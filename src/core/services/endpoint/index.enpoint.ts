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
    curriculum: {
        getList: {
            endpoint: '/curriculum',
            method: 'GET',
        },
        getById: {
            endpoint: '/curriculum',
            method: 'GET',
        },
        create: {
            endpoint: '/curriculum',
            method: 'GET',
        },
        update: {
            endpoint: '/curriculum',
            method: 'PUT',
        },
        delete: {
            endpoint: '/curriculum',
            method: 'DELETE',
        },
    },
    faculty: {
        getList: {
            endpoint: '/faculty',
            method: 'GET',
        },
        getById: {
            endpoint: '/faculty',
            method: 'GET',
        },
        create: {
            endpoint: '/faculty',
            method: 'POST',
        },
        update: {
            endpoint: '/faculty',
            method: 'PUT',
        },
        delete: {
            endpoint: '/faculty',
            method: 'DELETE',
        },
    },
    course: {
        getList: {
            endpoint: '/course',
            method: 'GET',
        },
        getById: {
            endpoint: '/course',
            method: 'GET',
        },
        create: {
            endpoint: '/course',
            method: 'POST',
        },
        update: {
            endpoint: '/course',
            method: 'PUT',
        },
        delete: {
            endpoint: '/course',
            method: 'DELETE',
        },
    },
    news: {
        getList: {
            endpoint: '/news',
            method: 'GET',
        },
        getById: {
            endpoint: '/news',
            method: 'GET',
        },
        create: {
            endpoint: '/news',
            method: 'POST',
        },
        update: {
            endpoint: '/news',
            method: 'PUT',
        },
        delete: {
            endpoint: '/news',
            method: 'DELETE',
        },
    },
    user: {
        getList: {
            endpoint: '/user',
            method: 'GET',
        },
        getById: {
            endpoint: '/user',
            method: 'GET',
        },
        create: {
            endpoint: '/user',
            method: 'POST',
        },
        approve: {
            endpoint: '/user/accept-register-course',
            method: 'POST',
        },
        complete: {
            endpoint: '/user/completer-course',
            method: 'POST',
        },
        update: {
            endpoint: '/user',
            method: 'PUT',
        },
        delete: {
            endpoint: '/user',
            method: 'DELETE',
        },
    },
    admissions: {
        getList: {
            endpoint: '/admissions',
            method: 'GET',
        },
        upgradeToStudent: {
            endpoint: '/admissions/upgrade-to-student',
            method: 'POST',
        },
        delete: {
            endpoint: '/admissions',
            method: 'DELETE',
        },
    },
    auth: {
        login: {
            endpoint: '/auth/login',
            method: 'POST',
        },
    },
};
