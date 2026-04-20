package ticketmaster.proyecto.config;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import ticketmaster.proyecto.enums.Establecimientos;
import ticketmaster.proyecto.model.Asientos;
import ticketmaster.proyecto.model.Funciones;
import ticketmaster.proyecto.model.Salas;
import ticketmaster.proyecto.model.TipoEstablecimiento;
import ticketmaster.proyecto.model.Establecimiento;
import ticketmaster.proyecto.repository.SucursalesRepository;
import ticketmaster.proyecto.repository.TipoEstablecimientosRepository;
import ticketmaster.proyecto.repository.CineRepository.AsientosRepository;
import ticketmaster.proyecto.repository.CineRepository.FuncionesRepository;
import ticketmaster.proyecto.repository.CineRepository.SalasRepository;

@Component
public class DataLoader implements CommandLineRunner {
    private final FuncionesRepository funcionesRepository;
    private final SalasRepository salasRepository;  
    private final SucursalesRepository sucursalesRepository;
    private final AsientosRepository asientosRepository;
    private final TipoEstablecimientosRepository tipoEstablecimientosRepository;

    public DataLoader(FuncionesRepository funcionesRepository, 
                        SalasRepository salasRepository, 
                        SucursalesRepository sucursalesRepository,
                        AsientosRepository asientosRepository,
                        TipoEstablecimientosRepository tipoEstablecimientosRepository
                ) {
        this.funcionesRepository = funcionesRepository;
        this.salasRepository = salasRepository;
        this.sucursalesRepository = sucursalesRepository;
        this.asientosRepository = asientosRepository;
        this.tipoEstablecimientosRepository = tipoEstablecimientosRepository;
    }

    @Override
    public void run(String... args) throws Exception {
       if(sucursalesRepository.count() == 0){
            // Cargar tipos de establecimientos
            TipoEstablecimiento cine = new TipoEstablecimiento();
            cine.setTipo(Establecimientos.CINE);
            tipoEstablecimientosRepository.save(cine);

            TipoEstablecimiento teatro = new TipoEstablecimiento();
            teatro.setTipo(Establecimientos.TEATRO);
            tipoEstablecimientosRepository.save(teatro);
            
            TipoEstablecimiento museo = new TipoEstablecimiento();
            museo.setTipo(Establecimientos.MUSEO);
            tipoEstablecimientosRepository.save(museo);

            // Guardar establecimientos
            Establecimiento sucursalCine = new Establecimiento();
            sucursalCine.setNombreSucursal("Cinepolis Forum Tlaquepaque");
            sucursalCine.setUbicacion("Marcelino Barragan 456");
            sucursalCine.setTipoEstablecimiento(cine);
            sucursalesRepository.save(sucursalCine);

            Establecimiento sucursalTeatro = new Establecimiento();
            sucursalTeatro.setNombreSucursal("Teatro Principal");
            sucursalTeatro.setUbicacion("Plaza Mayor 123");
            sucursalTeatro.setTipoEstablecimiento(teatro);
            sucursalesRepository.save(sucursalTeatro);

            Establecimiento sucursalMuseo = new Establecimiento();
            sucursalMuseo.setNombreSucursal("Museo de Arte");
            sucursalMuseo.setUbicacion("Avenida Reforma 456");
            sucursalMuseo.setTipoEstablecimiento(museo);
            sucursalesRepository.save(sucursalMuseo);

            // Cargar salas, funciones y asientos para el cine
            Salas salaCine1 = new Salas();
            salaCine1.setTipoSala("IMax");
            salaCine1.setNombreSala("Sala 1");
            salaCine1.setCapacidad(100);
            salaCine1.setIdEstablecimiento(sucursalCine);
            salasRepository.save(salaCine1);

            Salas salaTeatro = new Salas();     
            salaTeatro.setTipoSala("Principal");
            salaTeatro.setNombreSala("Sala A");
            salaTeatro.setCapacidad(200);
            salaTeatro.setIdEstablecimiento(sucursalTeatro);
            salasRepository.save(salaTeatro);
            
            Salas salaMuseo = new Salas();
            salaMuseo.setTipoSala("Exposicion");
            salaMuseo.setNombreSala("Sala B");
            salaMuseo.setCapacidad(100);
            salaMuseo.setIdEstablecimiento(sucursalMuseo);
            salasRepository.save(salaMuseo);

            String[] horarioCine = {"10:00", "13:30", "17:00", "21:00"};
            String[] horarioTeatro = {"12:00", "16:00", "20:00"};
            String[] horarioMuseo = {"09:00", "11:00", "14:00", "18:00"};

            for ( String hora : horarioCine){
                Funciones funcion = new Funciones();
                funcion.setNombreFuncion("Avengers: Endgame");
                funcion.setHorario(LocalTime.parse(hora));
                funcion.setFecha(LocalDate.now());
                funcion.setClasificacion("PG-13");
                funcion.setIdSala(salaCine1);
                funcionesRepository.save(funcion);
            }

            for ( String hora : horarioTeatro){
                Funciones funcion = new Funciones();
                funcion.setNombreFuncion("Romeo y Julieta");
                funcion.setHorario(LocalTime.parse(hora));
                funcion.setFecha(LocalDate.now());
                funcion.setClasificacion("B");
                funcion.setIdSala(salaTeatro);
                funcionesRepository.save(funcion);
            }

            for ( String hora : horarioMuseo){
                Funciones funcion = new Funciones();
                funcion.setNombreFuncion("Exposicion de Arte Moderno");
                funcion.setHorario(LocalTime.parse(hora));
                funcion.setFecha(LocalDate.now());
                funcion.setClasificacion("A");
                funcion.setIdSala(salaMuseo);
                funcionesRepository.save(funcion);
            }

            String[] letraFila = {"A","B","C","D","E"};
            int asientosPorFila = 10;
            for ( int i = 0; i < letraFila.length; i++){
                for ( int j = 0; j < asientosPorFila; j++){
                    Asientos asientos = new Asientos();
                    asientos.setFila(letraFila[i]);
                    asientos.setNumeroAsiento(i + 1);
                    asientos.setIdSala(salaCine1);

                    asientosRepository.save(asientos);
                }
            }


    } 
    
}
}
