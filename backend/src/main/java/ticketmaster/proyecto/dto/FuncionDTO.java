package ticketmaster.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuncionDTO {
    private Integer id;
    private String nombreFuncion;
    private LocalTime horario;
    private LocalDate fecha;
    private String clasificacion;
    private Integer idSala;
    private String nombreSala;
    private Integer idEstablecimiento;
    private String nombreEstablecimiento;
    private Integer precio;
    private String tipoEstablecimiento;
}