package ticketmaster.proyecto.config;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import ticketmaster.proyecto.enums.Establecimientos;
import ticketmaster.proyecto.model.Establecimiento;
import ticketmaster.proyecto.model.Funciones;
import ticketmaster.proyecto.model.Salas;
import ticketmaster.proyecto.model.TipoEstablecimiento;
import ticketmaster.proyecto.model.cineModels.Asientos;
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
    private final TipoEstablecimientosRepository tipoEstablecimientosRepository;
    private final AsientosRepository asientosRepository;

    public DataLoader(FuncionesRepository funcionesRepository,
                        SalasRepository salasRepository,
                        SucursalesRepository sucursalesRepository,
                        AsientosRepository asientosRepository,
                        TipoEstablecimientosRepository tipoEstablecimientosRepository
                ) {
        this.funcionesRepository = funcionesRepository;
        this.salasRepository = salasRepository;
        this.sucursalesRepository = sucursalesRepository;
        this.tipoEstablecimientosRepository = tipoEstablecimientosRepository;
        this.asientosRepository = asientosRepository;
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

            // ==================== CINES ====================
            Establecimiento cinepolis = new Establecimiento();
            cinepolis.setNombreSucursal("Cinepolis Forum Tlaquepaque");
            cinepolis.setUbicacion("Marcelino Barragan 456, Tlaquepaque");
            cinepolis.setTipoEstablecimiento(cine);
            sucursalesRepository.save(cinepolis);

            Establecimiento cinemex = new Establecimiento();
            cinemex.setNombreSucursal("Cinemex Plaza del Sol");
            cinemex.setUbicacion("Av. Lopez Mateos 2000, Zapopan");
            cinemex.setTipoEstablecimiento(cine);
            sucursalesRepository.save(cinemex);

            Establecimiento cineteca = new Establecimiento();
            cineteca.setNombreSucursal("Cineteca Nacional de Guadalajara");
            cineteca.setUbicacion("Avenida de la Patria 1200, Zapopan");
            cineteca.setTipoEstablecimiento(cine);
            sucursalesRepository.save(cineteca);

            // Salas para Cinepolis
            Salas salaCinepolisIMAX = new Salas();
            salaCinepolisIMAX.setTipoSala("IMAX");
            salaCinepolisIMAX.setNombreSala("Sala IMAX");
            salaCinepolisIMAX.setCapacidad(120);
            salaCinepolisIMAX.setPrecio(150);
            salaCinepolisIMAX.setIdEstablecimiento(cinepolis);
            salasRepository.save(salaCinepolisIMAX);

            Salas salaCinepolis2D = new Salas();
            salaCinepolis2D.setTipoSala("2D");
            salaCinepolis2D.setNombreSala("Sala 2D-1");
            salaCinepolis2D.setCapacidad(80);
            salaCinepolis2D.setPrecio(90);
            salaCinepolis2D.setIdEstablecimiento(cinepolis);
            salasRepository.save(salaCinepolis2D);

            Salas salaCinepolis3D = new Salas();
            salaCinepolis3D.setTipoSala("3D");
            salaCinepolis3D.setNombreSala("Sala 3D-1");
            salaCinepolis3D.setCapacidad(100);
            salaCinepolis3D.setPrecio(120);
            salaCinepolis3D.setIdEstablecimiento(cinepolis);
            salasRepository.save(salaCinepolis3D);

            // Salas para Cinemex
            Salas salaCinemexVIP = new Salas();
            salaCinemexVIP.setTipoSala("VIP");
            salaCinemexVIP.setNombreSala("Sala VIP");
            salaCinemexVIP.setCapacidad(60);
            salaCinemexVIP.setPrecio(200);
            salaCinemexVIP.setIdEstablecimiento(cinemex);
            salasRepository.save(salaCinemexVIP);

            Salas salaCinemex2D = new Salas();
            salaCinemex2D.setTipoSala("2D");
            salaCinemex2D.setNombreSala("Sala 2D-1");
            salaCinemex2D.setCapacidad(90);
            salaCinemex2D.setPrecio(85);
            salaCinemex2D.setIdEstablecimiento(cinemex);
            salasRepository.save(salaCinemex2D);

            // Salas para Cineteca
            Salas salaCineteca1 = new Salas();
            salaCineteca1.setTipoSala("Estreno");
            salaCineteca1.setNombreSala("Sala Estreno");
            salaCineteca1.setCapacidad(70);
            salaCineteca1.setPrecio(70);
            salaCineteca1.setIdEstablecimiento(cineteca);
            salasRepository.save(salaCineteca1);

            // Crear asientos para salas de cine
            crearAsientosSalaCine(salaCinepolisIMAX, 8, 15);
            crearAsientosSalaCine(salaCinepolis2D, 6, 14);
            crearAsientosSalaCine(salaCinepolis3D, 7, 14);
            crearAsientosSalaCine(salaCinemexVIP, 5, 12);
            crearAsientosSalaCine(salaCinemex2D, 6, 15);
            crearAsientosSalaCine(salaCineteca1, 5, 14);

            // Funciones para Cinepolis IMAX
            String[] peliculasCinepolis = {"Avengers: Endgame", "Spider-Man: No Way Home", "The Batman", "Dune: Part Two"};
            String[] horariosCine = {"10:00", "13:30", "17:00", "21:00"};
            String[] clasificacionesCine = {"PG-13", "PG-13", "R", "PG-13"};

            for(int i = 0; i < peliculasCinepolis.length; i++) {
                for(String hora : horariosCine) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(peliculasCinepolis[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i));
                    funcion.setClasificacion(clasificacionesCine[i]);
                    funcion.setIdSala(salaCinepolisIMAX);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Cinepolis 2D
            String[] peliculas2D = {"Toy Story 4", "Finding Nemo", "The Lion King", "Frozen II"};
            String[] clasificaciones2D = {"G", "G", "G", "PG"};

            for(int i = 0; i < peliculas2D.length; i++) {
                for(String hora : new String[]{"11:00", "14:30", "18:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(peliculas2D[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i));
                    funcion.setClasificacion(clasificaciones2D[i]);
                    funcion.setIdSala(salaCinepolis2D);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Cinepolis 3D
            String[] peliculas3D = {"Avatar: The Way of Water", "Shrek 3D", "Gravity 3D"};
            for(int i = 0; i < peliculas3D.length; i++) {
                for(String hora : new String[]{"12:00", "16:00", "20:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(peliculas3D[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i + 2));
                    funcion.setClasificacion("PG-13");
                    funcion.setIdSala(salaCinepolis3D);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Cinemex VIP
            String[] peliculasVIP = {"Oppenheimer", "Interstellar", "Tenet"};
            for(int i = 0; i < peliculasVIP.length; i++) {
                for(String hora : new String[]{"14:00", "19:00", "22:30"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(peliculasVIP[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i));
                    funcion.setClasificacion("R");
                    funcion.setIdSala(salaCinemexVIP);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Cinemex 2D
            String[] peliculasCinemex2D = {"Fast X", "John Wick 4", "The Flash"};
            for(int i = 0; i < peliculasCinemex2D.length; i++) {
                for(String hora : new String[]{"11:30", "15:00", "18:30", "21:30"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(peliculasCinemex2D[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i + 1));
                    funcion.setClasificacion("PG-13");
                    funcion.setIdSala(salaCinemex2D);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Cineteca
            String[] peliculasCineteca = {"Parasite", "Amelie", "Cinema Paradiso", "City of God"};
            for(int i = 0; i < peliculasCineteca.length; i++) {
                for(String hora : new String[]{"10:30", "15:30", "19:30"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(peliculasCineteca[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i + 3));
                    funcion.setClasificacion("R");
                    funcion.setIdSala(salaCineteca1);
                    funcionesRepository.save(funcion);
                }
            }

            // ==================== TEATROS ====================
            Establecimiento teatroPrincipal = new Establecimiento();
            teatroPrincipal.setNombreSucursal("Teatro Principal");
            teatroPrincipal.setUbicacion("Plaza Mayor 123, Centro");
            teatroPrincipal.setTipoEstablecimiento(teatro);
            sucursalesRepository.save(teatroPrincipal);

            Establecimiento teatroDegollado = new Establecimiento();
            teatroDegollado.setNombreSucursal("Teatro Degollado");
            teatroDegollado.setUbicacion("Av. Hidalgo 200, Centro");
            teatroDegollado.setTipoEstablecimiento(teatro);
            sucursalesRepository.save(teatroDegollado);

            Establecimiento teatroExperimental = new Establecimiento();
            teatroExperimental.setNombreSucursal("Teatro Experimental");
            teatroExperimental.setUbicacion("Calle Reforma 789, Chapalita");
            teatroExperimental.setTipoEstablecimiento(teatro);
            sucursalesRepository.save(teatroExperimental);

            // Salas para Teatro Principal
            Salas salaTeatroPrincipal = new Salas();
            salaTeatroPrincipal.setTipoSala("Principal");
            salaTeatroPrincipal.setNombreSala("Sala Principal");
            salaTeatroPrincipal.setCapacidad(300);
            salaTeatroPrincipal.setPrecio(250);
            salaTeatroPrincipal.setIdEstablecimiento(teatroPrincipal);
            salasRepository.save(salaTeatroPrincipal);

            Salas salaTeatroVIP = new Salas();
            salaTeatroVIP.setTipoSala("VIP");
            salaTeatroVIP.setNombreSala("Palco VIP");
            salaTeatroVIP.setCapacidad(50);
            salaTeatroVIP.setPrecio(500);
            salaTeatroVIP.setIdEstablecimiento(teatroPrincipal);
            salasRepository.save(salaTeatroVIP);

            // Salas para Teatro Degollado
            Salas salaDegollado = new Salas();
            salaDegollado.setTipoSala("Principal");
            salaDegollado.setNombreSala("Sala Principal");
            salaDegollado.setCapacidad(400);
            salaDegollado.setPrecio(300);
            salaDegollado.setIdEstablecimiento(teatroDegollado);
            salasRepository.save(salaDegollado);

            Salas salaDegolladoBalcon = new Salas();
            salaDegolladoBalcon.setTipoSala("Balcon");
            salaDegolladoBalcon.setNombreSala("Balcon");
            salaDegolladoBalcon.setCapacidad(150);
            salaDegolladoBalcon.setPrecio(200);
            salaDegolladoBalcon.setIdEstablecimiento(teatroDegollado);
            salasRepository.save(salaDegolladoBalcon);

            // Salas para Teatro Experimental
            Salas salaExperimental = new Salas();
            salaExperimental.setTipoSala("Experimental");
            salaExperimental.setNombreSala("Sala Experimental");
            salaExperimental.setCapacidad(100);
            salaExperimental.setPrecio(150);
            salaExperimental.setIdEstablecimiento(teatroExperimental);
            salasRepository.save(salaExperimental);

            // Crear asientos para salas de teatro
            crearAsientosSalaTeatro(salaTeatroPrincipal, 15, 20);
            crearAsientosSalaTeatro(salaTeatroVIP, 5, 10);
            crearAsientosSalaTeatro(salaDegollado, 20, 20);
            crearAsientosSalaTeatro(salaDegolladoBalcon, 10, 15);
            crearAsientosSalaTeatro(salaExperimental, 8, 12);

            // Funciones para Teatro Principal
            String[] obrasPrincipal = {"Romeo y Julieta", "Hamlet", "La Casa de Bernarda Alba", "El Rey Leon (Musical)"};
            for(int i = 0; i < obrasPrincipal.length; i++) {
                for(String hora : new String[]{"12:00", "16:00", "20:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(obrasPrincipal[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 2));
                    funcion.setClasificacion("B");
                    funcion.setIdSala(salaTeatroPrincipal);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Palco VIP
            String[] obrasVIP = {"Cena con Delito", "Escape Room En Vivo", "Stand Up Comedy"};
            for(int i = 0; i < obrasVIP.length; i++) {
                for(String hora : new String[]{"19:00", "21:30"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(obrasVIP[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 3 + 1));
                    funcion.setClasificacion("B");
                    funcion.setIdSala(salaTeatroVIP);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Teatro Degollado
            String[] obrasDegollado = {"La Boheme", "Carmen", "El Fantasma de la Opera", "Don Giovanni"};
            for(int i = 0; i < obrasDegollado.length; i++) {
                for(String hora : new String[]{"11:00", "17:00", "20:30"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(obrasDegollado[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 2 + 1));
                    funcion.setClasificacion("A");
                    funcion.setIdSala(salaDegollado);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Balcon
            for(int i = 0; i < 3; i++) {
                for(String hora : new String[]{"16:00", "20:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion("Recital de Piano " + (i + 1));
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 4));
                    funcion.setClasificacion("A");
                    funcion.setIdSala(salaDegolladoBalcon);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Teatro Experimental
            String[] obrasExperimental = {"Improvisacion Total", "Teatro del Absurdo", "Monologos de la Vagina"};
            for(int i = 0; i < obrasExperimental.length; i++) {
                for(String hora : new String[]{"18:00", "21:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(obrasExperimental[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 3 + 2));
                    funcion.setClasificacion("C");
                    funcion.setIdSala(salaExperimental);
                    funcionesRepository.save(funcion);
                }
            }

            // ==================== MUSEOS ====================
            Establecimiento museoArte = new Establecimiento();
            museoArte.setNombreSucursal("Museo de Arte de Guadalajara");
            museoArte.setUbicacion("Avenida Reforma 456, Centro");
            museoArte.setTipoEstablecimiento(museo);
            sucursalesRepository.save(museoArte);

            Establecimiento museoHistoria = new Establecimiento();
            museoHistoria.setNombreSucursal("Museo de Historia Regional");
            museoHistoria.setUbicacion("Calle Independencia 789, Centro");
            museoHistoria.setTipoEstablecimiento(museo);
            sucursalesRepository.save(museoHistoria);

            Establecimiento museoCiencia = new Establecimiento();
            museoCiencia.setNombreSucursal("Museo de Ciencia y Tecnologia");
            museoCiencia.setUbicacion("Av. Patria 1500, Zapopan");
            museoCiencia.setTipoEstablecimiento(museo);
            sucursalesRepository.save(museoCiencia);

            // Salas para Museo de Arte
            Salas salaArte1 = new Salas();
            salaArte1.setTipoSala("Exposicion");
            salaArte1.setNombreSala("Sala de Arte Moderno");
            salaArte1.setCapacidad(150);
            salaArte1.setPrecio(80);
            salaArte1.setIdEstablecimiento(museoArte);
            salasRepository.save(salaArte1);

            Salas salaArte2 = new Salas();
            salaArte2.setTipoSala("Exposicion");
            salaArte2.setNombreSala("Sala de Arte Colonial");
            salaArte2.setCapacidad(100);
            salaArte2.setPrecio(60);
            salaArte2.setIdEstablecimiento(museoArte);
            salasRepository.save(salaArte2);

            // Salas para Museo de Historia
            Salas salaHistoria1 = new Salas();
            salaHistoria1.setTipoSala("Exposicion");
            salaHistoria1.setNombreSala("Sala Prehispanica");
            salaHistoria1.setCapacidad(120);
            salaHistoria1.setPrecio(50);
            salaHistoria1.setIdEstablecimiento(museoHistoria);
            salasRepository.save(salaHistoria1);

            Salas salaHistoria2 = new Salas();
            salaHistoria2.setTipoSala("Exposicion");
            salaHistoria2.setNombreSala("Sala Colonial");
            salaHistoria2.setCapacidad(100);
            salaHistoria2.setPrecio(50);
            salaHistoria2.setIdEstablecimiento(museoHistoria);
            salasRepository.save(salaHistoria2);

            // Salas para Museo de Ciencia
            Salas salaCiencia1 = new Salas();
            salaCiencia1.setTipoSala("Interactiva");
            salaCiencia1.setNombreSala("Sala de Ciencias Basicas");
            salaCiencia1.setCapacidad(200);
            salaCiencia1.setPrecio(90);
            salaCiencia1.setIdEstablecimiento(museoCiencia);
            salasRepository.save(salaCiencia1);

            Salas salaCiencia2 = new Salas();
            salaCiencia2.setTipoSala("Interactiva");
            salaCiencia2.setNombreSala("Sala de Tecnologia");
            salaCiencia2.setCapacidad(150);
            salaCiencia2.setPrecio(100);
            salaCiencia2.setIdEstablecimiento(museoCiencia);
            salasRepository.save(salaCiencia2);

            // Funciones para Museo de Arte
            String[] exposicionesArte = {"Exposicion de Arte Moderno", "Frida Kahlo: Retrospectiva", "Picasso y sus Musas", "Surrealismo Contemporaneo"};
            for(int i = 0; i < exposicionesArte.length; i++) {
                for(String hora : new String[]{"09:00", "11:00", "14:00", "18:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(exposicionesArte[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 7));
                    funcion.setClasificacion("A");
                    funcion.setIdSala(salaArte1);
                    funcionesRepository.save(funcion);
                }
            }

            for(int i = 0; i < 3; i++) {
                for(String hora : new String[]{"10:00", "13:00", "16:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion("Arte Colonial " + (i + 1));
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 5 + 2));
                    funcion.setClasificacion("A");
                    funcion.setIdSala(salaArte2);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Museo de Historia
            String[] exposicionesHistoria = {"Culturas de Mesoamerica", "La Conquista de Mexico", "Independencia de Mexico"};
            for(int i = 0; i < exposicionesHistoria.length; i++) {
                for(String hora : new String[]{"09:30", "12:00", "15:00", "17:30"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(exposicionesHistoria[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 6));
                    funcion.setClasificacion("A");
                    funcion.setIdSala(salaHistoria1);
                    funcionesRepository.save(funcion);
                }
            }

            // Funciones para Museo de Ciencia
            String[] exposicionesCiencia = {"Robotica para Ninos", "El Universo y los Agujeros Negros", "Expedicion Dinosaurios"};
            for(int i = 0; i < exposicionesCiencia.length; i++) {
                for(String hora : new String[]{"10:00", "13:30", "16:30", "19:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion(exposicionesCiencia[i]);
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 4 + 3));
                    funcion.setClasificacion("A");
                    funcion.setIdSala(salaCiencia1);
                    funcionesRepository.save(funcion);
                }
            }

            for(int i = 0; i < 2; i++) {
                for(String hora : new String[]{"11:00", "15:00", "18:00"}) {
                    Funciones funcion = new Funciones();
                    funcion.setNombreFuncion("Tecnologia del Futuro " + (i + 1));
                    funcion.setHorario(LocalTime.parse(hora));
                    funcion.setFecha(LocalDate.now().plusDays(i * 5 + 4));
                    funcion.setClasificacion("A");
                    funcion.setIdSala(salaCiencia2);
                    funcionesRepository.save(funcion);
                }
            }

            System.out.println("Datos cargados exitosamente!");
    }

    }

    private void crearAsientosSalaCine(Salas sala, int filas, int asientosPorFila) {
        String[] letrasFilas = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"};
        for(int fila = 0; fila < filas; fila++) {
            for(int num = 1; num <= asientosPorFila; num++) {
                Asientos asiento = new Asientos();
                asiento.setFila(letrasFilas[fila]);
                asiento.setNumeroAsiento(num);
                asiento.setIdSala(sala);
                asientosRepository.save(asiento);
            }
        }
    }

    private void crearAsientosSalaTeatro(Salas sala, int filas, int asientosPorFila) {
        String[] letrasFilas = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"};
        for(int fila = 0; fila < filas; fila++) {
            for(int num = 1; num <= asientosPorFila; num++) {
                Asientos asiento = new Asientos();
                asiento.setFila(letrasFilas[fila]);
                asiento.setNumeroAsiento(num);
                asiento.setIdSala(sala);
                asientosRepository.save(asiento);
            }
        }
    }
}

