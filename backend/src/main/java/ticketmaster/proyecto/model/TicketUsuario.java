package ticketmaster.proyecto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "ticketUsuario")
@Data
public class TicketUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int idTicket;
    private Asientos idAsiento;
    private Salas idSala;
    private Funciones idFuncion;
    private int precioTotal;
    private int horaFuncion;
}
