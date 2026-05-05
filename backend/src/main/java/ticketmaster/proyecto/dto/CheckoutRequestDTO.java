package ticketmaster.proyecto.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequestDTO {
    private Integer funcionId;
    private Integer cantidadBoletos;
    private List<String> asientos;
    private Double monto;
    private String metodoPago;
    private String phoneNumber;
}