/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FormatDate } from '@/core/constants/common.constant';
import { ApiResponse, ApiResponsePaging, IFilterParams } from '@/core/interfaces/common.interface';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Col, DatePicker, Input, message, Modal, Pagination, Row, Space, Table, Tooltip } from 'antd';
import classNames from 'classnames/bind';
import { Dayjs } from 'dayjs';

import { FacultyService } from '@/core/services/faculty.service';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './Faculty.module.scss';

const cx = classNames.bind(styles);
const facultyService = new FacultyService();
export interface ICurriculumEntity {
    id: string;
    title: string;
    description: string;
    durationStart: string;
    durationEnd: string;
    code: string;
    faculties: string[];
    createdAt?: string;
    updatedAt?: string;
}

function FacultyModule() {
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState<ICurriculumEntity[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [filterParams, setFilterParams] = useState<IFilterParams & { totalPages: number }>({
        page: 1,
        limit: 10,
        keyword: '',
        durationEnd: null,
        durationStart: null,
        totalPages: 0,
    });
    const { RangePicker } = DatePicker;
    const router = useRouter();

    useEffect(() => {
        callListApi();
    }, []);

    const callListApi = () => {
        setIsLoading(true);
        facultyService.getList({
            queryParams: formatterPayload(filterParams),
            onSuccess: (res: ApiResponsePaging) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data || !res.data.items) {
                    setDataSource([]);
                    setFilterParams((prev) => ({ ...prev, totalPages: 0, page: 1, limit: 10 }));
                    return;
                }
                const data = res.data.items.map((item) => ({
                    ...item,
                    durationStart: TimezoneUtil.formatCurrentTimezone(item.durationStart, FormatDate.CLIENT_DATE_TIME),
                    durationEnd: TimezoneUtil.formatCurrentTimezone(item.durationEnd, FormatDate.CLIENT_DATE_TIME),
                }));
                setFilterParams((prev) => ({
                    ...prev,
                    totalPages: res.data.totalPages,
                    page: res.data.page,
                    limit: res.data.limit,
                }));
                setTotalItems(res.data.totalItems);
                setDataSource(data);
            },
            onError: (err) => {
                console.log('err', err);
                setIsLoading(false);
                setDataSource([]);
                setFilterParams((prev) => ({ ...prev, totalPages: 0, page: 1, limit: 10 }));
                message.error('Lỗi khi lấy danh sách chương trình đào tạo');
            },
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterParams((prev) => ({ ...prev, keyword: e.target.value }));
    };

    const formatterPayload = (params: IFilterParams) => {
        return {
            ...params,
            durationStart: params.durationStart ? params.durationStart.format() : undefined,
            durationEnd: params.durationEnd ? params.durationEnd.format() : undefined,
        };
    };

    const onSubmitSearch = () => {
        callListApi();
    };

    const onDatePickerChange: any = (value: Dayjs[]) => {
        if (!value || !value.length) {
            setFilterParams((prev) => ({ ...prev, durationStart: null, durationEnd: null }));
            return;
        }
        setFilterParams((prev) => ({ ...prev, durationStart: value[0], durationEnd: value[1] }));
    };

    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmitSearch();
        }
    };

    const handleEdit = (path: string) => {
        router.push(path);
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mã khối ngành',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'durationStart',
            key: 'durationStart',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'durationEnd',
            key: 'durationEnd',
        },
        {
            title: 'Khoá học',
            dataIndex: 'courses',
            key: 'courses',
            render: (courses: any[]) => (
                <div>
                    <ul>
                        {courses.map((course) => (
                            <li style={{ marginBottom: 10 }} key={course}>
                                <Badge status="success" text={course.title} />
                            </li>
                        ))}
                    </ul>
                </div>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (id: string) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button onClick={() => handleEdit(`/faculty/${id}`)} shape="circle" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const callDeleteApi = (id: string) => {
        facultyService.delete({
            slug: id,
            onSuccess: (res: ApiResponse) => {
                if (!res.isSuccess || !res.data) {
                    message.error(res.message);
                    return;
                }
                callListApi();
                message.success('Xoá khối ngành thành công');
            },
            onError: (err) => {
                message.error('Lỗi khi xoá khối ngành');
                console.log('err', err);
            },
        });
    };

    const { confirm } = Modal;

    const showConfirm = (id: string) => {
        confirm({
            title: 'Bạn có muốn xoá khối ngành này không?',
            icon: <ExclamationCircleFilled />,
            content: '',
            onOk() {
                callDeleteApi(id);
            },
            onCancel() {
                console.log('Huỷ');
            },
        });
    };

    return (
        <div className={cx('wrapper-curriculum')}>
            <div className="wrapper-filter">
                <h2>Khối ngành học</h2>
                <div className={cx('filter-container')}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={8}>
                            <div className={cx('filter-group')} style={{ width: '100%' }}>
                                <div className={cx('filter-title')}>Từ Khoá</div>
                                <Input
                                    placeholder="Tìm kiếm theo tiêu đề"
                                    value={filterParams.keyword}
                                    onChange={handleSearch}
                                    prefix={<SearchOutlined />}
                                    onKeyUp={onKeyUp}
                                    style={{ marginBottom: 16, width: '100%' }}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className={cx('filter-group')} style={{ width: '100%' }}>
                                <div className={cx('filter-title')}>Thời gian hiệu lực</div>
                                <RangePicker
                                    value={[filterParams.durationStart, filterParams.durationEnd]}
                                    style={{ width: '100%' }}
                                    onChange={onDatePickerChange}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className={cx('submit-search')}>
                                <Button type="primary" style={{ marginLeft: 'auto' }} onClick={onSubmitSearch}>
                                    Tìm kiếm
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className={cx('wrapper-table')}>
                <div className={cx('wrapper-above')}>
                    <div className={cx('total-item')}>Tổng: {totalItems}</div>
                    <Button type="primary" style={{ marginLeft: 'auto' }} onClick={() => handleEdit('/faculty/create')}>
                        Tạo mới
                    </Button>
                </div>

                <Table loading={isLoading} dataSource={dataSource} columns={columns} rowKey="id" pagination={false} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination
                        current={filterParams.page}
                        pageSize={filterParams.limit}
                        total={totalItems}
                        onChange={(page, pageSize) => setFilterParams((prev) => ({ ...prev, page, limit: pageSize }))}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50', '100']}
                        style={{ marginTop: 16, textAlign: 'right' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default FacultyModule;
