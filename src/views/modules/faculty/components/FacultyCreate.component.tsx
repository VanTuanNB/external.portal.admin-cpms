/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FormatDate } from '@/core/constants/common.constant';
import { ApiResponse, ApiResponsePaging } from '@/core/interfaces/common.interface';
import { CourseService } from '@/core/services/course.service';
import { CurriculumService } from '@/core/services/curriculum.service';
import { FacultyService } from '@/core/services/faculty.service';
import { ICourseEntity } from '@/core/services/models/course.model';
import { IFacultyEntity } from '@/core/services/models/faculty.model';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { Button, Col, DatePicker, Form, Input, Row, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ICurriculumEntity } from '../Faculty.component';
import styles from '../Faculty.module.scss';

const cx = classNames.bind(styles);

const curriculumService = new CurriculumService();
const facultyService = new FacultyService();
const courseService = new CourseService();

function FacultyCreate() {
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [curriculums, setCurriculums] = useState<ICurriculumEntity[]>([]);
    const [courses, setCourses] = useState<ICourseEntity[]>([]);
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
        curriculumService.getList({
            queryParams: {
                page: 1,
                limit: 1000,
            },
            onSuccess: (res: ApiResponsePaging<ICurriculumEntity[]>) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data) {
                    message.error('Lấy thông tin thất bại');
                    setCurriculums([]);
                    return;
                }
                setIsLoading(false);
                setCurriculums(res.data.items.flat());
            },
            onError: (err: any) => {
                console.log('err', err);
                setIsLoading(false);
                setCurriculums([]);
            },
        });
    }, []);

    useEffect(() => {
        setIsLoading(true);
        courseService.getList({
            queryParams: {
                page: 1,
                limit: 1000,
            },
            onSuccess: (res: ApiResponsePaging<ICourseEntity[]>) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data) {
                    message.error('Lấy thông tin thất bại');
                    setCourses([]);
                    return;
                }
                setIsLoading(false);
                setCourses(res.data.items.flat());
            },
            onError: (err: any) => {
                console.log('err', err);
                setIsLoading(false);
                setCourses([]);
            },
        });
    }, []);

    const formatterPayload = () => {
        return {
            title: values.title?.trim(),
            code: values.code?.trim(),
            curriculumId: values.curriculum,
            courseIds: values.courses,
            durationStart: TimezoneUtil.parseCurrentTimezone(values.duration[0], FormatDate.UTC_DATE_TIME),
            durationEnd: TimezoneUtil.parseCurrentTimezone(values.duration[1], FormatDate.UTC_DATE_TIME),
            description: values.description?.trim(),
        };
    };

    const callUpdateApi = (payload: any) => {
        setIsLoading(true);
        facultyService.create({
            payload,
            onSuccess: (res: ApiResponse<IFacultyEntity>) => {
                if (!res.isSuccess || !res.data) {
                    message.error('Tạo thất bại');
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                message.success('Tạo thành công');
                router.push('/faculty');
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

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={cx('wrapper-curriculum-detail')}>
            <h2>Tạo mới khối ngành học</h2>
            <div
                className="wrapper-actions"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
            >
                <Button style={{ marginRight: 10 }} iconPosition="start" onClick={handleBack}>
                    Trở lại
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
            </div>
            <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                <Row gutter={16}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Tên khối ngành"
                            name="title"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khối ngành' }]}
                        >
                            <Input placeholder="Nhập tên khối ngành" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Mã khối ngành"
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã khối ngành' }]}
                        >
                            <Input placeholder="Nhập mã khối ngành" />
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
                            label="Chương trình đào tạo"
                            name="curriculum"
                            rules={[{ required: true, message: 'Vui lòng chọn chương trình đào tạo' }]}
                        >
                            <Select style={{ width: '100%' }} placeholder="Chọn chương trình đào tạo">
                                {curriculums.map((curriculum) => (
                                    <Select.Option key={curriculum.id} value={curriculum.id}>
                                        {curriculum.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            label="Khoá học"
                            name="courses"
                            rules={[{ required: true, message: 'Vui lòng chọn khoá học' }]}
                        >
                            <Select mode="multiple" style={{ width: '100%' }} placeholder="Chọn khoá học">
                                {courses.map((course) => (
                                    <Select.Option key={course.id} value={course.id}>
                                        {course.title}
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

export default FacultyCreate;
