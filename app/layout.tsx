import ToastProvider from "@/components/providers/ToastProvider";
import "./globals.css";

export const metadata = {
    title: "SAHABAT3T",
    description: "Platform Pendidikan Daerah 3T",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body>
                <ToastProvider />
                {children}
            </body>
        </html>
    );
}
