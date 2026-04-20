package ticketmaster.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ticketmaster.proyecto.model.cineModels.Establecimiento;

public interface SucursalesRepository extends JpaRepository<Establecimiento,Integer> {

}
