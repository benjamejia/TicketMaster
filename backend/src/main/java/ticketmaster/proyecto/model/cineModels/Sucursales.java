package ticketmaster.proyecto.model.cineModels;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "sucursales")
@Data
public class Sucursales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int idSucursal;
    private String nombreSucursal;
    private String ubicacion;
}
