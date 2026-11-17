"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/money";
import type { CatalogProductVariant } from "@/server/queries/catalog";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL"];

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const indexA = SIZE_ORDER.indexOf(a.toUpperCase());
    const indexB = SIZE_ORDER.indexOf(b.toUpperCase());

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

type VariantPickerProps = {
  productId: string;
  productSlug: string;
  productName: string;
  basePrice: number;
  imageUrl: string | null;
  variants: CatalogProductVariant[];
};

export function VariantPicker({
  productId,
  productSlug,
  productName,
  basePrice,
  imageUrl,
  variants,
}: VariantPickerProps) {
  const { addItem } = useCart();

  const colors = useMemo(
    () => [...new Set(variants.map((variant) => variant.color))],
    [variants],
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors.length === 1 ? colors[0] : null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const sizes = useMemo(() => {
    const visible = variants
      .filter((variant) => selectedColor === null || variant.color === selectedColor)
      .map((variant) => variant.size);

    return sortSizes([...new Set(visible)]);
  }, [variants, selectedColor]);

  const selectedVariant =
    selectedColor !== null && selectedSize !== null
      ? variants.find(
          (variant) => variant.color === selectedColor && variant.size === selectedSize,
        ) ?? null
      : null;

  const price = selectedVariant?.priceOverride ?? basePrice;
  const needsColor = colors.length > 1 && selectedColor === null;
  const canAdd = selectedVariant !== null && selectedVariant.stock > 0;

  function chooseColor(color: string) {
    setSelectedColor(color);
    setNotice(null);

    if (
      selectedSize !== null &&
      !variants.some((variant) => variant.color === color && variant.size === selectedSize)
    ) {
      setSelectedSize(null);
    }
  }

  function addToCart() {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId,
      slug: productSlug,
      name: productName,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.priceOverride ?? basePrice,
      imageUrl,
    });

    setNotice(`${selectedVariant.size} · ${selectedVariant.color} ditambahkan ke keranjang.`);
  }

  if (variants.length === 0) {
    return <p className="text-sm text-zinc-600">Varian produk belum tersedia.</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-2xl font-semibold">{formatRupiah(price)}</p>

      {colors.length > 1 ? (
        <fieldset>
          <legend className="text-sm font-medium">Warna</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseColor(color)}
                  className={`h-10 rounded-lg border px-4 text-sm transition-colors ${
                    active
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-500"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset disabled={needsColor}>
        <legend className="text-sm font-medium">Ukuran</legend>
        {needsColor ? (
          <p className="mt-2 text-sm text-zinc-500">Pilih warna terlebih dahulu.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((size) => {
              const inStock = variants.some(
                (variant) =>
                  variant.color === selectedColor && variant.size === size && variant.stock > 0,
              );
              const active = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  disabled={!inStock}
                  onClick={() => {
                    setSelectedSize(size);
                    setNotice(null);
                  }}
                  className={`h-10 min-w-12 rounded-lg border px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-500"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      {selectedVariant ? (
        <p className="text-sm text-zinc-600">
          {selectedVariant.stock > 0
            ? `Stok tersedia: ${selectedVariant.stock}`
            : "Stok habis untuk varian ini"}
          <span className="text-zinc-400"> · </span>
          SKU {selectedVariant.sku}
        </p>
      ) : (
        <p className="text-sm text-zinc-500">Pilih ukuran dan warna terlebih dahulu.</p>
      )}

      <Button type="button" disabled={!canAdd} onClick={addToCart} className="w-full sm:w-auto">
        Tambah ke keranjang
      </Button>

      {notice ? (
        <p role="status" className="text-sm text-emerald-700">
          {notice}{" "}
          <Link href="/keranjang" className="font-medium underline">
            Lihat keranjang
          </Link>
        </p>
      ) : null}
    </div>
  );
}
