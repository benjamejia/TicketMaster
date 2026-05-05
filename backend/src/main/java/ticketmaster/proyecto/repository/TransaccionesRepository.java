package ticketmaster.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ticketmaster.proyecto.model.Transacciones;

import java.util.Optional;

public interface TransaccionesRepository extends JpaRepository<Transacciones, Integer> {
    Optional<Transacciones> findByTicketId(int ticketId);
}
