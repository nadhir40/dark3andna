
# 7. add-property.html - Add property form
add_property_html = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>أضف عقارك | دارك عندنا</title>
    <meta name="description" content="أضف عقارك للبيع أو للإيجار على منصة دارك عندنا مجاناً">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="navbar-container">
            <a href="index.html" class="logo">
                <i class="fas fa-home"></i>
                دارك عندنا
            </a>
            <button class="mobile-menu-btn" onclick="toggleMenu()">
                <i class="fas fa-bars"></i>
            </button>
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html"><i class="fas fa-home"></i> الرئيسية</a></li>
                <li><a href="buy.html"><i class="fas fa-shopping-cart"></i> للبيع</a></li>
                <li><a href="rent.html"><i class="fas fa-key"></i> للإيجار</a></li>
                <li><a href="contact.html"><i class="fas fa-envelope"></i> تواصل معنا</a></li>
                <li><a href="login.html"><i class="fas fa-user"></i> تسجيل الدخول</a></li>
                <li><a href="add-property.html" class="btn-add"><i class="fas fa-plus-circle"></i> أضف عقارك</a></li>
            </ul>
        </div>
    </nav>

    <!-- Form -->
    <div class="form-container" style="margin-top: 100px;">
        <h2><i class="fas fa-plus-circle" style="color: var(--primary);"></i> أضف عقارك</h2>
        <p style="text-align: center; color: var(--gray); margin-bottom: 30px;">
            املأ النموذج التالي لإضافة عقارك على المنصة. سيتم مراجعة إعلانك قبل النشر.
        </p>
        
        <form id="propertyForm" onsubmit="submitProperty(event)">
            <div class="form-row">
                <div class="form-group">
                    <label>عنوان الإعلان <span class="required">*</span></label>
                    <input type="text" id="title" class="form-control" placeholder="مثال: فيلا فاخرة في حيدرة" required>
                </div>
                <div class="form-group">
                    <label>نوع العملية <span class="required">*</span></label>
                    <select id="propertyType" class="form-control form-select" required>
                        <option value="">اختر نوع العملية</option>
                        <option value="sale">للبيع</option>
                        <option value="rent">للإيجار</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>المدينة <span class="required">*</span></label>
                    <select id="city" class="form-control form-select" required>
                        <option value="">اختر المدينة</option>
                        <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                        <option value="وهران">وهران</option>
                        <option value="قسنطينة">قسنطينة</option>
                        <option value="عنابة">عنابة</option>
                        <option value="سطيف">سطيف</option>
                        <option value="باتنة">باتنة</option>
                        <option value="بلعباس">بلعباس</option>
                        <option value="تلمسان">تلمسان</option>
                        <option value="سكيكدة">سكيكدة</option>
                        <option value="بجاية">بجاية</option>
                        <option value="تيارت">تيارت</option>
                        <option value="المدية">المدية</option>
                        <option value="الشلف">الشلف</option>
                        <option value="جيجل">جيجل</option>
                        <option value="بسكرة">بسكرة</option>
                        <option value="ورقلة">ورقلة</option>
                        <option value="الأغواط">الأغواط</option>
                        <option value="غرداية">غرداية</option>
                        <option value="تيزي وزو">تيزي وزو</option>
                        <option value="البويرة">البويرة</option>
                        <option value="الطارف">الطارف</option>
                        <option value="قالمة">قالمة</option>
                        <option value="خنشلة">خنشلة</option>
                        <option value="تبسة">تبسة</option>
                        <option value="سوق أهراس">سوق أهراس</option>
                        <option value="الوادي">الوادي</option>
                        <option value="البيض">البيض</option>
                        <option value="النعامة">النعامة</option>
                        <option value="تندوف">تندوف</option>
                        <option value="إليزي">إليزي</option>
                        <option value="أدرار">أدرار</option>
                        <option value="تمنراست">تمنراست</option>
                        <option value="تيميمون">تيميمون</option>
                        <option value="أولاد جلال">أولاد جلال</option>
                        <option value="بني عباس">بني عباس</option>
                        <option value="عين صالح">عين صالح</option>
                        <option value="عين قزام">عين قزام</option>
                        <option value="تقرت">تقرت</option>
                        <option value="جانت">جانت</option>
                        <option value="المغير">المغير</option>
                        <option value="المنيعة">المنيعة</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>العنوان التفصيلي</label>
                    <input type="text" id="address" class="form-control" placeholder="مثال: حيدرة، شارع محمد بوضياف">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>السعر <span class="required">*</span> (بالدينار الجزائري)</label>
                    <input type="number" id="price" class="form-control" placeholder="مثال: 15000000" required min="1">
                </div>
                <div class="form-group">
                    <label>المساحة (م²)</label>
                    <input type="number" id="area" class="form-control" placeholder="مثال: 120" min="1">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>عدد الغرف</label>
                    <input type="number" id="rooms" class="form-control" placeholder="مثال: 3" min="0">
                </div>
                <div class="form-group">
                    <label>عدد الحمامات</label>
                    <input type="number" id="bathrooms" class="form-control" placeholder="مثال: 2" min="0">
                </div>
            </div>
            
            <div class="form-group">
                <label>رقم الهاتف <span class="required">*</span></label>
                <input type="tel" id="phone" class="form-control" placeholder="مثال: 0550 12 34 56" required>
            </div>
            
            <div class="form-group">
                <label>الوصف</label>
                <textarea id="description" class="form-control" placeholder="صف العقار بالتفصيل... (اختياري)"></textarea>
            </div>
            
            <div class="form-group">
                <label>صور العقار <span class="required">*</span></label>
                <div class="image-upload" onclick="document.getElementById('propertyImages').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>اضغط هنا لرفع الصور أو اسحبها</p>
                    <p style="font-size: 0.85rem; color: var(--gray);">يمكنك رفع حتى 5 صور (JPG, PNG)</p>
                </div>
                <input type="file" id="propertyImages" accept="image/*" multiple style="display: none;" onchange="handleImageUpload(event)">
                <div class="image-preview-grid" id="imagePreview"></div>
            </div>
            
            <button type="submit" class="btn-submit" id="submitBtn">
                <i class="fas fa-paper-plane"></i> نشر الإعلان
            </button>
        </form>
    </div>

    <!-- Footer -->
    <footer class="footer" style="margin-top: 50px;">
        <div class="footer-container">
            <div class="footer-brand">
                <h3><i class="fas fa-home"></i> دارك عندنا</h3>
                <p>منصة العقارات الأولى في الجزائر.</p>
                <div class="footer-social">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-telegram"></i></a>
                    <a href="#"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
            <div class="footer-links">
                <h4>روابط سريعة</h4>
                <ul>
                    <li><a href="index.html">الرئيسية</a></li>
                    <li><a href="buy.html">عقارات للبيع</a></li>
                    <li><a href="rent.html">عقارات للإيجار</a></li>
                </ul>
            </div>
            <div class="footer-links">
                <h4>المساعدة</h4>
                <ul>
                    <li><a href="contact.html">تواصل معنا</a></li>
                    <li><a href="#">شروط الاستخدام</a></li>
                </ul>
            </div>
            <div class="footer-links">
                <h4>تواصل معنا</h4>
                <ul>
                    <li><i class="fas fa-phone"></i> +213 XXX XX XX XX</li>
                    <li><i class="fas fa-envelope"></i> info@darak3andna.com</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 دارك عندنا - جميع الحقوق محفوظة</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/supabase-config.js"></script>
    <script src="js/main.js"></script>
    <script>
        function toggleMenu() {
            document.getElementById('navLinks').classList.toggle('active');
        }
        
        let uploadedImages = [];
        
        function handleImageUpload(event) {
            const files = event.target.files;
            const preview = document.getElementById('imagePreview');
            
            if (uploadedImages.length + files.length > 5) {
                showNotification('يمكنك رفع 5 صور كحد أقصى', 'warning');
                return;
            }
            
            Array.from(files).forEach(file => {
                if (!file.type.startsWith('image/')) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImages.push({
                        file: file,
                        dataUrl: e.target.result
                    });
                    updateImagePreview();
                };
                reader.readAsDataURL(file);
            });
        }
        
        function updateImagePreview() {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = uploadedImages.map((img, index) => `
                <div class="image-preview-item">
                    <img src="${img.dataUrl}" alt="صورة ${index + 1}">
                    <button type="button" class="remove-img" onclick="removeImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
        
        function removeImage(index) {
            uploadedImages.splice(index, 1);
            updateImagePreview();
        }
        
        async function submitProperty(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر...';
            
            try {
                // Get current user (optional - can be anonymous)
                const user = await getCurrentUser();
                
                // Upload images to Supabase Storage
                let imageUrls = [];
                if (uploadedImages.length > 0) {
                    for (let img of uploadedImages) {
                        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${img.file.name.split('.').pop()}`;
                        const { data, error } = await supabase.storage
                            .from('property-images')
                            .upload(fileName, img.file);
                        
                        if (error) {
                            console.warn('Upload error:', error);
                            // Fallback: use data URL
                            imageUrls.push(img.dataUrl);
                        } else {
                            const { data: { publicUrl } } = supabase.storage
                                .from('property-images')
                                .getPublicUrl(fileName);
                            imageUrls.push(publicUrl);
                        }
                    }
                }
                
                // If no images uploaded, use placeholder
                if (imageUrls.length === 0) {
                    imageUrls = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];
                }
                
                // Insert property
                const propertyData = {
                    user_id: user ? user.id : null,
                    title: document.getElementById('title').value,
                    property_type: document.getElementById('propertyType').value,
                    city: document.getElementById('city').value,
                    address: document.getElementById('address').value || null,
                    price: parseFloat(document.getElementById('price').value),
                    area: document.getElementById('area').value ? parseFloat(document.getElementById('area').value) : null,
                    rooms: document.getElementById('rooms').value ? parseInt(document.getElementById('rooms').value) : null,
                    bathrooms: document.getElementById('bathrooms').value ? parseInt(document.getElementById('bathrooms').value) : null,
                    phone: document.getElementById('phone').value,
                    description: document.getElementById('description').value || null,
                    images: imageUrls,
                    status: 'pending',
                    views: 0
                };
                
                const { data, error } = await supabase
                    .from('properties')
                    .insert([propertyData])
                    .select();
                
                if (error) throw error;
                
                showNotification('تم إضافة الإعلان بنجاح! سيتم مراجعته قبل النشر.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } catch (error) {
                console.error('Error:', error);
                showNotification('حدث خطأ: ' + (error.message || 'يرجى المحاولة مرة أخرى'), 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> نشر الإعلان';
            }
        }
    </script>
</body>
</html>
'''

with open('/mnt/agents/output/darak3andna/add-property.html', 'w', encoding='utf-8') as f:
    f.write(add_property_html)

print("✅ add-property.html created (", len(add_property_html), "chars)")

