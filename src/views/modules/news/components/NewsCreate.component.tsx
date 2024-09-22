/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ApiResponse } from '@/core/interfaces/common.interface';
import { INewsEntity } from '@/core/services/models/news.model';
import { NewsService } from '@/core/services/news.service';
import { Button, Col, Form, Input, Row, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../News.module.scss';

const cx = classNames.bind(styles);

const newsService = new NewsService();

function NewsCreate() {
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

    const formatterPayload = () => {
        return {
            title: values.title?.trim(),
            description: values.description?.trim(),
            contents: values.contents ? values.contents : '{}',
        };
    };

    const callUpdateApi = (payload: any) => {
        setIsLoading(true);
        newsService.create({
            payload,
            onSuccess: (res: ApiResponse<INewsEntity>) => {
                if (!res.isSuccess || !res.data) {
                    message.error('Tạo thất bại');
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                message.success('Tạo thành công');
                router.push('/news');
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Tạo thất bại');
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

    return (
        <div className={cx('wrapper-curriculum-detail')}>
            <h2>Tạo mới tin tức</h2>
            <div
                className="wrapper-actions"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
            >
                <Button
                    type="primary"
                    loading={isLoading}
                    iconPosition="start"
                    disabled={!submittable}
                    onClick={onFinish}
                >
                    Lưu
                </Button>
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input placeholder="Nhập tiêu đề" />
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
                                            return Promise.reject('Nội dung không hợp lệ, vui lòng nhập JSON hợp lệ');
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Nhập nội dung dưới dạng JSON" rows={10} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <Form.Item label="Mô tả" name="description">
                            <TextArea placeholder="Nhập mô tả" rows={5} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default NewsCreate;
