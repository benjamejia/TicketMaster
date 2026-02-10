package ticketmaster.proyecto.config;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import ticketmaster.proyecto.model.Asientos;
import ticketmaster.proyecto.model.Funciones;
import ticketmaster.proyecto.model.Salas;
import ticketmaster.proyecto.model.Sucursales;
import ticketmaster.proyecto.repository.SucursalesRepository;
import ticketmaster.proyecto.repository.CineRepository.AsientosRepository;
import ticketmaster.proyecto.repository.CineRepository.FuncionesRepository;
import ticketmaster.proyecto.repository.CineRepository.SalasRepository;

@Component
public class DataLoader implements CommandLineRunner {
   //Esto es para que exista el cine nadamas
    private final FuncionesRepository funcionesRepository;
    private final SalasRepository salasRepository;  
    private final SucursalesRepository sucursalesRepository;
    private final AsientosRepository asientosRepository;

    public DataLoader(FuncionesRepository funcionesRepository, 
                      SalasRepository salasRepository, 
                      SucursalesRepository sucursalesRepository,
                    AsientosRepository asientosRepository) {
        this.funcionesRepository = funcionesRepository;
        this.salasRepository = salasRepository;
        this.sucursalesRepository = sucursalesRepository;
        this.asientosRepository = asientosRepository;
    }

    @Override
    public void run(String... args) throws Exception {
       if(sucursalesRepository.count() == 0){
            Sucursales sucursal = new Sucursales();
            sucursal.setNombreSucursal("Cinepolis Forum Tlaquepaque");
            sucursal.setUbicacion("Marcelino Barragan 456");
            sucursalesRepository.save(sucursal);

            Salas sala1 = new Salas();
            sala1.setIdSucursal(sucursal);
            sala1.setNombreSala("IMAX");
            sala1.setTotalAsientos(60);
            salasRepository.save(sala1);

            String[] horarioCine = {"10:00", "13:30", "17:00", "21:00"};

            for ( String hora : horarioCine){
                Funciones funcion = new Funciones();
                funcion.setNombreFuncion("Avengers: Endgame");
                funcion.setIdSala(sala1);
                funcion.setHorario(LocalTime.parse(hora));
                funcion.setFecha(LocalDate.now());
                funcionesRepository.save(funcion);
            }

            String[] letraFila = {"A","B","C","D","E","F"};
            int asientosPorFila = 10;
            for ( int i = 0; i < letraFila.length; i++){
                for ( int j = 0; j < asientosPorFila; j++){
                    Asientos asientos = new Asientos();
                    asientos.setFila(letraFila[i]);
                    asientos.setNumeroAsiento(i + 1);
                    asientos.setIdSala(sala1);

                    asientosRepository.save(asientos);
                }
       }
    } 
    
}
}
