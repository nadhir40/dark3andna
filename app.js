// ================================
// Supabase
// ================================
const supabaseUrl = "https://znguekkrzfgqwxuvnrph.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3Vla2tyemZncXd4dXZucnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTMxMjUsImV4cCI6MjA5Nzk4OTEyNX0.XOst38V9w6K8wDywyKQJNgS-Nsj_BKHsuUgBIbEE0y4";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

console.log("App Loaded");

// ================================
// SIGN UP
// ================================
async function signUp(email, password, fullName) {

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("تم إنشاء الحساب");
}

// ================================
// SIGN IN
// ================================
async function signIn(email, password) {

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("تم تسجيل الدخول");
  window.location.href = "index.html";
}

// ================================
// LOGIN BUTTON
// ================================
async function handleLogin() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("املأ جميع البيانات");
    return;
  }

  await signIn(email, password);
}

// ================================
// SIGN OUT
// ================================
async function signOut() {

  await supabase.auth.signOut();

  window.location.href = "index.html";
}

// ================================
// GET USER
// ================================
async function getUser() {

  const { data } = await supabase.auth.getUser();

  return data.user;
}
// ================================
// ADD PROPERTY
// ================================
const propertyForm = document.getElementById("propertyForm");

if (propertyForm) {

propertyForm.addEventListener("submit", async function(e){

e.preventDefault();

const user = await getUser();

if(!user){
alert("يجب تسجيل الدخول أولاً");
window.location.href="login.html";
return;
}

const title=document.getElementById("title").value;
const description=document.getElementById("description").value;
const operation=document.getElementById("operation").value;
const property_type=document.getElementById("property_type").value;
const price=document.getElementById("price").value;
const state=document.getElementById("state").value;
const city=document.getElementById("city").value;
const phone=document.getElementById("phone").value;
const email=document.getElementById("email").value;

const imageFile=document.getElementById("image").files[0];

let imageUrl="";

if(imageFile){

const fileName=Date.now()+"_"+imageFile.name;

const {error:uploadError}=await supabase.storage
.from("properties")
.upload(fileName,imageFile);

if(uploadError){
alert(uploadError.message);
return;
}

const {data}=supabase.storage
.from("properties")
.getPublicUrl(fileName);

imageUrl=data.publicUrl;

}

const {error}=await supabase
.from("properties")
.insert([{

title,
description,
operation,
property_type,
price:Number(price),
state,
city,
phone,
email,
images:imageUrl,
status:"pending",
user_id:user.id

}]);

if(error){

console.log(error);

alert(error.message);

return;

}

alert("تم نشر العقار بنجاح");

window.location.href="index.html";

});

}
