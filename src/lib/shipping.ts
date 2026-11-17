export type ShippingOption = {
  id: string;
  courier: string;
  service: string;
  eta: string;
  cost: number;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "jne-reg", courier: "JNE", service: "REG", eta: "2-3 hari", cost: 15000 },
  { id: "jne-yes", courier: "JNE", service: "YES", eta: "1 hari", cost: 25000 },
  { id: "sicepat-reg", courier: "SiCepat", service: "REG", eta: "2-4 hari", cost: 12000 },
  { id: "anteraja-reg", courier: "AnterAja", service: "REG", eta: "2-3 hari", cost: 14000 },
];

export function findShippingOption(id: string): ShippingOption | null {
  return SHIPPING_OPTIONS.find((option) => option.id === id) ?? null;
}
