package ticketmaster.proyecto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ticketmaster.proyecto.dto.SalaDTO;
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
    public ResponseEntity<List<SalaDTO>> getAllSalas() {
        List<SalaDTO> salas = salasRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(salas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaDTO> getSalaById(@PathVariable Integer id) {
        return salasRepository.findById(id)
                .map(sala -> ResponseEntity.ok(toDTO(sala)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/establecimiento/{establecimientoId}")
    public ResponseEntity<List<SalaDTO>> getSalasByEstablecimiento(@PathVariable Integer establecimientoId) {
        List<SalaDTO> salas = salasRepository.findAll().stream()
                .filter(s -> s.getIdEstablecimiento() != null && 
                             s.getIdEstablecimiento().getId() == establecimientoId)
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(salas);
    }

    private SalaDTO toDTO(Salas sala) {
        SalaDTO dto = new SalaDTO();
        dto.setId(sala.getId());
        dto.setTipoSala(sala.getTipoSala());
        dto.setPrecio(sala.getPrecio());
        dto.setNombreSala(sala.getNombreSala());
        dto.setCapacidad(sala.getCapacidad());
        if (sala.getIdEstablecimiento() != null) {
            dto.setIdEstablecimiento(sala.getIdEstablecimiento().getId());
            dto.setNombreEstablecimiento(sala.getIdEstablecimiento().getNombreSucursal());
        }
        return dto;
    }
}
