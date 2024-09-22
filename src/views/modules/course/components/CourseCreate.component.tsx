/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FormatDate } from '@/core/constants/common.constant';
import { ApiResponse, ApiResponsePaging } from '@/core/interfaces/common.interface';
import { CourseService } from '@/core/services/course.service';
import { FacultyService } from '@/core/services/faculty.service';
import { IFacultyEntity } from '@/core/services/models/faculty.model';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { Button, Col, DatePicker, Form, Input, Row, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../Course.module.scss';
export interface ICourseEntity {
    id: string;
    title: string;
    code: string;
    durationStart: string;
    durationEnd: string;
    quantity: number;
    faculty: string;
    // faq?: string[];
    requirements: string[];
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

const cx = classNames.bind(styles);

const facultyService = new FacultyService();
const courseService = new CourseService();

function CourseCreate() {
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [faculties, setFaculties] = useState<IFacultyEntity[]>([]);

    const values = Form.useWatch([], form);
    const { RangePicker } = DatePicker;
    const router = useRouter();

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

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
        courseService.create({
            payload,
            onSuccess: (res: ApiResponse<ICourseEntity>) => {
                if (!res.isSuccess || !res.data) {
                    message.error('Tạo thất bại');
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                message.success('Tạo thành công');
                router.push('/course');
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
        console.log('payload', payload);
        callUpdateApi(payload);
    };

    const onFinishFailed = () => {
        message.error('Cập nhật thất bại');
    };

    return (
        <div className={cx('wrapper-curriculum-detail')}>
            <h2>Tạo mới khoá học</h2>
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
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Tên khoá học"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khoá học' }]}
                        >
                            <Input placeholder="Nhập tên khoá học" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Mã khoá học"
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã khoá học' }]}
                        >
                            <Input placeholder="Nhập mã khoá học" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Số lượng học sinh"
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng học sinh' }]}
                        >
                            <Input type="number" placeholder="Nhập số lượng học sinhc" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Thời gian hiệu lực"
                            name="duration"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian hiệu lực' }]}
                        >
                            <RangePicker style={{ width: '100%' }} placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Khối ngành học"
                            name="faculty"
                            rules={[{ required: true, message: 'Vui lòng chọn khối ngành học' }]}
                        >
                            <Select style={{ width: '100%' }} placeholder="Chọn khối ngành học">
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
                            <TextArea placeholder="Nhập mô tả" rows={5} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default CourseCreate;
