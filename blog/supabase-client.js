import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://mrfdtszzzdejslqzjtyz.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_BN90xXq0TsbgXsTV_I8SdA_7e6q-hhg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
