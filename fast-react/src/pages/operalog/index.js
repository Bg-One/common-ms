import {Button, DatePicker, Descriptions, Form, Input, message, Modal, Select, Space, Table} from "antd";
import {ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {
    cleanOperLogApi, listOperLogApi, removeOperLogByGuidsApi
} from "../../common/api/log-api";
import './index.scss'
import {businessTypeEnum} from "../../common/enmus/business-type-enum";
import {opreStatusEnum} from "../../common/enmus/oper-status-enum";

const OperateLog = () => {
    const [searchForm] = useForm();
    const [operData, setOperData] = useState([])
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [selectLogGuids, setSelectLogGuids] = useState([])
    const [detailContentItems, setDetailContentItems] = useState({})
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    })

    useEffect(() => {
        listOperLogininfor({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
    }, [])

    //获取系统登录日志
    const listOperLogininfor = (values) => {
        listOperLogApi({...values}).then(res => {
                setOperData(res.data.list)
                setPageInfo({
                    currentPage: res.data.currentPage,
                    pageSize: res.data.pageSize,
                    total: res.data.total,
                    totalPages: res.data.totalPages
                })
            }
        )
    }
    //查询
    const onSearch = (values) => {
        let loginTime = values.loginTime;
        listOperLogininfor({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            operLocation: values.operLocation,
            operIp: values.operIp,
            operName: values.operName,
            status: values.status,
            businessType: values.businessType,
            startTime: loginTime ? loginTime[0].format('YYYY-MM-DD') : '',
            endTime: loginTime ? loginTime[1].format('YYYY-MM-DD') : ''
        })
    }
    //清空
    const cleanLog = () => {
        cleanOperLogApi().then(res => {
            listOperLogininfor({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
            })
            message.success('清空成功')
        })
    }
    //删除日志
    const removeLog = () => {
        removeOperLogByGuidsApi({operGuids: selectLogGuids.join(",")}).then(res => {
            listOperLogininfor({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
            })
            message.success('删除成功')
        })
    }
    //设置详情
    const setDetail = (record) => {
        //遍历对象的key
        let detailContentItems = [
            {
                key: '1',
                label: '操作模块',
                children: record.title,
            },
            {
                key: '2',
                label: '请求地址',
                children: record.operUrl,
            },
            {
                key: '3',
                label: '登录信息',
                children: record.operName + "/" + record.operIp + "/" + record.operLocation,
            },
            {
                key: '4',
                label: '操作方法',
                children: record.method,
            },
            {
                key: '5',
                label: '请求参数',
                children: record.operParam,
            },
            {
                key: '6',
                label: '响应应参数',
                children: record.operParam,
            },
            {
                key: '7',
                label: '异常信息',
                children: record.errorMsg,
            },
            {
                key: '8',
                label: '状态',
                children: opreStatusEnum.getName(record.status),
            },
            {
                key: '9',
                label: '操作时间',
                children: record.operTime,
            },
            {
                key: '10',
                label: '耗时',
                children: record.costTime + 'ms',
            }]

        setDetailContentItems(detailContentItems)
        setDetailModalOpen(true)
    }

    return <div id={'operate-log'}>
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                onFinish={onSearch}
                autoComplete="off"
            >
                <Form.Item
                    label="操作ip"
                    name="operIp"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="操作人员"
                    name="operName"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="操作类型"
                    name="businessType"
                >
                    <Select
                        options={[
                            {
                                value: '0',
                                label: '其它',
                            },
                            {
                                value: '1',
                                label: '新增',
                            },
                            {
                                value: '2',
                                label: '修改',
                            },
                            {
                                value: '3',
                                label: '删除',
                            }, {
                                value: '4',
                                label: '授权',
                            },
                            {
                                value: '5',
                                label: '导出',
                            }, {
                                value: '6',
                                label: '导入',
                            }, {
                                value: '7',
                                label: '清空数据',
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status"
                >
                    <Select
                        options={[
                            {
                                value: '1',
                                label: '成功',
                            },
                            {
                                value: '0',
                                label: '失败',
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="操作时间"
                    name="loginTime"
                >
                    <DatePicker.RangePicker/>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                            查询
                        </Button>
                        <Button htmlType="button" icon={<ReloadOutlined/>} onClick={() => {
                            searchForm.resetFields()
                            listOperLogininfor({})
                        }}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
        <div className={'btn-area'}>
            <Button type={'primary'} onClick={removeLog}>删除</Button>
            <Button type={'primary'} onClick={cleanLog}>清空</Button>
            <Button type={'primary'}>导出</Button>
        </div>
        <Table
            rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                    setSelectLogGuids(selectedRowKeys)
                },
            }}
            columns={[
                {
                    title: '序号',
                    render: (text, record, index) => {
                        return index + 1
                    },
                },
                {
                    title: '用户名',
                    dataIndex: 'operName',
                },
                {
                    title: '用户IP',
                    dataIndex: 'operIp',
                }, {
                    title: '用户地址',
                    dataIndex: 'operLocation',
                }, {
                    title: '系统模块',
                    dataIndex: 'title',
                }, {
                    title: '操作类型',
                    dataIndex: 'businessType',
                    render: (text, record) => {
                        return <>{businessTypeEnum.getName(record.businessType)}</>
                    }
                }, {
                    title: '操作状态',
                    dataIndex: 'status',
                    render: (text, record) => {
                        return <>{opreStatusEnum.getName(record.status)}</>
                    }
                }, {
                    title: '操作时间',
                    dataIndex: 'operTime',
                }, {
                    title: '消耗时间(ms)',
                    dataIndex: 'costTime',
                }, {
                    title: '操作',
                    render: (text, record) => {
                        return <Button type={'link'} onClick={() => {
                            setDetail(record)
                        }}>查看详情</Button>
                    }
                }
            ]}
            dataSource={operData}
            rowKey={record => record.operGuid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listOperLogininfor({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />
        <Modal
            title="详情"
            className={'oper-log-modal'}
            open={detailModalOpen}
            footer={false}
            onCancel={() => {
                setDetailModalOpen(false)
            }}
        >
            <Descriptions items={detailContentItems}/>
        </Modal>
    </div>
}
export default OperateLog
