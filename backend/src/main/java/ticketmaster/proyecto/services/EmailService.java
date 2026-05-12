package ticketmaster.proyecto.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import ticketmaster.proyecto.model.TicketUsuario;
import ticketmaster.proyecto.model.Transacciones;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import org.springframework.core.io.ByteArrayResource;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendPurchaseConfirmation(String toEmail, TicketUsuario ticket, 
                                            Transacciones transaction, String userName) {
        try {
            if (toEmail == null || toEmail.isEmpty()) {
                log.warn("Email vacío, no se puede enviar confirmación");
                return false;
            }

            String subject = "TicketMaster - Confirmación de Compra #" + transaction.getNumeroConfirmacion();
            String body = buildPurchaseEmail(ticket, transaction, userName);
            
            if (transaction.getCodigoQR() != null) {
                return sendEmailWithAttachment(toEmail, subject, body, transaction.getCodigoQR());
            } else {
                return sendEmail(toEmail, subject, body);
            }

        } catch (Exception e) {
            log.error("Error enviando email de confirmación: {}", e.getMessage(), e);
            return false;
        }
    }

    private String buildPurchaseEmail(TicketUsuario ticket, Transacciones transaction, String userName) {
        StringBuilder message = new StringBuilder();
        
        message.append("<html><body style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">");
        message.append("<div style=\"background-color: #1a1a2e; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;\">");
        message.append("<h1>TicketMaster</h1>");
        message.append("<h2>Confirmación de Compra</h2>");
        message.append("</div>");
        
        message.append("<div style=\"padding: 20px; background-color: #f8f9fa;\">");
        message.append("<p>Hola <strong>").append(userName).append("</strong>! 👋</p>");
        message.append("<p>Gracias por tu compra. Aquí tienes los detalles de tu reserva:</p>");
        
        message.append("<div style=\"background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;\">");
        message.append("<h3 style=\"color: #1a1a2e;\">Detalles del Evento</h3>");
        
        if (ticket.getFuncion() != null) {
            message.append("<p><strong>Evento:</strong> ").append(ticket.getFuncion().getNombreFuncion()).append("</p>");
            message.append("<p><strong>Ubicación:</strong> ");
            if (ticket.getFuncion().getIdSala() != null && 
                ticket.getFuncion().getIdSala().getIdEstablecimiento() != null) {
                message.append(ticket.getFuncion().getIdSala().getIdEstablecimiento().getUbicacion());
            }
            message.append("</p>");
        }
        
        message.append("<p><strong>Asientos:</strong> ").append(String.join(", ", ticket.getAsientos())).append("</p>");
        message.append("<p><strong>Fecha de compra:</strong> ").append(formatDate(ticket.getFecha())).append("</p>");
        
        message.append("</div>");
        
        message.append("<div style=\"background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;\">");
        message.append("<h3 style=\"color: #1a1a2e;\">Detalles de Pago</h3>");
        message.append("<p><strong>Método de pago:</strong> ").append(transaction.getMetodoPago()).append("</p>");
        message.append("<p><strong>Total:</strong> $").append(String.format("%.2f", transaction.getMonto())).append("</p>");
        message.append("<p style=\"background-color: #e8f5e8; padding: 10px; border-radius: 5px;\">");
        message.append("<strong>Código de confirmación:</strong> ").append(transaction.getNumeroConfirmacion());
        message.append("</p>");
        message.append("<p><strong>ID Transacción:</strong> ").append(transaction.getId()).append("</p>");
        message.append("</div>");
        
        message.append("<div style=\"background-color: #fff3cd; padding: 15px; border-radius: 10px; margin: 20px 0;\">");
        message.append("<h4>Instrucciones importantes:</h4>");
        message.append("<ul>");
        message.append("<li>Guarda este email y tu código de confirmación</li>");
        message.append("<li>Presenta el código QR adjunto en la entrada</li>");
        message.append("<li>Llega 15 minutos antes del evento</li>");
        message.append("</ul>");
        message.append("</div>");
        
        message.append("<p style=\"text-align: center; color: #6c757d; margin-top: 30px;\">");
        message.append("¿Preguntas? Contáctanos a través de nuestro sitio.<br>");
        message.append("¡Que disfrutes el evento! 🎉");
        message.append("</p>");
        
        message.append("</div>");
        message.append("</body></html>");
        
        return message.toString();
    }

    private String formatDate(LocalDateTime date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return date != null ? date.format(formatter) : "Fecha no disponible";
    }

    public boolean sendEmail(String to, String subject, String text) {
        try {
            if (fromEmail == null || fromEmail.isEmpty()) {
                log.warn("Email de remitente no configurado");
                return false;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);
            
            mailSender.send(message);
            log.info("Email enviado exitosamente a: {}", to);
            return true;

        } catch (MessagingException e) {
            log.error("Error enviando email: {}", e.getMessage(), e);
            return false;
        }
    }

    public boolean sendEmailWithAttachment(String to, String subject, String text, String base64QR) {
        try {
            if (fromEmail == null || fromEmail.isEmpty()) {
                log.warn("Email de remitente no configurado");
                return false;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);
            
            if (base64QR != null && !base64QR.isEmpty()) {
                try {
                    byte[] qrBytes = Base64.getDecoder().decode(base64QR);
                    helper.addAttachment("codigo-qr.png", new ByteArrayResource(qrBytes), "image/png");
                } catch (Exception e) {
                    log.warn("No se pudo adjuntar el código QR: {}", e.getMessage());
                }
            }
            
            mailSender.send(message);
            log.info("Email con QR enviado exitosamente a: {}", to);
            return true;

        } catch (MessagingException e) {
            log.error("Error enviando email con adjunto: {}", e.getMessage(), e);
            return false;
        }
    }
}
