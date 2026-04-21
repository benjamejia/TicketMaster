package ticketmaster.proyecto.util;

import org.springframework.stereotype.Component;
import ticketmaster.proyecto.model.userModels.User;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Utilidad para generación de CURP mexicana oficial.
 * 
 * Formato: AAAAVVDDGEECCCCCHD (18 caracteres)
 * - AAAA: Iniciales (Paterno + VocalInterna + Materno + Nombre)
 * - VVDD: Fecha nacimiento (AAMMDD)
 * - G: Género (H/M/X)
 * - EE: Entidad federativa (2 letras)
 * - CCCC: Consonantes internas
 * - H: Homoclave (2 alfanuméricos)
 * - D: Dígito verificador
 */
@Component
public class CurpUtil {

    // === Constantes ===
    private static final String VOWELS = "AEIOU";
    private static final String CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ";
    private static final String HOMoclAVE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final char PLACEHOLDER = 'X';
    private static final String FOREIGN_ENTITY = "NE";
    
    // === Mapa básico de entidades federativas ===
    private static final java.util.Map<String, String> STATE_CODES = java.util.Map.ofEntries(
        java.util.Map.entry("Aguascalientes", "AS"),
        java.util.Map.entry("Baja California", "BC"),
        java.util.Map.entry("Baja California Sur", "BS"),
        java.util.Map.entry("Campeche", "CC"),
        java.util.Map.entry("Chiapas", "CS"),
        java.util.Map.entry("Chihuahua", "CH"),
        java.util.Map.entry("Ciudad de México", "DF"),
        java.util.Map.entry("CDMX", "DF"),
        java.util.Map.entry("Distrito Federal", "DF"),
        java.util.Map.entry("Coahuila", "CL"),
        java.util.Map.entry("Colima", "CM"),
        java.util.Map.entry("Durango", "DG"),
        java.util.Map.entry("Guanajuato", "GT"),
        java.util.Map.entry("Guerrero", "GR"),
        java.util.Map.entry("Hidalgo", "HG"),
        java.util.Map.entry("Jalisco", "JC"),
        java.util.Map.entry("Estado de México", "MC"),
        java.util.Map.entry("Michoacán", "MN"),
        java.util.Map.entry("Morelos", "MS"),
        java.util.Map.entry("Nayarit", "NT"),
        java.util.Map.entry("Nuevo León", "NL"),
        java.util.Map.entry("Oaxaca", "OC"),
        java.util.Map.entry("Puebla", "PL"),
        java.util.Map.entry("Querétaro", "QT"),
        java.util.Map.entry("Quintana Roo", "QR"),
        java.util.Map.entry("San Luis Potosí", "SP"),
        java.util.Map.entry("Sinaloa", "SL"),
        java.util.Map.entry("Sonora", "SR"),
        java.util.Map.entry("Tabasco", "TC"),
        java.util.Map.entry("Tamaulipas", "TS"),
        java.util.Map.entry("Tlaxcala", "TL"),
        java.util.Map.entry("Veracruz", "VZ"),
        java.util.Map.entry("Yucatán", "YN"),
        java.util.Map.entry("Zacatecas", "ZS"),
        java.util.Map.entry("Nacido en el extranjero", FOREIGN_ENTITY)
    );

    /**
     * Genera la CURP oficial para un usuario.
     * @param user Usuario con datos validados
     * @return CURP de 18 caracteres en mayúsculas
     * @throws IllegalArgumentException si faltan datos requeridos
     */
    public static String generateCurp(User user) {
        if (user == null) {
            throw new IllegalArgumentException("El usuario no puede ser null");
        }

        // 1. Normalizar entradas
        String pApellido = normalize(user.getPrimerApellido());
        String sApellido = normalize(user.getSegundoApellido());
        String pNombre = normalize(user.getPrimerNombre());

        StringBuilder curp = new StringBuilder(18);

        // 2. Iniciales (4 caracteres)
        curp.append(pApellido.charAt(0));                           // 1: 1ra letra apellido paterno
        curp.append(getFirstInternalVowel(pApellido));              // 2: 1ra vocal interna paterno
        curp.append(sApellido.charAt(0));                           // 3: 1ra letra apellido materno
        curp.append(pNombre.charAt(0));                             // 4: 1ra letra nombre

        // 3. Fecha de nacimiento (6 dígitos: AAMMDD)
        curp.append(formatDatePart(user.getDateOfBirth()));

        // 4. Género (1 carácter)
        curp.append(getGenderCode(user.getGender()));

        // 5. Entidad federativa (2 caracteres)
        curp.append(getStateCode(user.getBirthState()));

        // 6. Consonantes internas (3 caracteres)
        curp.append(getFirstInternalConsonant(pApellido));
        curp.append(getFirstInternalConsonant(sApellido));
        curp.append(getFirstInternalConsonant(pNombre));

        // 7. Homoclave (2 caracteres alfanuméricos)
        curp.append(generateHomoclave());

        // 8. Dígito verificador
        curp.append(calculateCheckDigit(curp.toString()));

        return curp.toString().toUpperCase();
    }

    // === Métodos auxiliares privados ===

    /**
     * Normaliza texto: mayúsculas, sin acentos, sin caracteres especiales.
     */
    private static String normalize(String value) {
        if (value == null || value.trim().isEmpty()) {
            return String.valueOf(PLACEHOLDER);
        }
        return value.toUpperCase()
                .replaceAll("[ÁÀÂÄ]", "A")
                .replaceAll("[ÉÈÊË]", "E")
                .replaceAll("[ÍÌÎÏ]", "I")
                .replaceAll("[ÓÒÔÖ]", "O")
                .replaceAll("[ÚÙÛÜ]", "U")
                .replaceAll("Ñ", "X")
                .replaceAll("[^A-Z]", "");
    }

    /**
     * Obtiene la primera vocal INTERNA (después de la primera letra).
     */
    private static char getFirstInternalVowel(String text) {
        if (text == null || text.length() < 2) return PLACEHOLDER;
        for (int i = 1; i < text.length(); i++) {
            char c = text.charAt(i);
            if (VOWELS.indexOf(c) != -1) return c;
        }
        return PLACEHOLDER;
    }

    /**
     * Obtiene la primera consonante INTERNA (después de la primera letra).
     */
    private static char getFirstInternalConsonant(String text) {
        if (text == null || text.length() < 2) return PLACEHOLDER;
        for (int i = 1; i < text.length(); i++) {
            char c = text.charAt(i);
            if (CONSONANTS.indexOf(c) != -1) return c;
        }
        return PLACEHOLDER;
    }

    /**
     * Formatea fecha de nacimiento a AAMMDD.
     */
    private static String formatDatePart(String dateOfBirthStr) {
        if (dateOfBirthStr == null || dateOfBirthStr.isEmpty()) {
            return "000101"; // Valor por defecto si no hay fecha
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate date = LocalDate.parse(dateOfBirthStr, formatter);
            return String.format("%02d%02d%02d",
                    date.getYear() % 100,
                    date.getMonthValue(),
                    date.getDayOfMonth());
        } catch (DateTimeParseException e) {
            return "000101"; // Fallback en caso de error
        }
    }

    /**
     * Obtiene código de género: H (hombre), M (mujer), X (no binario/desconocido).
     */
    private static char getGenderCode(String gender) {
        if (gender == null || gender.trim().isEmpty()) return PLACEHOLDER;
        return switch (gender.toLowerCase().trim()) {
            case "male", "m", "hombre", "h" -> 'H';
            case "female", "f", "mujer", "w" -> 'M';
            default -> PLACEHOLDER;
        };
    }

    /**
     * Obtiene código de entidad federativa (2 letras).
     */
    private static String getStateCode(String state) {
        if (state == null || state.trim().isEmpty()) {
            return FOREIGN_ENTITY;
        }
        String normalized = normalize(state);
        return STATE_CODES.getOrDefault(normalized, FOREIGN_ENTITY);
    }

    /**
     * Genera homoclave aleatoria de 2 caracteres alfanuméricos.
     */
    private static String generateHomoclave() {
        var rand = ThreadLocalRandom.current();
        return "" + HOMoclAVE_CHARS.charAt(rand.nextInt(HOMoclAVE_CHARS.length()))
                 + HOMoclAVE_CHARS.charAt(rand.nextInt(HOMoclAVE_CHARS.length()));
    }

    /**
     * Calcula dígito verificador según algoritmo oficial.
     */
    private static char calculateCheckDigit(String partialCurp) {
        int sum = 0;
        String curp = partialCurp.toUpperCase();
        
        for (int i = 0; i < curp.length(); i++) {
            int value = getCharValue(curp.charAt(i));
            // Posiciones pares (índice impar) se multiplican por 2
            if (i % 2 == 1) {
                value *= 2;
                if (value > 9) value -= 9;
            }
            sum += value;
        }
        
        int remainder = sum % 10;
        return (remainder == 0) ? '0' : (char) ('0' + (10 - remainder));
    }

    /**
     * Obtiene valor numérico para cálculo del dígito verificador.
     */
    private static int getCharValue(char c) {
        return switch (c) {
            case '0' -> 0; case '1' -> 1; case '2' -> 2; case '3' -> 3;
            case '4' -> 4; case '5' -> 5; case '6' -> 6; case '7' -> 7;
            case '8' -> 8; case '9' -> 9;
            case 'A', 'J', 'S' -> 10;
            case 'B', 'K', 'T' -> 11;
            case 'C', 'L', 'U' -> 12;
            case 'D', 'M', 'V' -> 13;
            case 'E', 'N', 'W' -> 14;
            case 'F', 'O', 'X' -> 15;
            case 'G', 'P', 'Y' -> 16;
            case 'H', 'Q', 'Z' -> 17;
            case 'I', 'R' -> 18;
            default -> 0;
        };
    }
}