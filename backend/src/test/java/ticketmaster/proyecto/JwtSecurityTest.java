package ticketmaster.proyecto;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class JwtSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserDetailsService userDetailsService;

    private static final String SECRET_KEY = "93bfbeecbd104134da39c3cdb619b85f8498cde651e6e4ac8b3d77910aa13f10";

    /**
     * Caso de prueba 1: Acceder al endpoint sin proporcionar token JWT.
     * Se espera que el servidor responda con HTTP 401 Unauthorized.
     */
    @Test
    void shouldReturn401WhenNoTokenProvided() throws Exception {
        mockMvc.perform(get("/api/checkout/my-tickets"))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Caso de prueba 2: Acceder al endpoint con un token inválido (falso).
     * Se espera que el servidor responda con HTTP 401 Unauthorized.
     * El token "tokenFalso123" no es un JWT válido.
     */
    @Test
    void shouldReturn401WhenInvalidTokenProvided() throws Exception {
        mockMvc.perform(get("/api/checkout/my-tickets")
                        .header("Authorization", "Bearer tokenFalso123"))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Caso de prueba 3: Acceder al endpoint con un token JWT expirado.
     * Se espera que el servidor responda con HTTP 401 Unauthorized.
     * El token fue generado con fecha de expiración en el pasado.
     */
    @Test
    void shouldReturn401WhenExpiredTokenProvided() throws Exception {
        String expiredToken = generateExpiredToken();

        mockMvc.perform(get("/api/checkout/my-tickets")
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }

    private String generateExpiredToken() {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 25))
                .setExpiration(new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 24))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}