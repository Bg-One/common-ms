import React, {useEffect, useState} from "react";

import {Button, Form, Input, message, Modal, Select, Space, Table} from 'antd';
import pinyinUtil from '../../common/react-pinyin-master/pinyinUtil'

import './index.scss'
import {countDemandTraceByProduceApi, relatedProduceApi} from "../../common/api/producems/demand";
import {listNotBindDemandTraceProduceListApi} from "../../common/api/producems/produce";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {hasRoleOr} from "../../utils/permi";


const DemandTrace = () => {
    const navigate = useNavigate();
    let userInfo = useSelector(state => state.user.userInfo);
    const [searchForm] = Form.useForm()
    const [demandTraceList, setDemandTraceList] = useState([])
    const [produceList, setProduceList] = useState([])
    const [relatedVisiBleFlag, setRelatedVisiBleFlag] = useState(false)
    const [relateProduceGuid, setRelateProduceGuid] = useState('')
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1, pageSize: 10, total: 0, totalPages: 0
    })
    useEffect(() => {
        countDemandTraceByProduce({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
        listNoBindProduceDemandTrace()
    }, [])


    /**
     * 获取产品
     * @returns {Promise<void>}
     */
    const listNoBindProduceDemandTrace = async () => {
        let res = await listNotBindDemandTraceProduceListApi()
        setProduceList(res.data)
    }

    //获取软件测试统计列表
    const countDemandTraceByProduce = (values) => {
        countDemandTraceByProduceApi({...values}).then((res) => {
            setDemandTraceList(res.data.list)
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
        })
    }
    const onSearch = (values) => {
        countDemandTraceByProduce({
            currentPage: 1,
            pageSize: 10,
            ...values
        })
    }

    //关联产品
    const relatedProduce = async () => {
        await relatedProduceApi({produceGuid: relateProduceGuid})
        setRelatedVisiBleFlag(false)
        setRelateProduceGuid('')
        countDemandTraceByProduce({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
        listNoBindProduceDemandTrace()
    }
    //获取详情
    const getDetail = (record) => {
        navigate('/home/demand-trace-detail' + '?produceGuid=' + record.produceGuid)
    }
    return <div id="home-require-trace">
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
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
                <Input placeholder="请输入产品名称"/>
            </Form.Item>
                <Form.Item
                    wrapperCol={{span: 10, offset: 10,}}>
                    <Space>
                        <Button type={'primary'} htmlType={'submit'}>搜索</Button>
                        <Button type={'primary'} disabled={!hasRoleOr(userInfo, ['pro:dept:user', 'pro:dept:manager'])}
                                onClick={() => {
                                    setRelatedVisiBleFlag(true)
                                }}>关联产品</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>

        <Table
            dataSource={demandTraceList}
            columns={[{
                title: '序号',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            }, {
                title: '产品名称',
                dataIndex: 'produceName',
                key: 'produceName'
            },
                {
                    title: '总数量',
                    dataIndex: 'totalCount',
                    key: 'totalCount',
                    render: (text, record, index) => {
                        return <div className="totalCount">{record.demandTraceCountVo.totalCount}</div>
                    }
                }, {
                    title: '待确认',
                    dataIndex: 'waitConfirmCount',
                    key: 'waitConfirmCount',
                    render: (text, record, index) => {
                        return <div className="waitConfirmCount">
                            {record.demandTraceCountVo.waitConfirmCount}
                        </div>
                    }
                }, {
                    title: '待编制',
                    dataIndex: 'waitEditCount',
                    key: 'waitEditCount',
                    render: (text, record, index) => {
                        return <div className="waitEditCount">
                            {record.demandTraceCountVo.waitEditCount}
                        </div>
                    }
                }, {
                    title: '待评审',
                    dataIndex: 'waitReviewCount',
                    key: 'waitReviewCount',
                    render: (text, record, index) => {
                        return <div className="waitReviewCount">
                            {record.demandTraceCountVo.waitReviewCount}
                        </div>
                    }
                }, {
                    title: '开发待确认',
                    dataIndex: 'waitDevelopConfirmCount',
                    key: 'waitDevelopConfirmCount',
                    render: (text, record, index) => {
                        return <div className="waitDevelopConfirmCount">
                            {record.demandTraceCountVo.waitDevelopConfirmCount}
                        </div>
                    }
                }, {
                    title: '开发待完成',
                    dataIndex: 'waitDevelopFinishCount',
                    key: 'waitDevelopFinishCount',
                    render: (text, record, index) => {
                        return <div className="waitDevelopFinishCount">
                            {record.demandTraceCountVo.waitDevelopFinishCount}
                        </div>
                    }
                }, {
                    title: '需求待确认',
                    dataIndex: 'waitDemandConfirmCount',
                    key: 'waitDemandConfirmCount',
                    render: (text, record, index) => {
                        return <div className="waitDemandConfirmCount">
                            {record.demandTraceCountVo.waitDemandConfirmCount}
                        </div>
                    }
                }, {
                    title: '待测试',
                    dataIndex: 'waitCheckCount',
                    key: 'waitCheckCount',
                    render: (text, record, index) => {
                        return <div className="waitCheckCount">
                            {record.demandTraceCountVo.waitCheckCount}
                        </div>
                    }
                }, {
                    title: '已完结',
                    dataIndex: 'finishCount',
                    key: 'finishCount',
                    render: (text, record, index) => {
                        return <div className="finishCount">
                            {record.demandTraceCountVo.finishCount}
                        </div>
                    }
                }, {
                    title: '挂起',
                    dataIndex: 'hangCount',
                    key: 'hangCount',
                    render: (text, record, index) => {
                        return <div className="hangCount">
                            {record.demandTraceCountVo.hangCount}
                        </div>
                    }
                }, {
                    title: '暂缓',
                    dataIndex: 'suspendCount',
                    key: 'suspendCount',
                    render: (text, record, index) => {
                        return <div className="suspendCount">
                            {record.demandTraceCountVo.suspendCount}
                        </div>
                    }
                }, {
                    title: '作废',
                    dataIndex: 'voidCount',
                    key: 'voidCount',
                    render: (text, record, index) => {
                        return <div className="voidCount">
                            {record.demandTraceCountVo.voidCount}
                        </div>
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    render: (text, record, index) => {
                        return <Button type={'link'} onClick={(r) => {
                            getDetail(record)
                        }}>查看</Button>
                    }
                }
            ]}
            rowKey={record => record.produceGuid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                current: pageInfo.currentPage,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    countDemandTraceByProduce({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />
        <Modal
            open={relatedVisiBleFlag}
            centered={true}
            closable={true}
            footer={false}
            style={{textAlign: 'center'}}
            onCancel={() => {
                setRelatedVisiBleFlag(false)
            }}
            title={'关联产品'}
        >
            <div className="related">
                <div style={{margin: '1vh 0'}}>
                    <span className="project-name">产品名称:</span>
                    <Select
                        showSearch={true}
                        filterOption={(input, option) => {
                            return pinyinUtil.getFirstLetter(option.title).indexOf(input.toUpperCase()) !== -1 || option.title.indexOf(input.toUpperCase()) !== -1
                        }}
                        value={relateProduceGuid}
                        placeholder="请选择"
                        style={{width: '15vw', marginLeft: '1vw'}}
                        onChange={(v) => {
                            setRelateProduceGuid(v)
                        }}
                        options={
                            produceList.map((item) => {
                                return {
                                    value: item.guid,
                                    label: item.name,
                                }
                            })
                        }
                    />
                </div>
                <Button type={'primary'} onClick={relatedProduce}
                        disabled={!hasRoleOr(userInfo, ['pro:dept:user', 'pro:dept:manager'])}>确认</Button>
            </div>
        </Modal>
    </div>

}

export default DemandTrace
