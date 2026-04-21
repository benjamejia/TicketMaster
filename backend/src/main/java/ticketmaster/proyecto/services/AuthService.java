// backend/src/main/java/ticketmaster/proyecto/services/AuthService.java
package ticketmaster.proyecto.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ticketmaster.proyecto.dto.auth.AuthResponse;
import ticketmaster.proyecto.dto.auth.LoginRequest;
import ticketmaster.proyecto.dto.auth.RegisterRequest;
import ticketmaster.proyecto.model.userModels.Role;
import ticketmaster.proyecto.model.userModels.User;
import ticketmaster.proyecto.repository.UserRepository;
import ticketmaster.proyecto.util.CurpUtil;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
    // 1. Buscar al usuario por username o por email
    User user = userRepository.findByUsernameOrEmail(request.getUsernameOrCurp(), request.getUsernameOrCurp())
            .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

    // 2. Lógica de doble validación: ¿Es la contraseña correcta O es la CURP correcta?
    boolean isCurpLogin = request.getPassword().equalsIgnoreCase(user.getCurp());
    
    if (!isCurpLogin) {
        // Si no es la CURP, intentamos validación estándar de Spring Security (contraseña)
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );
    }

    // 3. Si llegamos aquí, la validación (ya sea por CURP o Contraseña) fue exitosa
    String token = jwtService.getToken(user);
    return AuthResponse.builder().token(token).build();
}

    public AuthResponse register(RegisterRequest request) {
    User user = User.builder()
        .username(request.getUsername())
        .password(passwordEncoder.encode(request.getPassword()))
        .primerNombre(request.getPrimerNombre())
        .segundoNombre(request.getSegundoNombre())
        .primerApellido(request.getPrimerApellido())
        .segundoApellido(request.getSegundoApellido())
        .dateOfBirth(request.getDateOfBirth())
        .gender(request.getGender())
        .email(request.getEmail())
        .country(request.getCountry())
        .phoneNumber(request.getPhoneNumber())
        .role(Role.USER)
        .build();

    try {
        String generatedCurp = CurpUtil.generateCurp(user);
        user.setCurp(generatedCurp);
    } catch (Exception e) {
    }

    userRepository.save(user);

    return AuthResponse.builder()
        .token(jwtService.getToken(user))
        .build();
    }
}
