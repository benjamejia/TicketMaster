package ticketmaster.proyecto.model.cineModels;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import ticketmaster.proyecto.model.Salas;

@Entity
@Table(name = "asientos")
@Data
public class Asientos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String fila;
    private int numeroAsiento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idSala", nullable = false)
    private Salas idSala;
}
