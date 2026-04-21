package ticketmaster.proyecto.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ticketmaster.proyecto.model.userModels.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    Optional<User> findByCurp(String curp);
    Optional<User> findByUsernameOrCurp(String username, String curp);
    boolean existsByCurp(String curp);
}
