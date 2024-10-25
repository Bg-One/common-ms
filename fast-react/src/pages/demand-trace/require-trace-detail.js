import React, {useEffect, useState} from "react";
import {
    Input,
    Select,
    Table,
    Button,
    message,
    Checkbox,
    Popconfirm,
    Form,
    Space
} from 'antd';
import moment from "moment/moment";
import './index.scss'
import {checkChanges, deepCopy, handleSave} from "../../utils/table";
import ExplainModal from "../../content/demand-trace/explain-modal";
import RepeatModal from "../../content/demand-trace/repeat-modal";
import {
    addDemandTraceApi,
    deleteteDemandTraceApi,
    editdemandTraceApi,
    listDemandTraceApi,
    updateDemandTraceDetailDesApi
} from "../../common/api/producems/demand";
import {useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {AppstoreAddOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import wenhao from "../../static/images/wenhao.png";
import {demandTraceDealstateEnum} from "../../common/enmus/demand-trace-dealstate-enum";
import {listProjectByProduceGuidApi} from "../../common/api/producems/project";
import DemandTraceDetailcontent from "../../content/demand-trace/demand-trace-detailcontent";
import DemandTraceAddModal from "../../content/demand-trace/demand-trace-add-modal";

const {TextArea} = Input;

const DemandTraceDetail = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [searchForm] = Form.useForm()
    const [demandTraceList, setDemandTraceList] = useState([])
    const [originalDemandTraceList, setOriginalDemandTraceList] = useState([])
    const [projectList, setProjectList] = useState([])
    const [explainModalVisible, setExplainModalVisible] = useState(false)
    const [repealModalFlag, setRepealModalFlag] = useState(false)
    const [detailDescriptionFlag, setDetailDescriptionFlag] = useState(false)
    const userInfo = useSelector(state => state.user.userInfo);
    const [pageInfo, setPageInfo] = useState({currentPage: 1, pageSize: 10, total: 0, totalPages: 0})
    const [filterRules, setFilterRules] = useState({filterProjectList: []})
    const [detailDescription, setDetailDescription] = useState('')
    const [selectDemandTraceGuid, setSelectDemandTraceGuid] = useState('')
    const [addModalFlag, setAddModalFlag] = useState(false)
    useEffect(() => {
        listDemandTrace({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
        listProjectByProduceGuid()
    }, [])
    useEffect(() => {
        // 检查是否是首次渲染（通过状态或 ref）
        if (isInitialRender) {
            // 如果是首次渲染，则跳过逻辑
            setIsInitialRender(false); // 更新状态以标记为非首次渲染
            return; // 提前返回，不执行后续逻辑
        }
        listDemandTrace({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue()
        })
    }, [filterRules])
    //根据产品获取项目列表
    const listProjectByProduceGuid = (values) => {
        listProjectByProduceGuidApi({
                ...values,
                filterProjectList: filterRules.filterProjectList.join(","),
                produceGuid: searchParams.get("produceGuid")
            }
        ).then(res => {
            setProjectList(res.data)
            setFilterRules({
                filterProjectList: res.data.map(item => item.guid)
            })
        })
    }
    //获取需求跟踪列表
    const listDemandTrace = (values) => {
        listDemandTraceApi({
            ...values,
            produceGuid: searchParams.get('produceGuid')
        }).then((res) => {
            setDemandTraceList(deepCopy(res.data.list))
            setOriginalDemandTraceList(deepCopy(res.data.list))
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
        })

    }
    const onSearch = (values) => {
        listDemandTrace({
            currentPage: 1,
            pageSize: 10,
            ...values
        })
    }
    //保存需求跟踪详情
    const addDemandTraceDetail = async () => {
        await updateDemandTraceDetailDesApi({
            guid: selectDemandTraceGuid,
            detailDescription: detailDescription
        })
        listDemandTrace({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue()
        })
        message.success('保存成功')
    }
    //检测是否符合时间格式
    const checkDate = (dateStr) => {
        const regExp = /^(\d{4})-(\d{2})-(\d{2})$/;
        return regExp.test(dateStr);
    }
    const onChange = (pagination, filters, sorter, extra) => {
        setFilterRules({
            filterProjectList: filters.projectGuid
        })
    };
    // 保存需求跟踪详情
    const editdemandTrace = () => {
        let checkResult = checkChanges(originalDemandTraceList, demandTraceList, 'guid');
        if (checkResult.changeArr.length === 0) return
        //保存前进行验证
        for (let {
            dealState,
            demandDescription,
            demandName,
            demandType,
            finishTime,
            proposer,
            submitName,
            submitTime
        } of checkResult.changeArr) {
            //判断某些字段是否为空
            if (demandType === '') {
                message.error('需求类型禁止为空', 1)
                return
            }
            if (demandDescription === '') {
                message.error('需求描述禁止为空', 1)
                return
            }
            if (proposer === '') {
                message.error('提出人禁止为空', 1)
                return
            }
            if (submitName === '') {
                message.error('提交人禁止为空', 1)
                return
            }
            if (submitTime === '') {
                message.error('提交时间禁止为空', 1)
                return
            }
            //判断时间是否符合格式
            if ((submitTime !== '' && !checkDate(submitTime)) || ((finishTime !== '' && finishTime !== '1970-01-01 00:00:00') && !checkDate(finishTime))) {
                message.error('时间格式不正确,格式为yyyy-MM-dd,精确到日', 1)
                return
            }
            if (dealState === demandTraceDealstateEnum.REPEAL && demandName !== '') {//表示作废
                setRepealModalFlag(true)
                break
            }
        }
        editdemandTraceApi({
            demandTraceList: JSON.stringify(checkResult.changeArr)
        }).then(res => {
            message.success('保存成功')
        })
    }

    //删除需求跟踪
    const deleteteDemandTrace = (guid, index) => {
        //需求人员签字的不能删除
        for (let item of demandTraceList) {
            if (item.guid === guid && item.demandName !== '') {
                message.error('需求变更已完成禁止删除',)
                return
            }
        }
        deleteteDemandTraceApi({guid: guid}).then(data => {
            listDemandTrace({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                ...searchForm.getFieldsValue(),
            })
            message.success("删除成功", 1)
        })

    }
    //编辑列内容
    const editColumnsContent = (field, index, value) => {
        let oldDemandTraceList = deepCopy(demandTraceList)
        oldDemandTraceList[index][field] = value
        if (field === 'dealState' && value === 4) {
            oldDemandTraceList[index].finishTime = moment().format("YYYY-MM-DD")
        }
        setDemandTraceList(oldDemandTraceList)
    }

    //新增需求跟踪
    const addDemandTrace = (values) => {
        addDemandTraceApi({...values}).then(() => {
            listDemandTrace({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                ...searchForm.getFieldsValue(),
            })
            message.success('新增成功', 1)
        })
    }


    let columns = [
        {
            title: '序号',
            width: '4vw',
            fixed: 'left',
            render: (text, record, index) => {
                return <div style={{width: '4vw'}}>
                    {index + 1}
                </div>
            }
        }, {
            title: '所属项目',
            width: '8vw',
            fixed: 'left',
            filters: projectList.map((item) => {
                return {
                    value: item.guid,
                    text: item.name,
                }
            }),
            onFilter: (value, record) => {
                return record.projectGuid === value
            },
            render: (text, record, index) => {
                return <Select
                    style={{width: '8vw'}}
                    value={record.projectGuid}
                    onChange={(v) => {
                        handleSave(index, 'projectGuid', v, demandTraceList, setDemandTraceList)
                    }}
                    options={projectList.map((item) => {
                        return {
                            value: item.guid,
                            label: item.name,
                        }
                    })
                    }
                />
            }
        }, {
            title: '需求类型',
            width: '8vw',
            dataIndex: 'demandType',
            key: 'demandType',
            fixed: 'left',
            render: (text, record, index) => {
                return <Select
                    style={{width: '7vw'}}
                    value={
                        record.demandType
                    }
                    onChange={(v) => {
                        handleSave(index, 'demandType', v, demandTraceList, setDemandTraceList)
                    }}
                    options={[
                        {
                            value: 0,
                            label: '新增需求',
                        }, {
                            value: 1,
                            label: '需求变更'
                        }
                    ]}
                />
            }
        },
        {
            title: '需求描述',
            width: '20vw',
            dataIndex: 'demandDescription',
            key: 'demandDescription',
            fixed: 'left',
            render: (text, record, index) => {
                return <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                    style={{width: '20vw'}}
                    value={record.demandDescription}
                    onChange={(e) => {
                        handleSave(index, 'demandDescription', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '提出人',
            width: '5vw',
            dataIndex: 'proposer',
            key: 'proposer',
            render: (text, record, index) => {
                return <Input
                    style={{width: '5vw'}}
                    bordered={false}
                    value={
                        record.proposer
                    }
                    onClick={() => {
                        handleSave(index, 'proposer', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'proposer', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '提交人',
            width: '5vw',
            dataIndex: 'submitName',
            key: 'submitName',
            render: (text, record, index) => {
                return <Input
                    style={{width: '5vw'}}
                    bordered={false}
                    value={
                        record.submitName
                    }
                    onClick={() => {
                        handleSave(index, 'submitName', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'submitName', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '提交时间',
            width: '7vw',
            dataIndex: 'submitTime',
            key: 'submitTime',
            render: (text, record, index) => {
                return <Input
                    style={{width: '7vw'}}
                    bordered={false}
                    value={record.submitTime}
                    onClick={() => {
                        handleSave(index, 'submitTime', moment().format("YYYY-MM-DD"), demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'submitTime', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '优先级',
            width: '5vw',
            dataIndex: 'priority',
            key: 'priority',
            render: (text, record, index) => {
                return <Select
                    style={{width: '5vw'}}
                    value={
                        record.priority
                    }
                    onChange={(v) => {
                        handleSave(index, 'priority', v, demandTraceList, setDemandTraceList)
                    }}
                    options={[
                        {
                            value: 0,
                            label: '紧急',
                        }, {
                            value: 1,
                            label: '一般'
                        }
                    ]}
                />
            }
        }, {
            title: '生产负责人',
            width: '7vw',
            dataIndex: 'techManager',
            key: 'techManager',
            render: (text, record, index) => {
                return <Input
                    style={{width: '7vw'}}
                    bordered={false}
                    value={record.techManager}
                    onClick={() => {
                        if (record.dealState === 1) {
                            message.error('请先选择处理状态后签名')
                            return
                        }
                        handleSave(index, 'techManager', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        if (record.dealState === 1) {
                            message.error('请先选择处理状态后签名')
                            return
                        }
                        handleSave(index, 'techManager', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '是否评审',
            width: '6vw',
            dataIndex: 'reviewFlag',
            key: 'reviewFlag',
            render: (text, record, index) => {
                return <Select
                    disabled={true}
                    style={{width: '6vw'}}
                    value={record.reviewFlag}
                    onChange={(v) => {
                        handleSave(index, 'reviewFlag', v, demandTraceList, setDemandTraceList)
                    }}
                    options={[
                        {
                            value: 0,
                            label: '否',
                        }, {
                            value: 1,
                            label: '是'
                        }
                    ]}
                />
            }
        }, {
            title: '需求人员',
            width: '6vw',
            dataIndex: 'demandName',
            key: 'demandName',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('demandManagerFlag') === 'false'}
                    style={{width: '6vw'}}
                    bordered={false}
                    value={
                        record.demandName
                    }
                    onClick={() => {
                        handleSave(index, 'demandName', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'demandName', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '评审确认',
            width: '6vw',
            dataIndex: 'reviewName',
            key: 'reviewName',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('demandUserFlag') === 'false'}
                    style={{width: '6vw'}}
                    bordered={false}
                    value={record.reviewName}
                    onClick={() => {
                        handleSave(index, 'reviewName', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'reviewName', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '开发确认',
            width: '6vw',
            dataIndex: 'developName',
            key: 'developName',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('devUserFlag') === 'false'}
                    style={{width: '6vw'}}
                    bordered={false}
                    value={record.developName}
                    onClick={() => {
                        handleSave(index, 'developName', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'developName', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '开发完成',
            width: '6vw',
            dataIndex: 'devlopFinishName',
            key: 'devlopFinishName',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('devUserFlag') === 'false'}
                    style={{width: '6vw'}}
                    bordered={false}
                    value={record.devlopFinishName}
                    onClick={() => {
                        handleSave(index, 'devlopFinishName', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'devlopFinishName', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '需求确认',
            width: '6vw',
            dataIndex: 'demandConfirmName',
            key: 'demandConfirmName',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('demandUserFlag') === 'false'}
                    style={{width: '6vw'}}
                    bordered={false}
                    value={record.demandConfirmName}
                    onClick={() => {
                        handleSave(index, 'demandConfirmName', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'demandConfirmName', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '测试确认',
            width: '6vw',
            dataIndex: 'checkName',
            key: 'checkName',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('checkUserFlag') === 'false'}
                    style={{width: '6vw'}}
                    bordered={false}
                    value={record.checkName}
                    onClick={() => {
                        handleSave(index, 'checkName', userInfo.user.nickName, demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'checkName', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '处理状态',
            width: '6vw',
            dataIndex: 'dealState',
            key: 'dealState',
            render: (text, record, index) => {
                return <Select
                    style={{width: '6vw'}}
                    value={record.dealState}
                    onChange={(v) => {
                        editColumnsContent('dealState', index, v)
                    }}
                    options={[
                        {
                            value: 1,
                            label: '新增'
                        },
                        {
                            value: 2,
                            label: '进行中'
                        },
                        {
                            value: 3,
                            label: '挂起'
                        },
                        {
                            value: 4,
                            label: '已完结'
                        }, {
                            value: 5,
                            label: '作废'
                        }, {
                            value: 6,
                            label: '暂缓'
                        }
                    ]}
                />
            }
        }, {
            title: '完结时间',
            width: '7vw',
            dataIndex: 'finishTime',
            key: 'finishTime',
            render: (text, record, index) => {
                return <Input
                    style={{width: '7vw'}}
                    bordered={false}
                    value={record.finishTime}
                    onClick={() => {
                        handleSave(index, 'finishTime', moment().format("YYYY-MM-DD"), demandTraceList, setDemandTraceList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'finishTime', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '备注',
            width: '20vw',
            dataIndex: 'notes',
            key: 'notes',
            render: (text, record, index) => {
                return <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                    style={{width: '20vw'}}
                    value={record.notes}
                    onChange={(e) => {
                        handleSave(index, 'notes', e.target.value, demandTraceList, setDemandTraceList)
                    }}
                />
            }
        }, {
            title: '操作',
            key: 'action',
            width: '4vw',
            fixed: 'right',
            render: (text, record, index) => {
                return <div className='actionlist'>
                    <Button type={'link'}
                            onClick={() => {
                                setDetailDescription(record.detailDescription)
                                setDetailDescriptionFlag(true)
                                setSelectDemandTraceGuid(record.guid)
                            }}
                    >
                        详述{record.detailDescription === "" ? '' : '*'}
                    </Button>
                    <Popconfirm
                        title={`您确认删除${record.demandDescription}需求跟踪吗？`}
                        onConfirm={(e) => deleteteDemandTrace(record.guid, index)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type={'link'}>删除</Button>
                    </Popconfirm>
                </div>
            }
        }]
    return <div id="home-require-trace-detail">{
        detailDescriptionFlag ? <DemandTraceDetailcontent detailDescriptionFlag={detailDescriptionFlag}
                                                          setDetailDescriptionFlag={setDetailDescriptionFlag}
                                                          detailDescription={detailDescription}
                                                          setDetailDescription={setDetailDescription}
                                                          addDemandTraceDetail={addDemandTraceDetail}/>

            : <div>
                <div style={{display: detailDescriptionFlag ? 'none' : 'block'}}>
                    <div className={'search-area'}>
                        <Form
                            className={'search-form'}
                            form={searchForm}
                            name="basic"
                            layout="inline"
                            labelCol={{
                                span: 7,
                            }}
                            initialValues={{
                                demandType: 100,
                                priority: 100
                            }}
                            onFinish={onSearch}
                            autoComplete="off"
                        > <Form.Item
                            label="需求类型"
                            name="demandType"
                        >
                            <Select
                                style={{width: '10vw'}}
                                placeholder="请选择需求类型"
                                options={[
                                    {
                                        value: 100,
                                        label: '全部',
                                    }, {
                                        value: 0,
                                        label: '新增需求',
                                    }, {
                                        value: 1,
                                        label: '变更需求'
                                    }
                                ]}
                            />
                        </Form.Item>
                            <Form.Item
                                label="优先级"
                                name="priority"
                            >
                                <Select
                                    style={{width: '10vw'}}
                                    placeholder="请选择优先级"
                                    options={[
                                        {
                                            value: 100,
                                            label: '全部',
                                        }, {
                                            value: 0,
                                            label: '紧急',
                                        }, {
                                            value: 1,
                                            label: '一般'
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="需求关键字"
                                name="demandDescription"
                            >
                                <Input
                                    style={{width: '10vw'}}
                                    placeholder="请输入需求关键字"
                                />
                            </Form.Item>
                            <Form.Item
                                name="progressStatuss"
                                valuePropName="checked"
                            >
                                <Checkbox.Group>
                                    <Checkbox value={1}>待确认</Checkbox>
                                    <Checkbox value={2}>待编制</Checkbox>
                                    <Checkbox value={3}>待评审</Checkbox>
                                    <Checkbox value={4}>开发待确认</Checkbox>
                                    <Checkbox value={5}>开发待完成</Checkbox>
                                    <Checkbox value={6}>需求待确认</Checkbox>
                                    <Checkbox value={7}>待测试</Checkbox>
                                    <Checkbox value={8}>已完结</Checkbox>
                                    <Checkbox value={9}>挂起</Checkbox>
                                    <Checkbox value={10}>暂缓</Checkbox>
                                    <Checkbox value={11}>作废</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    span: 10,
                                    offset: 10,
                                }}>
                                <Space>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>搜索</Button>
                                    <Button type={'primary'} onClick={() => {
                                        setAddModalFlag(true)
                                    }}>新增</Button>
                                    <Button type={'primary'} onClick={editdemandTrace}>保存</Button>
                                    <img src={wenhao}
                                         style={{width: '1.5vw', verticalAlign: 'text-bottom', cursor: 'pointer'}}
                                         onClick={() => {
                                             setExplainModalVisible(true)
                                         }}
                                    />
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>

                    <Table
                        dataSource={demandTraceList}
                        columns={columns}
                        rowKey={record => record.guid}
                        scroll={{x: '1vw', y: 'calc(100vh - 300px)'}}
                        onChange={onChange}
                        pagination={{
                            pageSize: pageInfo.pageSize,
                            pageNumber: pageInfo.currentPage,
                            total: pageInfo.total,
                            current: pageInfo.currentPage,
                            showSizeChanger: true,
                            onChange: (page, pageSize) => {
                                setPageInfo({
                                    ...pageInfo,
                                    currentPage: page,
                                    pageSize: pageSize,
                                })
                            }
                        }}
                    />
                </div>

                <ExplainModal explainModalVisible={explainModalVisible} setExplainModalVisible={setExplainModalVisible}/>
                <RepeatModal repealModalFlag={repealModalFlag} setRepealModalFlag={setRepealModalFlag}/>
                <DemandTraceAddModal addModalFlag={addModalFlag} setAddModalFlag={setAddModalFlag}
                                     projectList={projectList} addDemandTrace={addDemandTrace}/>
            </div>
    }
    </div>

}

export default DemandTraceDetail
