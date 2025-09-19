// Este servicio ofrece la instancia de Supabase.
// En este contexto, un servicio es una biblioteca que ofrece funciones o clases
// para trabajar con alguna funcionalidad.

import { createClient } from '@supabase/supabase-js';

// Eventualmente, estos datos podrían salir de un [.env].
const SUPABASE_URL = 'https://pvfohrginewxkbxixrdg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TPIj5CCfyf-vvB_ZBfkZHw_l6-32ZkD';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// La instancia de Supabase se puede usar en cualquier parte de la applicación
// importando este servicio.