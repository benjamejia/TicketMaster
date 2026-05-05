package ticketmaster.proyecto.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
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
@Table(name = "transacciones")
@Data
public class Transacciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idUsuario", nullable = false)
    User id_usuario;
    
    @Column(nullable = false)
    @JoinColumn(name = "idTicket", nullable = false)
    private int ticketId;

    @Column(nullable = false)
    private Double monto;

    @Column(columnDefinition = "TEXT")
    private String codigoQR;

    @Column(nullable = false)
    private String metodoPago;

    @Column(unique = true, nullable = false)
    private String numeroConfirmacion;
    
    @Column(nullable = false)
    private String estado; // Ejemplo: "COMPLETADA", "PENDIENTE", "CANCELADA"

    @Column(nullable = false)
    private LocalDateTime fecha;

    // setTotal no es necesario, usar setMonto() en su lugar
}
