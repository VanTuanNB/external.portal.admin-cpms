/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import useAuthToken from '@/core/hooks/useAuthToken.hook';
import { AuthService } from '@/core/services/auth.service';
import { JwtUtil } from '@/core/utils/jwt.util';
import { Button, Form, Input, message, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const authService = new AuthService();

function LoginComponent() {
    const router = useRouter();
    const authToken = useAuthToken();
    useEffect(() => {
        if (window.location.pathname === '/login' && authToken) {
            router.push('/admissions');
        }
    }, [router, authToken]);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const values = Form.useWatch([], form);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const callLoginApi = () => {
        if (Object.keys(values).length < 2) {
            message.error('Vui lòng nhập đầy đủ thông tin đăng nhập!');
            return;
        }
        setIsLoading(true);
        authService.login({
            payload: {
                email: values.email,
                password: values.password,
            },
            onSuccess: (res) => {
                console.log('res', res);
                if (!res.isSuccess) {
                    message.error(res.message);
                    setIsLoading(false);
                    return;
                }
                const userInfo = JwtUtil.decode(res.data.accessToken);
                localStorage.setItem(
                    'cpms-user-info',
                    JSON.stringify({ ...userInfo, accessToken: res.data.accessToken }),
                );
                message.success('Đăng nhập thành công');
                window.location.href = '/admissions';
            },
            onError: (err) => {
                console.log('err', err);
                message.error('Đăng nhập thất bại');
                setIsLoading(false);
            },
        });
    };

    return (
        <div hidden={!!authToken} style={{ maxWidth: '600px', margin: '0 auto', padding: '50px' }}>
            <Spin spinning={isLoading}>
                <h1 style={{ marginBottom: 40 }}>Đăng nhập</h1>
                <Form name="basic" form={form} initialValues={{ remember: true }} onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={callLoginApi}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
}

export default LoginComponent;
