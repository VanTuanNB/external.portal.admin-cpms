import { IDefineApiDocument } from '@/core/interfaces/common.interface';

export const API_DOCUMENT: { [key: string]: { [key: string]: IDefineApiDocument } } = {
    school: {
        getById: {
            endpoint: '/school',
            method: 'GET',
        },
        update: {
            endpoint: '/school',
            method: 'PUT',
        },
    },
};
