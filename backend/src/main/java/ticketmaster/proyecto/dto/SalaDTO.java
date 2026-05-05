package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaDTO {
    private Integer id;
    private String tipoSala;
    private int precio;
    private String nombreSala;
    private int capacidad;
    private Integer idEstablecimiento;
    private String nombreEstablecimiento;
}