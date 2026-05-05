package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.dto.EstablecimientoDTO;
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
    public ResponseEntity<List<EstablecimientoDTO>> getAllSucursales() {
        List<EstablecimientoDTO> sucursales = sucursalesRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(sucursales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstablecimientoDTO> getSucursalById(@PathVariable Integer id) {
        return sucursalesRepository.findById(id)
                .map(sucursal -> ResponseEntity.ok(toDTO(sucursal)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tipo/{tipoId}")
    public ResponseEntity<List<EstablecimientoDTO>> getSucursalesByTipo(@PathVariable Long tipoId) {
        List<EstablecimientoDTO> sucursales = sucursalesRepository.findAll().stream()
                .filter(s -> s.getTipoEstablecimiento() != null && 
                             s.getTipoEstablecimiento().getId().equals(tipoId))
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(sucursales);
    }

    private EstablecimientoDTO toDTO(Establecimiento e) {
        EstablecimientoDTO dto = new EstablecimientoDTO();
        dto.setId(e.getId());
        dto.setNombreSucursal(e.getNombreSucursal());
        dto.setUbicacion(e.getUbicacion());
        if (e.getTipoEstablecimiento() != null) {
            dto.setTipoEstablecimientoId(Math.toIntExact(e.getTipoEstablecimiento().getId()));
             dto.setTipoEstablecimiento(e.getTipoEstablecimiento().getTipo().name());
        }
        return dto;
    }
}
