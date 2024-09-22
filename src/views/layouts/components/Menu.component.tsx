'use client';
import {
    BlockOutlined,
    FileSearchOutlined,
    FileZipOutlined,
    FundProjectionScreenOutlined,
    HomeOutlined,
    ProfileOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

import { usePathname, useRouter } from 'next/navigation';

function MenuComponent() {
    const router = useRouter();
    const handleRedirect = (path: string) => {
        router.push(path);
    };
    const pathname = usePathname();
    console.log('pathname', pathname);

    const items = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Thông tin trường',
            onClick: () => handleRedirect('/'),
        },
        {
            key: 'admissions',
            icon: <UserAddOutlined />,
            label: 'Tuyển sinh',
            onClick: () => handleRedirect('/admissions'),
        },
        {
            key: 'curriculum',
            icon: <FundProjectionScreenOutlined />,
            label: 'Chương trình đào tạo',
            onClick: () => handleRedirect('/curriculum'),
        },
        {
            key: 'faculty',
            icon: <BlockOutlined />,
            label: 'Khối ngành',
            onClick: () => handleRedirect('/faculty'),
        },
        {
            key: 'course',
            icon: <FileZipOutlined />,
            label: 'Khoá học',
            onClick: () => handleRedirect('/course'),
        },
        {
            key: 'student',
            icon: <ProfileOutlined />,
            label: 'Học sinh',
            onClick: () => handleRedirect('/student'),
        },
        {
            key: 'news',
            icon: <FileSearchOutlined />,
            label: 'Tin tức',
            onClick: () => handleRedirect('/news'),
        },
    ];

    const selectedKeys = items
        .filter((item) => {
            return pathname.replace('/', '').startsWith(item.key);
        })
        .map((item) => item.key);

    return <Menu theme="dark" mode="inline" selectedKeys={pathname.length > 1 ? selectedKeys : ['/']} items={items} />;
}

export default MenuComponent;
