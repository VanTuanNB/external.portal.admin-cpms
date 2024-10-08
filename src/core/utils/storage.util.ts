/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IClientStore {
    localStorage: {
        [key: string]: string;
    };
    sessionStorage: {
        [key: string]: string;
    };
    cookie: {
        [key: string]: string;
    };
}

export interface IClientStoreSide {
    getStore(key: string): any;
    setStore<T>(key: string, value: T, options?: { expires: number }): void;
}

export class LocalStorageSide implements IClientStoreSide {
    getStore(key: string): any {
        const store = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem(key) || 'null') : null;
        return store;
    }
    setStore<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export class sessionStorageSide implements IClientStoreSide {
    getStore(key: string): any {
        const store = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(key) || 'null') : null;
        return store;
    }
    setStore<T>(key: string, value: T): void {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

export class CookieStorageSide implements IClientStoreSide {
    getStore(key: string): { [key: string]: any } {
        if (typeof document === 'undefined') return {};
        const keyEQ = key + '=';
        const arrSegmentCookie = document.cookie.split(';');
        for (let i = 0; i < arrSegmentCookie.length; i++) {
            let charts = arrSegmentCookie[i];
            while (charts.charAt(0) == ' ') charts = charts.substring(1, charts.length);
            if (charts.indexOf(keyEQ) === 0)
                return { [key]: JSON.parse(decodeURIComponent(charts.substring(keyEQ.length, charts.length))) };
        }
        return {};
    }
    setStore<T>(key: string, value: T, options?: { expires: number } | undefined): void {
        let timeExpires: string = '';
        if (options && options.expires) {
            const date = new Date();
            date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
            timeExpires = '; expires=' + date.toUTCString();
        }
        document.cookie = key + '=' + value + timeExpires + '; path=/';
    }
}
