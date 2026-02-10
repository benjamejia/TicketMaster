package ticketmaster.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ticketmaster.proyecto.model.TicketUsuario;

public interface TicketUsuarioRepository extends JpaRepository<TicketUsuario,Integer> {

}
