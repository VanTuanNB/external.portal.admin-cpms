'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuthToken from '../core/hooks/useAuthToken.hook';
import PrimaryLayout from './layouts/PrimaryLayout.component';
import LoginComponent from './layouts/auth/Login.component';

function AppComponent({ children }: { children: React.ReactNode }) {
    const authToken = useAuthToken();
    const router = useRouter();
    useEffect(() => {
        if (!authToken) {
            router.push('/login');
        }
    }, [authToken, router]);

    return <>{authToken ? <PrimaryLayout>{children}</PrimaryLayout> : <LoginComponent></LoginComponent>}</>;
}

export default AppComponent;
