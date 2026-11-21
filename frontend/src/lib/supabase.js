import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const configured = Boolean(url && anon)
// Placeholder values keep the app renderable (showing a setup notice) when env is missing.
export const supabase = createClient(url || 'http://localhost', anon || 'missing')
