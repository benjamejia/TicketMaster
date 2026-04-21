package ticketmaster.proyecto.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import ticketmaster.proyecto.model.userModels.User;

@Entity
@Table(name = "ticketUsuario")
@Data
public class TicketUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int idTicket;

    @ElementCollection
    private List<String> asientos;

    @ManyToOne(optional = false)
    @JoinColumn(name = "funcionId", nullable = false)
    private Funciones funcion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idUsuario", nullable = false)
    private User usuario;

    @Column(nullable = false)
    private LocalDateTime fecha;
}