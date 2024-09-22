/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FormatDate } from '@/core/constants/common.constant';
import { ApiResponse, ApiResponsePaging } from '@/core/interfaces/common.interface';
import { CurriculumService } from '@/core/services/curriculum.service';
import { FacultyService } from '@/core/services/faculty.service';
import { IFacultyEntity } from '@/core/services/models/faculty.model';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ICurriculumEntity } from '../Curriculum.component';
import styles from '../Curriculum.module.scss';

const cx = classNames.bind(styles);

const curriculumService = new CurriculumService();
const facultyService = new FacultyService();

function CurriculumDetail() {
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [faculties, setFaculties] = useState<IFacultyEntity[]>([]);
    const values = Form.useWatch([], form);
    const { RangePicker } = DatePicker;
    const params = useParams();

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

    useEffect(() => {
        setIsLoading(true);
        curriculumService.getById({
            slug: params.id as string,
            onSuccess: (res: ApiResponse<ICurriculumEntity>) => {
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
                    faculties:
                        res.data.faculties && res.data.faculties.length
                            ? res.data.faculties.map((faculty: any) => faculty.id)
                            : [],
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
            facultyIds: values.faculties,
            durationStart: TimezoneUtil.parseCurrentTimezone(values.duration[0], FormatDate.UTC_DATE_TIME),
            durationEnd: TimezoneUtil.parseCurrentTimezone(values.duration[1], FormatDate.UTC_DATE_TIME),
            description: values.description?.trim(),
        };
    };

    const callUpdateApi = (payload: any) => {
        setIsLoading(true);
        curriculumService.update({
            slug: params.id as string,
            payload,
            onSuccess: (res: ApiResponse<ICurriculumEntity>) => {
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
        console.log('payload', payload);
        callUpdateApi(payload);
    };

    const onFinishFailed = () => {
        message.error('Cập nhật thất bại');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <Spin spinning={isLoading} className={cx('wrapper-curriculum-detail')}>
            <h2>Chương Trình Đào Tạo</h2>
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
                                    label="Tên trương trình"
                                    name="title"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên trương trình' }]}
                                >
                                    <Input placeholder="Nhập tên trương trình" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Mã trương trình"
                                    name="code"
                                    rules={[{ required: true, message: 'Vui lòng nhập mã trương trình' }]}
                                >
                                    <Input placeholder="Nhập mã trương trình" disabled={!editMode} />
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
                                    label="Khối ngành"
                                    name="faculties"
                                    rules={[{ required: true, message: 'Vui lòng chọn khối ngành' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn khối ngành"
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
                                    <TextArea placeholder="Nhập mô tả" disabled={!editMode} rows={5} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </Spin>
    );
}

export default CurriculumDetail;
