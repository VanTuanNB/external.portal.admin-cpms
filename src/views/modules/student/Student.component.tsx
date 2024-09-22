/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { EnumUserRole, FormatDate } from '@/core/constants/common.constant';
import { ApiResponse, ApiResponsePaging, IFilterParams } from '@/core/interfaces/common.interface';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Modal, Pagination, Row, Space, Table, Tooltip } from 'antd';
import classNames from 'classnames/bind';

import { ICourseEntity } from '@/core/services/models/course.model';
import { UserService } from '@/core/services/user.service';
import { ColumnType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './Student.module.scss';

const cx = classNames.bind(styles);
const userService = new UserService();
function StudentModule() {
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState<ICourseEntity[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [filterParams, setFilterParams] = useState<IFilterParams & { totalPages: number }>({
        page: 1,
        limit: 10,
        keyword: '',
        durationEnd: null,
        durationStart: null,
        totalPages: 0,
    });
    // const { RangePicker } = DatePicker;
    const router = useRouter();

    useEffect(() => {
        callListApi();
    }, [filterParams.page, filterParams.limit]);

    const callListApi = () => {
        setIsLoading(true);
        userService.getList({
            queryParams: formatterPayload(filterParams),
            onSuccess: (res: ApiResponsePaging) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data || !res.data.items) {
                    setDataSource([]);
                    setFilterParams((prev) => ({ ...prev, totalPages: 0, page: 1, limit: 10 }));
                    return;
                }
                const filtered = res.data.items.filter((item) => {
                    const isStudent = item.roles?.find((role: any) => role.role === EnumUserRole.USER);
                    return isStudent;
                });
                const data =
                    filtered?.map((item) => ({
                        ...item,
                        createdAt: TimezoneUtil.formatCurrentTimezone(item.createdAt, FormatDate.CLIENT_DATE_TIME),
                        updatedAt: TimezoneUtil.formatCurrentTimezone(item.updatedAt, FormatDate.CLIENT_DATE_TIME),
                    })) || [];
                setTotalItems(res.data.totalItems);
                setFilterParams((prev) => ({
                    ...prev,
                    page: res.data.page,
                    limit: res.data.limit,
                    totalPages: res.data.totalPages,
                }));
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

    // const onDatePickerChange: any = (value: Dayjs[]) => {
    //     setFilterParams((prev) => ({ ...prev, durationStart: value[0], durationEnd: value[1] }));
    // };

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
            title: 'Tên sinh viên',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            key: 'birthday',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
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
            fixed: 'right',
            width: 100,
            render: (id: string) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button onClick={() => handleEdit(`/student/${id}`)} shape="circle" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const callDeleteApi = (id: string) => {
        userService.delete({
            slug: id,
            onSuccess: (res: ApiResponse) => {
                if (!res.isSuccess || !res.data) {
                    message.error(res.message);
                    return;
                }
                callListApi();
                message.success('Xoá sinh viên thành công');
            },
            onError: (err) => {
                message.error('Lỗi khi xoá sinh viên');
                console.log('err', err);
            },
        });
    };

    const { confirm } = Modal;

    const showConfirm = (id: string) => {
        confirm({
            title: 'Bạn có muốn xoá sinh viên này không?',
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
                <h2>Sinh Viên</h2>
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
                        {/* <Col className="gutter-row" span={8}>
                            <div className={cx('filter-group')} style={{ width: '100%' }}>
                                <div className={cx('filter-title')}>Thời gian hiệu lực</div>
                                <RangePicker
                                    value={[filterParams.durationStart, filterParams.durationEnd]}
                                    style={{ width: '100%' }}
                                    onChange={onDatePickerChange}
                                />
                            </div>
                        </Col> */}
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
                    {/* <Button type="primary" style={{ marginLeft: 'auto' }} onClick={() => handleEdit('/course/create')}>
                        Tạo mới
                    </Button> */}
                </div>

                <Table
                    loading={isLoading}
                    scroll={{ x: 1500, y: 500 }}
                    dataSource={dataSource}
                    columns={columns as ColumnType<ICourseEntity>[]}
                    rowKey="id"
                    pagination={false}
                />
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

export default StudentModule;
