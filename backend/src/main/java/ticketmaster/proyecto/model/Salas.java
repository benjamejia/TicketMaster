package ticketmaster.proyecto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "salas")
@Data
public class Salas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int idSala;
    private Sucursales idSucursal;
    private String nombreSala;
    private int totalAsientos;
}
