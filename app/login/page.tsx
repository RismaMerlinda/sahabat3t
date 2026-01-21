"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Schema validasi
const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/login", data);

            // Backend returns: { success: true, message: "...", token: "...", user: {...} }
            const { token, user } = response.data;

            if (token && user) {
                // ✅ SIMPAN TOKEN & USER (CRITICAL FIX)
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                toast.success("Login berhasil!");
                router.replace("/dashboard"); // ✅ PINDAH KE DASHBOARD
            } else {
                throw new Error("Respon server tidak valid (missing token/user)");
            }

        } catch (error: any) {
            console.error("Login Error:", error);
            const msg = error.response?.data?.message || "Login gagal";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-bg flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-neutral-heading">
                        Masuk Sekolah
                    </h1>
                    <p className="text-neutral-body mt-2">
                        Akses dashboard sekolah Anda
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="sekolah@email.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="******"
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Lupa Password?
                        </Link>
                    </div>

                    <Button type="submit" isLoading={isLoading} className="mt-2">
                        Masuk
                    </Button>
                </form>

                <p className="text-center mt-6 text-neutral-body text-sm">
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className="text-primary font-semibold hover:underline"
                    >
                        Daftar disini
                    </Link>
                </p>
            </Card>
        </div>
    );
}
