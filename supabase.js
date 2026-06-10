const SUPABASE_URL = "https://inmxnwerojearlnyvbyy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlubXhud2Vyb2plYXJsbnl2Ynl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDIxNzUsImV4cCI6MjA5MjY3ODE3NX0.r6JBYFRaCweofjbPxMcD_9xmowWR6tuzai1lOUpb26M";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);