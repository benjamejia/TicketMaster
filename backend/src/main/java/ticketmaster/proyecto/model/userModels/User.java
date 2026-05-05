// backend/src/main/java/ticketmaster/proyecto/model/User/User.java
package ticketmaster.proyecto.model.userModels;

import java.util.Collection;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = "username")})
public class User implements UserDetails {
    @Id
    @GeneratedValue
    Integer id;
    @Column(name = "username", nullable = false)
    String username;
    String primerNombre;
    String segundoNombre;
    String primerApellido;
    String segundoApellido;
    String dateOfBirth;
    String gender;
    String email;
    String password;
    String birthState;
    String country;
    int phoneNumber;
    @Enumerated(EnumType.STRING )
    Role role;
    @Column(unique = true)
    String curp;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    
    @Override
    public String getUsername() { return this.username; }
    
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    @Override
    public @Nullable String getPassword() {
        return this.password;
    }

    }
