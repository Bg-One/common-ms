import React, {useEffect, useState} from "react";
import {
    Input,
    Select,
    Table,
    Button,
    message,
    Modal,
    Popconfirm,
    Form,
    Space
} from 'antd';


import wenhao from '../../static/images/wenhao.png'
import moment from "moment/moment";
import './index.scss'
import TreeSearch from "../../content/demand-tree-search/tree-search";
import {auto} from "html-webpack-plugin/lib/chunksorter";
import {
    addOrEditCheckChangNoteApi,
    addOrEditCheckfeedbackApi,
    deleteCheckFeedbackApi,
    listCheckFeedbackApi
} from "../../common/api/producems/softcheck";
import {listNodesApi} from "../../common/api/producems/demand";
import {checChanges, deepCopy, handleSave} from "../../utils/table";
import {useSelector} from "react-redux";
import {AppstoreAddOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import ChangenodeModal from "../../content/soft-check-detail/changenode-modal";
import ExplainModal from "../../content/soft-check-detail/explain-modal";
import DemandTreeModal from "../../content/soft-check-detail/demand-tree-modal";
import DemandEventstreamModal from "../../content/soft-check-detail/demand-eventstream-modal";

const {TextArea} = Input;

const SoftwareCheckDetail = () => {
    const [searchForm] = Form.useForm()
    const userInfo = useSelector(state => state.user.userInfo);
    const [checkFeedbackList, setCheckFeedbackList] = useState([])
    const [orginalCheckFeedbackList, setOrginalCheckFeedbackList] = useState([])
    const [nodeList, setNodeList] = useState([])
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1, pageSize: 10, total: 0, totalPages: 0
    })
    const [eventStreamModalInfo, setEventStreamModalInfo] = useState({
        open: false,
        eventStream: ''
    })
    const [explainModalVisible, setExplainModalVisible] = useState(false)
    const [checkChangNotesObj, setCheckChangNotesObj] = useState({
        open: false,
        selcetCheckGuid: '',
        dbChange: '',
        configurationChange: '',
        scopeOfinfluence: '',
        checkSuggestion: '',
    })
    const [nodeVisible, setNodeVisible] = useState(false)

    useEffect(() => {
        document.getElementById('home-software-check-detail').addEventListener('paste', (event) => {
            if ('imageLink' === event.target.id) {//粘贴图片
                // 防止默认的粘贴事件和停止冒泡
                event.preventDefault();
                event.stopPropagation();
                // 找到光标位置或突出显示的区域
                const selection = window.getSelection();
                // 如果没有找到光标或突出显示的区域，则取消粘贴操作
                if (!selection.rangeCount) return false;
                sendFile()
            }
        })
        listCheckFeedback()
        listNodes()
    })


    //设置默认过滤规则
    const setDefaultFilteredValue = () => {
        let rulesArr = []
        if (getItem('checkFlag') === 'all' || getItem('checkFlag') === 'add') {
            rulesArr.push('1')
        }
        if (getItem('checkFlag') === 'all' || getItem('checkFlag') === 'pass') {
            rulesArr.push('2')
        }
        if (getItem('checkFlag') === 'all' || getItem('checkFlag') === 'nopassed') {
            rulesArr.push('3')
        }
        if (getItem('checkFlag') === 'all' || getItem('checkFlag') === 'open') {
            rulesArr.push('4')
        }
        if (getItem('checkFlag') === 'all' || getItem('checkFlag') === 'hungup') {
            rulesArr.push('5')
        }
        if (getItem('checkFlag') === 'all' || getItem('checkFlag') === 'close') {
            rulesArr.push('6')
        }
        if (getItem('checkFlag') === 'all' || getItem('checkFlag') === 'finish') {
            rulesArr.push('7')
        }
        return rulesArr
    }
    //获取测试反馈列表
    const listCheckFeedback = (values) => {
        listCheckFeedbackApi({...values}).then(res => {
            setCheckFeedbackList(res.data.list)
            setOrginalCheckFeedbackList(res.data.list)
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
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
        listNodesApi().then(res => {
            setNodeList(res.data)
            // let oldNodeList = data.data
            // let newFuncNodeList = this.createFuncDemandNode(oldNodeList, 1)
            // let newNoFuncNodeList = this.createFuncDemandNode(oldNodeList, 2)
            // //属性结构数据
            // let treeData = [
            //     this.createTreeItem('功能需求', 'func-demand', <img src={file} style={{
            //         width: '1.0vw',
            //         verticalAlign: 'text-bottom'
            //     }}/>, newFuncNodeList),
            //     this.createTreeItem('非功能需求', 'nofunc-demand', <img src={file} style={{
            //         width: '1.0vw',
            //         verticalAlign: 'text-bottom'
            //     }}/>, newNoFuncNodeList),
            // ];
            // this.setState({
            //     nodeList: data.data,
            //     treeData: treeData
            // })
        })
    }
    //创建需求节点
    const createFuncDemandNode = (item, classType) => {
        let newNodeList = []
        item.forEach((i) => {
            if (i.classType === classType) {
                newNodeList.push(createTreeItem(i.name, i.guid, '', i.child.length === 0 ? '' : createFuncDemandNode(i.child, classType)))
            }
        })
        return newNodeList;
    }

    //生成tree项
    const createTreeItem = (title, key, icon, children,) => {
        return {key, icon, children, title};
    }
    //新增或编辑软件测试列表
    const addOrEditCheckfeedback = () => {
        let checkResult = checChanges(orginalCheckFeedbackList, checkFeedbackList, 'guid');
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
            if (item.severity !== 0 && item.severity !== 1) {
                message.error('请选择优先级', 1)
                return
            }
            if (!item.feedbackTime) {
                message.error('反馈时间禁止为空', 1)
                return
            }
        }
        for (let item of checkFeedbackList) {
            //判断时间是否符合格式
            if (!checkDate(item.feedbackTime) || !checkDate(item.dealFinishTime) || !checkDate(item.publishTime)) {
                message.error('时间格式不正确,格式为yyyy-MM-dd,精确到日', 1)
                return
            }
        }
        addOrEditCheckfeedbackApi({
            checkFeedbackList: JSON.stringify(checkFeedbackList)
        }).then(res => {
            listCheckFeedback()
            message.success('保存成功', 1)
        })
    }
    //检测是否符合时间格式
    const checkDate = (dateStr) => {
        const regExp = /^(\d{4})-(\d{2})-(\d{2})$/;
        return regExp.test(dateStr);
    }
    //新增测试反馈详情
    const addCheckfeedback = () => {
        let oldcheckFeedbackList = deepCopy(checkFeedbackList)
        let obj = {
            guid: '',
            projectGuid: '',
            nodeName: '',
            nodeGuid: '',
            demandGuid: '',
            checkFeedbackGuid: '',
            questionDescription: '',
            imageLink: '',
            severity: '',
            feedbackTime: '',
            dealFinishTime: "",
            submitName: '',
            checkConfirmName: "",
            developConfirmName: '',
            dealName: '',
            dealState: 1,
            dealMethod: '',
            publishTime: '',
            notes: '',
        }
        oldcheckFeedbackList.push(obj)
        setCheckFeedbackList(oldcheckFeedbackList)
    }
    //新增或者更新变更说明
    const addOrEditCheckChangNote = (values) => {
        addOrEditCheckChangNoteApi({
            checkFeedbackGuid: checkChangNotesObj.selcetCheckGuid,
            ...values
        }).then(res => {
            setCheckChangNotesObj({
                open: false,
                selcetCheckGuid: '',
                dbChange: '',
                configurationChange: '',
                scopeOfinfluence: '',
                checkSuggestion: ''
            })
            listCheckFeedback()
            message.success('保存成功', 1)
        })

    }
    //删除测试反馈
    const deleteCheckFeedback = (guid, index) => {
        //判断当前是否有唯一标识有调接口没有删内存
        if (!guid) {
            let deepcheckFeedbackList = deepCopy(checkFeedbackList);
            deepcheckFeedbackList.splice(index, 1);
            setCheckFeedbackList(deepcheckFeedbackList)
        } else {
            deleteCheckFeedbackApi({guid,}).then(res => {
                listCheckFeedback()
                message.success('保存成功', 1)
            })
        }
    }
    //搜索的条件过滤
    const checkFeedbackListFilter = (condition) => {
        let arr = deepCopy(checkFeedbackList)
        return arr.filter((item) => {
            return condition(item)
        })
    }
    //发送图片
    const sendFile = async () => {
        let needItem = await navigator.clipboard.read();
        let needData = needItem[0]
        for (const t of needData.types) {
            if (t.indexOf('image') !== -1) {
                let blob = await needData.getType(t);
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    let base64data = reader.result;
                    //根据上传选中时的guid编辑列表
                    let oldCheckFeedbackList = deepCopy(checkFeedbackList)
                    oldCheckFeedbackList.map((item) => {
                        if (item.guid === checkFeedbackGuid) {
                            item.imageLink = base64data,
                                item.saveImageFlag = 1
                        }
                    })
                    setCheckFeedbackList(oldCheckFeedbackList)
                }
            }
        }
    }
    //编辑列内容
    const editColumnsContent = (field, index, value) => {
        let copycheckFeedbackList = deepCopy(checkFeedbackList)
        if (field === 'dealState' && value === 7) {
            copycheckFeedbackList[index].dealName = userInfo.nickName
            copycheckFeedbackList[index].dealFinishTime = moment().format("YYYY-MM-DD")
        }
        setCheckFeedbackList(() => copycheckFeedbackList, () => {
            if (field === 'dealState') {
                addOrEditCheckfeedback()
            }
        })

    }
    const onChange = (pagination, filters, sorter, extra) => {
        // this.setState({
        //     defaultFilteredValue: filters.dealState,
        //     filterProjectGuid: filters[1] ? filters[1][0] : this.state.filterProjectGuid
        // })
    };

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
                name="name"
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
                        <Button type="primary" icon={<AppstoreAddOutlined/>} onClick={addCheckfeedback}>新增</Button>
                        <Button type="primary" icon={<SaveOutlined/>}>保存</Button>
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
            columns={
                [{
                    title: '序号',
                    fixed: 'left',
                    render: (text, record, index) => {
                        return <div>{index + 1}</div>
                    }
                }, {
                    title: '所属项目',
                    fixed: 'left',
                    // filters: this.props.listProject.length !== 0 ? (this.props.listProject.filter(i => i.produceGuid === getItem('produceGuid') && i.executionStatus === projectExecutionStatusEnum.EXECUTING)).filter(i => i.produceGuid === getItem('produceGuid')).map((item) => {
                    //     return {
                    //         value: item.guid,
                    //         text: item.name,
                    //     }
                    // }) : '',
                    // onFilter: (value, record) => record.projectGuid === value,
                    // render: (text, record, index) => {
                    //     return <Select
                    //         style={{width: '8vw'}}
                    //         value={this.props.listProject.filter(i => i.guid === record.projectGuid).length !== 0 ? this.props.listProject.filter(i => i.guid === record.projectGuid)[0].name : ''}
                    //         onChange={(v) => {
                    //             this.editColumnsContent('projectGuid', index, v)
                    //         }}
                    //         options={this.props.listProject.filter(i => i.produceGuid === getItem('produceGuid') && i.executionStatus === projectExecutionStatusEnum.EXECUTING).map((item) => {
                    //             return {
                    //                 value: item.guid,
                    //                 label: item.name,
                    //             }
                    //         })}
                    //     />
                    // }
                }, {
                    title: '所属需求',
                    dataIndex: 'nodeName',
                    key: 'nodeName',
                    fixed: 'left',
                    render: (text, record, index) => {
                        return <TextArea
                            autoSize={{minRows: 1, maxRows: 6}}
                            value={record.nodeName}
                            // onClick={() => {
                            //     this.setState({
                            //         nodeVisibleFlag: true,
                            //         checkFeedbackGuid: record.guid,
                            //         selectIndex: index
                            //     })
                            // }}
                        />
                    }
                },
                    {
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
                    render: (text, record, index) => {
                        return <div id="imageLink" suppressContentEditableWarning contentEditable="true"
                                    style={{
                                        height: '5vh',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        cursor: 'pointer'
                                    }}
                            // onDoubleClick={(e) => {
                            //     this.setState({
                            //         wetherLarge: true,
                            //         imgSrc: record.imageLink,
                            //         checkFeedbackGuid: record.guid
                            //     })
                            // }}
                            // onClick={() => {
                            //     this.setState({
                            //         checkFeedbackGuid: record.guid
                            //     })
                            // }}
                        >{record.imageLink ?
                            <img className="img" style={{overflow: 'hidden'}} src={record.imageLink}/> : null}
                        </div>
                    }
                }, {
                    title: '反馈时间',
                    dataIndex: 'feedbackTime',
                    key: 'feedbackTime',
                    render: (text, record, index) => {
                        return <Input
                            bordered={false}
                            value={record.feedbackTime.includes('1970') ? '' : record.feedbackTime}
                            onClick={() => {
                                handleSave(index, 'feedbackTime', moment(), checkFeedbackList, setCheckFeedbackList)
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
                    render: (text, record, index) => {
                        return <Select
                            value={
                                record.severity
                            }
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
                    render: (text, record, index) => {
                        return <Input
                            bordered={false}
                            value={record.submitName}
                            onClick={() => {
                                handleSave(index, 'submitName', userInfo.nickName, checkFeedbackList, setCheckFeedbackList)
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
                    render: (text, record, index) => {
                        return <Input
                            disabled={getItem('checkUserFlag') === 'false'}
                            bordered={false}
                            value={record.checkConfirmName}
                            onClick={() => {
                                handleSave(index, 'checkConfirmName', userInfo.nickName, checkFeedbackList, setCheckFeedbackList)
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
                    render: (text, record, index) => {
                        return <Input
                            disabled={getItem('devUserFlag') === 'false'}
                            value={record.dealName}
                            onClick={() => {
                                handleSave(index, 'dealName', userInfo.nickName, checkFeedbackList, setCheckFeedbackList)
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
                    render: (text, record, index) => {
                        return <Input
                            disabled={getItem('checkUserFlag') === 'false'}
                            bordered={false}
                            style={{width: '6.5vw'}}
                            value={record.dealFinishTime.includes('1970') ? '' : record.dealFinishTime}
                            onClick={() => {
                                handleSave(index, 'dealFinishTime', moment(), checkFeedbackList, setCheckFeedbackList)
                            }}
                            onChange={(e) => {
                                handleSave(index, 'dealFinishTime', e.target.value, checkFeedbackList, setCheckFeedbackList)
                            }}
                        />
                    }
                }, {
                    title: '处理状态',
                    dataIndex: 'dealState',
                    key: 'dealState',
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
                    // filteredValue: this.state.defaultFilteredValue,
                    onFilter: (value, record) => record.dealState === value,
                    render: (text, record, index) => {
                        return <Select
                            disabled={getItem('checkUserFlag') === 'false' && getItem('devUserFlag') === 'false'}
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
                    key: 'dealMethod',
                    render: (text, record, index) => {
                        return <TextArea
                            autoSize={{minRows: 1, maxRows: 6}}
                            disabled={getItem('devUserFlag') === 'false'}
                            style={{width: '6vw'}}
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
                    key: 'publishTime',
                    render: (text, record, index) => {
                        return <Input
                            disabled={getItem('checkUserFlag') === 'false'}
                            bordered={false}
                            style={{width: '6.5vw'}}
                            value={record.publishTime.includes('1970') ? '' : record.publishTime}
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
                    key: 'notes',
                    render: (text, record, index) => {
                        return <TextArea
                            autoSize={{minRows: 1, maxRows: 6}}
                            disabled={getItem('checkUserFlag') === 'false' && getItem('devUserFlag') === 'false'}
                            style={{width: '10vw'}}
                            value={record.notes}
                            onChange={(e) => {
                                handleSave(index, 'notes', e.target.value, checkFeedbackList, setCheckFeedbackList)
                            }}
                        />
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    render: (text, record, index) => {
                        return <div className='actionlist' style={{width: '5vw'}}>
                            <Button type={'link'}
                                    onClick={() => {
                                        // this.props.history.push('/home/demand-edit' + '?guid=' + record.demandGuid + '&nodeGuid=' + record.nodeGuid + '&edit=false&tabKey=3')
                                    }}
                            >查看用例</Button>
                            <Button type={'link'}
                                    onClick={() => {
                                        if (!record.eventStream) {
                                            message.warning('暂无需求描述')
                                            return
                                        }
                                        setEventStreamModalInfo({
                                            eventStream: record.eventStream,
                                            open: true
                                        })
                                    }}
                            >查看需求</Button>
                            <Button disabled={getItem('checkUserFlag') === 'false'} type={'link'}
                                    onClick={() => {
                                        setCheckChangNotesObj({
                                            open: true,
                                            selcetCheckGuid: record.guid,
                                            dbChange: record.dbChange,
                                            configurationChange: record.configurationChange,
                                            scopeOfinfluence: record.scopeOfinfluence,
                                            checkSuggestion: record.checkSuggestion,
                                        })
                                    }}
                            >变更说明</Button>
                            <Popconfirm
                                title={`您确认删除${record.questionDescription}问题吗吗？`}
                                onConfirm={(e) => deleteCheckFeedback(record.guid, index)}
                                okText="确定"
                                cancelText="取消"
                            ><Button type={'link'}>删除</Button>
                            </Popconfirm>
                        </div>
                    }
                }]}
            rowKey={record => record.guid}
            scroll={{x: '1vw'}}
            // onChange={this.onChange}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listCheckFeedback({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
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
                         saveNode={(value) => {
                             handleSave('index', 'nodeGuid', value, checkFeedbackList, setCheckFeedbackList)
                         }}
                         treeData={[]} nodeList={nodeList}/>
        {/*需求事件流弹窗*/}
        <DemandEventstreamModal eventStreamModalInfo={eventStreamModalInfo}
                                setEventStreamModalInfo={setEventStreamModalInfo}/>
        {/*<div className={this.state.wetherLarge ? "imgPreview" : "imgPreviewNone"} onDoubleClick={(e) => {*/}
        {/*    this.setState({*/}
        {/*        wetherLarge: false,*/}
        {/*    })*/}
        {/*}}>*/}
        {/*        <span style={{*/}
        {/*            position: "fixed",*/}
        {/*            top: "0",*/}
        {/*            right: "17px",*/}
        {/*            cursor: 'pointer',*/}
        {/*            color: 'white',*/}
        {/*            fontSize: '3vw',*/}
        {/*        }} onClick={(e) => {*/}
        {/*            this.setState({*/}
        {/*                wetherLarge: false,*/}
        {/*            })*/}
        {/*        }}>X</span>*/}
        {/*    /!*<img src={this.state.imgSrc}/>*!/*/}
        {/*</div>*/}
    </div>

}

export default SoftwareCheckDetail;
