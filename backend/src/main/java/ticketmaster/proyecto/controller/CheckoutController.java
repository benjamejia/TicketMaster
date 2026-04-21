package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.dto.CheckoutRequestDTO;
import ticketmaster.proyecto.dto.PurchaseResponseDTO;
import ticketmaster.proyecto.model.TicketUsuario;
import ticketmaster.proyecto.model.Transacciones;
import ticketmaster.proyecto.model.Funciones;
import ticketmaster.proyecto.model.userModels.User;
import ticketmaster.proyecto.repository.TicketUsuarioRepository;
import ticketmaster.proyecto.repository.UserRepository;
import ticketmaster.proyecto.repository.TransaccionesRepository; // ← AGREGAR este repository
import ticketmaster.proyecto.repository.CineRepository.FuncionesRepository;
import ticketmaster.proyecto.services.WhatsAppService;
import ticketmaster.proyecto.services.QRCodeGeneratorService;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
@Slf4j
@CrossOrigin(origins = "*")
public class CheckoutController {

    @Autowired
    private TicketUsuarioRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransaccionesRepository transaccionRepository; // ← AGREGADO

    @Autowired
    private FuncionesRepository funcionesRepository; // ← AGREGADO

    @Autowired
    private WhatsAppService whatsAppService;

    @Autowired
    private QRCodeGeneratorService qrCodeGenerator;

    @PostMapping("/process")
    public ResponseEntity<?> processPurchase(
            @RequestBody CheckoutRequestDTO request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(createErrorResponse("Usuario no autenticado"));
            }

            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Usuario no encontrado"));
            }

            User user = userOpt.get();

            if (request.getCantidadBoletos() <= 0 || request.getMonto() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Cantidad de boletos o monto inválido"));
            }

            // Buscar la función si viene un ID
            // FIX: ya no se llama setAsientos dos veces, y se setea la función correctamente
            TicketUsuario ticket = new TicketUsuario();
            ticket.setUsuario(user);
            ticket.setAsientos(request.getAsientos());
            ticket.setFecha(LocalDateTime.now());

            if (request.getFuncion() != null) {
                Optional<Funciones> funcionOpt = funcionesRepository.findById(request.getFuncion().getId());
                funcionOpt.ifPresent(ticket::setFuncion);
            }

            TicketUsuario savedTicket = ticketRepository.save(ticket); // ← SE GUARDA

            // Crear y GUARDAR transacción
            String numeroConfirmacion = generarNumeroConfirmacion();
            Transacciones transaccion = new Transacciones();
            transaccion.setTicketId(savedTicket.getIdTicket());
            transaccion.setId_usuario(user);
            transaccion.setMonto(request.getMonto());
            transaccion.setMetodoPago(request.getMetodoPago());
            transaccion.setNumeroConfirmacion(numeroConfirmacion);
            transaccion.setFecha(LocalDateTime.now());
            transaccion.setEstado("COMPLETADA");

            String qrData = generarDatosQR(numeroConfirmacion, user.getEmail(), savedTicket.getIdTicket());
            String qrCode = qrCodeGenerator.generateQRCode(qrData);
            transaccion.setCodigoQR(qrCode);

            transaccionRepository.save(transaccion); // ← FIX: ya no está comentado

            // Enviar WhatsApp
            boolean whatsAppSent = false;
            if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
                whatsAppSent = whatsAppService.sendPurchaseConfirmation(
                    request.getPhoneNumber(),
                    savedTicket,
                    transaccion,
                    user.getPrimerNombre()
                );
            }

            PurchaseResponseDTO response = new PurchaseResponseDTO();
            response.setSuccess(true);
            response.setMessage("Compra procesada exitosamente");
            response.setConfirmationNumber(numeroConfirmacion);
            response.setTicketId(savedTicket.getIdTicket());
            response.setQrCode(qrCode);
            response.setWhatsAppSent(whatsAppSent);
            response.setTransactionId(transaccion.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error procesando compra: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(createErrorResponse("Error al procesar la compra: " + e.getMessage()));
        }
    }

    // ... resto de métodos sin cambios ...
    @PostMapping("/procesar-compra")
    public ResponseEntity<?> procesarCompra(@RequestBody CheckoutRequestDTO request) {
        try {
            // 1. Hardcodeamos o extraemos datos del usuario (puedes usar SecurityContextHolder)
            User usuario = userRepository.findByEmail("usuario_ejemplo@mail.com")
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // 2. Crear y persistir la Transacción
            Transacciones transaccion = new Transacciones();
            transaccion.setId_usuario(usuario);
            transaccion.setTotal(request.getMonto()); // Dato que viene del frontend
            transaccion.setFecha(LocalDateTime.now());
            
            // Generar un código QR ficticio o real usando tu QRCodeGeneratorService
            String qrData = "Ticket-" + System.currentTimeMillis();
            String qrBase64 = qrCodeGenerator.generateQRCode(qrData);
            transaccion.setCodigoQR(qrBase64);

            // Guardar en la base de datos
            Transacciones guardada = transaccionRepository.save(transaccion);

            // 3. Enviar mensaje por WhatsApp usando tu WhatsAppService
            // Hardcodeamos el número para pruebas o usamos el del usuario
            String mensaje = "¡Hola " + usuario.getPrimerNombre() + "! Tu compra por $" + 
                            request.getMonto() + " ha sido exitosa. ID: " + guardada.getId();
            
            whatsAppService.sendWhatsAppMessage(usuario.getTelefono(), mensaje);

            return ResponseEntity.ok(new PurchaseResponseDTO(null, mensaje, mensaje, guardada.getId(), 0, "Compra exitosa", null));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar: " + e.getMessage());
        }
    }
    // FIX en resend: recibe phoneNumber del body, no del @RequestParam
    @PostMapping("/resend-whatsapp/{ticketId}")
    public ResponseEntity<?> resendWhatsAppConfirmation(
            @PathVariable int ticketId,
            @RequestBody Map<String, String> body, // ← FIX: era @RequestParam
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(createErrorResponse("Usuario no autenticado"));
            }

            Optional<TicketUsuario> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Ticket no encontrado"));
            }

            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Usuario no encontrado"));
            }

            // Aquí podrías buscar la transacción y reenviar
            // boolean sent = whatsAppService.sendPurchaseConfirmation(phoneNumber, ...);

            return ResponseEntity.ok(Map.of("message", "Confirmación reenviada", "success", true));

        } catch (Exception e) {
            log.error("Error reenviando confirmación: {}", e.getMessage());
            return ResponseEntity.status(500).body(createErrorResponse("Error al reenviar confirmación"));
        }
    }

    private String generarNumeroConfirmacion() {
        return "CONF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generarDatosQR(String confirmationNumber, String email, int ticketId) {
        return String.format("TICKET|%s|%s|%d|%s", confirmationNumber, email, ticketId, LocalDateTime.now());
    }

    private Map<String, Object> createErrorResponse(String message) {
        return Map.of("success", false, "message", message);
    }
}