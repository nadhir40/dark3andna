const SUPABASE_URL = "https://znguekkrzfgqwxuvnrph.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3Vla2tyemZncXd4dXZucnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTMxMjUsImV4cCI6MjA5Nzk4OTEyNX0.XOst38V9w6K8wDywyKQJNgS-Nsj_BKHsuUgBIbEE0y4";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
