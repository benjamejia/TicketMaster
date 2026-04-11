package ticketmaster.proyecto.model.museoModels;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "exposicionesMuseo")
@Data
public class Exposiciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int idExposiciones;
    @JoinColumn(name = "")
    private int idSucursal;
    private String nombreExposicion;
}
