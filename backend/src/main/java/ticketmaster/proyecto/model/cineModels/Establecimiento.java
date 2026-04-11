package ticketmaster.proyecto.model.cineModels;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import ticketmaster.proyecto.enums.Establecimientos;

@Entity
public class Establecimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstablecimiento;

    @Enumerated(EnumType.STRING)
    private Establecimientos tipo;
}
