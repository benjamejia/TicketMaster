package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstablecimientoDTO {
    private Integer id;
    private String nombreSucursal;
    private String ubicacion;
    private Integer tipoEstablecimientoId;
    private String tipoEstablecimiento;
}