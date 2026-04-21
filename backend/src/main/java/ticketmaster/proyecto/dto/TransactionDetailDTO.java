package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * DTO para detalles de transacción
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailDTO {
    private Long id;
    private String confirmationNumber;
    private String estado;
    private Double monto;
    private String metodoPago;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fecha;
    private String qrCode;
    private TicketDetailDTO ticket;
}