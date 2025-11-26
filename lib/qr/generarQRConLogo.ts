import QRCode from "qrcode";
import { Jimp } from "jimp";

export async function generarQRConLogo({ url, logoBase64 }: {
  url: string;
  logoBase64: string;
}) {
  // 1) Generar QR inicial
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "H", // H = permite cubrir hasta 30%
    type: "png",
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // 2) Cargar QR y logo en Jimp
  const qrImage = await Jimp.read(qrBuffer);

  const logoImage = await Jimp.read(Buffer.from(logoBase64, "base64"));

  // Redimensionar logo para que no tape demasiado (20–25% del QR aprox)
  const qrWidth = qrImage.bitmap.width;
  const logoSize = qrWidth * 0.22;

  logoImage.resize(logoSize as any);

  // 3) Posición centrada del logo
  const x = (qrWidth - logoSize) / 2;
  const y = (qrWidth - logoSize) / 2;

  // 4) Pegar logo encima del QR
  qrImage.composite(logoImage, x, y, {
    mode: (Jimp as any).BLEND_SOURCE_OVER,
    opacitySource: 1,
  });

  // 5) Devolver QR final en base64
  const buffer = await qrImage.getBuffer("image/png");
return buffer.toString("base64");


}
