"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  uploadProductImageAction,
  type UploadImageState,
} from "@/server/actions/product-images";

const initialState: UploadImageState = { status: "idle", message: "" };

type ImageUploadFormProps = {
  slug: string;
};

export function ImageUploadForm({ slug }: ImageUploadFormProps) {
  const [state, formAction] = useActionState(uploadProductImageAction, initialState);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <input type="hidden" name="slug" value={slug} />

      <div className="space-y-2">
        <label htmlFor="file" className="text-sm font-medium">
          Gambar produk
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="block w-full rounded-lg border border-zinc-300 p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:text-white"
        />
        <p className="text-xs text-zinc-500">JPG, PNG, WEBP, atau AVIF. Maksimal 5 MB.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="alt" className="text-sm font-medium">
          Teks alternatif (opsional)
        </label>
        <input
          id="alt"
          name="alt"
          type="text"
          maxLength={120}
          placeholder="Deskripsi singkat gambar"
          className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <SubmitButton />

      {state.status !== "idle" ? (
        <p
          role="status"
          className={state.status === "success" ? "text-sm text-emerald-700" : "text-sm text-red-600"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mengunggah..." : "Unggah gambar"}
    </Button>
  );
}
