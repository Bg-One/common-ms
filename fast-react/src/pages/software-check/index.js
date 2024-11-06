import React, {useEffect, useState} from "react";

import {Button, Form, Input, message, Modal, Select, Space, Table} from 'antd';
import pinyinUtil from '../../common/react-pinyin-master/pinyinUtil'
import './index.scss'
import {countCheckFeedbackByProduceApi, relatedProduceApi} from "../../common/api/producems/softcheck";
import {listNotBindSoftwareCheckProduceListApi} from "../../common/api/producems/produce";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {hasRoleOr} from "../../utils/permi";

const SoftwareCheck = () => {
    const navigate = useNavigate();
    let userInfo = useSelector(state => state.user.userInfo);
    const [searchForm] = Form.useForm()
    const [notBindCheckProduceList, setNotBindCheckProduceList] = useState([])
    const [relatedVisiBleFlag, setRelatedVisiBleFlag] = useState(false)
    const [relateProduceGuid, setRelateProduceGuid] = useState('')
    const [countSoftwareCheckList, setCountSoftwareCheckList] = useState([])
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1, pageSize: 10, total: 0, totalPages: 0
    })
    useEffect(() => {
        countCheckFeedbackByProduce({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
        listNotBindCheckProduce()
    }, [])


    /**
     * 获取产品
     * @returns {Promise<void>}
     */
    const listNotBindCheckProduce = () => {
        listNotBindSoftwareCheckProduceListApi().then((res) => {
            setNotBindCheckProduceList(res.data)
        })
    }

    const onSearch = (values) => {
        countCheckFeedbackByProduce({
            currentPage: 1,
            pageSize: 10,
            ...values
        })
    }

    //获取软件测试统计列表
    const countCheckFeedbackByProduce = (values) => {
        countCheckFeedbackByProduceApi({...values}).then(res => {
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
            setCountSoftwareCheckList(res.data.list)

        })
    }

    //关联产品
    const relatedProduce = () => {
        relatedProduceApi({produceGuid: relateProduceGuid}).then(res => {
            setRelatedVisiBleFlag(false)
            setRelateProduceGuid('')
            countCheckFeedbackByProduce({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
            })
            listNotBindCheckProduce()
        })
    }

    //获取详情
    const getDetail = (record) => {
        navigate('/home/software-check-detail' + '?produceGuid=' + record.produceGuid)
    }
    return <div id="home-software-check">
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
                        <Button type={'primary'}
                                disabled={!hasRoleOr(userInfo, ['qa:dept:user', 'qa:dept:manager'])}
                                onClick={() => {
                                    setRelatedVisiBleFlag(true)
                                }}>关联产品</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>

        <Table
            className={'soft-check-table'}
            dataSource={countSoftwareCheckList}
            columns={[
                {
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
                        return <div className="totalCount">{record.checkFeedbackCountVo.totalCount}</div>
                    }
                }, {
                    title: '新增',
                    dataIndex: 'checkWaitConfirmCount',
                    key: 'checkWaitConfirmCount',
                    render: (text, record, index) => {
                        return <div
                            className="checkWaitConfirmCount">{record.checkFeedbackCountVo.checkWaitConfirmCount}</div>
                    }
                }, {
                    title: '开发已完成',
                    dataIndex: 'reopenCount',
                    key: 'reopenCount',
                    render: (text, record, index) => {
                        return <div className="reopenCount">{record.checkFeedbackCountVo.reopenCount}</div>
                    }
                }, {
                    title: '已通过',
                    dataIndex: 'devWaitConfirmCount',
                    key: 'devWaitConfirmCount',
                    render: (text, record, index) => {
                        return <div
                            className="devWaitConfirmCount">{record.checkFeedbackCountVo.devWaitConfirmCount}</div>
                    }
                }, {
                    title: '未通过',
                    dataIndex: 'revisingCount',
                    key: 'revisingCount',
                    render: (text, record, index) => {
                        return <div className="revisingCount">{record.checkFeedbackCountVo.revisingCount}</div>
                    }
                }, {
                    title: '重新打开',
                    dataIndex: 'waitRetestCount',
                    key: 'waitRetestCount',
                    render: (text, record, index) => {
                        return <div className="waitRetestCount">{record.checkFeedbackCountVo.waitRetestCount}</div>
                    }
                }, {
                    title: '挂起',
                    dataIndex: 'noPassedCount',
                    key: 'noPassedCount',
                    render: (text, record, index) => {
                        return <div className="noPassedCount">
                            {record.checkFeedbackCountVo.noPassedCount}
                        </div>
                    }
                }, {
                    title: '已关闭',
                    dataIndex: 'passedCount',
                    key: 'passedCount',
                    render: (text, record, index) => {
                        return <div className="passedCount">{record.checkFeedbackCountVo.passedCount}</div>
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    render: (text, record, index) => {
                        return <Button type={'link'} onClick={() => {
                            getDetail(record)
                        }}>查看</Button>
                    }
                }]}
            rowKey={record => record.produceGuid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                current: pageInfo.currentPage,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    countCheckFeedbackByProduce({
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
                <span className="project-name">产品名称:</span>
                <Select
                    showSearch={true}
                    filterOption={(input, option) => {
                        return pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1
                    }}
                    value={relateProduceGuid === '' ? null : relateProduceGuid}
                    placeholder="请选择"
                    style={{width: '15vw', marginLeft: '1vw'}}
                    onChange={(v) => {
                        setRelateProduceGuid(v)
                    }}
                    options={
                        notBindCheckProduceList.map((item) => {
                            return {
                                value: item.guid,
                                label: item.name,
                            }
                        })
                    }
                />
                <Button type={'primary'} style={{
                    display: "block", margin: '1vh auto'
                }} onClick={() => {
                    relatedProduce()
                }}>确认</Button>
            </div>
        </Modal>
    </div>
}

export default SoftwareCheck
