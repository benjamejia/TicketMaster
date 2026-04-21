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
@Table(name = "sucursales")
@Data
public class Establecimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;
    
    private String nombreSucursal;
    private String ubicacion;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "idTipoEstablecimiento", nullable = false)
    private TipoEstablecimiento tipoEstablecimiento;
}
