import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qjjmgjbgzsnppvxwghhv.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Xb_efSR19wnfmFcU676jAA_cYrKjbSf'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
