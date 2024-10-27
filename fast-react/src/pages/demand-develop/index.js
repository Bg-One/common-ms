import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tabs, Tree} from 'antd';
import pinyinUtil from '../../common/react-pinyin-master/pinyinUtil'
import './index.scss'
import {
    addDemandApi, countDemandApi,
    deleteDemandApi,
    listDemandApi,
    listDemandChangeRecordApi,
    statusTransferApi, updateDemandApi
} from "../../common/api/producems/demand";
import {listNoDemandProduceApi} from "../../common/api/producems/produce";
import {documentStatusEnum} from "../../common/enmus/document-status-enum";
import {componentMap} from "../../common/config/menu-config";
import {addTab} from "../../redux/tab/tab-slice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const {TextArea} = Input;

const DemandDevelop = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchForm] = Form.useForm()
    const [demandList, setDemandList] = useState([])
    const [produceList, setProduceList] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [demandCountObj, setDemandCountObj] = useState({
        allCount: 0,
        editCount: 0,
        previewCount: 0,
        finalCount: 0,
    })
    const [addModalVisible, setAddModalVisible] = useState(false)
    const [reviewCommentsModalInfo, setReviewCommentsModalInfo] = useState({
        open: false,
        reviewComments: '',
        demandGuid: '',
        produceName: ''
    })
    const [demandChangeRecordModalObj, setDemandChangeRecordModalObj] = useState({
        open: false,
        demandChangeRecordList: []
    })
    const [selectProduceGuid, setSelectProduceGuid] = useState('')
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    })
    const [documentStatus, setDocumentStatus] = useState(100)
    useEffect(() => {
        listDemand({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue()
        })
        countStatusDemand()
    }, [])

    useEffect(() => {
        listDemand({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue(),
            staus: documentStatus
        })
    }, [documentStatus])

    const countStatusDemand = async () => {
        let res = await countDemandApi()
        setDemandCountObj({
            allCount: res.data.allCount,
            editCount: res.data.editCount,
            previewCount: res.data.previewCount,
            finalCount: res.data.finalCount
        })
    }
    //获取需求列表
    const listDemand = async (values) => {
        let res = await listDemandApi({...values})
        setDemandList(res.data.list)
        setPageInfo({
            currentPage: res.data.currentPage,
            pageSize: res.data.pageSize,
            total: res.data.total,
            totalPages: res.data.totalPages
        })
    }
    const onSearch = () => {
        listDemand({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue(),
            staus: documentStatus
        })
    }

    const listNoDemandProduce = async () => {
        let res = await listNoDemandProduceApi()
        setProduceList(res.data)
        setAddModalVisible(true)
    }

    //编辑评审意见
    const editDamand = async () => {
        await updateDemandApi({
            guid: reviewCommentsModalInfo.demandGuid,
            reviewComments: reviewCommentsModalInfo.reviewComments
        })
        listDemand({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue(),
            staus: documentStatus
        })
        message.success('保存成功', 1)
    }
    //新增需求确定
    const addHandleSure = async (e) => {
        if (!selectProduceGuid) {
            message.error('请选择产品!')
            return
        }
        await addDemandApi({produceGuid: selectProduceGuid})
        setAddModalVisible(false)
        this.props.history.push('/home/demand-edit' + '?guid=' + this.state.demandGuid + '&edit=true')

    }

    //查看
    const getDetail = (record) => {
        navigate('/home/demand-edit' + '?produceGuid=' + record.produceGuid + "&demandGuid=" + record.guid)
        setTimeout(() => {
            const Component = componentMap.DemandEdit;
            dispatch(addTab({
                label: `${record.produceName}需求详情`,
                children: <React.Suspense fallback={<div>Loading...</div>}>
                    <Component/>
                </React.Suspense>
                ,
                key: '/home/demand-edit' + '?produceGuid=' + record.produceGuid + "&demandGuid=" + record.guid,
            }))
        }, 200)
    }

    //删除所选的需求规格
    const deleteDemand = async () => {
        if (selectedRowKeys.length === 0) {
            message.error("请选择需要删除的产品需求！", 1)
            return
        }
        await deleteDemandApi({
            guids: selectedRowKeys,
        })
        listDemand({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue(),
            staus: documentStatus
        })
        countStatusDemand()
        setSelectedRowKeys([])
        message.success('删除成功', 1)
    }

    //需求流转
    const statusTransfer = async (staus, guid) => {
        await statusTransferApi({
            guids: guid ? guid : selectedRowKeys.join(","), staus,
        })
        setSelectedRowKeys([])
        listDemand({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue(),
            staus: documentStatus
        })
        countStatusDemand()
        message.success('保存成功', 1)
    }
    //获取变更记录
    const listDemandChangeRecord = async () => {
        if (selectedRowKeys.length > 1) {
            message.error("请选择单条记录")
        }
        await listDemandChangeRecordApi({
            demandGuid: selectedRowKeys[0]
        })
        setDemandChangeRecordModalObj({
            open: true,
            demandChangeRecordList: data.data
        })
    }

    // //导出需求规格书
    // const exportDemandDoc = () => {
    //     http.post('common/exportDemandDoc', {
    //         produceGuid: this.state.selectDemandObj.produceGuid,
    //         name: this.state.selectDemandObj.produceManage.name
    //     }).then(data => {
    //         let arr = [{
    //             fileName: this.state.selectDemandObj.produceManage.name + '需求规格书.doc',
    //             data: {
    //                 html: data,
    //                 style: ''
    //             },
    //             dataType: 'html',
    //             outType: 'doc'
    //         }]
    //         createDownLoadFile(arr)
    //     })
    // }


    //需求列表列
    let columns = [
        {
            title: '',
            width: '3vw',
        }, {
            title: '序号',
            width: '3vw',
            render: (text, record, index) => {
                return <div>
                    {index + 1}
                </div>
            }
        }, {
            title: '产品名称',
            width: '25vw',
            dataIndex: 'produceName',
            key: 'produceName'
        },
        {
            title: '需求状态',
            width: '10vw',
            render: (text, record, index) => {
                return record.staus === documentStatusEnum.EDIT ? '编制' : record.staus === documentStatusEnum.REVIEW ? '待评审' : '定版'
            }
        }, {
            title: '产品负责人',
            width: '10vw',
            dataIndex: 'produceManagerName',
            key: 'produceManagerName'
        }, {
            title: '需求负责人',
            width: '10vw',

        }, {
            title: '创建时间',
            width: '10vw',
            dataIndex: 'createTime',
            key: 'createTime'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => {
                return <div className='actionlist'>
                    <Button type={'link'} onClick={() => getDetail(record)}>查看</Button>
                    <Button style={{display: record.staus !== 3 ? 'block' : 'none'}} type="link">编辑</Button>
                    <Popconfirm
                        title={`您确认送审吗？`}
                        onConfirm={(e) => statusTransfer(documentStatusEnum.REVIEW, record.guid)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button style={{display: record.staus === 1 ? 'block' : 'none'}}
                                type={'link'}>送审</Button>
                    </Popconfirm>
                    <Button type={'link'}
                            style={{display: record.staus === 3 ? 'block' : 'none'}}>需求变更</Button>
                    <Button type={'link'} style={{display: record.staus === 2 ? 'block' : 'none'}}
                            onClick={() => {
                                setReviewCommentsModalInfo({
                                    open: true,
                                    demandGuid: record.guid,
                                    reviewComments: record.reviewComments,
                                    produceName: record.produceName
                                })
                            }}>评审意见</Button>
                    <Popconfirm
                        title={`您确认撤回吗？`}
                        onConfirm={(e) => statusTransfer(documentStatusEnum.EDIT, record.guid)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button
                            style={{display: record.staus === 2 ? 'block' : 'none'}}
                            type={'link'}>撤回</Button>
                    </Popconfirm>
                </div>
            }
        }]


    return <div id="home-demand-develop">
        <Tabs items={[{
            label: `全部(${demandCountObj.allCount})`, key: documentStatusEnum.ALL
        }, {
            label: `编制(${demandCountObj.editCount})`, key: documentStatusEnum.EDIT
        }, {
            label: `待评审(${demandCountObj.previewCount})`, key: documentStatusEnum.REVIEW,
        }, {
            label: `定版(${demandCountObj.finalCount})`, key: documentStatusEnum.FINISH
        }
        ]} onChange={(v) => {
            setDocumentStatus(v)
        }}/>
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 7,
                }}
                initialValues={{staus: 100}}
                onFinish={onSearch}
                autoComplete="off"
            >
                <Form.Item
                    label="产品名称"
                    name="name"
                >
                    <Input placeholder="请输入产品名称"/>
                </Form.Item>
                <Form.Item
                    style={{width: '13vw'}}
                    name={'staus'}
                    label={'需求状态'}
                >
                    <Select
                        style={{width: '5vw'}}
                        placeholder="请选择需求状态"
                        options={[
                            {
                                value: documentStatusEnum.ALL,
                                label: '全部',
                            }, {
                                value: documentStatusEnum.EDIT,
                                label: '编制'
                            }, {
                                value: documentStatusEnum.REVIEW,
                                label: '待评审'
                            }, {
                                value: documentStatusEnum.FINISH,
                                label: '定版'
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    wrapperCol={{span: 10, offset: 10,}}>
                    <Space>
                        <Button type={'primary'}
                                htmlType={"submit"}
                                style={{display: documentStatus === documentStatusEnum.ALL ? 'block' : 'none'}}
                        >搜索</Button>
                        <Button type={'primary'} onClick={listNoDemandProduce}>新增</Button>
                        <Button type={'primary'}>导出</Button>
                        <Popconfirm
                            title={`您确认删除吗？`}
                            onConfirm={deleteDemand}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button
                                style={{display: documentStatus === documentStatusEnum.ALL || documentStatus === documentStatusEnum.EDIT ? 'block' : 'none'}}
                            >删除</Button>
                        </Popconfirm>
                        <Popconfirm
                            title={`您确认定版吗？`}
                            onConfirm={(e) => {
                                if (selectedRowKeys.length === 0) {
                                    message.error('请选择定版产品', 1)
                                    return
                                }
                                statusTransfer(documentStatusEnum.FINISH)
                            }}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button
                                style={{display: documentStatus === documentStatusEnum.REVIEW ? 'block' : 'none'}}
                                type={'primary'}>定版</Button>
                        </Popconfirm>
                        <Button type={'primary'}
                                style={{display: documentStatus === documentStatusEnum.FINISH ? 'block' : 'none'}}
                                onClick={listDemandChangeRecord}>变更记录</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>

        <Table
            rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedRowKeys(selectedRowKeys)
                },

            }}
            dataSource={demandList}
            columns={columns}
            rowKey={record => record.guid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                current: pageInfo.currentPage,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listDemand({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue(),
                        staus: documentStatus
                    })
                }
            }}
        />
        {/* 新增产品弹窗 */}
        <Modal
            open={addModalVisible}
            centered={true}
            closable={true}
            footer={false}
            title={false}
            onCancel={() => setAddModalVisible(false)}
        >
            <div className="add-project">
                <div className="project-name">
                    <span>产品名称:</span>
                    <Select
                        showSearch={true}
                        filterOption={(input, option) => {
                            return pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1
                        }}
                        value={selectProduceGuid}
                        placeholder="请选择"
                        style={{width: '21vw', marginLeft: '1vw'}}
                        onChange={(v) =>
                            setSelectProduceGuid(v)
                        }
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
                <Button type={'primary'} onClick={(e) => {
                    addHandleSure(e)
                }}>确定</Button>
            </div>
        </Modal>

        {/* 查看需求变更记录弹窗 */}
        <Modal
            className="demand-change-modal"
            open={demandChangeRecordModalObj.open}
            centered={true}
            closable={true}
            footer={false}
            title={false}
            onCancel={() => setDemandChangeRecordModalObj({...demandChangeRecordModalObj, open: false})}
        >
            <span style={{fontSize: '1.5vw'}}>{demandChangeRecordModalObj.produceName}产品变更记录</span>
            <Table
                dataSource={demandChangeRecordModalObj.demandChangeRecordList}
                rowKey={record => record.guid}
                columns={[
                    {
                        title: '序号',
                        width: '3vw',
                        render: (text, record, index) => {
                            return <div>
                                {index + 1}
                            </div>
                        }
                    }, {
                        title: '变更需求',
                        width: '15vw',
                        dataIndex: 'nodeName',
                        key: 'nodeName'
                    },
                    {
                        title: '变更人',
                        width: '15vw',
                        dataIndex: 'changeName',
                        key: 'changeName'
                    }, {
                        title: '变更时间',
                        width: '15vw',
                        dataIndex: 'changeTime',
                        key: 'changeTime'
                    }
                ]}
            />
            <Button type={'primary'} onClick={() => setReviewCommentsModalInfo({
                ...demandChangeRecordModalObj,
                open: false
            })}>关闭</Button>
        </Modal>

        <Modal
            className="demand-change-modal"
            open={reviewCommentsModalInfo.open}
            centered={true}
            closable={true}
            footer={false}
            title={false}
            onCancel={() => setReviewCommentsModalInfo({
                ...reviewCommentsModalInfo, open: false
            })}
        >
                    <span style={{fontSize: '1.5vw'}}>
                    评审结论
                    </span>
            <TextArea
                style={{height: '10vw'}}
                value={reviewCommentsModalInfo.reviewComments}
                onChange={(e) => {
                    setReviewCommentsModalInfo({
                        ...reviewCommentsModalInfo, reviewComments: e.target.value
                    })
                }}
            />
            <Button type={'primary'} onClick={editDamand}>保存</Button>
        </Modal>
    </div>

}

export default DemandDevelop
