package ticketmaster.proyecto.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    String username;
    String password;
    String primerNombre;
    String segundoNombre;
    String primerApellido;
    String segundoApellido;
    String dateOfBirth;
    String stateOfBirth;
    String gender;
    String email;
    String country;
    int phoneNumber;
}