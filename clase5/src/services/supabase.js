// Servicio de Supabase.
// Acá creamos una instancia para conectarnos a nuestra base de datos.

import { createClient } from '@supabase/supabase-js';

// (^)ojo(^) En este ejemplo las claves están escritas directo,
// pero lo recomendable es guardarlas en un archivo .env
const SUPABASE_URL = 'https://pvfohrginewxkbxixrdg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TPIj5CCfyf-vvB_ZBfkZHw_l6-32ZkD';

// Creamos el cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Ahora podemos importar "supabase" desde cualquier parte de la app
// para trabajar con autenticación, base de datos o storage.
