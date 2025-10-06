/**
 * @file supabase.js
 * @description Configura y exporta la instancia principal del cliente de Supabase
 * utilizada por toda la aplicación 'Gambito Club'.
 *
 * Este módulo se encarga de inicializar la conexión con el proyecto de Supabase
 * mediante las claves públicas (`URL` y `API key`), permitiendo a otros servicios
 * acceder a la base de datos, autenticación y almacenamiento de archivos.
 */

import { createClient } from "@supabase/supabase-js";

/**
 * URL del proyecto de Supabase.
 * @constant {string}
 */
const SUPABASE_URL = "https://pvfohrginewxkbxixrdg.supabase.co";

/**
 * Clave pública del proyecto Supabase.
 * @constant {string}
 * @note En entornos reales debe almacenarse en un archivo .env y no en el código fuente.
 */
const SUPABASE_KEY = "sb_publishable_TPIj5CCfyf-vvB_ZBfkZHw_l6-32ZkD";

/**
 * Instancia principal del cliente de Supabase.
 *
 * @constant {object}
 * @description
 * Este cliente se utiliza para realizar operaciones de autenticación,
 * consultas a la base de datos y gestión de archivos.
 *
 * Puede importarse desde cualquier módulo mediante:
 * ```js
 * import { supabase } from '../services/supabase';
 * ```
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
