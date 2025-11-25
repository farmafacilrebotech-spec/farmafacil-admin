import { supabaseAdmin } from './supabaseClient';

/**
 * Genera un nuevo farmacia_id con formato FF00001-25
 * Usa la tabla farmacia_codigo_autonumerico para mantener el contador
 */
export async function generarFarmaciaId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2); // Últimos 2 dígitos del año

  try {
    // Obtener el registro de autonumérico para el año actual
    const { data: codigoData, error: fetchError } = await supabaseAdmin
      .from('farmacia_codigo_autonumerico')
      .select('*')
      .eq('anio', currentYear)
      .single();

    let nuevoNumero: number;

    if (fetchError && fetchError.code === 'PGRST116') {
      // No existe registro para este año, crear uno nuevo
      nuevoNumero = 1;
      const { error: insertError } = await supabaseAdmin
        .from('farmacia_codigo_autonumerico')
        .insert({ anio: currentYear, ultimo_numero: nuevoNumero });

      if (insertError) {
        throw new Error(`Error al crear autonumérico: ${insertError.message}`);
      }
    } else if (fetchError) {
      throw new Error(`Error al obtener autonumérico: ${fetchError.message}`);
    } else {
      // Existe el registro, incrementar
      nuevoNumero = codigoData.ultimo_numero + 1;
      const { error: updateError } = await supabaseAdmin
        .from('farmacia_codigo_autonumerico')
        .update({ ultimo_numero: nuevoNumero })
        .eq('anio', currentYear);

      if (updateError) {
        throw new Error(`Error al actualizar autonumérico: ${updateError.message}`);
      }
    }

    // Formatear el código: FF00001-25
    const numeroFormateado = nuevoNumero.toString().padStart(5, '0');
    return `FF${numeroFormateado}-${yearSuffix}`;
  } catch (error) {
    console.error('Error generando farmacia_id:', error);
    throw error;
  }
}

