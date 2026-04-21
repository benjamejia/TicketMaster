package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de compra exitosa
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponseDTO {
    private Boolean success;
    private String message;
    private String confirmationNumber;
    private int ticketId;
    private int transactionId;
    private String qrCode; // Base64 encoded
    private Boolean whatsAppSent;
}