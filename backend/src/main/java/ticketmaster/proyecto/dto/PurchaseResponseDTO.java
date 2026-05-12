package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponseDTO {
    private Boolean success;
    private String message;
    private String confirmationNumber;
    private int ticketId;
    private int transactionId;
    private String qrCode;
    private Boolean emailSent;
}