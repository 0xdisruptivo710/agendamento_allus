import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ehlpmukjdknnyhkycncb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_WDSDse-bpqmAovgXWhYC4A_sKzIuU8E";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
