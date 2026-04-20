package ticketmaster.proyecto.model.cineModels;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "funciones")
@Data
public class Funciones {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;
    
    private String nombreFuncion;
    private LocalTime horario;
    private LocalDate fecha;
    private String clasificacion;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "idSala", nullable = false)
    private Salas idSala;
}
