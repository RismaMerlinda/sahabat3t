"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const resetSchema = z.object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

function ResetPasswordContent() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data: ResetForm) => {
        if (!token) {
            toast.error("Token tidak valid");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/sekolah/reset-password", {
                token,
                newPassword: data.password,
            });
            toast.success("Password berhasil diubah!");
            router.push("/sekolah/login");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mengubah password");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-red-500 mb-4">Token invalid atau hilang.</p>
                <Link href="/sekolah/login">
                    <Button variant="outline">Kembali ke Login</Button>
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-neutral-heading">Buat Password Baru</h1>
                <p className="text-neutral-body mt-2">Silahkan masukkan password baru anda</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Password Baru"
                    type="password"
                    placeholder="******"
                    {...register("password")}
                    error={errors.password?.message}
                />
                <Input
                    label="Konfirmasi Password"
                    type="password"
                    placeholder="******"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />

                <Button type="submit" isLoading={isLoading} className="mt-4">
                    Simpan Password
                </Button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-secondary-bg flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <Suspense fallback={<p>Loading...</p>}>
                    <ResetPasswordContent />
                </Suspense>
            </Card>
        </div>
    )
}
