package ticketmaster.proyecto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ticketmaster.proyecto.model.cineModels.Funciones;
import ticketmaster.proyecto.model.TicketUsuario;
import ticketmaster.proyecto.repository.TicketUsuarioRepository;
import ticketmaster.proyecto.repository.CineRepository.FuncionesRepository;

@RestController
public class TestController {

    @Autowired
    private FuncionesRepository funcionesRepository;
    @Autowired
    private TicketUsuarioRepository ticketUsuarioRepository;

    @GetMapping("/testFunciones")
    public List<Funciones> verFunciones(){
        return funcionesRepository.findAll();
    }

    @PostMapping("/testTicket")
    public TicketUsuario generarTicketUsuario(@RequestBody TicketUsuario nuevoTicketUsuario){
        return ticketUsuarioRepository.save(nuevoTicketUsuario);
    } 
}
