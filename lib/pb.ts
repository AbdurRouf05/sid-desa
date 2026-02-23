import PocketBase from 'pocketbase';
import { SiteConfigSchema, type SiteConfig } from './validations/site';
import { BkuTransactionSchema, type BkuTransaction } from './validations/bku';
import { PerangkatDesaSchema, type PerangkatDesa, SuratKeluarSchema, type SuratKeluar } from './validations/admin';
import { TanahDesaSchema, type TanahDesa } from './validations/aset';

// Singleton pattern to prevent multiple instances
let pb: PocketBase;

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db-desa.sumberanyar.id";

if (typeof window === "undefined") {
    pb = new PocketBase(PB_URL);
} else {
    if (!(window as any).pb) {
        (window as any).pb = new PocketBase(PB_URL);
    }
    pb = (window as any).pb;
}

pb.autoCancellation(false);

export { pb };

/**
 * Strict Typed Accessors
 */
export const db = {
  siteConfig: {
    get: async () => {
      const record = await pb.collection('profil_desa').getFirstListItem("");
      return SiteConfigSchema.parse(record);
    }
  },
  bku: {
    list: async (page = 1, perPage = 50, filter = "") => {
      const result = await pb.collection('bku_transaksi').getList(page, perPage, { filter, sort: '-tanggal' });
      return {
        ...result,
        items: result.items.map((item: any) => BkuTransactionSchema.parse(item))
      };
    },
    create: async (data: BkuTransaction) => {
      const validated = BkuTransactionSchema.parse(data);
      const record = await pb.collection('bku_transaksi').create(validated);
      return BkuTransactionSchema.parse(record);
    }
  },
  surat: {
    list: async (page = 1, perPage = 50) => {
      const result = await pb.collection('surat_keluar').getList(page, perPage, { sort: '-nomor_agenda' });
      return {
        ...result,
        items: result.items.map((item: any) => SuratKeluarSchema.parse(item))
      };
    }
  },
  perangkat: {
    listActive: async () => {
      const result = await pb.collection('perangkat_desa').getFullList({ filter: 'is_active = true' });
      return result.map((item: any) => PerangkatDesaSchema.parse(item));
    }
  }
};

/**
 * Legacy/Helper Accessors
 */
export const getSiteConfig = () => db.siteConfig.get();

export const searchContent = async (query: string) => {
    if (!query) return [];

    try {
        const [news, products] = await Promise.all([
            pb.collection('news').getList(1, 10, {
                filter: `title ~ "${query}" || content ~ "${query}"`,
                sort: '-created'
            }),
            pb.collection('products').getList(1, 10, {
                filter: `name ~ "${query}" || description ~ "${query}"`,
                sort: '-created'
            })
        ]);

        const newsResults = news.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.content?.replace(/<[^>]*>/g, '').substring(0, 160) + "...",
            thumbnail: item.thumbnail,
            url: `/berita/${item.slug}`,
            type: 'berita' as const,
            created: item.created
        }));

        const productResults = products.items.map((item: any) => ({
            id: item.id,
            title: item.name,
            description: item.description,
            thumbnail: item.icon_name || item.thumbnail,
            url: `/layanan/${item.slug}`,
            type: 'produk' as const,
            created: item.created
        }));

        return [...newsResults, ...productResults];
    } catch (e) {
        console.error("Search Error:", e);
        return [];
    }
};
