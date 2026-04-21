package ticketmaster.proyecto.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import ticketmaster.proyecto.model.TicketUsuario;
import ticketmaster.proyecto.model.Transacciones;
import org.springframework.web.client.RestClientException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WhatsAppService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.whatsapp-number}")
    private String twilioWhatsAppNumber;

    @Value("${whatsapp.api-provider:twilio}")
    private String apiProvider;

    @Value("${meta.phone-number-id:}")
    private String metaPhoneNumberId;

    @Value("${meta.business-account-id:}")
    private String metaBusinessAccountId;

    @Value("${meta.access-token:}")
    private String metaAccessToken;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final QRCodeGeneratorService qrCodeGenerator;

    public WhatsAppService(RestTemplate restTemplate, ObjectMapper objectMapper, 
                          QRCodeGeneratorService qrCodeGenerator) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    /**
     * Envía un mensaje de confirmación de compra por WhatsApp
     */
    public boolean sendPurchaseConfirmation(String phoneNumber, TicketUsuario ticket, 
                                           Transacciones transaction, String userName) {
        try {
            String message = buildPurchaseMessage(ticket, transaction, userName);
            
            if ("meta".equalsIgnoreCase(apiProvider)) {
                return sendViaMetaCloudAPI(phoneNumber, message);
            } else {
                return sendViaTwilio(phoneNumber, message);
            }
        } catch (Exception e) {
            log.error("Error enviando mensaje de WhatsApp", e);
            return false;
        }
    }

    /**
     * Envía el mensaje a través de Twilio
     */
    private boolean sendViaTwilio(String phoneNumber, String message) {
        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
            
            String auth = accountSid + ":" + authToken;
            String base64Auth = java.util.Base64.getEncoder()
                    .encodeToString(auth.getBytes());

            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(accountSid, authToken);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "From=whatsapp:" + twilioWhatsAppNumber + 
                         "&To=whatsapp:+" + phoneNumber + 
                         "&Body=" + java.net.URLEncoder.encode(message, "UTF-8");

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            
            restTemplate.postForObject(url, entity, String.class);
            log.info("Mensaje de WhatsApp enviado exitosamente a: {}", phoneNumber);
            return true;

        } catch (RestClientException e) {
            log.error("Error en Twilio API: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("Error al enviar mensaje: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Envía el mensaje a través de Meta Cloud API
     */
    private boolean sendViaMetaCloudAPI(String phoneNumber, String message) {
        try {
            String url = "https://graph.instagram.com/v18.0/" + metaPhoneNumberId + "/messages";
            
            WhatsAppMetaRequest request = new WhatsAppMetaRequest();
            request.setMessaging_product("whatsapp");
            request.setTo(phoneNumber);
            
            WhatsAppMetaRequest.Message msgObj = new WhatsAppMetaRequest.Message();
            msgObj.setType("text");
            msgObj.setText(new WhatsAppMetaRequest.Text(message));
            request.setMessage(msgObj);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + metaAccessToken);

            HttpEntity<String> entity = new HttpEntity<>(
                    objectMapper.writeValueAsString(request), 
                    headers
            );
            
            restTemplate.postForObject(url, entity, String.class);
            log.info("Mensaje de Meta Cloud API enviado exitosamente a: {}", phoneNumber);
            return true;

        } catch (Exception e) {
            log.error("Error en Meta Cloud API: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Construye el mensaje de confirmación de compra
     */
    private String buildPurchaseMessage(TicketUsuario ticket, Transacciones transaction, String userName) {
        StringBuilder message = new StringBuilder();
        
        message.append("🎫 *CONFIRMACIÓN DE COMPRA*\n\n");
        message.append("Hola ").append(userName).append("! 👋\n\n");
        
        message.append("*Detalles de tu reserva:*\n");
        message.append("📍 *Evento:* ").append(ticket.getFuncion()).append("\n");
        message.append("📌 *Ubicación:* ").append(ticket.getFuncion().getIdSala().getIdEstablecimiento().getUbicacion()).append("\n");
        message.append("📅 *Fecha:* ").append(formatDate(ticket.getFecha())).append("\n");
        message.append("💳 *Método de pago:* ").append(transaction.getMetodoPago()).append("\n");
        message.append("💰 *Total:* $").append(String.format("%.2f", transaction.getMonto())).append("\n");
        message.append("✅ *Código de confirmación:* ").append(transaction.getNumeroConfirmacion()).append("\n");
        message.append("🔐 *ID Transacción:* ").append(transaction.getId()).append("\n\n");
        
        message.append("*Instrucciones importantes:*\n");
        message.append("• Guarda tu código de confirmación\n");
        message.append("• Presenta este mensaje en la entrada\n");
        message.append("• Llega 15 minutos antes del evento\n\n");
        
        message.append("¿Preguntas? Contáctanos a través de nuestro sitio.\n");
        message.append("¡Que disfrutes el evento! 🎉");
        
        return message.toString();
    }

    private String formatDate(LocalDateTime date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return date != null ? date.format(formatter) : "Fecha no disponible";
    }

    /**
     * DTO para Meta Cloud API
     */
    public static class WhatsAppMetaRequest {
        private String messaging_product;
        private String to;
        private Message message;

        public void setMessaging_product(String messaging_product) {
            this.messaging_product = messaging_product;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public void setMessage(Message message) {
            this.message = message;
        }

        public static class Message {
            private String type;
            private Text text;

            public void setType(String type) {
                this.type = type;
            }

            public void setText(Text text) {
                this.text = text;
            }
        }

        public static class Text {
            private String body;

            public Text(String body) {
                this.body = body;
            }
        }
    }
}
