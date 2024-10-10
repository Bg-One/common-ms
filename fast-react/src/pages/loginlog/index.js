import {Button, DatePicker, Form, Input, message, Select, Space, Table} from "antd";
import {ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {cleanLoginLogApi, listSysLogininforApi, removeLoginLogByGuidsApi} from "../../common/api/sys/log-api";
import './index.scss'
import {loginStatusEnum} from "../../common/enmus/login-status-enum";

const LoginLog = () => {
    let [searchForm] = useForm();
    const [loginData, setLoginData] = useState([])
    const [selectLogGuids, setSelectLogGuids] = useState([])
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    })

    useEffect(() => {
        listSysLogininfor({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
    }, [])

    //获取系统登录日志
    const listSysLogininfor = (values) => {
        listSysLogininforApi({...values}).then(res => {
                setLoginData(res.data.list)
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
        listSysLogininfor({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ipaddr: values.ipaddr,
            userName: values.userName,
            status: values.status,
            startTime: loginTime ? loginTime[0].format('YYYY-MM-DD') : '',
            endTime: loginTime ? loginTime[1].format('YYYY-MM-DD') : ''
        })
    }
    //清空
    const cleanLog = () => {
        cleanLoginLogApi().then(res => {
            listSysLogininfor({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
            })
            message.success('清空成功')
        })
    }
    //删除日志
    const removeLog = () => {
        removeLoginLogByGuidsApi({guids: selectLogGuids.join(",")}).then(res => {
            listSysLogininfor({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
            })
            message.success('删除成功')
        })
    }


    return <div id={'login-log'}>
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 7,
                }}
                onFinish={onSearch}
                autoComplete="off"
            > <Form.Item
                label="登录Ip"
                name="ipaddr"
            >
                <Input/>
            </Form.Item>
                <Form.Item
                    label="用户名称"
                    name="userName"
                >
                    <Input/>
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
                    label="登陆时间"
                    name="loginTime"
                >
                    <DatePicker.RangePicker/>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 10,
                        offset: 10,
                    }}>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                            查询
                        </Button>
                        <Button htmlType="button" icon={<ReloadOutlined/>} onClick={() => {
                            searchForm.resetFields()
                            listSysLogininfor({})
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
                    dataIndex: 'userName',
                },
                {
                    title: '用户IP',
                    dataIndex: 'ipaddr',
                }, {
                    title: '用户地址',
                    dataIndex: 'loginLocation',
                }, {
                    title: '浏览器',
                    dataIndex: 'browser',
                }, {
                    title: '系统',
                    dataIndex: 'os',
                }, {
                    title: '登陆状态',
                    dataIndex: 'status',
                    render: (text, record) => {
                        return <>{loginStatusEnum.getName(record.status)}</>
                    }
                }, {
                    title: '登录信息',
                    dataIndex: 'msg',
                }, {
                    title: '登陆时间',
                    dataIndex: 'loginTime',
                },
            ]}
            dataSource={loginData}
            rowKey={record => record.infoGuid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listSysLogininfor({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />
    </div>
}
export default LoginLog
