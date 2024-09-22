/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FormatDate } from '@/core/constants/common.constant';
import { ApiResponse, ApiResponsePaging, IFilterParams } from '@/core/interfaces/common.interface';
import { TimezoneUtil } from '@/core/utils/timezone.util';
import { DeleteOutlined, ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Modal, Pagination, Row, Space, Table, Tooltip } from 'antd';
import classNames from 'classnames/bind';

import { AdmissionsService } from '@/core/services/admissions.service';
import { ICourseEntity } from '@/core/services/models/course.model';
import { ColumnType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import styles from './Admissions.module.scss';

const cx = classNames.bind(styles);
const admissionsService = new AdmissionsService();
function AdmissionsModule() {
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
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        callListApi();
    }, [filterParams.page, filterParams.limit]);

    const callListApi = () => {
        setIsLoading(true);
        admissionsService.getList({
            queryParams: formatterPayload(filterParams),
            onSuccess: (res: ApiResponsePaging) => {
                setIsLoading(false);
                if (!res.isSuccess || !res.data || !res.data.items) {
                    setDataSource([]);
                    setFilterParams((prev) => ({ ...prev, totalPages: 0, page: 1, limit: 10 }));
                    return;
                }
                const data = res.data.items?.map((item) => ({
                    ...item,
                    createdAt: TimezoneUtil.formatCurrentTimezone(item.createdAt, FormatDate.CLIENT_DATE_TIME),
                    updatedAt: TimezoneUtil.formatCurrentTimezone(item.updatedAt, FormatDate.CLIENT_DATE_TIME),
                }));
                setTotalItems(res.data.totalItems);
                setFilterParams((prev) => ({
                    ...prev,
                    page: res.data.page,
                    limit: res.data.limit,
                    totalPages: res.data.totalPages,
                }));
                setDataSource(data);
            },
            onError: (err: any) => {
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

    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmitSearch();
        }
    };

    const onApproveAdmissions = () => {
        callUpgradeToStudentApi();
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
                    <Tooltip title="Xóa">
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const callUpgradeToStudentApi = () => {
        Modal.confirm({
            title: 'Bạn có muốn chấp nhận yêu cầu tuyển sinh này không?',
            icon: <ExclamationCircleFilled />,
            content: '',
            onOk() {
                admissionsService.upgradeToStudent({
                    payload: {
                        admissionIds: selectedRowKeys,
                    },
                    onSuccess: (res: ApiResponse) => {
                        if (!res.isSuccess) {
                            message.error(res.message);
                            return;
                        }
                        callListApi();
                        message.success('Chấp nhận yêu cầu tuyển sinh thành công');
                    },
                    onError: (err: any) => {
                        message.error('Lỗi khi chấp nhận yêu cầu tuyển sinh');
                        console.log('err', err);
                    },
                });
            },
        });
    };

    const { confirm } = Modal;

    const showConfirm = (id: string) => {
        confirm({
            title: 'Bạn có muốn xóa yêu cầu tuyển sinh này không?',
            icon: <ExclamationCircleFilled />,
            content: '',
            onOk() {
                admissionsService.delete({
                    slug: id,
                    onSuccess: (res: ApiResponse) => {
                        if (!res.isSuccess) {
                            message.error(res.message);
                            return;
                        }
                        callListApi();
                        message.success('Xóa yêu cầu tuyển sinh thành công');
                    },
                    onError: (err: any) => {
                        message.error('Lỗi khi xóa yêu cầu tuyển sinh');
                        console.log('err', err);
                    },
                });
            },
            onCancel() {
                console.log('Huỷ');
            },
        });
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
        },
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
                    <Button
                        type="primary"
                        disabled={selectedRowKeys.length === 0}
                        style={{ marginLeft: 'auto' }}
                        onClick={onApproveAdmissions}
                    >
                        Chấp nhận
                    </Button>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    {selectedRowKeys.length > 0 ? `Đã chọn ${selectedRowKeys.length} items` : null}
                </div>
                <Table
                    rowSelection={rowSelection}
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

export default AdmissionsModule;
