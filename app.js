const supabaseUrl = "https://znguekkrzfgqwxuvnrph.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3Vla2tyemZncXd4dXZucnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MTMxMjUsImV4cCI6MjA5Nzk4OTEyNX0.XOst38V9w6K8wDywyKQJNgS-Nsj_BKHsuUgBIbEE0y4";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
// =====================
// تسجيل الدخول
// =====================
async function signIn(email, password){
const { error } = await supabase.auth.signInWithPassword({
email,
password
});
if(error){
alert(error.message);
return;
}
window.location.href="index.html";
}
// =====================
// تسجيل الخروج
// =====================
async function signOut(){
await supabase.auth.signOut();
window.location.href="index.html";
}
// =====================
// إنشاء حساب
// =====================
async function signUp(email,password,fullName){
const { error } = await supabase.auth.signUp({
email,
password,
options:{
data:{
full_name:fullName
}
}
});
if(error){
alert(error.message);
return;
}
alert("تم إنشاء الحساب");
}
// =====================
// المستخدم الحالي
// =====================
async function getUser(){
const { data } = await supabase.auth.getUser();
return data.user;
}
// =====================
// تسجيل الدخول من login
// =====================
async function handleLogin(){
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;
await signIn(email,password);
}
// =====================
// نشر العقار
// =====================
const propertyForm = document.getElementById("propertyForm");
if (propertyForm) {
propertyForm.addEventListener("submit", async (e) => {
e.preventDefault();
const { data: authData } = await supabase.auth.getUser();
const user = authData.user;
if (!user) {
alert("يجب تسجيل الدخول أولاً");
window.location.href = "login.html";
return;
}
const imageFile = document.getElementById("image").files[0];
let imageUrl = "";
if (imageFile) {
const fileName = Date.now() + "_" + imageFile.name;
const { error: uploadError } = await supabase
.storage
.from("property-images")
.upload(fileName, imageFile);
if (uploadError) {
alert(uploadError.message);
return;
}
const { data } = supabase
.storage
.from("property-images")
.getPublicUrl(fileName);
imageUrl = data.publicUrl;
}
const { error } = await supabase
.from("properties")
.insert([{
title: document.getElementById("title").value,
description: document.getElementById("description").value,
operation: document.getElementById("operation").value,
property_type: document.getElementById("property_type").value,
price: Number(document.getElementById("price").value),
state: document.getElementById("state").value,
city: document.getElementById("city").value,
phone: document.getElementById("phone").value,
email: document.getElementById("email").value,
images: imageUrl,
status: "pending",
user_id: user.id
}]);
if (error) {
console.error(error);
alert(error.message);
return;
}
alert("تم نشر العقار بنجاح");
window.location.href = "index.html";
});
}
