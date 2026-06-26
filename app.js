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
    console.error(error.message)
    return
  }

  console.log("User created:", data.user)
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
    console.error(error.message)
    return
  }

  console.log("User logged in:", data.user)
}


// ======================
// تسجيل خروج
// ======================
async function signOut() {
  await supabase.auth.signOut()
  console.log("User logged out")
}


// ======================
// جلب profile
// ======================
async function getProfile() {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) return

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single()

  console.log(data)
}


// ======================
// تحديث profile
// ======================
async function updateProfile(fullName, phone) {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) return

  await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone
    })
    .eq("id", userData.user.id)

  console.log("Profile updated")
}


// ======================
// Debug
// ======================
console.log("App JS Loaded ✅")
