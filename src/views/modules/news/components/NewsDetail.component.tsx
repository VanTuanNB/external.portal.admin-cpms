/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ApiResponse } from '@/core/interfaces/common.interface';
import { INewsEntity } from '@/core/services/models/news.model';
import { NewsService } from '@/core/services/news.service';
import { Button, Col, Form, Input, Row, Space, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../News.module.scss';

const cx = classNames.bind(styles);

const newsService = new NewsService();

function NewsDetail() {
    const [editMode, setEditMode] = useState(false);
    const params = useParams();
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const values = Form.useWatch([], form);
    const router = useRouter();

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

    useEffect(() => {
        setIsLoading(true);
        newsService.getById({
            slug: params.id as string,
            onSuccess: (res: ApiResponse<INewsEntity>) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data) {
                    message.error('Lấy thông tin thất bại');
                    form.resetFields();
                    return;
                }
                setIsLoading(false);
                form.setFieldsValue({
                    title: res.data.title,
                    description: res.data.description,
                    contents: res.data.contents || '{}',
                });
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Lấy thông tin thất bại');
                setIsLoading(false);
            },
        });
    }, []);

    const formatterPayload = () => {
        return {
            title: values.title?.trim(),
            description: values.description?.trim(),
            contents: values.contents ? values.contents.replace(/\n/g, '') : '{}',
        };
    };

    const callUpdateApi = (payload: any) => {
        setIsLoading(true);
        newsService.update({
            slug: params.id as string,
            payload,
            onSuccess: (res: ApiResponse<INewsEntity>) => {
                if (!res.isSuccess || !res.data) {
                    message.error('Cập nhật thất bại');
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                message.success('Cập nhật thành công');
                setEditMode(false);
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Cập nhật thất bại');
                setIsLoading(false);
            },
        });
    };

    const onFinish = () => {
        const payload = formatterPayload();
        callUpdateApi(payload);
    };

    const onFinishFailed = () => {
        message.error('Cập nhật thất bại');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={cx('wrapper-curriculum-detail')}>
            <h2>Cập nhật tin tức</h2>
            <div className="wrapper-form">
                <div className={cx('wrapper-school')}>
                    <div className={cx('wrapper-actions')}>
                        <>
                            <Button style={{ marginRight: 10 }} iconPosition="start" onClick={handleBack}>
                                Trở lại
                            </Button>
                            {!editMode ? (
                                <Button type="primary" onClick={() => setEditMode(!editMode)}>
                                    Sửa
                                </Button>
                            ) : (
                                <Space>
                                    <Button type="default" onClick={() => setEditMode(!editMode)}>
                                        Huỷ
                                    </Button>

                                    <Button
                                        type="primary"
                                        loading={isLoading}
                                        iconPosition="start"
                                        disabled={!submittable}
                                        onClick={onFinish}
                                    >
                                        Lưu
                                    </Button>
                                </Space>
                            )}
                        </>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className="gutter-row" span={24}>
                                <Form.Item
                                    label="Tiêu đề"
                                    name="title"
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                >
                                    <Input disabled={!editMode} placeholder="Nhập tiêu đề" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Form.Item
                                    label="Nội dung"
                                    name="contents"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                try {
                                                    JSON.parse(value);
                                                    return Promise.resolve();
                                                } catch (err) {
                                                    return Promise.reject(
                                                        'Nội dung không hợp lệ, vui lòng nhập JSON hợp lệ',
                                                    );
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input.TextArea
                                        disabled={!editMode}
                                        placeholder="Nhập nội dung dưới dạng JSON"
                                        rows={10}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Form.Item label="Mô tả" name="description">
                                    <TextArea disabled={!editMode} placeholder="Nhập mô tả" rows={5} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default NewsDetail;
