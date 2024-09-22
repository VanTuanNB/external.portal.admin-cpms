/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FormatDate } from '@/core/constants/common.constant';
import { ApiResponse, ApiResponsePaging } from '@/core/interfaces/common.interface';
import { CourseService } from '@/core/services/course.service';
import { FacultyService } from '@/core/services/faculty.service';
import { ICourseEntity } from '@/core/services/models/course.model';
import { IFacultyEntity } from '@/core/services/models/faculty.model';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../Course.module.scss';

const cx = classNames.bind(styles);

const facultyService = new FacultyService();
const courseService = new CourseService();

function CourseDetail() {
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [faculties, setFaculties] = useState<IFacultyEntity[]>([]);
    const values = Form.useWatch([], form);
    const router = useRouter();
    const { RangePicker } = DatePicker;
    const params = useParams();
    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

    useEffect(() => {
        setIsLoading(true);
        courseService.getById({
            slug: params.id as string,
            onSuccess: (res: ApiResponse<ICourseEntity>) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data) {
                    message.error('Lấy thông tin thất bại');
                    form.resetFields();
                    return;
                }
                setIsLoading(false);
                form.setFieldsValue({
                    title: res.data.title,
                    code: res.data.code,
                    faculty: res.data.faculty ? (res.data.faculty as any).id : null,
                    quantity: res.data.quantity,
                    duration: [dayjs(res.data.durationStart), dayjs(res.data.durationEnd)],
                    description: res.data.description,
                });
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Lấy thông tin thất bại');
                setIsLoading(false);
                form.resetFields();
            },
        });
    }, [params]);

    useEffect(() => {
        setIsLoading(true);
        facultyService.getList({
            queryParams: {
                page: 1,
                limit: 1000,
            },
            onSuccess: (res: ApiResponsePaging<IFacultyEntity[]>) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data) {
                    message.error('Lấy thông tin thất bại');
                    setFaculties([]);
                    return;
                }
                setIsLoading(false);
                setFaculties(res.data.items.flat());
            },
            onError: (err: any) => {
                console.log('err', err);
                setIsLoading(false);
                setFaculties([]);
            },
        });
    }, []);

    const formatterPayload = () => {
        return {
            title: values.title?.trim(),
            code: values.code?.trim(),
            facultyId: values.faculty,
            quantity: values.quantity ? Number(values.quantity) : 0,
            durationStart: TimezoneUtil.parseCurrentTimezone(values.duration[0], FormatDate.UTC_DATE_TIME),
            durationEnd: TimezoneUtil.parseCurrentTimezone(values.duration[1], FormatDate.UTC_DATE_TIME),
            description: values.description?.trim(),
        };
    };

    const callUpdateApi = (payload: any) => {
        setIsLoading(true);
        courseService.update({
            slug: params.id as string,
            payload,
            onSuccess: (res: ApiResponse<IFacultyEntity>) => {
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
        // Handle form submission
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
        <Spin spinning={isLoading}>
            <h2>Cập nhật khoá học</h2>
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
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Tên khoá học"
                                    name="title"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên khoá học' }]}
                                >
                                    <Input placeholder="Nhập tên khoá học" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Mã khoá học"
                                    name="code"
                                    rules={[{ required: true, message: 'Vui lòng nhập mã khoá học' }]}
                                >
                                    <Input placeholder="Nhập mã khoá học" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Số lượng học sinh"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng học sinh' }]}
                                >
                                    <Input type="number" placeholder="Nhập số lượng học sinhc" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Thời gian hiệu lực"
                                    name="duration"
                                    rules={[{ required: true, message: 'Vui lòng chọn thời gian hiệu lực' }]}
                                >
                                    <RangePicker
                                        style={{ width: '100%' }}
                                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                        disabled={!editMode}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Khối ngành học"
                                    name="faculty"
                                    rules={[{ required: true, message: 'Vui lòng chọn khối ngành học' }]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Chọn khối ngành học"
                                        disabled={!editMode}
                                    >
                                        {faculties.map((faculty) => (
                                            <Select.Option key={faculty.id} value={faculty.id}>
                                                {faculty.title}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Form.Item label="Mô tả" name="description">
                                    <TextArea placeholder="Nhập mô tả" rows={5} disabled={!editMode} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </Spin>
    );
}

export default CourseDetail;
