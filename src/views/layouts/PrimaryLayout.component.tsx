'use client';
import { LocalStorageSide } from '@/core/utils/storage.util';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, ConfigProvider, Dropdown, Layout, theme } from 'antd';
import { ReactNode, useState } from 'react';
import MenuComponent from './components/Menu.component';

const { Header, Sider, Content } = Layout;

function PrimaryLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const userInfo = new LocalStorageSide().getStore('cpms-user-info') || {};

    const handleLogout = () => {
        localStorage.removeItem('cpms-user-info');
        window.location.href = '/login';
    };

    return (
        <ConfigProvider theme={{}}>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical" />
                    <MenuComponent />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingRight: 40,
                            }}
                            className="wrapper-headers"
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <div className="wrapper-headers-right">
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: '1',
                                                label: (
                                                    <div style={{ borderBottom: '1px solid #666', padding: '6px' }}>
                                                        <b>{userInfo?.name}</b>
                                                    </div>
                                                ),
                                            },
                                            {
                                                key: '2',
                                                label: <div onClick={handleLogout}>Đăng xuất</div>,
                                            },
                                        ],
                                    }}
                                    placement="bottom"
                                    arrow={{ pointAtCenter: true }}
                                >
                                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                </Dropdown>
                                {/* End of Selection */}
                            </div>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: '24px 24px 180px 24px',
                            overflowY: 'auto',
                            maxHeight: '101vh',
                            minHeight: '100vh',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}

export default PrimaryLayout;
