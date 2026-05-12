package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.dto.CheckoutRequestDTO;
import ticketmaster.proyecto.dto.MyTicketDTO;
import ticketmaster.proyecto.dto.PurchaseResponseDTO;
import ticketmaster.proyecto.model.TicketUsuario;
import ticketmaster.proyecto.model.Transacciones;
import ticketmaster.proyecto.model.Funciones;
import ticketmaster.proyecto.model.userModels.User;
import ticketmaster.proyecto.repository.TicketUsuarioRepository;
import ticketmaster.proyecto.repository.UserRepository;
import ticketmaster.proyecto.repository.TransaccionesRepository;
import ticketmaster.proyecto.repository.CineRepository.FuncionesRepository;
import ticketmaster.proyecto.services.EmailService;
import ticketmaster.proyecto.services.QRCodeGeneratorService;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private TransaccionesRepository transaccionRepository;

    @Autowired
    private FuncionesRepository funcionesRepository;

    @Autowired
    private EmailService emailService;

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
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Usuario no encontrado"));
            }

            User user = userOpt.get();

            if (request.getCantidadBoletos() <= 0 || request.getMonto() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Cantidad de boletos o monto inválido"));
            }

            TicketUsuario ticket = new TicketUsuario();
            ticket.setUsuario(user);
            ticket.setAsientos(request.getAsientos());
            ticket.setFecha(LocalDateTime.now());

            if (request.getFuncionId() != null) {
                Optional<Funciones> funcionOpt = funcionesRepository.findById(request.getFuncionId());
                funcionOpt.ifPresent(ticket::setFuncion);
            }

            TicketUsuario savedTicket = ticketRepository.save(ticket);

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

            transaccionRepository.save(transaccion);

            boolean emailSent = false;
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                emailSent = emailService.sendPurchaseConfirmation(
                    user.getEmail(),
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
            response.setEmailSent(emailSent);
            response.setTransactionId(transaccion.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error procesando compra: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(createErrorResponse("Error al procesar la compra: " + e.getMessage()));
        }
    }

    @PostMapping("/resend-email/{ticketId}")
    public ResponseEntity<?> resendEmailConfirmation(
            @PathVariable int ticketId,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(createErrorResponse("Usuario no autenticado"));
            }

            Optional<TicketUsuario> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Ticket no encontrado"));
            }

            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Usuario no encontrado"));
            }

            User user = userOpt.get();
            TicketUsuario ticket = ticketOpt.get();

            if (!ticket.getUsuario().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(createErrorResponse("No tienes permiso para acceder a este ticket"));
            }

            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("El usuario no tiene un email registrado"));
            }

            Optional<Transacciones> transaccionOpt = transaccionRepository.findByTicketId(ticketId);
            if (transaccionOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Transacción no encontrada para este ticket"));
            }

            Transacciones transaccion = transaccionOpt.get();
            boolean sent = emailService.sendPurchaseConfirmation(
                    user.getEmail(),
                    ticket,
                    transaccion,
                    user.getPrimerNombre()
            );

            if (sent) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Email reenviado exitosamente a " + user.getEmail()));
            } else {
                return ResponseEntity.status(500).body(createErrorResponse("Error al reenviar el email de confirmación"));
            }

        } catch (Exception e) {
            log.error("Error reenviando confirmación de email: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(createErrorResponse("Error al reenviar el email de confirmación"));
        }
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<?> getTicketDetails(@PathVariable int ticketId, Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(createErrorResponse("Usuario no autenticado"));
            }

            Optional<Transacciones> transaccionOpt = transaccionRepository.findByTicketId(ticketId);
            if (transaccionOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Transacción no encontrada"));
            }

            Optional<TicketUsuario> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Ticket no encontrado"));
            }

            Transacciones transaccion = transaccionOpt.get();
            TicketUsuario ticket = ticketOpt.get();

            if (!ticket.getUsuario().getUsername().equals(authentication.getName())) {
                return ResponseEntity.status(403).body(createErrorResponse("No tienes permiso para acceder a este ticket"));
            }

            Map<String, Object> ticketInfo = Map.of(
                "id", ticket.getIdTicket(),
                "tipoEvento", ticket.getFuncion() != null ? ticket.getFuncion().getNombreFuncion() : "Evento",
                "ubicacion", ticket.getFuncion() != null && ticket.getFuncion().getIdSala() != null 
                    ? ticket.getFuncion().getIdSala().getNombreSala() : "Ubicación no disponible",
                "fecha", ticket.getFecha() != null ? ticket.getFecha().toString() : "",
                "cantidadBoletos", ticket.getAsientos() != null ? ticket.getAsientos().size() : 0,
                "asientos", ticket.getAsientos() != null ? ticket.getAsientos() : List.of(),
                "fechaCompra", ticket.getFecha() != null ? ticket.getFecha().toString() : ""
            );

            Map<String, Object> response = Map.of(
                "id", transaccion.getId(),
                "confirmationNumber", transaccion.getNumeroConfirmacion(),
                "estado", transaccion.getEstado(),
                "monto", transaccion.getMonto(),
                "metodoPago", transaccion.getMetodoPago(),
                "fecha", transaccion.getFecha().toString(),
                "qrCode", transaccion.getCodigoQR() != null ? transaccion.getCodigoQR() : "",
                "ticket", ticketInfo
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error obteniendo detalles del ticket: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(createErrorResponse("Error al obtener los detalles"));
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<?> getMyTickets(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(createErrorResponse("Usuario no autenticado"));
            }

            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorResponse("Usuario no encontrado"));
            }

            User user = userOpt.get();

            List<MyTicketDTO> tickets = ticketRepository.findAll().stream()
                    .filter(t -> t.getUsuario() != null && t.getUsuario().getId().equals(user.getId()))
                    .map(t -> {
                        MyTicketDTO dto = new MyTicketDTO();
                        dto.setIdTicket((long) t.getIdTicket());
                        dto.setAsientos(t.getAsientos());
                        dto.setFecha(t.getFecha());
                        if (t.getFuncion() != null) {
                            dto.setNombreFuncion(t.getFuncion().getNombreFuncion());
                            dto.setUbicacion(t.getFuncion().getIdSala().getNombreSala());
                            dto.setClasificacion(t.getFuncion().getClasificacion());
                        }
                        
                        Optional<Transacciones> transaccionOpt = transaccionRepository.findByTicketId(t.getIdTicket());
                        transaccionOpt.ifPresent(trans -> {
                            dto.setNumeroConfirmacion(trans.getNumeroConfirmacion());
                            dto.setMonto(trans.getMonto());
                            dto.setMetodoPago(trans.getMetodoPago());
                            dto.setCodigoQR(trans.getCodigoQR());
                            dto.setEstado(trans.getEstado());
                        });
                        
                        return dto;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            log.error("Error obteniendo tickets del usuario: {}", e.getMessage());
            return ResponseEntity.status(500).body(createErrorResponse("Error al obtener los tickets"));
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
