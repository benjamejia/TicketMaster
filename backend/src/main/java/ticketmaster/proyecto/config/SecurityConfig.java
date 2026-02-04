package ticketmaster.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll() // Fuerza a permitir TODO
                .anyRequest().permitAll()
            )
            .httpBasic(basic -> basic.disable()) // Desactiva el popup de login
            .formLogin(form -> form.disable()); // Desactiva el formulario
            
        return http.build();
    }
}