import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.url().optional());

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_URL: optionalUrl,
  SUPABASE_SECRET_KEY: optionalString,
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("product-images"),
  AUTH_SECRET: optionalString,
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}
