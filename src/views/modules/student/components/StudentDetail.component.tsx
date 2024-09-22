/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { EnumUserCourseStatus, FormatDate } from '@/core/constants/common.constant';
import { ApiResponse } from '@/core/interfaces/common.interface';
import { IUserEntity } from '@/core/services/models/user.model';
import { UserService } from '@/core/services/user.service';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Space, Spin, Table, Tag, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../Student.module.scss';

const cx = classNames.bind(styles);

const userService = new UserService();
const columnsRegistering = [
    {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: 150,
    },
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Duration Start',
        dataIndex: 'durationStart',
        key: 'durationStart',
    },
    {
        title: 'Duration End',
        dataIndex: 'durationEnd',
        key: 'durationEnd',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: () => (
            <Tag style={{ padding: '8px 10px' }} color="purple">
                {'Đang chờ duyệt'}
            </Tag>
        ),
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
];

const columns = [
    {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: 150,
    },
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Duration Start',
        dataIndex: 'durationStart',
        key: 'durationStart',
    },
    {
        title: 'Duration End',
        dataIndex: 'durationEnd',
        key: 'durationEnd',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: number) => (
            <Tag
                style={{ padding: '8px 10px' }}
                color={status === EnumUserCourseStatus.COMPLETED ? 'green' : 'geekblue'}
            >
                {status === EnumUserCourseStatus.COMPLETED ? 'Đã hoàn thành' : 'Đang học'}
            </Tag>
        ),
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
];

function StudentDetail() {
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<IUserEntity | null>({} as IUserEntity);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRegistering, setSelectedRegistering] = useState<React.Key[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<React.Key[]>([]);
    const values = Form.useWatch([], form);
    const {} = DatePicker;
    const params = useParams();
    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

    useEffect(() => {
        callAPIGetUser();
    }, [params]);

    const callAPIGetUser = () => {
        setIsLoading(true);
        userService.getById({
            slug: params.id as string,
            onSuccess: (res: ApiResponse<IUserEntity>) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data) {
                    message.error('Lấy thông tin thất bại');
                    form.resetFields();
                    return;
                }
                setIsLoading(false);
                setUserInfo(res.data);
                form.setFieldsValue({
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    birthday: dayjs(res.data.birthday),
                    address: res.data.address,
                });
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Lấy thông tin thất bại');
                setIsLoading(false);
                form.resetFields();
            },
        });
    };

    const onFinish = () => {
        callAPIUpdateUser();
    };

    const onFinishFailed = () => {
        message.error('Cập nhật thất bại');
    };

    const formatterPayloadUser = () => {
        return {
            name: values.name?.trim(),
            email: values.email?.trim(),
            phone: values.phone?.trim(),
            birthday: TimezoneUtil.parseCurrentTimezone(values.birthday, FormatDate.UTC_DATE_TIME),
            address: values.address?.trim(),
        };
    };

    const callAPIUpdateUser = () => {
        setIsLoading(true);
        userService.update({
            slug: params.id as string,
            payload: formatterPayloadUser(),
            onSuccess: (res: ApiResponse<any>) => {
                if (!res.isSuccess || !res.data) {
                    message.error('Cập nhật thất bại');
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                message.success('Cập nhật thành công');
                callAPIGetUser();
                setEditMode(false);
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Cập nhật thất bại');
                setIsLoading(false);
            },
        });
    };

    const callAPIUpdateApproveCourse = () => {
        setIsLoading(true);
        userService.approveCourse({
            payload: {
                courseIds: selectedRegistering,
                userId: params.id as string,
            },
            onSuccess: (res: ApiResponse<any>) => {
                if (!res.isSuccess || !res.data) {
                    message.error('Cập nhật thất bại');
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                message.success('Cập nhật thành công');
                callAPIGetUser();
                setEditMode(false);
                setSelectedRegistering([]);
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Cập nhật thất bại');
                setIsLoading(false);
            },
        });
    };

    const callAPIUpdateCompleteCourse = () => {
        setIsLoading(true);
        userService.completeCourse({
            payload: {
                courseIds: selectedCourses,
                userId: params.id as string,
            },
            onSuccess: (res: ApiResponse<any>) => {
                if (!res.isSuccess || !res.data) {
                    message.error('Cập nhật thất bại');
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                message.success('Cập nhật thành công');
                callAPIGetUser();
                setEditMode(false);
                setSelectedCourses([]);
            },
            onError: (err: any) => {
                console.log('err', err);
                message.error('Cập nhật thất bại');
                setIsLoading(false);
            },
        });
    };

    const onApproveRegistering = () => {
        Modal.confirm({
            title: 'Xác nhận',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn duyệt các khóa học đã chọn không?',
            okText: 'Ok',
            cancelText: 'Hủy',
            onOk() {
                callAPIUpdateApproveCourse();
            },
        });
    };

    const onApproveChangeStatusCourse = () => {
        Modal.confirm({
            title: 'Xác nhận',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn hoàn thành các khóa học đã chọn không?',
            okText: 'Ok',
            cancelText: 'Hủy',
            onOk() {
                callAPIUpdateCompleteCourse();
            },
        });
    };

    const onSelectRegisteringChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRegistering(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys: selectedRegistering,
        onChange: onSelectRegisteringChange,
    };

    const hasSelected = selectedRegistering.length > 0;

    const onSelectCoursesChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedCourses(newSelectedRowKeys);
    };

    const rowSelectionCourses: TableRowSelection<any> = {
        selectedRowKeys: selectedCourses,
        onChange: onSelectCoursesChange,
    };

    const hasSelectedCourses = selectedCourses.length > 0;

    return (
        <Spin spinning={isLoading}>
            <h2>Cập nhật khối ngành</h2>
            <div className="wrapper-form">
                <div className={cx('wrapper-school')}>
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
                                    label="Tên sinh viên"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên sinh viên' }]}
                                >
                                    <Input placeholder="Nhập tên sinh viên" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                                >
                                    <Input placeholder="Nhập mã email" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Ngày sinh"
                                    name="birthday"
                                    rules={[{ required: true, message: 'Vui chọn ngày sinh' }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="Nhập ngày sinh"
                                        disabled={!editMode}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input placeholder="Nhập địa chỉ" disabled={!editMode} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            <div className={cx('wrapper-course')}>
                <h2>Khoá học đang chờ duyệt</h2>
                <div className={cx('wrapper-table')}>
                    <div className={cx('wrapper-above')}>
                        <div className={cx('total-item')}>Tổng: {userInfo?.coursesRegistering?.length}</div>
                        <Button
                            type="primary"
                            disabled={!hasSelected}
                            style={{ marginLeft: 'auto' }}
                            onClick={onApproveRegistering}
                        >
                            Duyệt
                        </Button>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        {hasSelected ? `Đã chọn ${selectedRegistering.length} items` : null}
                    </div>
                    <Table
                        rowSelection={rowSelection}
                        loading={isLoading}
                        scroll={{ x: 1500, y: 800 }}
                        dataSource={userInfo?.coursesRegistering || []}
                        columns={columnsRegistering as ColumnType<any>[]}
                        rowKey="id"
                    />
                </div>
                <div className={cx('wrapper-course')}>
                    <h2>Khoá học đang học</h2>
                    <div className={cx('wrapper-table')}>
                        <div className={cx('wrapper-above')}>
                            <div className={cx('total-item')}>Tổng: {userInfo?.courses?.length}</div>
                            <Button
                                type="primary"
                                disabled={!hasSelectedCourses}
                                style={{ marginLeft: 'auto' }}
                                onClick={onApproveChangeStatusCourse}
                            >
                                Hoàn thành
                            </Button>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            {hasSelectedCourses ? `Đã chọn ${selectedCourses.length} items` : null}
                        </div>
                        <Table
                            rowSelection={rowSelectionCourses}
                            loading={isLoading}
                            scroll={{ x: 1500, y: 800 }}
                            dataSource={userInfo?.courses || []}
                            columns={columns as ColumnType<any>[]}
                            rowKey="id"
                        />
                    </div>
                </div>
            </div>
            {/* Closing div for 'wrapper-course' */}
        </Spin>
    );
}

export default StudentDetail;
