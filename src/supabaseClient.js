import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://atromnggvwfobaqazjok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0cm9tbmdndndmb2JhcWF6am9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NTczMjYsImV4cCI6MjA1NTUzMzMyNn0.Z9YUanxyJPGjrSn0UBZ_ukpdLx2tUm80VFWBELaY8Lk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
