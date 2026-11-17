"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { payOrderAction, type PaymentActionState } from "@/server/actions/orders";

const INITIAL_STATE: PaymentActionState = { status: "idle", message: "" };

type MockPaymentButtonProps = {
  orderNumber: string;
  accessToken: string;
};

export function MockPaymentButton({ orderNumber, accessToken }: MockPaymentButtonProps) {
  const [state, formAction] = useActionState(payOrderAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <input type="hidden" name="accessToken" value={accessToken} />
      <SubmitButton />
      {state.status !== "idle" ? (
        <p
          role="status"
          className={`text-sm ${
            state.status === "success" ? "text-emerald-700" : "text-red-600"
          }`}
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
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Memproses pembayaran..." : "Bayar sekarang (simulasi)"}
    </Button>
  );
}
