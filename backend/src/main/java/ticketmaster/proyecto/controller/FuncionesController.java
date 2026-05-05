package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.model.Funciones;
import ticketmaster.proyecto.model.Salas;
import ticketmaster.proyecto.model.cineModels.Asientos;
import ticketmaster.proyecto.repository.CineRepository.AsientosRepository;
import ticketmaster.proyecto.repository.CineRepository.FuncionesRepository;
import ticketmaster.proyecto.repository.TicketUsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/funciones")
@CrossOrigin(origins = "*")
public class FuncionesController {

    @Autowired
    private FuncionesRepository funcionesRepository;

    @Autowired
    private AsientosRepository asientosRepository;

    @Autowired
    private TicketUsuarioRepository ticketUsuarioRepository;

    @GetMapping
    public ResponseEntity<List<Funciones>> getAllFunciones() {
        return ResponseEntity.ok(funcionesRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funciones> getFuncionById(@PathVariable int id) {
        return funcionesRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sala/{salaId}")
    public ResponseEntity<List<Funciones>> getFuncionesBySala(@PathVariable int salaId) {
        List<Funciones> funciones = funcionesRepository.findAll().stream()
                .filter(f -> f.getIdSala() != null && f.getIdSala().getId() == salaId)
                .toList();
        return ResponseEntity.ok(funciones);
    }

    @GetMapping("/{funcionId}/asientos")
    public ResponseEntity<?> getAsientosForFunction(@PathVariable int funcionId) {
        return funcionesRepository.findById(funcionId)
                .map(funcion -> {
                    Salas sala = funcion.getIdSala();
                    if (sala == null) {
                        return ResponseEntity.badRequest().body("La función no tiene sala asignada");
                    }

                    List<Asientos> asientos = asientosRepository.findAll().stream()
                            .filter(a -> a.getIdSala() != null && a.getIdSala().getId() == sala.getId())
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(asientos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{funcionId}/asientos-disponibles")
    public ResponseEntity<?> getAsientosDisponibles(@PathVariable int funcionId) {
        return funcionesRepository.findById(funcionId)
                .map(funcion -> {
                    Salas sala = funcion.getIdSala();
                    if (sala == null) {
                        return ResponseEntity.badRequest().body("La función no tiene sala asignada");
                    }

                    List<Asientos> todosAsientos = asientosRepository.findAll().stream()
                            .filter(a -> a.getIdSala() != null && a.getIdSala().getId() == sala.getId())
                            .collect(Collectors.toList());

                    List<String> asientosOcupados = ticketUsuarioRepository.findAll().stream()
                            .filter(t -> t.getFuncion() != null && t.getFuncion().getId() == funcionId)
                            .filter(t -> t.getAsientos() != null)
                            .flatMap(t -> t.getAsientos().stream())
                            .collect(Collectors.toList());

                    List<Asientos> asientosDisponibles = todosAsientos.stream()
                            .filter(a -> !asientosOcupados.contains(a.getFila() + a.getNumeroAsiento()))
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(asientosDisponibles);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{funcionId}/asientos-ocupados")
    public ResponseEntity<?> getAsientosOcupados(@PathVariable int funcionId) {
        List<String> asientosOcupados = ticketUsuarioRepository.findAll().stream()
                .filter(t -> t.getFuncion() != null && t.getFuncion().getId() == funcionId)
                .filter(t -> t.getAsientos() != null)
                .flatMap(t -> t.getAsientos().stream())
                .collect(Collectors.toList());

        return ResponseEntity.ok(asientosOcupados);
    }
}
