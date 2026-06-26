// app.js
import { createClient } from '@supabase/supabase-js'
// 1. ربط Supabase
const supabaseUrl = "https://znguekkrzfgqwxuvnrph.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3Vla2tyemZncXd4dXZucnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTMxMjUsImV4cCI6MjA5Nzk4OTEyNX0.XOst38V9w6K8wDywyKQJNgS-Nsj_BKHsuUgBIbEE0y4"
const supabase = createClient(supabaseUrl, supabaseKey)
// 2. تسجيل مستخدم جديد
async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  if (error) {
    console.error("Error sign up:", error.message)
    return
  }
  console.log("User created:", data.user)
}
// 3. تسجيل الدخول
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) {
    console.error("Login error:", error.message)
    return
  }
  console.log("User logged in:", data.user)
}
// 4. تسجيل الخروج
async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Logout error:", error.message)
    return
  }
  console.log("User logged out")
}
// 5. جلب المستخدم الحالي
async function getUser() {
  const { data } = await supabase.auth.getUser()
  console.log("Current user:", data.user)
}
