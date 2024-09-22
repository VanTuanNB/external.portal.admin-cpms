/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ApiResponse } from '@/core/interfaces/common.interface';
import { ISchoolInfo } from '@/core/services/models/school.model';
import { SchoolService } from '@/core/services/school.service';
import { Button, Col, Form, Input, Row, Space, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './School.module.scss';
const cx = classNames.bind(styles);

const schoolService = new SchoolService();

// const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };
function SchoolModule() {
    const [editMode, setEditMode] = useState(false);
    const [schoolInfo, setSchoolInfo] = useState<ISchoolInfo>({} as ISchoolInfo);
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
        schoolService.getList({
            onSuccess: (res: ApiResponse<ISchoolInfo[]>) => {
                const school = res.data[0];
                form.setFieldsValue({
                    id: school.id,
                    title: school.title,
                    code: school.code,
                    email: school.email,
                    phone: school.phone,
                    logoUrl: school.logoUrl,
                    address: school.address,
                    description: school.description,
                });
                setSchoolInfo(res.data[0]);
            },
            onError: (err) => {
                console.error('Get user error', err);
            },
        });
    }, []);

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

    const onFinish = (value: any) => {
        if (!schoolInfo || !schoolInfo.id) {
            message.error('Đã xảy ra lỗi, vui lòng thử lại!');
            return;
        }
        setIsLoading(true);
        const payload = form.getFieldsValue();
        schoolService.update({
            payload,
            slug: schoolInfo.id,
            onSuccess: (res: ApiResponse<ISchoolInfo[]>) => {
                setIsLoading(false);
                if (!res.isSuccess) {
                    message.error('Cập nhật thất bại');
                    return;
                }
                setEditMode(false);
                message.success('Cập nhật thành công!');
            },
            onError: (err) => {
                console.log('Update user error', err);
                message.error('Cập nhật thất bại');
                setIsLoading(false);
            },
        });
    };

    const onFinishFailed = () => {
        message.error('Cập nhật thất bại');
    };

    return (
        <Spin spinning={isLoading} className={cx('wrapper-school')}>
            <div className={cx('wrapper-actions')}>
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
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                <Row gutter={16}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Tên trường"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
                        >
                            <Input placeholder="Nhập tên trường" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Mã trường"
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã trường' }]}
                        >
                            <Input placeholder="Nhập mã trường" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email', type: 'email' }]}
                        >
                            <Input placeholder="Nhập email" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại', type: 'string' }]}
                        >
                            <Input placeholder="Nhập số điện thoại" disabled={!editMode} type="number" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <Form.Item
                            label="Hình ảnh"
                            name="logoUrl"
                            rules={[{ required: true, message: 'Vui lòng nhập url hình ảnh', type: 'url' }]}
                        >
                            <Input placeholder="Nhập url hình ảnh" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <Form.Item label="Địa chỉ" name="address">
                            <TextArea placeholder="Nhập địa chỉ" disabled={!editMode} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <Form.Item label="Mô tả" name="description">
                            <TextArea placeholder="Nhập mô tả" disabled={!editMode} rows={5} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
}

export default SchoolModule;
