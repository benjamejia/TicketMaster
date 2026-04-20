package ticketmaster.proyecto.repository.CineRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import ticketmaster.proyecto.model.TipoEstablecimiento;

public interface EstablecimientoRepository extends JpaRepository<TipoEstablecimiento,Integer> {

}
