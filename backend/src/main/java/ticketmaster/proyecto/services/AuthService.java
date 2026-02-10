package ticketmaster.proyecto.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ticketmaster.proyecto.dto.auth.AuthResponse;
import ticketmaster.proyecto.dto.auth.LoginRequest;
import ticketmaster.proyecto.dto.auth.RegisterRequest;
import ticketmaster.proyecto.model.User.Role;
import ticketmaster.proyecto.model.User.User;
import ticketmaster.proyecto.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request){
        // 1. Autenticar al usuario
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        // 2. Si llegamos aquí, los datos son correctos. Buscamos al usuario.
        UserDetails user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        
        // 3. Generamos el token
        String token = jwtService.getToken(user);
        
        return AuthResponse.builder()
            .token(token)
            .build();
    }

    public AuthResponse register(RegisterRequest request){
        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .country(request.getCountry())
            .email(request.getEmail())
            .phoneNumber(request.getPhoneNumber())
            .role(Role.USER)
            .build();
        
            userRepository.save(user);

            return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();
            }
}
