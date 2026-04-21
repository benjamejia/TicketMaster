package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para reenvío de WhatsApp
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResendWhatsAppDTO {
    private Long ticketId;
    private String phoneNumber;
}