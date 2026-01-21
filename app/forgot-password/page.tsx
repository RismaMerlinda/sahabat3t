"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const forgotSchema = z.object({
    email: z.string().email("Email tidak valid"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotForm>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotForm) => {
        setIsLoading(true);
        try {
            await api.post("/auth/sekolah/forgot-password", data);
            setIsSuccess(true);
            toast.success("Link reset password terkirim!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mengirim email");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-secondary-bg flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-secondary-card rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-heading mb-2">Cek Email Anda</h2>
                    <p className="text-neutral-body mb-6">Instruksi reset password telah dikirim ke email anda.</p>
                    <Link href="/sekolah/login">
                        <Button variant="outline">Kembali ke Login</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-bg flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-neutral-heading">Lupa Password</h1>
                    <p className="text-neutral-body mt-2">Masukkan email untuk reset password</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="sekolah@email.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Button type="submit" isLoading={isLoading} className="mt-4">
                        Kirim Link Reset
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <Link href="/sekolah/login" className="text-sm text-neutral-body hover:text-primary">
                        Kembali ke Login
                    </Link>
                </div>
            </Card>
        </div>
    );
}
