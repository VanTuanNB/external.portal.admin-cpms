import AppComponent from '@/views/App.component';
import type { Metadata } from 'next';
import './global.scss';

export const metadata: Metadata = {
    title: 'CPMS Admin',
    description: 'CPMS Admin',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <AppComponent>{children}</AppComponent>
            </body>
        </html>
    );
}
