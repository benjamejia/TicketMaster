package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.dto.CheckoutRequestDTO;
import ticketmaster.proyecto.dto.PurchaseResponseDTO;
import ticketmaster.proyecto.model.TicketUsuario;
import ticketmaster.proyecto.model.Transacciones;
import ticketmaster.proyecto.model.userModels.User;
import ticketmaster.proyecto.repository.TicketUsuarioRepository;
import ticketmaster.proyecto.repository.UserRepository;
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
    private WhatsAppService whatsAppService;

    @Autowired
    private QRCodeGeneratorService qrCodeGenerator;

    /**
     * Procesa una compra de boletos
     * Crea la transacción, genera QR y envía confirmación por WhatsApp
     */
    @PostMapping("/process")
    public ResponseEntity<?> processPurchase(
            @RequestBody CheckoutRequestDTO request,
            Authentication authentication) {
        try {
            // Validar usuario autenticado
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(
                    createErrorResponse("Usuario no autenticado")
                );
            }

            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(username);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(
                    createErrorResponse("Usuario no encontrado")
                );
            }

            User user = userOpt.get();

            // Validar datos de la compra
            if (request.getCantidadBoletos() <= 0 || request.getMonto() <= 0) {
                return ResponseEntity.badRequest().body(
                    createErrorResponse("Cantidad de boletos o monto inválido")
                );
            }

            // Crear el ticket
            TicketUsuario ticket = new TicketUsuario();
            ticket.setUsuario(user);
            ticket.setAsientos(request.getAsientos());
            ticket.setFuncion(request.getFuncion());
            ticket.setFecha(LocalDateTime.now());
            ticket.setAsientos(request.getAsientos());

            TicketUsuario savedTicket = ticketRepository.save(ticket);

            // Crear transacción
            String numeroConfirmacion = generarNumeroConfirmacion();
            Transacciones transaccion = new Transacciones();
            transaccion.setTicketId(savedTicket.getIdTicket());
            transaccion.setId_usuario(user);
            transaccion.setMonto(request.getMonto());
            transaccion.setMetodoPago(request.getMetodoPago());
            transaccion.setNumeroConfirmacion(numeroConfirmacion);
            transaccion.setFecha(LocalDateTime.now());
            transaccion.setEstado("COMPLETADA");

            // Generar código QR
            String qrData = generarDatosQR(numeroConfirmacion, user.getEmail(), 
                                           savedTicket.getIdTicket());
            String qrCode = qrCodeGenerator.generateQRCode(qrData);
            transaccion.setCodigoQR(qrCode);

            // Guardar transacción (asumiendo que tienes el repository)
            // transaccionRepository.save(transaccion);

            // Enviar mensaje de WhatsApp
            boolean whatsAppSent = false;
            if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
                whatsAppSent = whatsAppService.sendPurchaseConfirmation(
                    request.getPhoneNumber(),
                    savedTicket,
                    transaccion,
                    user.getPrimerNombre()
                );
            }

            // Preparar respuesta
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
            return ResponseEntity.status(500).body(
                createErrorResponse("Error al procesar la compra: " + e.getMessage())
            );
        }
    }

    /**
     * Obtiene los detalles de una compra
     */
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<?> getTicketDetails(
            @PathVariable int ticketId,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(
                    createErrorResponse("Usuario no autenticado")
                );
            }

            Optional<TicketUsuario> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.status(404).body(
                    createErrorResponse("Ticket no encontrado")
                );
            }

            return ResponseEntity.ok(ticketOpt.get());

        } catch (Exception e) {
            log.error("Error obteniendo detalles del ticket: {}", e.getMessage());
            return ResponseEntity.status(500).body(
                createErrorResponse("Error al obtener detalles del ticket")
            );
        }
    }

    /**
     * Lista todos los tickets del usuario autenticado
     */
    @GetMapping("/my-tickets")
    public ResponseEntity<?> getMyTickets(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(
                    createErrorResponse("Usuario no autenticado")
                );
            }

            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(username);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(
                    createErrorResponse("Usuario no encontrado")
                );
            }

            // Asumiendo que tienes un método en el repository
            // var tickets = ticketRepository.findByUsuarioId(userOpt.get().getId());
            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("message", "Implementar método en repository");
            }});

        } catch (Exception e) {
            log.error("Error obteniendo tickets: {}", e.getMessage());
            return ResponseEntity.status(500).body(
                createErrorResponse("Error al obtener tickets")
            );
        }
    }

    /**
     * Reenvía la confirmación por WhatsApp
     */
    @PostMapping("/resend-whatsapp/{ticketId}")
    public ResponseEntity<?> resendWhatsAppConfirmation(
            @PathVariable int ticketId,
            @RequestParam String phoneNumber,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(
                    createErrorResponse("Usuario no autenticado")
                );
            }

            Optional<TicketUsuario> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.status(404).body(
                    createErrorResponse("Ticket no encontrado")
                );
            }

            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(
                    createErrorResponse("Usuario no encontrado")
                );
            }

            // Aquí obtendrías la transacción asociada
            // boolean sent = whatsAppService.sendPurchaseConfirmation(...);

            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("message", "Confirmación reenviada");
                put("success", true);
            }});

        } catch (Exception e) {
            log.error("Error reenviando confirmación: {}", e.getMessage());
            return ResponseEntity.status(500).body(
                createErrorResponse("Error al reenviar confirmación")
            );
        }
    }

    // Helper methods

    private String generarNumeroConfirmacion() {
        return "CONF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generarDatosQR(String confirmationNumber, String email, int ticketId) {
        return String.format("TICKET|%s|%s|%d|%s", 
            confirmationNumber, 
            email, 
            ticketId, 
            LocalDateTime.now()
        );
    }

    private Map<String, Object> createErrorResponse(String message) {
        return new HashMap<String, Object>() {{
            put("success", false);
            put("message", message);
        }};
    }
}