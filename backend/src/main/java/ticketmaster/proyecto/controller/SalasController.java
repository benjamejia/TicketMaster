package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.model.Salas;
import ticketmaster.proyecto.repository.CineRepository.SalasRepository;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@CrossOrigin(origins = "*")
public class SalasController {

    @Autowired
    private SalasRepository salasRepository;

    @GetMapping
    public ResponseEntity<List<Salas>> getAllSalas() {
        return ResponseEntity.ok(salasRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salas> getSalaById(@PathVariable int id) {
        return salasRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/establecimiento/{establecimientoId}")
    public ResponseEntity<List<Salas>> getSalasByEstablecimiento(@PathVariable int establecimientoId) {
        List<Salas> salas = salasRepository.findAll().stream()
                .filter(s -> s.getIdEstablecimiento() != null && 
                             s.getIdEstablecimiento().getId() == establecimientoId)
                .toList();
        return ResponseEntity.ok(salas);
    }
}
