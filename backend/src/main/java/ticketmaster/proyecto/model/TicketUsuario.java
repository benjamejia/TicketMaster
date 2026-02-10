package ticketmaster.proyecto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "ticketUsuario")
@Data
public class TicketUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int idTicket;
    @ManyToOne
    private Asientos idAsiento;
    @ManyToOne
    private Salas idSala;
    @ManyToOne
    private Funciones idFuncion;
    private int precioTotal;
    private int horaFuncion;
}
/*
{
  "idAsiento": { "idAsiento": 1 },
  "idSala": { "idSala": 1 },
  "idFuncion": { "idFuncion": 1 },
  "precioTotal": 150,
  "horaFuncion": 1040
}
*/