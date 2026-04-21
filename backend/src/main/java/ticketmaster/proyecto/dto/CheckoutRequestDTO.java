package ticketmaster.proyecto.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ticketmaster.proyecto.model.Funciones;

/**
 * DTO para la solicitud de procesamiento de compra
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequestDTO {
    private Funciones funcion;
    private String ubicacion;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fecha;
    private Integer cantidadBoletos;
    private List<String> asientos;
    private Double monto;
    private String metodoPago; // TARJETA_DEBITO, TARJETA_CREDITO, PAYPAL
    private String phoneNumber; // Número de WhatsApp con código de país
    private String eventId;
}