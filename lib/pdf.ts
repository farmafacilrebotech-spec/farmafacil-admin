import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generarPDFBienvenida({
  nombreFarmacia,
  qrBase64,
  logoFarmaciaBase64,
}: {
  nombreFarmacia: string;
  qrBase64: string;
  logoFarmaciaBase64?: string;
}): Promise<Uint8Array> {

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 vertical
  const { height, width } = page.getSize();

  // ⭐️ Esta sí funciona con pdf-lib
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  // Encabezado
  page.drawText(`FarmaFácil - ${nombreFarmacia}`, {
    x: 50,
    y: height - 80,
    size: 26,
    font,
    color: rgb(0.1, 0.7, 0.65),
  });

  // Logo farmacia
  if (logoFarmaciaBase64) {
    const logoBytes = Buffer.from(
      logoFarmaciaBase64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const logoImg = await pdf.embedPng(new Uint8Array(logoBytes.buffer));

    page.drawImage(logoImg, {
      x: width - 170,
      y: height - 160,
      width: 120,
      height: 120,
    });
  }

  // QR
  const qrBytes = Buffer.from(
    qrBase64.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
  const qrImg = await pdf.embedPng(new Uint8Array(qrBytes.buffer));

  page.drawImage(qrImg, {
    x: width / 2 - 150,
    y: height / 2 - 150,
    width: 300,
    height: 300,
  });

  // Footer
  page.drawText("by ReBoTech Solutions", {
    x: width / 2 - 80,
    y: 40,
    size: 14,
    font,
    color: rgb(0.1, 0.7, 0.65),
  });

  return await pdf.save();
}
