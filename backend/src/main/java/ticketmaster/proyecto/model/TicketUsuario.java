package ticketmaster.proyecto.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import ticketmaster.proyecto.model.User.User;

@Entity
@Table(name = "ticketUsuario")
@Data
public class TicketUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int idTicket;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idAsiento", nullable = false)
    private Asientos asiento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "funcionId", nullable = false)
    private Funciones funcion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idUsuario", nullable = false)
    private User usuario;

    private LocalDate fechaCompra;
}