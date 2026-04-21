package ticketmaster.proyecto.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

import javax.imageio.ImageIO;

@Service
@Slf4j
public class QRCodeGeneratorService {

    private static final int QR_WIDTH = 300;
    private static final int QR_HEIGHT = 300;

    /**
     * Genera un código QR en formato Base64
     * @param data Datos a codificar
     * @return String Base64 del código QR
     */
    public String generateQRCode(String data) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, QR_WIDTH, QR_HEIGHT);
            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
            return convertImageToBase64(image);
        } catch (WriterException e) {
            log.error("Error generando código QR: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Genera un código QR y lo retorna como bytes
     */
    public byte[] generateQRCodeAsBytes(String data) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, QR_WIDTH, QR_HEIGHT);
            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);
            return baos.toByteArray();
        } catch (WriterException | IOException e) {
            log.error("Error generando código QR: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Convierte BufferedImage a String Base64
     */
    private String convertImageToBase64(BufferedImage image) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);
            byte[] imageBytes = baos.toByteArray();
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            log.error("Error convirtiendo imagen a Base64: {}", e.getMessage());
            return null;
        }
    }
}