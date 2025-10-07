/**
 * @file supabase.js
 * @description Conexión principal de la aplicación "Gambito Club" con Supabase.
 * Crea y exporta el cliente que se usa en todos los servicios del proyecto.
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Datos públicos del proyecto Supabase.
 * En un entorno real deberían guardarse en variables de entorno (.env)
 * para mayor seguridad.
 */
const URL_SUPABASE = 'https://pvfohrginewxkbxixrdg.supabase.co';
const CLAVE_SUPABASE = 'sb_publishable_TPIj5CCfyf-vvB_ZBfkZHw_l6-32ZkD';

/**
 * Cliente principal de Supabase.
 * Se utiliza para autenticación, consultas y almacenamiento.
 */
export const supabase = createClient(URL_SUPABASE, CLAVE_SUPABASE);
