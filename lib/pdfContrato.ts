// lib/pdfContrato.ts
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a "25 de enero de 2025"
 */
function formatearFechaLarga(fechaISO: string) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const fecha = new Date(fechaISO + "T00:00:00");
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();

  return `${dia} de ${mes} de ${año}`;
}

export interface ContratoData {
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

export async function generarContratoPDF(
  data: ContratoData
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  const colorPrincipal = rgb(0.1, 0.73, 0.68);
  const negro = rgb(0, 0, 0);

  const fontNormal = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const marginX = 50;
  const marginTop = 80;
  const marginBottom = 70;

  let page = pdf.addPage([595, 842]); // A4
  let { width, height } = page.getSize();
  let y = height - marginTop;

  // ------------ helpers de maquetación -------------------------

  const newPage = () => {
    page = pdf.addPage([595, 842]);
    ({ width, height } = page.getSize());
    y = height - marginTop;
  };

  const ensureSpace = (needed: number) => {
    if (y - needed < marginBottom) newPage();
  };

  const writeHeading = (text: string) => {
    const size = 13;
    const lineHeight = 18;
    ensureSpace(lineHeight + 6);
    page.drawText(text, {
      x: marginX,
      y,
      size,
      font: fontBold,
      color: colorPrincipal,
    });
    y -= lineHeight;
  };

  const writeLabelLine = (text: string) => {
    const size = 11;
    const lineHeight = 14;
    ensureSpace(lineHeight);
    page.drawText(text, {
      x: marginX,
      y,
      size,
      font: fontNormal,
      color: negro,
    });
    y -= lineHeight;
  };

  const writeParagraphJustified = (text: string) => {
    const size = 11;
    const lineHeight = 14;
    const maxWidth = width - marginX * 2;

    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) {
      y -= lineHeight;
      return;
    }

    const words = clean.split(" ");
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentWidth = 0;
    const spaceWidth = fontNormal.widthOfTextAtSize(" ", size);

    for (const word of words) {
      const wWidth = fontNormal.widthOfTextAtSize(word, size);
      if (currentWidth + wWidth + (currentLine.length > 0 ? spaceWidth : 0) > maxWidth) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [word];
        currentWidth = wWidth;
      } else {
        if (currentLine.length === 0) {
          currentLine.push(word);
          currentWidth = wWidth;
        } else {
          currentLine.push(word);
          currentWidth += spaceWidth + wWidth;
        }
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    lines.forEach((lineWords, idx) => {
      const isLast = idx === lines.length - 1;
      ensureSpace(lineHeight);

      if (isLast || lineWords.length === 1) {
        // última línea o una sola palabra → sin justificar
        page.drawText(lineWords.join(" "), {
          x: marginX,
          y,
          size,
          font: fontNormal,
          color: negro,
        });
        y -= lineHeight;
        return;
      }

      const textNoSpaces = lineWords.join("");
      const wordsWidth = fontNormal.widthOfTextAtSize(textNoSpaces, size);
      const gaps = lineWords.length - 1;
      const extraSpace = maxWidth - wordsWidth;
      const gapSpace = extraSpace / gaps;

      let cursor = marginX;

      for (let i = 0; i < lineWords.length; i++) {
        const w = lineWords[i];
        page.drawText(w, {
          x: cursor,
          y,
          size,
          font: fontNormal,
          color: negro,
        });
        const wWidth = fontNormal.widthOfTextAtSize(w, size);
        cursor += wWidth + gapSpace;
      }

      y -= lineHeight;
    });

    y -= 6; // espacio extra entre párrafos
  };

  // ------------- CABECERA: logo + título -----------------------------

  const logoUrl =
    "https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png";

  try {
    const logoBytes = await fetch(logoUrl).then((r) => r.arrayBuffer());
    const logoImage = await pdf.embedPng(logoBytes);

    const logoWidth = 80; // pequeño y centrado
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth;

    page.drawImage(logoImage, {
      x: width / 2 - logoWidth / 2,
      y: y - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });

    y -= logoHeight + 20;
  } catch (e) {
    // si falla el logo, seguimos sin romper
  }

  const titulo = "CONTRATO DE SERVICIO — FARMAFÁCIL®";
  const tituloSize = 18;
  const tituloWidth = fontBold.widthOfTextAtSize(titulo, tituloSize);

  page.drawText(titulo, {
    x: (width - tituloWidth) / 2,
    y,
    size: tituloSize,
    font: fontBold,
    color: colorPrincipal,
  });

  y -= 32;

  // ===================== CUERPO DEL CONTRATO =========================

  // REUNIDOS
  writeHeading("REUNIDOS");
  writeParagraphJustified(
    "De una parte, Rebotech Solutions S.L.U, con CIF XXXXXXXXXXX y domicilio social en Av. Primado Reig 149, Valencia, en adelante, “El Proveedor”."
  );
  writeParagraphJustified(
    `Y de otra, ${data.razon_social}, con CIF/NIF ${data.cif_nif} y domicilio en ${data.direccion_fiscal}, representada en este acto por la persona que firma el presente documento, en adelante, “La Farmacia”.`
  );
  writeParagraphJustified(
    "Ambas partes se reconocen capacidad legal suficiente para contratar y MANIFIESTAN lo siguiente:"
  );

  // MANIFIESTAN
  writeHeading("MANIFIESTAN");
  writeParagraphJustified(
    "Que La Farmacia está interesada en contratar los servicios de la plataforma tecnológica FarmaFácil®, desarrollada y gestionada por El Proveedor, para la digitalización y mejora de la relación con sus clientes."
  );

  // 1. OBJETO
  writeHeading("1. OBJETO DEL CONTRATO");
  writeParagraphJustified(
    "El presente contrato tiene por objeto la prestación, por parte de El Proveedor, de los servicios asociados a la plataforma FarmaFácil®, que permiten a La Farmacia disponer de una solución tecnológica para mejorar su presencia digital y la relación con sus clientes."
  );
  writeParagraphJustified(
    "En particular, el servicio incluye, entre otros, los siguientes elementos:"
  );
  writeParagraphJustified(
    "1.1. Alta y configuración de la farmacia en la plataforma FarmaFácil."
  );
  writeParagraphJustified(
    "1.2. Creación y mantenimiento de un panel de administración para la farmacia."
  );
  writeParagraphJustified(
    "1.3. Generación y suministro de un código QR personalizado que enlaza con el perfil digital de la farmacia."
  );
  writeParagraphJustified(
    "1.4. Alojamiento y mantenimiento de la información básica de la farmacia en la plataforma."
  );
  writeParagraphJustified(
    "1.5. Soporte básico para la correcta utilización de la herramienta, por los canales habilitados por El Proveedor."
  );

  // 2. PRECIO Y FORMA DE PAGO
  writeHeading("2. PRECIO Y FORMA DE PAGO");
  writeParagraphJustified(
    `2.1. Cuota de alta / personalización. La Farmacia abonará a El Proveedor una cuota inicial de ${data.cuota_alta.toFixed(
      2
    )} € en concepto de alta, configuración y personalización del servicio.`
  );
  writeParagraphJustified(
    `2.2. Cuota mensual de servicio. La Farmacia abonará una cuota mensual de ${data.cuota_mensual.toFixed(
      2
    )} € en concepto de uso, mantenimiento y soporte de la plataforma FarmaFácil, para el plan contratado: ${data.plan}.`
  );
  writeParagraphJustified(
    `2.3. Forma de pago. El pago inicial se realizará mediante ${data.metodo_pago_inicial}. Los pagos recurrentes se realizarán mediante ${data.metodo_pago_recurrente}, con cargo al IBAN ${data.iban}, cuyo titular es ${data.titular_cuenta}, con día de cobro preferente el ${data.dia_cobro_preferente} de cada mes.`
  );
  writeParagraphJustified(
    "2.4. En caso de devolución o impago de recibos, La Farmacia asumirá las comisiones bancarias generadas y El Proveedor podrá suspender temporalmente el servicio hasta la regularización del pago."
  );

  // 3. DURACIÓN Y RESCISIÓN
  writeHeading("3. DURACIÓN Y RESCISIÓN");
  writeParagraphJustified(
    "3.1. El presente contrato tendrá una duración inicial de 12 meses a contar desde la fecha de inicio del servicio, renovándose automáticamente por períodos sucesivos de un (1) mes, salvo comunicación expresa en contrario por cualquiera de las partes."
  );
  writeParagraphJustified(
    "3.2. Cualquiera de las partes podrá resolver el contrato en cualquier momento, mediante comunicación escrita con un preaviso mínimo de 15 días."
  );
  writeParagraphJustified(
    "3.3. La resolución del contrato no exime a La Farmacia del pago de las cantidades devengadas y pendientes hasta la fecha efectiva de baja."
  );

  // 4. NIVEL DE SERVICIO Y MANTENIMIENTO
  writeHeading("4. NIVEL DE SERVICIO Y MANTENIMIENTO");
  writeParagraphJustified(
    "4.1. El Proveedor se compromete a realizar los esfuerzos razonables para asegurar la disponibilidad de la plataforma FarmaFácil durante el mayor tiempo posible, salvo incidencias técnicas, tareas de mantenimiento programado o causas de fuerza mayor."
  );
  writeParagraphJustified(
    "4.2. El soporte se prestará por los canales acordados (correo electrónico, WhatsApp u otros canales indicados por El Proveedor) en horario laboral aproximado de lunes a viernes, excepto festivos."
  );

  // 5. PROPIEDAD INTELECTUAL
  writeHeading("5. PROPIEDAD INTELECTUAL");
  writeParagraphJustified(
    "5.1. La plataforma FarmaFácil, así como su código fuente, diseño, estructuras de base de datos y funcionalidades, son propiedad exclusiva de El Proveedor."
  );
  writeParagraphJustified(
    "5.2. La Farmacia adquiere únicamente un derecho de uso no exclusivo, intransferible y limitado a la duración del presente contrato."
  );
  writeParagraphJustified(
    "5.3. La Farmacia se compromete a no reproducir, copiar, modificar, descompilar, distribuir o ceder la plataforma a terceros sin autorización expresa y por escrito de El Proveedor."
  );

  // 6. PROTECCIÓN DE DATOS
  writeHeading("6. PROTECCIÓN DE DATOS");
  writeParagraphJustified(
    "6.1. Ambas partes se comprometen a cumplir la normativa vigente en materia de protección de datos personales (RGPD y LOPDGDD)."
  );
  writeParagraphJustified(
    "6.2. En caso de que El Proveedor trate datos personales por cuenta de La Farmacia (por ejemplo, datos de clientes), actuará como Encargado del Tratamiento, firmándose en su caso un Acuerdo de Encargo de Tratamiento anexo al presente contrato."
  );
  writeParagraphJustified(
    "6.3. La información básica de la farmacia (nombre, dirección, horarios, etc.) será publicada en la plataforma con la finalidad de ofrecer el servicio contratado."
  );

  // 7. CONFIDENCIALIDAD
  writeHeading("7. CONFIDENCIALIDAD");
  writeParagraphJustified(
    "7.1. Las partes se comprometen a mantener la confidencialidad de la información comercial, técnica o de negocio a la que tengan acceso con motivo de la relación contractual."
  );
  writeParagraphJustified(
    "7.2. Esta obligación se mantendrá durante la vigencia del contrato y hasta dos (2) años después de su finalización."
  );

  // 8. RESPONSABILIDAD
  writeHeading("8. RESPONSABILIDAD");
  writeParagraphJustified(
    "8.1. El Proveedor no será responsable por el uso incorrecto de la plataforma por parte de La Farmacia, por interrupciones debidas a causas técnicas ajenas a su control razonable o por pérdidas indirectas, lucro cesante o daño emergente."
  );
  writeParagraphJustified(
    "8.2. En cualquier caso, la responsabilidad máxima de El Proveedor quedará limitada al importe de las cuotas abonadas por La Farmacia en los tres (3) meses anteriores al incidente que origine la reclamación."
  );

  // 9. MODIFICACIONES
  writeHeading("9. MODIFICACIONES");
  writeParagraphJustified(
    "Cualquier modificación del presente contrato deberá realizarse por escrito y estar firmada por ambas partes."
  );

  // 10. LEGISLACIÓN Y JURISDICCIÓN
  writeHeading("10. LEGISLACIÓN APLICABLE Y JURISDICCIÓN");
  writeParagraphJustified(
    "El presente contrato se regirá e interpretará de conformidad con la legislación española."
  );
  writeParagraphJustified(
    "Para la resolución de cualquier conflicto derivado del presente contrato, las partes se someten expresamente a los Juzgados y Tribunales de Valencia, con renuncia a cualquier otro fuero que pudiera corresponderles."
  );

  // Texto final antes de firmas
  const fechaLarga = formatearFechaLarga(data.fecha_inicio);
  writeParagraphJustified(
    "Y en prueba de conformidad, ambas partes firman el presente contrato por duplicado y a un solo efecto, en el lugar y fecha indicados."
  );
  writeParagraphJustified(`En Valencia, a ${fechaLarga}.`);

  // ======================= FIRMAS ===========================

  ensureSpace(160);

  writeHeading("FIRMA DE LA FARMACIA CONTRATANTE");
  y -= 10;
  writeLabelLine(`Nombre: ${data.razon_social}`);
  y -= 10;
  writeLabelLine("Nombre y apellidos del firmante: ______________________________________________");
  y -= 10;
  writeLabelLine("DNI/NIF: ________________________________");
  y -= 10;
  writeLabelLine("Firma:");
  y -= 10;
  writeLabelLine("Fecha: ________________________________");

  y -= 40;

  writeHeading("FIRMA DEL PRESTADOR DEL SERVIVIO FARMAFÁCIL®");
  y -= 10;
  writeLabelLine("Pilar Reyes Bononat");
  y -= 10;
  writeLabelLine("Fundadora y CEO de FarmaFácil® - Rebotech Solutions S.L.U");
  y -= 10;
  writeLabelLine("Firma: ");
  y -= 10;
  writeLabelLine("Fecha: ________________________________");

  return await pdf.save();
}
