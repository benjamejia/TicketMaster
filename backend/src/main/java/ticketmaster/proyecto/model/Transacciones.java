package ticketmaster.proyecto.model;

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
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "idFuncion", nullable = false)
    Funciones id_funcion;
    int total;
    String metodo_pago;
    String fecha;
    String estado;
}
