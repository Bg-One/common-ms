import React from "react";
import {Input, Table, Button, Tabs, Select, Switch, Radio, DatePicker, Checkbox, Popconfirm} from 'antd';
import parse from 'html-react-parser';
import {iniOption} from '../../common/tinymce'
import moment from "moment/moment";
import http from '../../common/http';

import './index.scss'

import {
    deepCopy,
    getCurrentUserGuid,
    getItem,
    getCurrentUserDepName,
    getCurrentUserName,
    diffCheck,
    diffData
} from "../../common/function.js";
import {message} from "antd";
import WaitButton from "../../common/wait-button/button";

const {TextArea} = Input;

class DemandNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            activeKey: 1,
            addFuncDesignGuid: '',//新增需求设计的guid
            demandTraceList: [],//需求跟踪的列表
            addDetailDesignGuid: '',//新增需求设计的guid
            addCheckDesignGuid: '',//新增的测试用例唯一标识

            degreeOfImportance: 1,//重要程度
            priority: 1,//优先程度
            demandState: 1,//需求状态
            demandTraceGuid: '',//关联跟踪的唯一标识
            funDescription: '',//功能描述
            preconditions: '',//前置条件
            entry: '',//输入
            eventStream: '',//事件流
            output: '',//输出
            postconditions: '',//后置条件
            logRecord: '',//日志记录
            otherNotes: '',//其他说明
            question: '',//问题

            createName: '',//编写人
            createTime: '',//编写时间
            processAnalysis: '',//流程分析
            configurationRequirements: '',//配置要求
            classDesign: '',//类层设计
            dbOperate: '',//数据库操作
            communicationDesignDescription: '',//通信接口设计说明
            complexLogic: '',//复杂逻辑及7B97法说明
            notes: '',//备注

            nodeName: '',//节点名
            checkCasesName: '',//测试用例名
            severity: 1,//优先级
            checkName: '',//检测人员
            executeTime: '',//执行日期
            passFlag: 0,//通过标志
            iniPreconditions: '',//前置条件
            operateContent: '',//操作步骤
            expectedResults: '',//预期结果
            questionDescription: '',//问题描述
            casenotes: '',

            checkCaseDetail: false,//测试用例详情是否显示
            checkCaseList: [],//测试用例列表
            whetherHidePassed: false,//是否隐藏已通过用例
            severityFilter: 100,//优先级过滤条件

            currentPage: 1
        }
        this.iniDemandItemData = []
        this.iniDetailDesignData = []
        this.iniCheckDesignListData = []
        this.iniCheckDesignData = {}
    }

    componentDidMount() {
        this.props.getChild(this)
        this.interval = setInterval(() => {
            if (getItem('edit') !== 'false' && this.props.demandNodeVisible) {
                this.autoSave()
            }
        }, autoSaveTime);
    }

    componentWillUnmount() {
        tinymce.remove()
        clearInterval(this.interval)
    }

    //判断否一项是否变更，若变更则无提示自动保存
    autoSave = () => {
        if (this.state.activeKey === 1 &&
            (this.iniDemandItemData === null || this.state.degreeOfImportance !== this.iniDemandItemData.degreeOfImportance
                || this.state.priority !== this.iniDemandItemData.priority
                || this.state.demandState !== this.iniDemandItemData.demandState
                || this.state.funDescription !== this.iniDemandItemData.funDescription
                || this.state.preconditions !== this.iniDemandItemData.preconditions
                || this.state.entry !== this.iniDemandItemData.entry
                || this.state.eventStream !== this.iniDemandItemData.eventStream
                || this.state.output !== this.iniDemandItemData.output
                || this.state.postconditions !== this.iniDemandItemData.postconditions
                || this.state.logRecord !== this.iniDemandItemData.logRecord
                || this.state.otherNotes !== this.iniDemandItemData.otherNotes
                || this.state.question !== this.iniDemandItemData.question
                || this.state.demandTraceGuid !== this.iniDemandItemData.demandTraceGuid
            )) {
            this.addOrEditDemandItem(false)
        } else if (this.state.activeKey === 2 &&
            (this.iniDetailDesignData === null || this.state.createName !== this.iniDetailDesignData.createName
                || this.state.processAnalysis !== this.iniDetailDesignData.processAnalysis
                || this.state.configurationRequirements !== this.iniDetailDesignData.configurationRequirements
                || this.state.classDesign !== this.iniDetailDesignData.classDesign
                || this.state.dbOperate !== this.iniDetailDesignData.dbOperate
                || this.state.communicationDesignDescription !== this.iniDetailDesignData.communicationDesignDescription
                || this.state.complexLogic !== this.iniDetailDesignData.complexLogic
                || this.state.notes !== this.iniDetailDesignData.notes
            )) {
            this.addOrEditDetailDesign(false)
        } else if (this.state.activeKey === 3 &&
            (this.iniCheckDesignData === null || this.state.severity !== this.iniCheckDesignData.severity
                || this.state.checkCasesName !== this.iniCheckDesignData.checkCasesName
                || this.state.checkName !== this.iniCheckDesignData.checkName
                || this.state.executeTime !== this.iniCheckDesignData.executeTime
                || this.state.passFlag !== this.iniCheckDesignData.passFlag
                || this.state.iniPreconditions !== this.iniCheckDesignData.preconditions
                || this.state.operateContent !== this.iniCheckDesignData.operateContent
                || this.state.expectedResults !== this.iniCheckDesignData.expectedResults
                || this.state.questionDescription !== this.iniCheckDesignData.questionDescription
                || this.state.casenotes !== this.iniCheckDesignData.notes
                || diffData(this.iniCheckDesignListData, this.state.checkCaseList, 'guid').length !== 0)) {
            this.addOreditChecktCase(false)
        }
    }

    //新增或者更新需求分项
    addOrEditDemandItem = (alertFlag) => {
        if (getItem('change') === 'true') {//说明需求变更进来的，需求跟踪必填
            if (this.state.demandTraceGuid === '') {
                alertFlag ? message.error('需求跟踪为必填项!', 1) : ''
                return
            }
        }
        http.post('demand/addOrEditDemandItem', {
            nodeGuid: this.props.currentFuncNodeGuid,
            guid: this.state.addFuncDesignGuid,
            degreeOfImportance: this.state.degreeOfImportance,
            priority: this.state.priority,
            demandState: this.state.demandState,
            funDescription: this.state.funDescription,
            preconditions: this.state.preconditions,
            entry: this.state.entry,
            eventStream: this.state.eventStream,
            output: this.state.output,
            postconditions: this.state.postconditions,
            logRecord: this.state.logRecord,
            otherNotes: this.state.otherNotes,
            question: this.state.question,
            demandTraceGuid: this.state.demandTraceGuid,
            demandGuid: getItem('guid'),
            changeName: getCurrentUserName(),
        }).then(data => {
            if (data.code === 1) {
                this.getDemandItem(alertFlag)
                alertFlag ? message.success('保存成功', 1) : ''
            } else {
                alertFlag ? message.error('保存失败', 1) : ''
            }
        })
    }
    //新增或者更新详细设计
    addOrEditDetailDesign = (alertFlag) => {
        http.post('demand/addOrEditDetailDesign', {
            nodeGuid: this.props.currentFuncNodeGuid,
            guid: this.state.addDetailDesignGuid,
            createName: this.state.createName,//编写人
            createTime: moment().format('YYYY-MM-DD'),//编写时间
            processAnalysis: this.state.processAnalysis,//流程分析
            configurationRequirements: this.state.configurationRequirements,//配置要求
            classDesign: this.state.classDesign,//类层设计
            dbOperate: this.state.dbOperate,//数据库操作
            communicationDesignDescription: this.state.communicationDesignDescription,//通信接口设计说明
            complexLogic: this.state.complexLogic,//复杂逻辑及7B97法说明
            notes: this.state.notes,//备注
        }).then(data => {
            if (data.code === 1) {
                this.getDetailDesign(alertFlag)
                alertFlag ? message.success('保存成功', 1) : ''
            } else {
                alertFlag ? message.error('保存失败', 1) : ''
            }
        })
    }
    //获取该需求分项的内容
    getDemandItem = (alertFlag) => {
        if (this.props.currentFuncNodeGuid === 'objective' ||
            this.props.currentFuncNodeGuid === 'reader' ||
            this.props.currentFuncNodeGuid === 'demandTerm' ||
            this.props.currentFuncNodeGuid === 'userFunc' ||
            this.props.currentFuncNodeGuid === 'func-demand' ||
            this.props.currentFuncNodeGuid === 'nofunc-demand' ||
            this.props.currentFuncNodeGuid === 'question-confirmed') {
            return
        }
        http.post('demand/getDemandItem', {
            nodeGuid: this.props.currentFuncNodeGuid,
        }).then(data => {
            if (data.code === 1) {
                this.iniDemandItemData = deepCopy(data.data)
                this.setState({
                    nodeName: data.data ? data.data.nodeName : '',
                    addFuncDesignGuid: data.data ? data.data.guid : '',
                    degreeOfImportance: data.data ? data.data.degreeOfImportance : 1,//重要程度
                    priority: data.data ? data.data.priority : 1,//优先程度
                    demandState: data.data ? data.data.demandState : 1,//需求状态
                    funDescription: data.data ? data.data.funDescription : '',//功能描述
                    preconditions: data.data ? data.data.preconditions : '',//前置条件
                    entry: data.data ? data.data.entry : '',//输入
                    eventStream: data.data ? data.data.eventStream : '',//事件流
                    output: data.data ? data.data.output : '',//输出
                    postconditions: data.data ? data.data.postconditions : '',//后置条件
                    logRecord: data.data ? data.data.logRecord : '',//日志记录
                    otherNotes: data.data ? data.data.otherNotes : '',//其他说明
                    question: data.data ? data.data.question : '',//问题
                    demandTraceGuid: data.data ? data.data.demandTraceGuid : '',//关联的需求跟踪的唯一标识
                }, () => {
                    if (getItem('edit') !== 'false') {
                        tinymce.init(iniOption('#eventstream', data.data ? data.data.eventStream : '', getItem('edit'), (c) => {
                            this.setState({
                                eventStream: c
                            })
                        }))
                        !alertFlag ? '' : tinymce.get('eventstream').setContent(data.data ? data.data.eventStream : '')
                    }
                })
            }
        })
    }
    //获取详细设计的内容
    getDetailDesign = (alertFlag) => {
        http.post('demand/getDetailDesign', {
            nodeGuid: this.props.currentFuncNodeGuid,
        }).then(data => {
            if (data.code === 1) {
                this.iniDetailDesignData = (deepCopy(data.data))
                this.setState({
                    addDetailDesignGuid: data.data ? data.data.guid : '',//新增需求设计的guid
                    createName: data.data ? data.data.createName :'',//编写人
                    createTime: data.data ? data.data.createTime : '',//编写时间
                    processAnalysis: data.data ? data.data.processAnalysis : '',//流程分析
                    configurationRequirements: data.data ? data.data.configurationRequirements : '',//配置要求
                    classDesign: data.data ? data.data.classDesign : '',//类层设计
                    dbOperate: data.data ? data.data.dbOperate : '',//数据库操作
                    communicationDesignDescription: data.data ? data.data.communicationDesignDescription : '',//通信接口设计说明
                    complexLogic: data.data ? data.data.complexLogic : '',//复杂逻辑及7B97法说明
                    notes: data.data ? data.data.notes : '',//备注
                }, () => {
                    if (this.props.detailEdit) {
                        tinymce.init(iniOption('#process-analysis', data.data ? data.data.processAnalysis : '', getItem('edit'), (c) => {
                            this.setState({
                                processAnalysis: c
                            })
                        }))
                        !alertFlag ? '' : tinymce.get('process-analysis').setContent(data.data ? data.data.processAnalysis : '')
                    }
                })
            }
        })
    }
    //新增或者更新测试用例
    addOreditChecktCase = (alertFlag) => {
        //验证条件
        // let currentDate = moment(new Date()).format("yyyy-MM-dd HH:mm:ss")
        let isAfter = moment(this.state.executeTime).isAfter(moment())
        if (this.state.executeTime !== '' && !isAfter && this.state.passFlag === 0 && this.state.questionDescription === '') {
            alertFlag ? message.error('请填写问题概述', 1) : ''
            return
        }
        tinymce.get('preconditions') ?
            http.post('demand/addOreditChecktCase', {
                nodeGuid: this.props.currentFuncNodeGuid,
                guid: this.state.addCheckDesignGuid,
                nodeName: this.state.nodeName,//节点名
                checkCasesName: this.state.checkCasesName,//测试用例名
                severity: this.state.severity,//优先级
                checkName: this.state.checkName,//检测人员
                executeTime: this.state.executeTime ? this.state.executeTime : '1970-01-01 00:00:00',//执行日期
                passFlag: this.state.passFlag,//通过标志
                preconditions: this.state.iniPreconditions,//前置条件
                operateContent: this.state.operateContent,
                expectedResults: this.state.expectedResults,
                questionDescription: this.state.questionDescription,//问题描述
                notes: this.state.casenotes,//备注
            }).then(data => {
                if (data.code === 1) {
                    this.setState({
                        addCheckDesignGuid: data.data.guid
                    }, () => {
                        this.getCheckCase(alertFlag)
                        this.listCheckCase()
                    })
                    alertFlag ? message.success('保存成功', 1) : ''
                } else {
                    alertFlag ? message.error('保存失败', 1) : ''
                }
            }) : ''
    }
    //获取测试用例
    getCheckCase = (alertFlag) => {
        http.post('demand/getCheckCase', {
            guid: this.state.addCheckDesignGuid
        }).then(data => {
            if (data.code === 1) {
                this.iniCheckDesignData = deepCopy(data.data)
                this.iniCheckDesignData.executeTime = data.data.executeTime.includes('1970') ? '' : data.data.executeTime
                this.setState({
                    addCheckDesignGuid: data.data ? data.data.guid : '',//新增的测试用例唯一标识
                    nodeName: data.data ? data.data.nodeName : '',//节点名
                    checkCasesName: data.data ? data.data.checkCasesName : '',//测试用例名
                    severity: data.data ? data.data.severity : '',//优先级
                    checkName: data.data ? data.data.checkName : '',//检测人员
                    executeTime: data.data && !data.data.executeTime.includes('1970') ? data.data.executeTime : '',//执行日期
                    passFlag: data.data ? data.data.passFlag : '',//通过标志
                    iniPreconditions: data.data ? data.data.preconditions : '',//前置条件
                    operateContent: data.data ? data.data.operateContent : '',
                    expectedResults: data.data ? data.data.expectedResults : '',
                    questionDescription: data.data ? data.data.questionDescription : '',//问题描述
                    casenotes: data.data ? data.data.notes : '',//备注
                }, () => {
                    tinymce.init(iniOption('#preconditions', data.data ? data.data.preconditions : '', getItem('edit'), (c) => {
                        this.setState({
                            iniPreconditions: c
                        })
                    }))
                    !alertFlag ? '' : tinymce.get('preconditions').setContent(data.data ? data.data.preconditions : '')
                    tinymce.init(iniOption('#operateContent', data.data ? data.data.operateContent : '', getItem('edit'), (c) => {
                        this.setState({
                            operateContent: c
                        })
                    }))
                    !alertFlag ? '' : tinymce.get('operateContent').setContent(data.data ? data.data.operateContent : '')
                    tinymce.init(iniOption('#expectedResults', data.data ? data.data.expectedResults : '', getItem('edit'), (c) => {
                        this.setState({
                            expectedResults: c
                        })
                    }))
                    !alertFlag ? '' : tinymce.get('expectedResults').setContent(data.data ? data.data.expectedResults : '')

                })
            }
        })
    }
    //获取测试用例的列表
    listCheckCase = () => {
        http.post('demand/listCheckCase', {
            nodeGuid: this.props.currentFuncNodeGuid,
        }).then(data => {
            if (data.code === 1) {
                this.iniCheckDesignListData = deepCopy(data.data)
                this.setState({
                    checkCaseList: data.data
                })
            }
        })
    }
    //删除测试用例
    deleteCheckCase = (delCheckCaseGuid) => {
        http.post('demand/deleteCheckCase', {
            guid: delCheckCaseGuid,
            userGuid: getCurrentUserGuid
        }).then(data => {
            if (data.code === 1) {
                this.listCheckCase()
            }
        })
    }
    //权限判断能否保存
    judgmentSave = (depName) => {
        let arr = depName.split('、')
        return arr.includes(getCurrentUserDepName())
    }
    //获取需求跟踪列表
    listDemandItemTrace = () => {
        http.post('demandTrace/listDemandItemTrace', {
            demandGuid: getItem('guid'),
            noBindFlag: true
        }).then(data => {
            if (data.code === 1) {
                this.setState({
                    demandTraceList: data.data
                })
            }
        })
    }
    //处理需求变更
    devDealDemandTrace = (dealState) => {
        http.post('demand/devDealDemandTrace', {
            nodeGuid: this.props.currentFuncNodeGuid,
            userName: getCurrentUserName(),
            demandItemState: dealState
        }).then(data => {
            if (data.code === 1) {
                message.success('通知成功', 1)
            } else {
                message.error('通知失败', 1)
            }
        })
    }
    //编辑测试用例
    editCheckCase = () => {
        let newcheckCaseList = diffData(this.iniCheckDesignListData, this.state.checkCaseList, 'guid')
        if (newcheckCaseList.length === 0) {
            return;
        }
        http.post('demand/editCheckCase', {
            checkCaseList: JSON.stringify(newcheckCaseList)
        }).then(data => {
            if (data.code === 1) {
                this.listCheckCase()
                message.success('保存成功', 1)
            } else {
                message.error('保存失败', 1)
            }
        })
    }

    render() {
        let colums = [{
            title: '序号',
            width: '3vw',
            render: (text, record, index) => {
                return <div>
                    {index + 1}
                </div>
            }
        }, {
            title: '功能模块',
            width: '15vw',
            dataIndex: 'nodeName',
            key: 'nodeName'
        }, {
            title: '测试名称',
            width: '15vw',
            dataIndex: 'checkCasesName',
            key: 'checkCasesName'
        }, {
            title: '优先级',
            width: '8vw',
            render: (text, record, index) => {
                return <div className='actionlist'>
                    {
                        <Select
                            style={{width: '5vw'}}
                            value={record.severity}
                            onChange={(e) => {
                                let oldCheckCaseList = deepCopy(this.state.checkCaseList)
                                oldCheckCaseList[index + 10 * (this.state.currentPage - 1)].severity = e
                                this.setState({
                                    checkCaseList: oldCheckCaseList,
                                })
                            }}
                            options={[
                                {
                                    value: 1,
                                    label: '高'
                                }, {
                                    value: 2,
                                    label: '中'
                                }, {
                                    value: 3,
                                    label: '低'
                                }
                            ]}
                        />
                    }
                </div>
            }
        }, {
            title: '检测人员',
            width: '8vw',
            dataIndex: 'checkName',
            key: 'checkName'
        }, {
            title: '执行日期',
            width: '8vw',
            dataIndex: 'executeTime',
            key: 'executeTime',
            render: (text, record, index) => {
                return record.executeTime.includes('1970') ? '' : record.executeTime.split(' ')[0]
            }
        }, {
            title: '是否通过',
            width: '8vw',
            dataIndex: 'passFlag',
            key: 'passFlag',
            render: (text, record, index) => {
                return <Select
                    style={{width: '5vw'}}
                    value={record.passFlag}
                    onChange={(e) => {
                        let oldCheckCaseList = deepCopy(this.state.checkCaseList)
                        oldCheckCaseList[index + 10 * (this.state.currentPage - 1)].passFlag = e
                        this.setState({
                            checkCaseList: oldCheckCaseList,
                        })
                    }}
                    options={[
                        {
                            value: 0,
                            label: '否'
                        }, {
                            value: 1,
                            label: '是'
                        }
                    ]}
                />
            }
        }, {
            title: '操作',
            width: '8vw',
            render: (text, record, index) => {
                return <div className='actionlist'>
                    {<div>
                        <Popconfirm
                            title={`是否删除${record.checkCasesName}测试用例吗`}
                            onConfirm={() => {
                                this.deleteCheckCase(record.guid)
                            }}
                            okText="确定"
                            cancelText="取消"
                        >
                            <span style={{color: '#1D79FC', cursor: 'pointer', marginRight: '1vw'}}>删除</span>
                        </Popconfirm>
                        <span style={{color: '#1D79FC', cursor: 'pointer'}}
                              onClick={() => {
                                  this.setState({
                                      delCheckCaseGuid: record.guid,
                                      addCheckDesignGuid: record.guid,
                                      checkCaseDetail: true
                                  }, () => {
                                      this.getCheckCase(true)
                                  })
                              }}
                        >编辑</span>
                    </div>
                    }
                </div>
            }
        }]
        let options = [
            {
                label: '是',
                value: '1',
            },
            {
                label: '否',
                value: '0',
            }
        ];

        //tab的配置项
        let items = [
            {
                label: '功能需求设计', key: 1, forceRender: true, children: (
                    <>
                        <div className="func-item">
                            <span>需求名称:</span>
                            <Input value={this.props.childNodeName} disabled={true} readOnly/>
                        </div>
                        <div className="func-item">
                            <span>重要程度:</span>
                            <Select
                                disabled={getItem('edit') === 'false'}
                                value={this.state.degreeOfImportance}
                                onChange={v => this.setState({degreeOfImportance: v})}
                                options={[
                                    {
                                        value: 1,
                                        label: '特别重要'
                                    }, {
                                        value: 2,
                                        label: '重要'
                                    }, {
                                        value: 3,
                                        label: '一般'
                                    }
                                ]}
                            />

                            <span>优先程度:</span>
                            <Select
                                disabled={getItem('edit') === 'false'}
                                value={this.state.priority}
                                onChange={v => this.setState({priority: v})}
                                options={[
                                    {
                                        value: 1,
                                        label: '特别优先'
                                    }, {
                                        value: 2,
                                        label: '优先'
                                    }, {
                                        value: 3,
                                        label: '一般'
                                    }
                                ]}
                            />
                            <span>需求状态:</span>
                            <Select
                                disabled={getItem('edit') === 'false'}
                                value={this.state.demandState}
                                onChange={v => this.setState({demandState: v})}
                                options={[
                                    {
                                        value: 1,
                                        label: '正常'
                                    }, {
                                        value: 2,
                                        label: '挂起'
                                    }, {
                                        value: 3,
                                        label: '作废'
                                    }
                                ]}
                            />
                            {
                                getItem('change') ? <><span>关联跟踪:</span>
                                    <Select
                                        disabled={getItem('edit') === 'false'}
                                        mode="multiple"
                                        value={this.state.demandTraceGuid ? this.state.demandTraceGuid.split('、') : []}
                                        onChange={(v) => this.setState({demandTraceGuid: v.join('、')})}
                                        options={
                                            this.state.demandTraceList.map((item) => {
                                                let obj = {
                                                    value: item.guid,
                                                    label: item.demandDescription,
                                                }
                                                return obj

                                            })
                                        }/></> : ''
                            }
                        </div>
                        <div className="func-item">
                            <span>功能描述:</span>
                            <Input
                                disabled={getItem('edit') === 'false'}
                                value={this.state.funDescription} onChange={(e) => {
                                this.setState({
                                    funDescription: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="func-item">
                            <span>前置条件:</span>
                            <Input
                                disabled={getItem('edit') === 'false'}
                                value={this.state.preconditions} onChange={(e) => {
                                this.setState({
                                    preconditions: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="func-item">
                            <span>输&#12288;&#12288;入:</span>
                            <Input
                                disabled={getItem('edit') === 'false'}

                                value={this.state.entry} onChange={(e) => {
                                this.setState({
                                    entry: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="func-item" style={{display: 'flex'}}>
                            <span style={{
                                display: 'block',
                                width: '3vw',
                                lineHeight: '400px',
                                marginRight: '3vw'
                            }}>事件流:&#12288;</span>
                            {
                                getItem('edit') === 'false' ? <div>{parse(this.state.eventStream)}</div> : ''
                            }
                            <div id='eventstream'>
                            </div>
                        </div>
                        <div className="func-item">
                            <span>输&#12288;&#12288;出:</span>
                            <Input disabled={getItem('edit') === 'false'}
                                   value={this.state.output} onChange={(e) => {
                                this.setState({
                                    output: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="func-item">
                            <span>后置条件:</span>
                            <Input disabled={getItem('edit') === 'false'}
                                   value={this.state.postconditions} onChange={(e) => {
                                this.setState({
                                    postconditions: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="func-item">
                            <span>log&ensp;记录:</span>
                            <Input disabled={getItem('edit') === 'false'}
                                   value={this.state.logRecord} onChange={(e) => {
                                this.setState({
                                    logRecord: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="func-item">
                            <span>其他说明:</span>
                            <Input disabled={getItem('edit') === 'false'}
                                   value={this.state.otherNotes} onChange={(e) => {
                                this.setState({
                                    otherNotes: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="func-item">
                            <span>问&#12288;&#12288;题:</span>
                            <Input disabled={getItem('edit') === 'false'}
                                   value={this.state.question} onChange={(e) => {
                                this.setState({
                                    question: e.target.value
                                })
                            }}/>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            {getItem('change') ?
                                <Button type={'primary'} disabled={!this.props.detailEdit}
                                        onClick={() => {
                                            this.devDealDemandTrace(5)
                                        }}>研发明确</Button> : ''}
                            {getItem('change') ?
                                <Button type={'primary'} disabled={!this.props.detailEdit}
                                        onClick={() => {
                                            this.devDealDemandTrace(1)
                                        }}>研发完成</Button> : ''}


                            <WaitButton
                                waitTime={1000}
                                onClick={() => {
                                    this.addOrEditDemandItem(true)
                                }}
                                disabled={getItem('edit') === 'false'}
                                style={{
                                    position: 'absolute',
                                    top: '-5.1vh',
                                    right: '0'
                                }}
                            >
                                <Button type={'primary'}
                                        disabled={getItem('edit') === 'false'}

                                >保存</Button>
                            </WaitButton>
                        </div>
                    </>
                )
            }, // 务必填写 key
            {
                label: '开发详细设计', key: 2, forceRender: true, children: (
                    <>
                        <div className="dev-item">
                            <span>编写人:</span>
                            <Input disabled={true}
                                   style={{width: '10vw', margin: '0 2vw'}}
                                   value={this.state.createName}
                                   onChange={(e) => {
                                       this.setState({
                                           createName: e.target.value
                                       })
                                   }}/>
                            <span>当前时间:</span>
                            <span style={{width: '5vw', marginLeft: '2vw'}}>{moment().format('YYYY-MM-DD')}</span>
                        </div>
                        <div style={{display: 'flex'}}>
                            <span style={{
                                display: 'inline-block',
                                width: '4vw',
                                margin: 'auto 2vw auto 0'
                            }}>流程分析:</span>
                            {
                                !this.props.detailEdit ? <div>{parse(this.state.processAnalysis)}</div> : ''
                            }
                            <div id='process-analysis'>
                            </div>
                        </div>
                        <div className="dev-item">
                            <span>配置要求:</span>
                            <Input disabled={!this.props.detailEdit}
                                   value={this.state.configurationRequirements}
                                   style={{width: '90%', marginLeft: '2vw'}} onChange={(e) => {
                                this.setState({
                                    configurationRequirements: e.target.value
                                })
                            }}/>
                        </div>
                        <div className="dev-item">
                            <span>类层设计:</span>
                            <TextArea disabled={!this.props.detailEdit}
                                      value={this.state.classDesign}
                                      style={{width: '90%', marginLeft: '2vw', verticalAlign: 'middle'}}
                                      onChange={(e) => {
                                          this.setState({
                                              classDesign: e.target.value
                                          })
                                      }}/>
                        </div>
                        <div className="dev-item">
                            <span>数据库操作:</span>
                            <TextArea disabled={!this.props.detailEdit}
                                      value={this.state.dbOperate}
                                      style={{width: '90%', marginLeft: '2vw', verticalAlign: 'middle'}}
                                      onChange={(e) => {
                                          this.setState({
                                              dbOperate: e.target.value
                                          })
                                      }}/>
                        </div>
                        <div className="dev-item">
                            <span>通信接口设计说明:</span>
                            <TextArea disabled={!this.props.detailEdit}
                                      value={this.state.communicationDesignDescription}
                                      style={{width: '90%', marginLeft: '2vw', verticalAlign: 'middle'}}
                                      onChange={(e) => {
                                          this.setState({
                                              communicationDesignDescription: e.target.value
                                          })
                                      }}/>
                        </div>
                        <div className="dev-item">
                            <span>复杂逻辑及算法说明:</span>
                            <TextArea disabled={!this.props.detailEdit}
                                      value={this.state.complexLogic}
                                      style={{width: '90%', marginLeft: '2vw', verticalAlign: 'middle'}}
                                      onChange={(e) => {
                                          this.setState({
                                              complexLogic: e.target.value
                                          })
                                      }}/>
                        </div>
                        <div className="dev-item">
                            <span>备注:</span>
                            <Input disabled={!this.props.detailEdit}
                                   value={this.state.notes} style={{width: '90%', marginLeft: '2vw'}}
                                   onChange={(e) => {
                                       this.setState({
                                           notes: e.target.value
                                       })
                                   }}/>
                        </div>
                        <div style={{textAlign: 'center', margin: '1vh 0'}}>
                            <WaitButton
                                waitTime={1000}
                                disabled={!this.props.detailEdit} onClick={() => {
                                this.addOrEditDetailDesign(true)
                            }}
                            >
                                <Button type={'primary'} disabled={!this.props.detailEdit}>保存</Button>
                            </WaitButton>
                        </div>
                    </>
                )
            },
            {
                label: '测试用例', key: 3, forceRender: true, children: (
                    <>
                        {
                            this.state.checkCaseDetail ?
                                <>  <span className="back-checkcase" onClick={() => {
                                    tinymce.remove()
                                    this.setState({
                                        checkCaseDetail: false
                                    })
                                }}>返回</span>
                                    <div className="check-item">
                                        <span className="check-item-span">功能模块:</span>
                                        <Input style={{width: '8vw', marginRight: '2vw'}}
                                               value={this.props.childNodeName} disabled={true}/>
                                        <span className="check-item-span">测试名称:</span>
                                        <Input disabled={!this.props.checkEdit}
                                               style={{width: '8vw', marginRight: '2vw'}} onChange={(e) => {
                                            this.setState({
                                                checkCasesName: e.target.value
                                            })
                                        }} value={this.state.checkCasesName}/>
                                        <span className="check-item-span">优先级:</span>
                                        <Select disabled={!this.props.checkEdit}
                                                style={{width: '8vw', marginLeft: '2vw'}}
                                                value={this.state.severity}
                                                onChange={v => this.setState({severity: v})}
                                                options={[
                                                    {
                                                        value: 1,
                                                        label: '高'
                                                    }, {
                                                        value: 2,
                                                        label: '中'
                                                    }, {
                                                        value: 3,
                                                        label: '低'
                                                    }
                                                ]}
                                        />
                                    </div>
                                    <div className="check-item">
                                        <span className="check-item-span">检测人员:</span>
                                        <Input disabled={!this.props.checkEdit}
                                               style={{width: '8vw', marginRight: '2vw'}}
                                               onClick={() => {
                                                   this.setState({
                                                       checkName: getCurrentUserName()
                                                   })
                                               }}
                                               onChange={(e) => {
                                                   this.setState({
                                                       checkName: e.target.value
                                                   })
                                               }}
                                               value={this.state.checkName}/>
                                        <span className="check-item-span">执行日期:</span>
                                        <DatePicker disabled={!this.props.checkEdit}
                                                    style={{width: '8vw'}}
                                                    format={'YYYY-MM-DD'}
                                                    showTime={true}
                                                    value={this.state.executeTime ? moment(this.state.executeTime) : null}
                                                    onChange={(value, date) => this.setState({executeTime: date})}
                                        />
                                        <span className="check-item-span">是否通过:</span>
                                        <Radio.Group disabled={!this.props.checkEdit}
                                                     value={this.state.passFlag}
                                                     options={options} optionType="button" style={{marginLeft: '2vw'}}
                                                     onChange={(e) => {
                                                         this.setState({
                                                             passFlag: e.target.value
                                                         })
                                                     }}
                                        />
                                    </div>
                                    <div className="check-item" style={{display: 'flex'}}>
                                        <span className="check-item-span" style={{marginRight: '2vw'}}>前置条件:</span>
                                        {
                                            !this.props.checkEdit ? <div>{parse(this.state.preconditions)}</div> : ''
                                        }
                                        <div id="preconditions">
                                        </div>
                                    </div>
                                    <div className="check-item" style={{display: 'flex'}}>
                                        <span className="check-item-span" style={{marginRight: '2vw'}}>操作步骤:</span>
                                        {
                                            !this.props.checkEdit ? <div>{parse(this.state.operateContent)}</div> : ''
                                        }
                                        <div id="operateContent">
                                        </div>
                                    </div>
                                    <div className="check-item" style={{display: 'flex'}}>
                                        <span className="check-item-span" style={{marginRight: '2vw'}}>预期结果:</span>
                                        {
                                            !this.props.checkEdit ? <div>{parse(this.state.expectedResults)}</div> : ''
                                        }
                                        <div id="expectedResults">
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <span className="check-item-span">问题概述:</span>
                                        <Input disabled={!this.props.checkEdit}
                                               onChange={(e) => {
                                                   this.setState({
                                                       questionDescription: e.target.value
                                                   })
                                               }} value={this.state.questionDescription}/>
                                    </div>
                                    <div className="check-item">
                                        <span className="check-item-span">备注:</span>
                                        <Input disabled={!this.props.checkEdit}
                                               onChange={(e) => {
                                                   this.setState({
                                                       casenotes: e.target.value
                                                   })
                                               }} value={this.state.casenotes}/>
                                    </div>
                                    <div style={{textAlign: 'center', margin: '1vh 0'}}>
                                        <WaitButton
                                            waitTime={1000}
                                            disabled={!this.props.checkEdit}
                                            onClick={() => {
                                                this.addOreditChecktCase(true)
                                            }}
                                        >
                                            <Button type={'primary'} disabled={!this.props.checkEdit}>保存</Button>
                                        </WaitButton>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="check">
                                        <Checkbox
                                            disabled={!this.props.checkEdit}
                                            onChange={(e) => {
                                                this.setState({
                                                    whetherHidePassed: e.target.checked
                                                })
                                            }}
                                        /><span style={{margin: '0 1vw'}}>隐藏已通过用例</span>
                                        <span style={{margin: '0 1vw'}}>优先级</span>
                                        <Select
                                            disabled={!this.props.checkEdit}
                                            value={this.state.severityFilter}
                                            onChange={(v) => {
                                                this.setState({
                                                    severityFilter: v
                                                })
                                            }}
                                            options={[{
                                                value: 100,
                                                label: '全部'
                                            },
                                                {
                                                    value: 1,
                                                    label: '高'
                                                }, {
                                                    value: 2,
                                                    label: '中'
                                                }, {
                                                    value: 3,
                                                    label: '低'
                                                }
                                            ]}
                                        />

                                        <Button type={'primary'}
                                                style={{margin: '0 1vw'}}
                                                disabled={!this.props.checkEdit}
                                                onClick={() => {
                                                    this.iniCheckDesignData = {
                                                        checkCaseDetail: true,
                                                        addCheckDesignGuid: '',
                                                        nodeName: '',//节点名
                                                        checkCasesName: '',//测试用例名
                                                        severity: 1,//优先级
                                                        checkName: '',//检测人员
                                                        executeTime: '',//执行日期
                                                        passFlag: 0,//通过标志
                                                        iniPreconditions: '',//前置条件
                                                        operateContent: '',//操作步骤
                                                        expectedResults: '',//预期结果
                                                        questionDescription: '',//问题描述
                                                        casenotes: '',
                                                    }
                                                    this.setState({
                                                        checkCaseDetail: true,
                                                        addCheckDesignGuid: '',
                                                        nodeName: '',//节点名
                                                        checkCasesName: '',//测试用例名
                                                        severity: 1,//优先级
                                                        checkName: '',//检测人员
                                                        executeTime: '',//执行日期
                                                        passFlag: 0,//通过标志
                                                        iniPreconditions: '',//前置条件
                                                        operateContent: '',//操作步骤
                                                        expectedResults: '',//预期结果
                                                        questionDescription: '',//问题描述
                                                        casenotes: '',
                                                    }, () => {
                                                        if (this.props.checkEdit) {
                                                            tinymce.init(iniOption('#preconditions', '', getItem('edit'), (c) => {
                                                                this.setState({
                                                                    iniPreconditions: c
                                                                })
                                                            }))
                                                            tinymce.init(iniOption('#operateContent', '', getItem('edit'), (c) => {
                                                                this.setState({
                                                                    operateContent: c
                                                                })
                                                            }))
                                                            tinymce.init(iniOption('#expectedResults', '', getItem('edit'), (c) => {
                                                                this.setState({
                                                                    expectedResults: c
                                                                })
                                                            }))
                                                        }
                                                    })
                                                }}>新增</Button>
                                        <Button
                                            disabled={!this.props.checkEdit}
                                            onClick={() => {
                                                this.editCheckCase()
                                            }} type={'primary'}>
                                            保存
                                        </Button>
                                        <Table
                                            columns={colums}
                                            rowKey={record => record.guid}
                                            dataSource={this.state.checkCaseList.filter((item) => {
                                                return ((this.state.whetherHidePassed ? item.passFlag === 0 : 1) && (this.state.severityFilter === 100 ? 1 : item.severity === this.state.severityFilter))
                                            })}
                                            pagination={{
                                                current: this.state.currentPage,
                                                onChange: (page) => {
                                                    this.setState({currentPage: page})
                                                }
                                            }}
                                        />
                                    </div>
                                </>
                        }
                    </>
                )
            }
        ];
        return <div id="demand-node">
            <Tabs
                className={'ant-tabs'}
                items={items}
                defaultActiveKey={getItem('tabKey') ? parseInt(getItem('tabKey')) : 1}
                onChange={(activeKey) => {
                    this.setState({activeKey})
                }}
                destroyInactiveTabPane={false}
            />
        </div>
    }
}

export default DemandNode
