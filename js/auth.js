async function signUp(fullName, phone, email, password) {

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  });

  if (error) {
    alert(error.message);
    return false;
  }

  alert("تم إنشاء الحساب بنجاح، تحقق من بريدك الإلكتروني.");
  return true;
}

async function signIn(email, password) {

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert(error.message);
    return false;
  }

  window.location.href = "index.html";
  return true;
}

async function signOut() {

  await supabase.auth.signOut();

  window.location.href = "login.html";
}

async function currentUser() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

async function forgotPassword(email) {

  const { error } =
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login.html"
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("تم إرسال رابط إعادة تعيين كلمة المرور.");
}
