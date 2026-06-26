import { createClient } from '@supabase/supabase-js'

// ======================
// 1. ربط Supabase
// ======================
const supabaseUrl = "https://znguekkrzfgqwxuvnrph.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3Vla2tyemZncXd4dXZucnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTMxMjUsImV4cCI6MjA5Nzk4OTEyNX0.XOst38V9w6K8wDywyKQJNgS-Nsj_BKHsuUgBIbEE0y4" // 🔴 ضع المفتاح هنا
const supabase = createClient(supabaseUrl, supabaseKey)


// ======================
// 2. تسجيل مستخدم جديد
// ======================
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
    console.error("SignUp Error:", error.message)
    return
  }

  console.log("User created successfully:", data.user)
}


// ======================
// 3. تسجيل الدخول
// ======================
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error("Login Error:", error.message)
    return
  }

  console.log("User logged in:", data.user)
}


// ======================
// 4. تسجيل الخروج
// ======================
async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout Error:", error.message)
    return
  }

  console.log("User logged out")
}


// ======================
// 5. جلب المستخدم الحالي
// ======================
async function getUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error("Get User Error:", error.message)
    return
  }

  console.log("Current user:", data.user)
}


// ======================
// 6. جلب profile الخاص بالمستخدم
// ======================
async function getProfile() {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    console.log("No user logged in")
    return
  }

  const userId = userData.user.id

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Profile Error:", error.message)
    return
  }

  console.log("User profile:", data)
}


// ======================
// 7. تحديث profile (اسم + هاتف)
// ======================
async function updateProfile(fullName, phone) {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    console.log("No user logged in")
    return
  }

  const userId = userData.user.id

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone
    })
    .eq("id", userId)

  if (error) {
    console.error("Update Error:", error.message)
    return
  }

  console.log("Profile updated successfully")
}
update supabase app.js
