'use client';
import {
    BlockOutlined,
    FileSearchOutlined,
    FileZipOutlined,
    FundProjectionScreenOutlined,
    HomeOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

import { useRouter } from 'next/navigation';

function MenuComponent() {
    const router = useRouter();
    const handleRedirect = (path: string) => {
        router.push(path);
    };

    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
                {
                    key: '1',
                    icon: <HomeOutlined />,
                    label: 'Thông tin trường',
                    onClick: () => handleRedirect('/'),
                },
                {
                    key: '2',
                    icon: <FundProjectionScreenOutlined />,
                    label: 'Chương trình đào tạo',
                    onClick: () => handleRedirect('/curriculum'),
                },
                {
                    key: '3',
                    icon: <BlockOutlined />,
                    label: 'Khối ngành',
                    onClick: () => handleRedirect('/faculty'),
                },
                {
                    key: '4',
                    icon: <FileZipOutlined />,
                    label: 'Khoá học',
                    onClick: () => handleRedirect('/course'),
                },
                {
                    key: '5',
                    icon: <BlockOutlined />,
                    label: 'Khoá học chờ duyệt',
                    onClick: () => handleRedirect('/course-register'),
                },
                {
                    key: '6',
                    icon: <ProfileOutlined />,
                    label: 'Học sinh',
                    onClick: () => handleRedirect('/student'),
                },
                {
                    key: '7',
                    icon: <FileSearchOutlined />,
                    label: 'Tin tức',
                    onClick: () => handleRedirect('/news'),
                },
            ]}
        />
    );
}

export default MenuComponent;
