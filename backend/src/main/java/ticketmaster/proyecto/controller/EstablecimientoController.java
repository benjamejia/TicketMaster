package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.model.Establecimiento;
import ticketmaster.proyecto.repository.SucursalesRepository;

import java.util.List;

@RestController
@RequestMapping("/api/sucursales")
@CrossOrigin(origins = "*")
public class EstablecimientoController {

    @Autowired
    private SucursalesRepository sucursalesRepository;

    @GetMapping
    public ResponseEntity<List<Establecimiento>> getAllSucursales() {
        return ResponseEntity.ok(sucursalesRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Establecimiento> getSucursalById(@PathVariable int id) {
        return sucursalesRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tipo/{tipoId}")
    public ResponseEntity<List<Establecimiento>> getSucursalesByTipo(@PathVariable Long tipoId) {
        List<Establecimiento> sucursales = sucursalesRepository.findAll().stream()
                .filter(s -> s.getTipoEstablecimiento() != null && 
                             s.getTipoEstablecimiento().getId().equals(tipoId))
                .toList();
        return ResponseEntity.ok(sucursales);
    }
}
