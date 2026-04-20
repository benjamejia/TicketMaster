package ticketmaster.proyecto.repository.CineRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import ticketmaster.proyecto.model.cineModels.Asientos;

public interface AsientosRepository extends JpaRepository<Asientos,Integer> {

}
