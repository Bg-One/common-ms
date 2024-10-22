import React, {useEffect, useState} from "react";

import {Input, Select, Table, Button, message, Checkbox, Modal, Tabs, Form, Space} from 'antd';
// import parse from 'html-react-parser';

import './index.scss'
import {auto} from "html-webpack-plugin/lib/chunksorter";
import {listDemandConfirmDetailApi, updateDemandConfirmDetailApi} from "../../common/api/producems/demand";
import {useSearchParams} from "react-router-dom";
import {SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {checChanges, deepCopy, handleSave} from "../../utils/table";
import DemandEventstreamModal from "../../content/soft-check-detail/demand-eventstream-modal";

const {TextArea} = Input;


const ConfirmDetail = () => {
    const [searchForm] = Form.useForm()
    const [demandConfirmList, setDemandConfirmList] = useState([])
    const [originalDemandConfirmList, setOriginalDemandConfirmList] = useState([]); // 原始数据副本
    const [changedDemandConfirmList, setChangedDemandConfirmList] = useState([]); // 原始数据副本

    const [eventStreamModalInfo, setEventStreamModalInfo] = useState({
        open: false,
        eventStream: ''
    })
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    })
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
        listDemandConfirmDetail({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            severity: '100',
            demandConfirmedState: 100
        })
    }, [])

// 监视数据变化
    useEffect(() => {
        setChangedDemandConfirmList(checChanges(originalDemandConfirmList, demandConfirmList, 'guid').changeArr)
        // 你可以在这里添加其他逻辑，比如发送数据到服务器等
    }, [demandConfirmList]); // 注意这里的依赖数组 [data]
    //获取需求确认详情列表
    const listDemandConfirmDetail = (values) => {
        listDemandConfirmDetailApi({...values, demandGuid: searchParams.get('demandGuid')}).then((res) => {
            setDemandConfirmList(deepCopy(res.data.list))
            setOriginalDemandConfirmList(deepCopy(res.data.list))
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
        })

    }

    //更新需求确认详情
    const updateDemandConfirmDetail = () => {
        updateDemandConfirmDetailApi({
                demandConfirmList: JSON.stringify(changedDemandConfirmList),
                demandGuid: searchParams.get('demandGuid'),
                produceGuid: searchParams.get('produceGuid')
            }
        ).then(res => {
            listDemandConfirmDetail({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                ...searchForm.getFieldsValue()
            })
            message.success('保存成功', 1)
        })
    }

    const onSearch = (values) => {
        listDemandConfirmDetail({
            currentPage: 1,
            pageSize: 10,
            severity: values.severity,
            demandConfirmedState: values.demandConfirmedState
        })
    }
    return <div id="home-demand-confirm">
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{span: 7,}}
                initialValues={{
                    demandConfirmedState: 100,
                    severity: '100'
                }}
                onFinish={onSearch}
                autoComplete="off"
            >
                <Form.Item
                    label="确认状态"
                    name="demandConfirmedState"
                    style={{width: '20vw'}}
                >
                    <Select
                        placeholder={'请选择确认状态'}
                        mode="multiple"
                        options={[
                            {
                                value: 100,
                                label: '全部',
                            }, {
                                value: 1,
                                label: '待确认'
                            }, {
                                value: 2,
                                label: '已确认'
                            }, {
                                value: 3,
                                label: '未通过'
                            }, {
                                value: 5,
                                label: '开发未完成'
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="严重程度"
                    name="severity"
                    style={{width: '13vw'}}
                >
                    <Select
                        placeholder={'请选择严重程度'}
                        options={[
                            {
                                value: '100',
                                label: '全部',
                            }, {
                                value: '严重',
                                label: '严重'
                            }, {
                                value: '一般',
                                label: '一般'
                            }
                        ]}
                    />
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
                        <Button type={'primary'} icon={<SaveOutlined/>}
                                onClick={updateDemandConfirmDetail}>保存</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
        <Table
            dataSource={demandConfirmList}
            columns={[{
                title: '序号',
                width: '1vw',
                render: (text, record, index) => {
                    return <div>
                        {index + 1}
                    </div>
                }
            }, {
                title: '需求名称',
                width: '6vw',
                dataIndex: 'nodeName',
                key: 'nodeName',
                render: (text, record, index) => {
                    return <div>
                        {record.nodes.name}
                    </div>
                }
            },
                {
                    title: '确认状态',
                    width: '4vw',
                    dataIndex: 'confirmedState',
                    key: 'confirmedState',
                    render: (text, record, index) => {
                        return <Select
                            style={{width: '100%'}}
                            value={record.demandConfiemedState}
                            onChange={(v) => {
                                handleSave(index, 'demandConfiemedState', v, demandConfirmList, setDemandConfirmList)
                            }}
                            options={[
                                {
                                    value: 1,
                                    label: '待确认',
                                }, {
                                    value: 2,
                                    label: '已确认'
                                }, {
                                    value: 3,
                                    label: '未通过'
                                }, {
                                    value: 5,
                                    label: '开发未完成'
                                }
                            ]}
                        />
                    }
                }, {
                    title: '问题和说明',
                    width: '20vw',
                    dataIndex: 'questionAndNotes',
                    key: 'questionAndNotes',
                    render: (text, record, index) => {
                        return <div>
                            <TextArea
                                autoSize={{minRows: 1, maxRows: 6}}
                                value={record.questionAndNotes}
                                onChange={(e) => {
                                    handleSave(index, 'questionAndNotes', e.target.value, demandConfirmList, setDemandConfirmList)
                                }}
                            />
                        </div>
                    }
                }, {
                    title: '严重程度',
                    width: '4vw',
                    dataIndex: 'severity',
                    key: 'severity',
                    render: (text, record, index) => {
                        return <Select
                            style={{width: '100%'}}
                            value={record.severity}
                            onChange={(v) => {
                                handleSave(index, 'severity', v, demandConfirmList, setDemandConfirmList)
                            }}
                            options={[
                                {
                                    value: '严重',
                                    label: '严重',
                                }, {
                                    value: '一般',
                                    label: '一般'
                                }
                            ]}
                        />
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: '3vw',
                    render: (text, record, index) => {
                        return <Button type={'link'} onClick={() => {
                            setEventStreamModalInfo({eventStream: record.eventStream, open: true})
                        }}>查看需求</Button>
                    }
                }]}
            rowKey={record => record.guid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                current: pageInfo.currentPage,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listDemandConfirmDetail({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />
        {/*需求事件流弹窗*/}
        <DemandEventstreamModal eventStreamModalInfo={eventStreamModalInfo}
                                setEventStreamModalInfo={setEventStreamModalInfo}/>
    </div>

}

export default ConfirmDetail
