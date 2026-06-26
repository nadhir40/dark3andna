
const supabaseUrl = "https://znguekkrzfgqwxuvnrph.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3Vla2tyemZncXd4dXZucnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTMxMjUsImV4cCI6MjA5Nzk4OTEyNX0.XOst38V9w6K8wDywyKQJNgS-Nsj_BKHsuUgBIbEE0y4"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)


// ======================
// تسجيل مستخدم
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
    alert("خطأ في التسجيل: " + error.message)
    return
  }

  console.log("User created:", data.user)
  alert("تم إنشاء الحساب بنجاح 🎉")
}


// ======================
// تسجيل دخول
// ======================
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error("Login Error:", error.message)
    alert("خطأ في تسجيل الدخول: " + error.message)
    return
  }

  console.log("User logged in:", data.user)
  alert("تم تسجيل الدخول بنجاح 🎉")

  // تحديث الصفحة بعد الدخول
  window.location.href = "index.html"
}


// ======================
// تسجيل خروج
// ======================
async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout Error:", error.message)
    return
  }

  console.log("User logged out")
  alert("تم تسجيل الخروج")

  window.location.href = "index.html"
}


// ======================
// جلب المستخدم الحالي
// ======================
async function getUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error(error.message)
    return null
  }

  return data.user
}


// ======================
// جلب profile
// ======================
async function getProfile() {
  const user = await getUser()

  if (!user) return

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Profile Error:", error.message)
    return
  }

  console.log("Profile:", data)
  return data
}


// ======================
// تحديث profile
// ======================
async function updateProfile(fullName, phone) {
  const user = await getUser()

  if (!user) return

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone
    })
    .eq("id", user.id)

  if (error) {
    console.error("Update Error:", error.message)
    alert("خطأ في التحديث: " + error.message)
    return
  }

  console.log("Profile updated")
  alert("تم تحديث البيانات ✅")
}


// ======================
// Debug
// ======================
console.log("App JS Loaded ✅")
