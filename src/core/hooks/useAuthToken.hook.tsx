import { useEffect, useState } from 'react';

const useAuthToken = () => {
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('cpms-user-info');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setAuthToken(parsedUserInfo.accessToken || null);
        }
    }, []);

    return authToken;
};

export default useAuthToken;
