import React, {useEffect, useState} from "react";
import {
    Input,
    Select,
    Table,
    Button,
    message,
    Popconfirm,
    Form,
    Space
} from 'antd';


import wenhao from '../../static/images/wenhao.png'
import file from '../../static/images/file.png'

import moment from "moment/moment";
import './index.scss'
import {
    addOrEditCheckChangNoteApi,
    editCheckfeedbackApi,
    deleteCheckFeedbackApi, getCheckChangNoteApi,
    listCheckFeedbackApi, addCheckfeedbackApi
} from "../../common/api/producems/softcheck";
import {getNodesApi, listNodesApi} from "../../common/api/producems/demand";
import {checkChanges, deepCopy, handleSave} from "../../utils/table";
import {useSelector} from "react-redux";
import {AppstoreAddOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import ChangenodeModal from "../../content/soft-check-detail/changenode-modal";
import ExplainModal from "../../content/soft-check-detail/explain-modal";
import DemandTreeModal from "../../content/soft-check-detail/demand-tree-modal";
import DemandEventstreamModal from "../../content/soft-check-detail/demand-eventstream-modal";
import {useSearchParams} from "react-router-dom";
import ImageLargeMask from "../../content/soft-check-detail/image-large-mask";
import {listProjectByProduceGuidApi} from "../../common/api/producems/project";
import {createFuncDemandNode, createTreeItem, handleTree} from "../../utils/tree-data";
import AddSoftCheckModal from "../../content/soft-check-detail/soft-check-add-modal";
import {paseImageFile} from "../../utils/upload";


const {TextArea} = Input;

const SoftwareCheckDetail = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [searchForm] = Form.useForm()
    const userInfo = useSelector(state => state.user.userInfo);
    const [checkFeedbackList, setCheckFeedbackList] = useState([])
    const [orginalCheckFeedbackList, setOrginalCheckFeedbackList] = useState([])
    const [nodeList, setNodeList] = useState([])
    const [treeData, setTreeData] = useState([])
    const [projectList, setProjectList] = useState([])
    const [pageInfo, setPageInfo] = useState({currentPage: 1, pageSize: 10, total: 0, totalPages: 0})
    const [eventStreamModalInfo, setEventStreamModalInfo] = useState({open: false, eventStream: ''})
    const [explainModalVisible, setExplainModalVisible] = useState(false)
    const [checkChangNotesObj, setCheckChangNotesObj] = useState({
        open: false,
        guid: '',
        selcetCheckGuid: '',
        dbChange: '',
        configurationChange: '',
        scopeOfInfluence: '',
        checkSuggestion: '',
    })
    const [nodeVisible, setNodeVisible] = useState(false)
    const [wetherLargeObj, setWetherLargeObj] = useState({open: false, imageUrl: '', index: 0})
    const [filterRules, setFilterRules] = useState({filterStatus: [], filterProjectList: []})
    const [addCheckFeedbackModalVisible, setAddCheckFeedbackModalVisible] = useState(false)
    const [selectIndex, setSelectIndex] = useState(0)
    useEffect(() => {
        listNodes()
        listProjectByProduceGuid()
    }, [])

    useEffect(() => {
        // 检查是否是首次渲染（通过状态或 ref）
        if (isInitialRender) {
            // 如果是首次渲染，则跳过逻辑
            setIsInitialRender(false); // 更新状态以标记为非首次渲染
            return; // 提前返回，不执行后续逻辑
        }
        listCheckFeedback({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
    }, [filterRules])
    //根据产品获取项目列表
    const listProjectByProduceGuid = () => {
        listProjectByProduceGuidApi({produceGuid: searchParams.get("produceGuid")}).then(res => {
            setProjectList(res.data)
            setFilterRules({
                filterStatus: ['1', '2', '3', '4', '5', '6', '7'],
                filterProjectList: res.data.map(item => item.guid)
            })
        })
    }
    //获取测试反馈列表
    const listCheckFeedback = async (values) => {
        let res = await listCheckFeedbackApi({
            ...values,
            filterStatus: filterRules.filterStatus.join(","),
            filterProjectList: filterRules.filterProjectList.join(","),
            produceGuid: searchParams.get("produceGuid")
        })
        setCheckFeedbackList(deepCopy(res.data.list))
        setOrginalCheckFeedbackList(deepCopy(res.data.list))
        setPageInfo({
            currentPage: res.data.currentPage,
            pageSize: res.data.pageSize,
            total: res.data.total,
            totalPages: res.data.totalPages
        })
    }
    //搜索
    const onSearch = (values) => {
        listCheckFeedback({
            currentPage: 1,
            pageSize: 10,
            ...values
        })
    }
    //获取功能菜单
    const listNodes = () => {
        listNodesApi({
            produceGuid: searchParams.get("produceGuid")
        }).then(res => {
            setNodeList([...deepCopy(res.data), {guid: 'func-demand', name: '功能需求'},
                {guid: 'nofunc-demand', name: '非功能需求'}])
            let oldNodeList = deepCopy(res.data)
            let handleTreeData = handleTree(oldNodeList, "guid", 'name', 'parentNodeGuid');
            let newFuncNodeList = createFuncDemandNode(handleTreeData, 1)
            let newNoFuncNodeList = createFuncDemandNode(handleTreeData, 2)
            //属性结构数据
            let treeData = [
                createTreeItem('功能需求', 'func-demand', <img src={file} style={{
                    width: '1.0vw',
                    verticalAlign: 'text-bottom'
                }}/>, newFuncNodeList),
                createTreeItem('非功能需求', 'nofunc-demand', <img src={file} style={{
                    width: '1.0vw',
                    verticalAlign: 'text-bottom'
                }}/>, newNoFuncNodeList),
            ];
            setTreeData(treeData)
        })
    }

    //新增或编辑软件测试列表
    const editCheckfeedback = () => {
        let checkResult = checkChanges(orginalCheckFeedbackList, checkFeedbackList, 'guid');
        if (checkResult.changeArr.length === 0) return
        for (let item of checkFeedbackList) {
            if (!item.projectGuid) {
                message.error('请选择所属项目', 1)
                return
            }
            if (item.nodeGuid === '') {
                message.error('请选择所属需求', 1)
                return
            }
            if (!item.feedbackTime) {
                message.error('反馈时间禁止为空', 1)
                return
            }
            //判断时间是否符合格式
            if (!checkDate(item.feedbackTime) || !checkDate(item.dealFinishTime) || !checkDate(item.publishTime)) {
                message.error('时间格式不正确,格式为yyyy-MM-dd,精确到日', 1)
                return
            }
        }
        editCheckfeedbackApi({
            checkFeedbackList: JSON.stringify(checkResult.changeArr)
        }).then(res => {
            message.success('保存成功', 1)
        })
    }
    //检测是否符合时间格式
    const checkDate = (dateStr) => {
        const regExp = /^(\d{4})-(\d{2})-(\d{2})$/;
        return !dateStr || regExp.test(dateStr);
    }
    //新增或者更新变更说明
    const addOrEditCheckChangNote = (values) => {
        addOrEditCheckChangNoteApi({
            ...checkChangNotesObj,
            ...values
        }).then(res => {
            setCheckChangNotesObj({
                open: false,
                guid: '',
                selcetCheckGuid: '',
                dbChange: '',
                configurationChange: '',
                scopeOfInfluence: '',
                checkSuggestion: ''
            })
            message.success('保存成功', 1)
        })
    }
    //删除测试反馈
    const deleteCheckFeedback = (guid, index) => {
        deleteCheckFeedbackApi({guid,}).then(res => {
            listCheckFeedback({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                ...searchForm.getFieldsValue(),
            })
            message.success('删除成功', 1)
        })
    }
    //发送图片
    const sendFile = async () => {
        let res = await paseImageFile()
        handleSave(wetherLargeObj.index, 'imageLink', res.data[0].url, checkFeedbackList, setCheckFeedbackList)
    }
    //编辑列内容
    const editColumnsContent = (field, index, value) => {
        let copycheckFeedbackList = deepCopy(checkFeedbackList)
        if (field === 'status' && value === 7) {
            copycheckFeedbackList[index].dealName = userInfo.user.nickName
            copycheckFeedbackList[index].dealFinishTime = moment().format("YYYY-MM-DD")
        }
        copycheckFeedbackList[index][field] = value
        setCheckFeedbackList(copycheckFeedbackList)
    }
    const onChange = (pagination, filters, sorter, extra) => {
        setFilterRules({
            filterStatus: filters.status,
            filterProjectList: filters.projectGuid
        })
    };
    //获取变更说明
    const getCheckChangNote = (guid) => {
        getCheckChangNoteApi({guid}).then(res => {
            setCheckChangNotesObj({
                open: true,
                ...res.data
            })
        })
    }
    //获取需求描述
    const getNode = (nodeGuid) => {
        getNodesApi({guid: nodeGuid}).then(res => {
            if (res.data.eventStream === '') {
                message.warning('暂无需求描述')
                return
            }
            setEventStreamModalInfo({
                open: true,
                eventStream: res.data.eventStream
            })
        })
    }
    //新增测试详情
    const addCheckFeedback = async (obj) => {
        await addCheckfeedbackApi({...obj})
        await listCheckFeedback({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue(),
        })
        setAddCheckFeedbackModalVisible(false)
        message.success("新增成功", 1)
    }
    const defaultColumns = [
        {
            title: '序号',
            fixed: 'left',
            width: '4vw',
            render: (text, record, index) => {
                return <div>{index + 1}</div>
            }
        }, {
            title: '所属项目',
            dataIndex: 'projectGuid',
            key: 'projectGuid',
            fixed: 'left',
            width: '10vw',
            filters: projectList.map((item) => {
                return {
                    value: item.guid,
                    text: item.name,
                }
            }),
            onFilter: (value, record) => {
                return record.projectGuid === value
            },
            filteredValue: filterRules.filterProjectList,
            render: (text, record, index) => {
                return <Select
                    style={{width: '8vw'}}
                    value={record.projectGuid}
                    onChange={(v) => {
                        handleSave(index, 'projectGuid', v, checkFeedbackList, setCheckFeedbackList)
                    }}
                    options={projectList.map((item) => {
                        return {
                            value: item.guid,
                            label: item.name,
                        }
                    })}
                />
            }
        }, {
            title: '所属需求',
            dataIndex: 'nodeName',
            key: 'nodeName',
            width: '8vw',
            fixed: 'left',
            render: (text, record, index) => {
                return <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                    bordered={false}
                    value={record.nodeName}
                    onClick={() => {
                        setSelectIndex(index)
                        setNodeVisible(true)
                    }}/>
            }
        }, {
            title: '问题描述',
            width: '15vw',
            dataIndex: 'questionDescription',
            key: 'questionDescription',
            fixed: 'left',
            render: (text, record, index) => {
                return <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                    style={{width: '15vw'}}
                    value={record.questionDescription}
                    onChange={(e) => {
                        handleSave(index, 'questionDescription', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '附图',
            dataIndex: 'imageLink',
            key: 'imageLink',
            width: '5vw',
            fixed: 'left',
            render: (text, record, index) => {
                return <div onPaste={sendFile} suppressContentEditableWarning
                            contentEditable="true"
                            style={{height: '5vh', overflow: 'hidden', display: 'flex', cursor: 'pointer'}}
                            onDoubleClick={(e) => {
                                setWetherLargeObj({
                                    open: true,
                                    imageUrl: record.imageLink,
                                    index: index
                                })
                            }}
                            onClick={(e) => {
                                setWetherLargeObj({
                                    ...wetherLargeObj,
                                    index: index
                                })
                            }}
                >{record.imageLink ? <img style={{overflow: 'hidden'}} src={record.imageLink}/> : null}
                </div>
            }
        }, {
            title: '反馈时间',
            dataIndex: 'feedbackTime',
            key: 'feedbackTime',
            width: '6.5vw',
            render: (text, record, index) => {
                return <Input
                    bordered={false}
                    value={record.feedbackTime}
                    onClick={() => {
                        handleSave(index, 'feedbackTime', moment().format("YYYY-MM-DD"), checkFeedbackList, setCheckFeedbackList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'feedbackTime', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '优先级',
            dataIndex: 'severity',
            key: 'severity',
            width: '5vw',
            render: (text, record, index) => {
                return <Select
                    style={{width: '5vw'}}
                    value={record.severity}
                    onChange={(v) => {
                        handleSave(index, 'severity', v, checkFeedbackList, setCheckFeedbackList)
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
            title: '提交人',
            dataIndex: 'submitName',
            key: 'submitName',
            width: '5vw',
            render: (text, record, index) => {
                return <Input
                    bordered={false}
                    value={record.submitName}
                    onClick={() => {
                        handleSave(index, 'submitName', userInfo.user.nickName, checkFeedbackList, setCheckFeedbackList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'submitName', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '测试确认',
            dataIndex: 'checkConfirmName',
            key: 'checkConfirmName',
            width: '5.5vw',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('checkUserFlag') === 'false'}
                    bordered={false}
                    value={record.checkConfirmName}
                    onClick={() => {
                        handleSave(index, 'checkConfirmName', userInfo.user.nickName, checkFeedbackList, setCheckFeedbackList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'checkConfirmName', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '处理人',
            dataIndex: 'dealName',
            key: 'dealName',
            width: '5vw',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('devUserFlag') === 'false'}
                    value={record.dealName}
                    onClick={() => {
                        handleSave(index, 'dealName', userInfo.user.nickName, checkFeedbackList, setCheckFeedbackList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'dealName', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                    bordered={false}
                />
            }
        }, {
            title: '处理完成时间',
            dataIndex: 'dealFinishTime',
            key: 'dealFinishTime',
            width: '7vw',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('checkUserFlag') === 'false'}
                    bordered={false}
                    value={record.dealFinishTime}
                    onClick={() => {
                        handleSave(index, 'dealFinishTime', moment().format("YYYY-MM-DD"), checkFeedbackList, setCheckFeedbackList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'dealFinishTime', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '处理状态',
            dataIndex: 'status',
            key: 'status',
            width: '8vw',
            filters: [{
                text: '新增',
                value: 1,
            }, {
                text: '已通过',
                value: 2,
            }, {
                text: '未通过',
                value: 3,
            }, {
                text: '重新打开',
                value: 4,
            }, {
                text: '挂起',
                value: 5,
            }, {
                text: '已关闭',
                value: 6,
            }, {
                text: '开发已完成',
                value: 7,
            }],
            filteredValue: filterRules.filterStatus,
            onFilter: (value, record) => record.status === value,
            render: (text, record, index) => {
                return <Select
                    // disabled={getItem('checkUserFlag') === 'false' && getItem('devUserFlag') === 'false'}
                    value={record.status}
                    style={{width: '8vw'}}
                    onChange={(v) => {
                        editColumnsContent('status', index, v)
                    }}
                    options={[
                        {
                            value: 1,
                            label: '新增'
                        },
                        {
                            value: 2,
                            label: '已通过'
                        },
                        {
                            value: 3,
                            label: '未通过'
                        },
                        {
                            value: 4,
                            label: '重新打开'
                        }, {
                            value: 5,
                            label: '挂起'
                        }, {
                            value: 6,
                            label: '已关闭'
                        }, {
                            value: 7,
                            label: '开发已完成'
                        }
                    ]}
                />
            }
        }, {
            title: '处理办法',
            dataIndex: 'dealMethod',
            width: '6vw',
            key: 'dealMethod',
            render: (text, record, index) => {
                return <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                    // disabled={getItem('devUserFlag') === 'false'}
                    bordered={false}
                    value={record.dealMethod}
                    onChange={(e) => {
                        handleSave(index, 'dealMethod', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '发布/更新时间',
            dataIndex: 'publishTime',
            width: '7.5vw',
            key: 'publishTime',
            render: (text, record, index) => {
                return <Input
                    // disabled={getItem('checkUserFlag') === 'false'}
                    bordered={false}
                    value={record.publishTime}
                    onClick={() => {
                        handleSave(index, 'publishTime', moment().format("YYYY-MM-DD"), checkFeedbackList, setCheckFeedbackList)
                    }}
                    onChange={(e) => {
                        handleSave(index, 'publishTime', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '备注',
            dataIndex: 'notes',
            width: '10vw',
            key: 'notes',
            render: (text, record, index) => {
                return <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                    // disabled={getItem('checkUserFlag') === 'false' && getItem('devUserFlag') === 'false'}
                    value={record.notes}
                    onChange={(e) => {
                        handleSave(index, 'notes', e.target.value, checkFeedbackList, setCheckFeedbackList)
                    }}
                />
            }
        }, {
            title: '操作',
            key: 'action',
            width: '6vw',
            fixed: 'right',
            render: (text, record, index) => {
                return <div className='actionlist'>
                    <Button type={'link'}
                            onClick={() => {
                                // this.props.history.push('/home/demand-edit' + '?guid=' + record.demandGuid + '&nodeGuid=' + record.nodeGuid + '&edit=false&tabKey=3')
                            }}
                    >查看用例</Button>
                    <Button type={'link'}
                            onClick={() => {
                                getNode(record.nodeGuid)
                            }}
                    >查看需求</Button>
                    <Button
                        // disabled={getItem('checkUserFlag') === 'false'}
                        type={'link'}
                        onClick={() => {
                            getCheckChangNote(record.guid)
                        }}
                    >变更说明</Button>
                    <Popconfirm
                        title={`您确认删除${record.questionDescription ? record.questionDescription : ''}问题吗？`}
                        onConfirm={(e) => deleteCheckFeedback(record.guid, index)}
                        okText="确定"
                        cancelText="取消"
                    ><Button type={'link'}>删除</Button>
                    </Popconfirm>
                </div>
            }
        }]
    return <div id="home-software-check-detail">
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 7,
                }}
                initialValues={{acceptanceFlag: 1}}
                onFinish={onSearch}
                autoComplete="off"
            > <Form.Item
                label="问题描述"
                name="questionDescription"
            >
                <Input placeholder="请输入问题描述关键字"/>
            </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 10,
                        offset: 10,
                    }}>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>查询</Button>
                        <Button type="primary" icon={<AppstoreAddOutlined/>} onClick={() => {
                            setAddCheckFeedbackModalVisible(true)
                        }
                        }>新增</Button>
                        <Button type="primary" icon={<SaveOutlined/>} onClick={editCheckfeedback}>保存</Button>
                        <img src={wenhao} style={{width: '1.5vw', verticalAlign: 'text-bottom', cursor: 'pointer'}}
                             onClick={() => {
                                 setExplainModalVisible(true)
                             }}
                        />
                    </Space>
                </Form.Item>
            </Form>
        </div>
        <Table
            dataSource={checkFeedbackList}
            columns={defaultColumns}
            rowKey={record => record.guid}
            rowClassName={() => 'editable-row'}
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

        {/*变更说明*/}
        <ChangenodeModal checkChangNotesObj={checkChangNotesObj}
                         addOrEditCheckChangNote={addOrEditCheckChangNote}
                         setCheckChangNotesObj={setCheckChangNotesObj}/>
        {/*解释说明*/}
        <ExplainModal explainModalVisible={explainModalVisible} setExplainModalVisible={setExplainModalVisible}/>
        {/*需求节点树弹窗*/}
        <DemandTreeModal nodeVisible={nodeVisible} setNodeVisible={setNodeVisible}
                         saveNode={(nodeGuid, nodeName) => {
                             const newData = deepCopy(checkFeedbackList);
                             newData[selectIndex].nodeGuid = nodeGuid
                             newData[selectIndex].nodeName = nodeName
                             setCheckFeedbackList(newData)
                         }}
                         treeData={treeData} nodeList={nodeList}/>
        {/*需求事件流弹窗*/}
        <DemandEventstreamModal eventStreamModalInfo={eventStreamModalInfo}
                                setEventStreamModalInfo={setEventStreamModalInfo}/>

        <ImageLargeMask wetherLargeObj={wetherLargeObj} setWetherLargeObj={setWetherLargeObj}/>

        <AddSoftCheckModal addCheckFeedbackModalVisible={addCheckFeedbackModalVisible}
                           setAddCheckFeedbackModalVisible={setAddCheckFeedbackModalVisible}
                           projectList={projectList}
                           treeData={treeData}
                           addCheckFeedback={addCheckFeedback}/>
    </div>

}

export default SoftwareCheckDetail;
