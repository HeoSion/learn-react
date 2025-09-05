import { createClient } from '@supabase/supabase-js'
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from './database.types'

const { VITE_SUPABASE_URL, VITE_SUPABASE_API_KEY } = import.meta.env

const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_API_KEY
)

export default supabase

export type Proflie = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

