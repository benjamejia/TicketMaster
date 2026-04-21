package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para detalles del ticket
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDetailDTO {
    private Long id;
    private String tipoEvento;
    private String ubicacion;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fecha;
    private Integer cantidadBoletos;
    private List<String> asientos;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaCompra;
}
