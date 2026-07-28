import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Upload, X, CheckCircle, ImagePlus } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { WILAYAS } from "@/lib/constants.ts";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

const schema = z.object({
  title: z.string().min(5, "العنوان قصير جداً، أدخل 5 أحرف على الأقل"),
  description: z.string().min(10, "الوصف قصير جداً، أدخل 10 أحرف على الأقل"),
  type: z.enum(["apartment", "house", "land", "commercial", "villa"]),
  operation: z.enum(["sale", "rent"]),
  price: z.coerce.number().min(1, "أدخل سعراً صحيحاً"),
  priceUnit: z.enum(["dzd", "eur", "usd"]),
  rentPeriod: z.enum(["monthly", "yearly"]).optional(),
  wilaya: z.string().min(1, "اختر الولاية"),
  commune: z.string().optional(),
  area: z.coerce.number().optional(),
  rooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  floor: z.coerce.number().optional(),
  contactName: z.string().min(2, "أدخل اسمك"),
  contactPhone: z.string().min(9, "أدخل رقم هاتف صحيح"),
});

type FormData = z.infer<typeof schema>;
type UploadedImage = {
  file: File;
  preview: string;
  storageId?: Id<"_storage">;
  uploading: boolean;
  error: boolean;
};

export default function AddListingPage() {
  const navigate = useNavigate();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createListing = useMutation(api.listings.createListing);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priceUnit: "dzd", operation: "sale", type: "apartment" },
  });

  const operation = watch("operation");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 6) {
      toast.error("يمكنك رفع 6 صور كحد أقصى");
      return;
    }
    const newImages: UploadedImage[] = files.map((file) => ({
      file, preview: URL.createObjectURL(file), uploading: true, error: false,
    }));
    setImages((prev) => [...prev, ...newImages]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const idx = images.length + i;
      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json() as { storageId: Id<"_storage"> };
        setImages((prev) => prev.map((img, j) => j === idx ? { ...img, storageId, uploading: false } : img));
      } catch {
        setImages((prev) => prev.map((img, j) => j === idx ? { ...img, uploading: false, error: true } : img));
        toast.error("فشل رفع إحدى الصور");
      }
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].preview);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const onSubmit = async (data: FormData) => {
    if (images.some((img) => img.uploading)) {
      toast.error("يرجى الانتظار حتى تنتهي عملية رفع الصور");
      return;
    }
    const storageIds = images.filter((img) => img.storageId).map((img) => img.storageId as Id<"_storage">);
    setSubmitting(true);
    try {
      await createListing({
        title: data.title, description: data.description,
        type: data.type, operation: data.operation,
        price: data.price, priceUnit: data.priceUnit,
        rentPeriod: operation === "rent" ? data.rentPeriod : undefined,
        wilaya: data.wilaya, commune: data.commune || undefined,
        area: data.area || undefined, rooms: data.rooms || undefined,
        bathrooms: data.bathrooms || undefined, floor: data.floor || undefined,
        imageStorageIds: storageIds,
        contactName: data.contactName, contactPhone: data.contactPhone,
      });
      setSuccess(true);
    } catch {
      toast.error("حدث خطأ أثناء نشر الإعلان، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3">تم إرسال إعلانك!</h2>
            <p className="text-muted-foreground mb-6">
              سيتم مراجعة إعلانك من قبل الإدارة ونشره في أقرب وقت ممكن.<br />
              شكراً لثقتك في دارك عندنا!
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/")} variant="default">الصفحة الرئيسية</Button>
              <Button onClick={() => { setSuccess(false); setImages([]); }} variant="secondary">أضف إعلاناً آخر</Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-4 py-8 flex-1">
        <h1 className="text-2xl font-black text-foreground mb-1">أضف إعلانك العقاري</h1>
        <p className="text-muted-foreground text-sm mb-6">مجاني 100% — سيُراجع إعلانك وينشر خلال 24 ساعة</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* النوع والعملية */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-base text-foreground">نوع العقار والعملية</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-sm">نوع العقار *</Label>
                <select {...register("type")} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="apartment">شقة</option>
                  <option value="house">منزل</option>
                  <option value="villa">فيلا</option>
                  <option value="land">أرض</option>
                  <option value="commercial">محل تجاري</option>
                </select>
                {errors.type && <p className="text-destructive text-xs mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <Label className="mb-1 block text-sm">نوع العملية *</Label>
                <select {...register("operation")} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="sale">للبيع</option>
                  <option value="rent">للإيجار</option>
                </select>
              </div>
            </div>
            {operation === "rent" && (
              <div>
                <Label className="mb-1 block text-sm">فترة الإيجار</Label>
                <select {...register("rentPeriod")} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="monthly">شهري</option>
                  <option value="yearly">سنوي</option>
                </select>
              </div>
            )}
          </div>

          {/* معلومات الإعلان */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-base text-foreground">معلومات الإعلان</h2>
            <div>
              <Label className="mb-1 block text-sm">عنوان الإعلان *</Label>
              <Input {...register("title")} placeholder="مثال: شقة 3 غرف للبيع في وهران" />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label className="mb-1 block text-sm">الوصف *</Label>
              <Textarea {...register("description")} placeholder="اكتب وصفاً تفصيلياً للعقار..." rows={4} />
              {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* الموقع */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-base text-foreground">الموقع</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-sm">الولاية *</Label>
                <select {...register("wilaya")} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="">اختر الولاية</option>
                  {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
                {errors.wilaya && <p className="text-destructive text-xs mt-1">{errors.wilaya.message}</p>}
              </div>
              <div>
                <Label className="mb-1 block text-sm">البلدية / الحي</Label>
                <Input {...register("commune")} placeholder="مثال: سيدي بلعباس" />
              </div>
            </div>
          </div>

          {/* التفاصيل */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-base text-foreground">التفاصيل</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="mb-1 block text-sm">المساحة (م²)</Label><Input {...register("area")} type="number" placeholder="مثال: 90" min={0} /></div>
              <div><Label className="mb-1 block text-sm">عدد الغرف</Label><Input {...register("rooms")} type="number" placeholder="مثال: 3" min={0} /></div>
              <div><Label className="mb-1 block text-sm">الحمامات</Label><Input {...register("bathrooms")} type="number" placeholder="مثال: 1" min={0} /></div>
              <div><Label className="mb-1 block text-sm">الطابق</Label><Input {...register("floor")} type="number" placeholder="مثال: 2" min={0} /></div>
            </div>
          </div>

          {/* السعر */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-base text-foreground">السعر</h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="mb-1 block text-sm">السعر *</Label>
                <Input {...register("price")} type="number" placeholder="مثال: 5000000" min={0} />
                {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div className="w-28">
                <Label className="mb-1 block text-sm">العملة</Label>
                <select {...register("priceUnit")} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                  <option value="dzd">دج</option>
                  <option value="eur">€ يورو</option>
                  <option value="usd">$ دولار</option>
                </select>
              </div>
            </div>
          </div>

          {/* الصور */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-base text-foreground">صور العقار (اختياري، حد أقصى 6)</h2>
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
              <ImagePlus size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">انقر لرفع الصور أو اسحبها هنا</p>
              <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG — حد أقصى 6 صور</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden aspect-square bg-muted">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    {img.uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Upload size={20} className="text-white animate-pulse" /></div>}
                    {img.error && <div className="absolute inset-0 bg-destructive/70 flex items-center justify-center"><X size={20} className="text-white" /></div>}
                    {!img.uploading && !img.error && idx === 0 && (
                      <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-bold">رئيسية</span>
                    )}
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 left-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* التواصل */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-base text-foreground">معلومات التواصل</h2>
            <div>
              <Label className="mb-1 block text-sm">الاسم *</Label>
              <Input {...register("contactName")} placeholder="مثال: محمد أمين" />
              {errors.contactName && <p className="text-destructive text-xs mt-1">{errors.contactName.message}</p>}
            </div>
            <div>
              <Label className="mb-1 block text-sm">رقم الهاتف / واتساب *</Label>
              <Input {...register("contactPhone")} placeholder="مثال: 0667834247" type="tel" dir="ltr" />
              {errors.contactPhone && <p className="text-destructive text-xs mt-1">{errors.contactPhone.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full py-3 text-base font-bold rounded-xl">
            {submitting ? "جاري النشر..." : "أضف الإعلان مجاناً"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
