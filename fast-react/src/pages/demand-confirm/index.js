import React, {useEffect, useState} from "react";
import {Input, able, Button, message, Form, Space, Table} from 'antd';
import './index.scss'
import {AppstoreAddOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {hasPermi} from "../../utils/permi";
import {countDemandConfirmApi} from "../../common/api/producems/demand";


const RequireConfirm = () => {
    const [searchForm] = Form.useForm()
    const [demandConfirmList, setDemandConfirmList] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    })

    useEffect(() => {
        countDemandConfirm({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
    }, [])
    //获取
    const countDemandConfirm = (values) => {
        countDemandConfirmApi({...values}).then(res => {
            setDemandConfirmList(res.data.list)
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
        })
    }

    const onSearch = (values) => {
        countDemandConfirm({
            currentPage: 1,
            pageSize: 10,
            ...values
        })
    }

    return <div id="home-demand-confirm">
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
                label="产品名称"
                name="name"
            >
                <Input/>
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
                    </Space>
                </Form.Item>
            </Form>
        </div>


        <Table
            dataSource={demandConfirmList}
            columns={[{
                title: '序号',
                width: '3vw',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            }, {
                title: '产品名称',
                width: '16vw',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '总需求数量',
                width: '6vw',
                dataIndex: 'demandCount',
                key: 'demandCount',
                render: (text, record, index) => {
                    return <div className="demandCount">{record.demandConfirmCountVo.demandCount}</div>
                }
            }, {
                title: '开发已完成数量',
                width: '6vw',
                dataIndex: 'devFinishedCount',
                key: 'devFinishedCount',
                render: (text, record, index) => {
                    return <div className="devFinishedCount">{record.demandConfirmCountVo.devFinishedCount}</div>
                }
            }, {
                title: '待确认数量',
                width: '6vw',
                dataIndex: 'waitConfirmCount',
                key: 'waitConfirmCount',
                render: (text, record, index) => {
                    return <div className="waitConfirmCount">{record.demandConfirmCountVo.waitConfirmCount}</div>
                }
            }, {
                title: '已确认数量',
                width: '6vw',
                dataIndex: 'confirmedCount',
                key: 'confirmedCount',
                render: (text, record, index) => {
                    return <div className="confirmedCount">{record.demandConfirmCountVo.confirmedCount}</div>
                }
            }, {
                title: '未通过数量',
                width: '6vw',
                dataIndex: 'noPassCount',
                key: 'noPassCount',
                render: (text, record, index) => {
                    return <div className="noPassCount">{record.demandConfirmCountVo.noPassCount}</div>
                }
            }, {
                title: '操作',
                key: 'action',
                width: '10vw',
                render: (text, record, index) => {
                    return <div className='actionlist'>
                    <span style={{marginRight: '1vw', color: '#1D79FC', cursor: 'pointer'}}
                          onClick={() => {
                              this.props.history.push('/home/confirm-detail' + '?produceName=' + record.produceName + '&demandGuid=' + record.demandGuid)
                          }}>查看</span>
                    </div>
                }
            }]}
            rowKey={record => record.projectGuid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                current: pageInfo.currentPage,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    countDemandConfirm({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />
    </div>

}

export default RequireConfirm
