import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export type StorageStatus = {
  ready: boolean;
  reason?: string;
};

export function getStorageStatus(): StorageStatus {
  const env = getEnv();

  if (!env.SUPABASE_URL) {
    return { ready: false, reason: "SUPABASE_URL belum diisi di .env." };
  }

  if (!env.SUPABASE_SECRET_KEY) {
    return { ready: false, reason: "SUPABASE_SECRET_KEY belum diisi di .env." };
  }

  return { ready: true };
}

type UploadProductImageArgs = {
  productId: string;
  file: File;
};

export async function uploadProductImageFile({
  productId,
  file,
}: UploadProductImageArgs): Promise<string> {
  const env = getEnv();
  const status = getStorageStatus();

  if (!status.ready || !env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    throw new Error(status.reason ?? "Storage belum siap.");
  }

  const extension = EXTENSION_BY_TYPE[file.type];
  if (!extension) {
    throw new Error("Format gambar tidak didukung.");
  }

  const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const bucket = env.SUPABASE_STORAGE_BUCKET;
  const objectPath = `products/${productId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await client.storage.from(bucket).upload(objectPath, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`);
  }

  const { data } = client.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}
