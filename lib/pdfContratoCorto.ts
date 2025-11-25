import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface ContratoData {
  farmaciaId: string;
  razon_social: string;
  cif_nif: string;
  direccion_fiscal: string;
  email_facturacion: string;
  telefono_facturacion: string;
  metodo_pago_inicial: string;
  metodo_pago_recurrente: string;
  plan: string;
  cuota_mensual: number;
  cuota_alta: number;
  fecha_inicio: string;
  iban: string;
  titular_cuenta: string;
  dia_cobro_preferente: number;
}

export async function generarContratoPDF(data: ContratoData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontNormal = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const color = rgb(0.1, 0.73, 0.68);

  let currentPage = page;
  let y = height - 80;

  // ------------------------------
  // FUNCIONES AUXILIARES
  // ------------------------------

  const write = (text: string, opts: any = {}) => {
    const size = opts.size || 11;
    const font = opts.bold ? fontBold : fontNormal;

    currentPage.drawText(text, {
      x: opts.x || 50,
      y,
      size,
      font,
      color: opts.color || rgb(0, 0, 0),
    });
    y -= size + 6;

    // si llegamos muy abajo → nueva página
    if (y < 80) newPage();
  };

  const newPage = () => {
    currentPage = pdf.addPage([595, 842]);
    y = height - 80;
  };

  // ------------------------------
  // LOGO CABECERA
  // ------------------------------

  const logoUrl =
    "https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png";

  const logoBytes = await fetch(logoUrl).then(r => r.arrayBuffer());
  const logoImage = await pdf.embedPng(logoBytes);

  const logoW = 75;
  const logoH = (logoImage.height / logoImage.width) * logoW;

  currentPage.drawImage(logoImage, {
    x: width / 2 - logoW / 2,
    y: y - logoH,
    width: logoW,
    height: logoH,
  });

  y -= logoH + 30;

  // ------------------------------
  // TÍTULO
  // ------------------------------
  const title = "CONTRATO DE SERVICIO — FARMAFÁCIL®";
  const textWidth = fontBold.widthOfTextAtSize(title, 18);

  currentPage.drawText(title, {
    x: (width - textWidth) / 2,
    y,
    size: 22,
    font: fontBold,
    color,
  });
  y -= 40;

  // ==============================
  // SECCIONES
  // ==============================

  // --- 1. OBJETO ---
  write("1. OBJETO DEL CONTRATO", { bold: true, size: 14, color });
  write(
    "El presente contrato regula el uso del servicio FarmaFácil®, desarrollado por Rebotech Solutions S.L.U."
  );
  y -= 15;

  // --- 2. DATOS REBOTECH ---
  write("2. DATOS DE REBOTECH SOLUTIONS S.L.U", { bold: true, size: 14, color });
  write("Rebotech Solutions S.L.U");
  write("CIF: XXXXXXXXXXX");
  write("Domicilio Social: Av. Primado Reig 149, Valencia");
  write("Correo soporte: farmafacil.rebotech@gmail.com");
  write("Teléfono: 647 734 564");
  write("Representante Legal: Pilar Reyes Bononat");
  write("Cargo: Fundadora y CEO");
  y -= 15;
  // --- 3. DATOS FARMACIA ---
  write("3. DATOS DE LA FARMACIA CONTRATANTE", { bold: true, size: 14, color });
  write(`ID de farmacia: ${data.farmaciaId}`);
  write(`Nombre fiscal: ${data.razon_social}`);
  write(`CIF/NIF: ${data.cif_nif}`);
  write(`Dirección fiscal: ${data.direccion_fiscal}`);
  write(`Email de facturación: ${data.email_facturacion}`);
  write(`Teléfono de facturación: ${data.telefono_facturacion}`);
  y -= 15;
  // --- 4. PLAN Y TARIFAS ---
  write("4. PLAN CONTRATADO Y TARIFAS", { bold: true, size: 14, color });
  write(`Plan seleccionado: ${data.plan}`);
  write(`Cuota mensual: ${data.cuota_mensual} €`);
  write(`Cuota de alta / personalización: ${data.cuota_alta} €`);
  write(`Fecha de inicio: ${data.fecha_inicio}`);
  y -= 15;
  // --- 5. MÉTODOS DE PAGO ---
  write("5. MÉTODOS DE PAGO", { bold: true, size: 14, color });
  write(`Método de pago inicial: ${data.metodo_pago_inicial}`);
  write(`Método de pago recurrente: ${data.metodo_pago_recurrente}`);
  write(`IBAN: ${data.iban}`);
  write(`Titular de la cuenta: ${data.titular_cuenta}`);
  write(`Día preferente de cobro: ${data.dia_cobro_preferente}`);
  y -= 15;  
  // -------------------------------------------------------------
//                    FIRMAS (PÁGINA FINAL)
// -------------------------------------------------------------
newPage();

// 🔹 Sección Farmacia
write("FIRMA DE LA FARMACIA CONTRATANTE", { bold: true, size: 16, color });
y -= 15;

write(`Nombre o Razón Social: ${data.razon_social}`);
y -= 25;

write("Nombre y apellidos y DNI del firmante: ______________________________________________");

y -= 20;
write("Fecha de la firma: _______________________________________________");
y -= 30;
write("Sello y firma del farmacéutico:");

y -= 60; // 📌 Gran espacio entre bloques

// 🔹 Sección Prestador
write("FIRMA DEL PRESTADOR DEL SERVIVIO FARMAFÁCIL®", { bold: true, size: 16, color });
y -= 15;

write("Pilar Reyes Bononat");
y -= 10;
write("Fundadora y CEO de FarmaFácil® - Rebotech Solutions S.L.U");
y -= 25;

write("Firma: ");
y -= 20;
write("Fecha: ____________________________________________________________");

// Fin del documento
return await pdf.save();

}
