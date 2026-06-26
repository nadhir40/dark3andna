
const supabaseUrl = "https://znguekkrzfgqwxuvnrph.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3Vla2tyemZncXd4dXZucnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTMxMjUsImV4cCI6MjA5Nzk4OTEyNX0.XOst38V9w6K8wDywyKQJNgS-Nsj_BKHsuUgBIbEE0y4"

// مهم جداً: انتظار تحميل supabase
const supabase = window.supabase?.createClient(supabaseUrl, supabaseKey)

console.log("App JS Loaded")


// ======================
// تسجيل دخول
// ======================
async function signIn(email, password) {

  if (!supabase) {
    alert("Supabase not loaded")
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert(error.message)
    console.log(error)
    return
  }

  alert("تم تسجيل الدخول")
  window.location.href = "index.html"
}


// ======================
// تسجيل خروج
// ======================
async function signOut() {

  if (!supabase) {
    alert("Supabase not loaded")
    return
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    alert(error.message)
    return
  }

  alert("تم تسجيل الخروج")
  window.location.href = "index.html"
}


// ======================
// تسجيل مستخدم
// ======================
async function signUp(email, password, fullName) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })

  if (error) {
    alert(error.message)
    return
  }

  alert("تم إنشاء الحساب")
}


// ======================
// جلب المستخدم
// ======================
async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}


// ======================
// Login bridge (مهم)
// ======================
async function handleLogin() {

  const email = document.getElementById("email")?.value
  const password = document.getElementById("password")?.value

  if (!email || !password) {
    alert("املأ البيانات")
    return
  }

  await signIn(email, password)
}
