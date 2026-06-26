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
    alert(error.message)
    return
  }

  alert("تم إنشاء الحساب 🎉")
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
    alert(error.message)
    return
  }

  window.location.href = "index.html"
}


// ======================
// تسجيل خروج
// ======================
async function signOut() {
  await supabase.auth.signOut()
  window.location.href = "index.html"
}


// ======================
// جلب المستخدم
// ======================
async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}


// ======================
// جلب profile
// ======================
async function getProfile() {
  const user = await getUser()
  if (!user) return

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
}


// ======================
// تحديث profile
// ======================
async function updateProfile(fullName, phone) {
  const user = await getUser()
  if (!user) return

  await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone
    })
    .eq("id", user.id)
}


// ======================
// Login bridge (مهم للواجهة)
// ======================
async function handleLogin() {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  if (!email || !password) {
    alert("املأ البيانات")
    return
  }

  await signIn(email, password)
}


// ======================
// Debug
// ======================
console.log("App JS Loaded ✅")
