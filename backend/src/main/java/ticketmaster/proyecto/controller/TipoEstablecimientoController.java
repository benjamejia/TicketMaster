package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.model.TipoEstablecimiento;
import ticketmaster.proyecto.repository.TipoEstablecimientosRepository;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-establecimiento")
@CrossOrigin(origins = "*")
public class TipoEstablecimientoController {

    @Autowired
    private TipoEstablecimientosRepository tipoEstablecimientosRepository;

    @GetMapping
    public ResponseEntity<List<TipoEstablecimiento>> getAllTipos() {
        return ResponseEntity.ok(tipoEstablecimientosRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoEstablecimiento> getTipoById(@PathVariable int id) {
        return tipoEstablecimientosRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
