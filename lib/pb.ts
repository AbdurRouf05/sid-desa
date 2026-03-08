import PocketBase, { BaseAuthStore } from 'pocketbase';
import { SiteConfigSchema, type SiteConfig } from './validations/site';
import { BkuTransactionSchema, type BkuTransactionForm } from './validations/bku';
import { PerangkatDesaSchema, type PerangkatDesa, SuratKeluarSchema, type SuratKeluar } from './validations/admin';
import { TanahDesaSchema, type TanahDesa } from './validations/aset';

// Singleton pattern to prevent multiple instances
let pb: PocketBase;

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sid-magang.sagamuda.cloud";

if (typeof window === "undefined") {
  pb = new PocketBase(PB_URL);
} else {
  if (!(window as any).pb) {
    let store;
    try {
      // Check if localStorage is accessible without throwing SecurityError
      window.localStorage.getItem('test');
    } catch (e) {
      // Fallback to memory store if localStorage is completely blocked
      store = new BaseAuthStore();
    }

    try {
      // Attempt standard initialization with or without custom auth store fallback
      (window as any).pb = new PocketBase(PB_URL, store);
    } catch (err) {
      // Ultimate fallback if the SDK still strictly throws
      (window as any).pb = new PocketBase(PB_URL, new BaseAuthStore());
    }
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
    create: async (data: BkuTransactionForm) => {
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
      const result = await pb.collection('perangkat_desa').getFullList({ filter: 'is_aktif = true' });
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
    const result = await pb.collection('berita_desa').getList(1, 10, {
      filter: `judul ~ "${query}" || konten ~ "${query}"`,
      sort: '-created'
    });

    return result.items.map((item: any) => ({
      id: item.id,
      title: item.judul,
      description: item.konten?.replace(/<[^>]*>/g, '').substring(0, 160) + "...",
      thumbnail: item.thumbnail,
      url: `/berita/${item.slug}`,
      type: 'berita' as const,
      created: item.created
    }));
  } catch (e) {
    console.error("Search Error:", e);
    return [];
  }
};
