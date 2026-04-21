package ticketmaster.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ticketmaster.proyecto.model.Transacciones;

public interface TransaccionesRepository extends JpaRepository<Transacciones, Integer> {

}
