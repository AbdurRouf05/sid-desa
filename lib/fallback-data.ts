import { HeroSlide } from "@/components/home/hero-slider";

export const HERO_SLIDES_FALLBACK: HeroSlide[] = [
    {
        id: 1,
        title: "Keterbukaan Informasi Desa Sumberanyar",
        subtitle: "Wujudkan tata kelola pemerintahan desa yang transparan, akuntabel, dan melayani sepenuh hati untuk seluruh warga.",
        cta: "Layanan Mandiri",
        cta_link: "/layanan",
        bgClass: "bg-desa-primary",
        image: "https://images.pexels.com/photos/34528447/pexels-photo-34528447.jpeg"
    },
    {
        id: 2,
        title: "Layanan Surat Digital",
        subtitle: "Sekarang buat surat keterangan jadi lebih mudah dan cepat melalui portal Layanan Mandiri. Bisa dilakukan dari mana saja!",
        cta: "Buat Surat",
        cta_link: "/layanan",
        bgClass: "bg-desa-accent",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=60&w=1200"
    },
    {
        id: 3,
        title: "Kabar Desa Terkini",
        subtitle: "Dapatkan informasi terbaru mengenai pembangunan desa, pengumuman penting, dan kabar menarik lainnya dari wilayah kita.",
        cta: "Baca Kabar Desa",
        cta_link: "/berita",
        bgClass: "bg-slate-900",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=60&w=1200"
    }
];
