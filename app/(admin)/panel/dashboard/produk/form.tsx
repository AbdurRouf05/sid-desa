"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
    Loader2, Save, ArrowLeft, UploadCloud,
    PiggyBank, CreditCard, Wallet, Banknote, Landmark, Coins, DollarSign,
    TrendingUp, ShieldCheck, Briefcase, Building, Home, Car, GraduationCap,
    Plane, Umbrella, Vote, Users, ShoppingBag, Smartphone,
    HeartHandshake, School, Package, Clock, Sprout, Store
} from "lucide-react";
import { toast } from "sonner";
import { formatThousand, cleanNumber } from "@/lib/number-utils";
import Link from "next/link";

const productSchema = z.object({
    name: z.string().min(3, "Nama produk minimal 3 karakter"),
    slug: z.string().min(3, "Slug otomatis terisi"),
    product_type: z.string(),
    description: z.string().optional(),
    requirements: z.string().optional(),
    min_deposit: z.string().optional(), // Text for flexibility "Rp 10.000"
    schema_type: z.string().optional(),
    published: z.boolean(),
    is_featured: z.boolean(),
    thumbnail_file: z.any().optional(),
    icon_file: z.any().optional(),
    brochure_file: z.any().optional(),
    icon_name: z.string().optional(),
    seo_keywords: z.string().optional(),
    sharia_contract: z.string().optional(),
});

type ProductInputs = z.infer<typeof productSchema>;

export default function ProductEditorPage({ isEdit = false }: { isEdit?: boolean }) {
    const router = useRouter();
    const params = isEdit ? useParams() : null;
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ProductInputs>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            slug: "",
            product_type: "simpanan",
            description: "",
            requirements: "",
            min_deposit: "",
            schema_type: "SavingsAccount",
            published: true,
            is_featured: false,
            seo_keywords: "",
            sharia_contract: ""
        }
    });

    const nameValue = watch("name");

    // Slug generator
    useEffect(() => {
        if (!isEdit && nameValue) {
            const slug = nameValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            setValue("slug", slug);
        }
    }, [nameValue, isEdit, setValue]);

    // Fetch data if edit
    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchData = async () => {
                try {
                    const record = await pb.collection('products').getOne(params.id as string);
                    setValue("name", record.name);
                    setValue("slug", record.slug);
                    setValue("product_type", record.product_type);
                    setValue("description", record.description);
                    setValue("requirements", record.requirements);
                    setValue("min_deposit", record.min_deposit);
                    setValue("schema_type", record.schema_type);
                    setValue("published", record.published);
                    setValue("is_featured", record.is_featured);
                    setValue("icon_name", record.icon_name);
                    setValue("seo_keywords", record.seo_keywords);
                    setValue("sharia_contract", record.sharia_contract || "");
                } catch (e) {
                    console.error("Failed", e);
                    router.push("/panel/dashboard/produk");
                }
            };
            fetchData();
        }
    }, [isEdit, params, setValue, router]);

    const onSubmit = async (data: ProductInputs) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            // Append all fields
            Object.entries(data).forEach(([key, val]) => {
                formData.append(key, val.toString());
            });

            // Handle Files manually
            // @ts-ignore
            if (data.thumbnail_file && data.thumbnail_file[0]) {
                formData.append('thumbnail', data.thumbnail_file[0]);
            }
            if (data.icon_file && data.icon_file[0]) {
                formData.append('icon', data.icon_file[0]);
            }
            if (data.brochure_file && data.brochure_file[0]) {
                const file = data.brochure_file[0];
                if (file.size > 5 * 1024 * 1024) { // 5MB Limit
                    toast.error("Brosur PDF terlalu besar (Maks 5MB)");
                    setIsLoading(false);
                    return;
                }
                formData.append('brochure_pdf', file);
            }

            if (isEdit && params?.id) {
                await pb.collection('products').update(params.id as string, formData);
            } else {
                await pb.collection('products').create(formData);
            }
            router.push("/panel/dashboard/produk");
        } catch (e) {
            alert("Gagal menyimpan produk");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-5xl mx-auto pb-20">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-40 border-b border-slate-200 -mx-8 px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/produk"
                            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
                            </h1>
                            <p className="text-sm text-slate-500">
                                {isEdit ? "Perbarui detail produk." : "Tambah produk simpanan atau pembiayaan."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Simpan
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Produk</label>
                                <input
                                    {...register("name")}
                                    className="w-full text-lg font-bold px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    placeholder="Contoh: Simpanan Wadiah"
                                />
                                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Thumbnail Upload */}
                            {/* Files Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Thumbnail (Card Image)</label>
                                    <p className="text-[10px] text-slate-400 mb-2">Rekomendasi: 1200x800 px (3:2) atau 1:1</p>
                                    <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="thumbnail-upload"
                                            {...register("thumbnail_file")}
                                        />
                                        <label htmlFor="thumbnail-upload" className="cursor-pointer flex flex-col items-center gap-1">
                                            <UploadCloud className="w-6 h-6 text-slate-400" />
                                            <span className="text-xs text-slate-500">Pilih Thumbnail</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Icon File (Custom SVG/PNG)</label>
                                    <p className="text-[10px] text-slate-400 mb-2">Rekomendasi: 512x512 px, SVG lebih baik</p>
                                    <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="icon-upload"
                                            {...register("icon_file")}
                                        />
                                        <label htmlFor="icon-upload" className="cursor-pointer flex flex-col items-center gap-1">
                                            <Package className="w-6 h-6 text-slate-400" />
                                            <span className="text-xs text-slate-500">Pilih Icon File</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Brosur PDF (Opsional)</label>
                                <p className="text-[10px] text-slate-400 mb-2">Ukuran maksimal file: 5MB</p>
                                <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        id="pdf-upload"
                                        {...register("brochure_file")}
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-1">
                                        <CreditCard className="w-6 h-6 text-slate-400" />
                                        <span className="text-sm text-slate-500 font-medium">Upload Brosur Produk (PDF)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Icon Picker */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Icon (Opsional)</label>
                                <div className="grid grid-cols-6 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 h-48 overflow-y-auto">
                                    {[
                                        { name: "PiggyBank", Icon: PiggyBank }, { name: "CreditCard", Icon: CreditCard },
                                        { name: "Wallet", Icon: Wallet }, { name: "Banknote", Icon: Banknote },
                                        { name: "Landmark", Icon: Landmark }, { name: "Coins", Icon: Coins },
                                        { name: "DollarSign", Icon: DollarSign }, { name: "TrendingUp", Icon: TrendingUp },
                                        { name: "ShieldCheck", Icon: ShieldCheck }, { name: "Briefcase", Icon: Briefcase },
                                        { name: "Building", Icon: Building }, { name: "Home", Icon: Home },
                                        { name: "Car", Icon: Car }, { name: "GraduationCap", Icon: GraduationCap },
                                        { name: "Plane", Icon: Plane }, { name: "Umbrella", Icon: Umbrella },
                                        { name: "Vote", Icon: Vote }, { name: "Users", Icon: Users },
                                        { name: "ShoppingBag", Icon: ShoppingBag }, { name: "Smartphone", Icon: Smartphone },
                                        { name: "HeartHandshake", Icon: HeartHandshake }, { name: "School", Icon: School },
                                        { name: "Package", Icon: Package }, { name: "Clock", Icon: Clock },
                                        { name: "Sprout", Icon: Sprout }, { name: "Store", Icon: Store }
                                    ].map(({ name, Icon }) => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => setValue("icon_name", name)}
                                            className={`p-3 rounded-lg flex items-center justify-center transition-all ${watch("icon_name") === name
                                                ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200"
                                                : "bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100"
                                                }`}
                                            title={name}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Pilih representasi icon yang sesuai kategori produk.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Produk</label>
                                    <select
                                        {...register("product_type")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    >
                                        <option value="simpanan">Simpanan</option>
                                        <option value="pembiayaan">Pembiayaan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Akad (Kontrak)</label>
                                    <input
                                        type="text"
                                        {...register("sharia_contract")}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="e.g. Wadiah, Mudharabah, Murabahah"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Min. Setoran / Limit</label>
                                    <Controller
                                        name="min_deposit"
                                        control={control}
                                        render={({ field: { onChange, value, ...rest } }) => (
                                            <div className="relative">
                                                <span className="absolute left-4 top-2 text-slate-400 font-medium">Rp</span>
                                                <input
                                                    {...rest}
                                                    value={formatThousand(value)}
                                                    onChange={(e) => {
                                                        const clean = cleanNumber(e.target.value);
                                                        onChange(clean);
                                                    }}
                                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                                                    placeholder="0"
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-4">Deskripsi Produk</label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Jelaskan keunggulan produk ini..."
                                    />
                                )}
                            />
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-4">Syarat & Ketentuan</label>
                            <Controller
                                name="requirements"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="List persyaratan..."
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Right Col */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <h3 className="font-bold text-slate-900">Konfigurasi</h3>

                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <input type="checkbox" {...register("published")} className="w-5 h-5 text-emerald-600 rounded" />
                                <span className="font-medium text-slate-700">Publikasikan</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <input type="checkbox" {...register("is_featured")} className="w-5 h-5 text-gold-500 rounded" />
                                <span className="font-medium text-slate-700">Produk Unggulan (Featured)</span>
                            </label>

                            <hr className="border-slate-100" />

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">SEO Keywords</label>
                                <textarea
                                    {...register("seo_keywords")}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    placeholder="tabungan, syariah, lumajang..."
                                    rows={3}
                                />
                            </div>

                            <hr className="border-slate-100" />

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Slug URL</label>
                                <input
                                    {...register("slug")}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Kategori SEO (Google Validation)</label>
                                <select
                                    {...register("schema_type")}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    <option value="SavingsAccount">Simpanan / Tabungan</option>
                                    <option value="LoanOrCredit">Pinjaman / Pembiayaan</option>
                                    <option value="DepositAccount">Simpanan Berjangka / Deposito</option>
                                    <option value="FinancialProduct">Produk Keuangan Lainnya</option>
                                </select>
                                <p className="text-xs text-slate-400 mt-1">
                                    Membantu Google memahami jenis produk ini di hasil pencarian.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
