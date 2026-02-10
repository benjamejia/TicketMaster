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
@Table(name = "asientos")
@Data
public class Asientos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAsiento;
    private String fila;
    private int numeroAsiento;
    @ManyToOne
    @JoinColumn(name = "id_sala")
    private Salas idSala;
}
