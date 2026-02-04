package ticketmaster.proyecto.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class CrearUsuario {

    @GetMapping("/usuario")
    public String getUsuario() {
        return "Soy un usuario";
    }
    
}
