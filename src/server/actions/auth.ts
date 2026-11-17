import { z } from "zod";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createAdminSession, destroyAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const db = getDb();
  const user = await db.user.findUnique({
    where: { email: result.data.email },
  });

  if (!user || user.role !== "ADMIN" || !(await verifyPassword(result.data.password, user.passwordHash))) {
    return { error: "Email atau password salah" };
  }

  await createAdminSession({ id: user.id, email: user.email });
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
