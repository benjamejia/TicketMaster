package ticketmaster.proyecto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "salas")
@Data
public class Salas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;

    private String tipoSala;
    private int precio;
    private String nombreSala;
    private int capacidad;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idEstablecimiento", nullable = false)
    private Establecimiento idEstablecimiento;
}
