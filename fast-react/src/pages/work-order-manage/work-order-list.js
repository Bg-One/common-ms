import React, { Component } from "react";
import { connect } from "react-redux";
import { saveRedux } from "../../redux/action";
import { Button, Table, Input, Select, DatePicker, message, Modal, TreeSelect } from 'antd'
import { getItem, getGuid, deepCopy, getCurrentUserDepName, multiConditionSort, mergesFilter, initWorkOrder } from '../../common/function'
import { exportExcel } from '../../common/exportToExcel/js-export-excel'
import moment from "moment";
import http from '../../common/http'
import './work-order-list.scss'
import back from '../../image/back.png'
import file from '../../image/file.png'
import withdraw from '../../image/withdraw.png'
import { projectExecutionStatusEnum } from "../../common/dist-enum";
import pinyinUtil from "../../common/react-pinyin-master";
import WaitButton from "../../common/wait-button/button";
import TextArea from "antd/lib/input/TextArea";
import { saveAs } from "file-saver";

const { RangePicker } = DatePicker

class WorkSubmit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workOrderList: [],
            isDetail: !!this.props.history.location.state,  // 是否进入编辑或者新建页面
            producemsUserInfo: {},  // 登录人员相关信息 
            projectNameList: [], // 项目名称
            workTypeList: [], // 工单类型
            workItemList: [], // 工单条目
            workCategoryList: [], // 工单类目
            demandItemNameList: [], // 功能点
            withdrawWorkModal: false, // 撤回工单Modal框
            reason: '', // 退单理由
            isView: false, // 是否是查看
            saveOfDraft: false,  // 是否是保存或者是提交
            producemsUserName: '', // 当前人员（默认为自己）
            producemsDepName: [], // 当前人员部门（默认为自己部门）
            startTime: moment().startOf('month').format('YYYY-MM-DD'),
            endTime: moment().format('YYYY-MM-DD'),
            projectName: ['全选'], // 项目名称（工时统计也会用上）
            userList: [], // 人员列表
            selectMember: [], // 选择的成员
            selectWorkType: ['全选'],  // 选择的工作类型
            selectWorkCategory: ['全选'], // 选择的工作类目
            isShowSelectMember: false, // 选择成员列表是否显示
            departmentMember: [], // 部门成员,
            isStatisticsDetail: false, // 统计工单详情页
            activeType: '项目',  // 选中状态类型（项目/成员）
            statisticsByProject: [], // 按项目工时列表
            statisticsByUser: [], // 按人员工时列表
            funcDemandChild: [],//功能需求子节点
            nofuncDemandChild: [],//非功能需求节点
            demandkeyword: '',//需求关键字
            expandedKeys: [],
            autoExpandParent: true,
            treeData: [],
            isSubmit: true, // 节流阀，防止多次点击
            filterProjectList: [], // 该成员参与的项目列表

            isProjectDep: false, // 用于判断是不是项目部 

            // 多报单模式
            workList: [],
            // 当前用户信息
            createName: '',
            createGuid: '',
            departmentName: '',
            departmentGuid: '',
            producemsUserType: '',
            // 报单所属时间
            createTime: '',
            // 审核关系
            reviewRelationshipList: [],
            // 工单查询 搜索
            selectDepGuid: [],
            selectUserGuid: '',
            selectProjectGuid: '',
            selectStartTime: moment().startOf('month').format('YYYY-MM-DD'),
            selectEndTime: moment().format('YYYY-MM-DD'),
            selectStatus: '', // 工单状态  0为全选
            searchRules: null,

            // 列表每页行数
            pageSize: 100
        }
        this.status = ''
        this.isReview = ''// '1'=待评审 其他=待审核
        this.isSearch = ''
        this.isStatistics = ''
        this.nodeList = []//节点列表

        // 代码优化  待优化
        this.pageType = '' //当前页面是 waitToSubmit=待提交 waitToCheck=待审核 myCheck=我评审的 searchList=工单查询 countPage=统计

        // 按项目
        this.statisticsByProjectColumns = [{
            title: '项目编号',
            dataIndex: 'projectNo',
            key: 'projectNo',
            onCell: (record, index) => {
                let maxRowSpan = 0
                for (let i = 0; i < this.state.statisticsByProject.length; i++) {
                    if (record.projectName === this.state.statisticsByProject[i].projectName) maxRowSpan++
                }
                if (index !== 0 && record.projectName === this.state.statisticsByProject[index - 1].projectName) {
                    return { rowSpan: 0 }
                } else {
                    return { rowSpan: maxRowSpan }
                }
            },
        }, {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            onCell: (record, index) => {
                let maxRowSpan = 0
                for (let i = 0; i < this.state.statisticsByProject.length; i++) {
                    if (record.projectName === this.state.statisticsByProject[i].projectName) maxRowSpan++
                }
                if (index !== 0 && record.projectName === this.state.statisticsByProject[index - 1].projectName) {
                    return { rowSpan: 0 }
                } else {
                    return { rowSpan: maxRowSpan }
                }
            },
        }, this.state.isProjectDep && {
            title: '项目部工作',
            key: 'projectDepworkType',
            render: (text, record, index) => {
                return record.projectDepworkType
            }
        }, {
            title: '工作类型',
            dataIndex: 'workType',
            key: 'workType',
            render: (text, record, index) => {
                return this.props.workType.find(item => item.guid === record.workTypeGuid) ? this.props.workType.find(item => item.guid === record.workTypeGuid).name : ''
            }
        },
        {
            title: '工作类目',
            dataIndex: 'workCategory',
            key: 'workCategory',
            render: (text, record, index) => {
                return this.props.workCategory.find(item => item.guid === record.workCategoryGuid) ? this.props.workCategory.find(item => item.guid === record.workCategoryGuid).name : ''
            }
        }, {
            title: '工作条目',
            dataIndex: 'workItem',
            key: 'workItem',
            render: (text, record, index) => {
                return this.props.workItem.find(item => item.guid === record.workItemGuid) ? this.props.workItem.find(item => item.guid === record.workItemGuid).name : ''
            }
        }, , {
            title: '员工姓名',
            dataIndex: 'createName',
            key: 'createName',
            onCell: (record, index) => {
                let maxRowSpan = 0
                for (let i = 0; i < this.state.statisticsByProject.length; i++) {
                    if (record.projectName === this.state.statisticsByProject[i].projectName && record.createName === this.state.statisticsByProject[i].createName) maxRowSpan++
                }
                if (index !== 0 && record.projectName === this.state.statisticsByProject[index - 1].projectName
                    && record.createName === this.state.statisticsByProject[index - 1].createName) {
                    return { rowSpan: 0 }
                } else {
                    return { rowSpan: maxRowSpan }
                }
            },
        },
        {
            title: '工时',
            dataIndex: 'workDuration',
            key: 'workDuration',
        },
        {
            title: '总工时',
            dataIndex: 'allWorkDuration',
            key: 'allWorkDuration',
            onCell: (record, index) => {
                let maxRowSpan = 0
                for (let i = 0; i < this.state.statisticsByProject.length; i++) {
                    if (record.projectName === this.state.statisticsByProject[i].projectName && record.createName === this.state.statisticsByProject[i].createName) maxRowSpan++
                }
                if (index !== 0 && record.projectName === this.state.statisticsByProject[index - 1].projectName
                    && record.createName === this.state.statisticsByProject[index - 1].createName) {
                    return { rowSpan: 0 }
                } else {
                    return { rowSpan: maxRowSpan }
                }
            },
        }, this.state.isProjectDep && {
            title: '项目部工作工时',
            dataIndex: 'projectDepworkDuration',
            key: 'projectDepworkDuration', // 改字段名
        }, {
            title: '项目总工时',
            dataIndex: 'projectWorkDuration',
            key: 'projectWorkDuration',
            onCell: (record, index) => {
                let maxRowSpan = 0
                for (let i = 0; i < this.state.statisticsByProject.length; i++) {
                    if (record.projectName === this.state.statisticsByProject[i].projectName) maxRowSpan++
                }
                if (index !== 0 && record.projectName === this.state.statisticsByProject[index - 1].projectName) {
                    return { rowSpan: 0 }
                } else {
                    return { rowSpan: maxRowSpan }
                }
            },
        }, {
            title: '项目占比',
            dataIndex: 'proportion',
            key: 'proportion',
            onCell: (record, index) => {
                let maxRowSpan = 0
                for (let i = 0; i < this.state.statisticsByProject.length; i++) {
                    if (record.projectName === this.state.statisticsByProject[i].projectName) maxRowSpan++
                }
                if (index !== 0 && record.projectName === this.state.statisticsByProject[index - 1].projectName) {
                    return { rowSpan: 0 }
                } else {
                    return { rowSpan: maxRowSpan }
                }
            },
        }].filter(Boolean)

        // 按人员
        this.statisticsByUserColumns = [{
            title: '成员姓名',
            dataIndex: 'createName',
            key: 'createName',
            onCell: (record, index) => {
                if (index === this.state.statisticsByUser.length - 1 && index > 0) {
                    if (record.createName !== this.state.statisticsByUser[index - 1].createName) return { rowSpan: 1 }
                    else return { rowSpan: 0 }
                }
                for (let i = index + 1; i <= this.state.statisticsByUser.length; i++) {
                    if (i === this.state.statisticsByUser.length) {
                        return { rowSpan: i - index }
                    } else if (index != 0 && record.createName === this.state.statisticsByUser[index - 1].createName) {
                        return { rowSpan: 0 }
                    } else if (record.createName !== this.state.statisticsByUser[i].createName) {
                        return { rowSpan: i - index }
                    }
                }
            },
        },
        {
            title: '项目编号',
            dataIndex: 'projectName',
            key: 'projectName',
            render: (text, record, index) => {
                return this.props.listProject.find(item => item.guid === record.projectGuid) ? this.props.listProject.find(item => item.guid === record.projectGuid).projectNo : ''
            }
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',

        }, {
            title: '工时',
            dataIndex: 'projectWorkDuration',
            key: 'projectWorkDuration',
        }, {
            title: '人员总工时',
            dataIndex: 'allWorkDuration',
            key: 'allWorkDuration',
            onCell: (record, index) => {
                if (index === this.state.statisticsByUser.length - 1 && index > 0) {
                    if (record.createName !== this.state.statisticsByUser[index - 1].createName) return { rowSpan: 1 }
                    else return { rowSpan: 0 }
                }
                for (let i = index + 1; i <= this.state.statisticsByUser.length; i++) {
                    if (i === this.state.statisticsByUser.length) {
                        return { rowSpan: i - index }
                    } else if (index != 0 && record.createName === this.state.statisticsByUser[index - 1].createName) {
                        return { rowSpan: 0 }
                    } else if (record.createName !== this.state.statisticsByUser[i].createName) {
                        return { rowSpan: i - index }
                    }
                }
            },
        }]
    }

    async componentDidMount() {
        this.status = getItem('status')
        this.isReview = getItem('isReview')
        this.isSearch = getItem('isSearch')
        this.isStatistics = getItem('isStatistics')
        this.pageType = getItem('pageType')
        // 删除切换日期留存的数据
        localStorage.setItem('temp_oldWorkList', '')

        await new Promise(async (resolve, reject) => {
            let producemsUserInfo = JSON.parse(localStorage.getItem('producemsUserInfo'))
            this.setState({
                isDetail: !!getItem("isDetail"),
                // 这些变量，单独写state
                createName: producemsUserInfo.currentInfo.producemsUserName,
                createGuid: producemsUserInfo.currentInfo.producemsUserGuid,
                departmentName: producemsUserInfo.currentInfo.producemsDepName,
                departmentGuid: producemsUserInfo.currentInfo.producemsDepGuid,
                producemsUserType: producemsUserInfo.currentInfo.producemsUserType,
                // 是否为项目部
                isProjectDep: producemsUserInfo.currentInfo.producemsDepName === '项目部'
            }, () => {
                // 这个方法是获取当前用户参与的项目列表，不着急所以允许异步获取
                this.getFilterProjectListByUser(this.state.createGuid)
                resolve()
            })
        })

        // 初始化模块
        this.mounted()

        // 获取审核关系  不着急所以允许异步获取
        this.getReviewRelationshipList()
    }

    // 获取审核关系
    getReviewRelationshipList = async () => {
        let result = await http.post('userinfo/listReviewRelationship')
        if (result.code !== 1) {
            message.error('获取审核关系数据失败')
            return
        }
        this.setState({
            reviewRelationshipList: result.data
        })
    }

    // 手动触发组件挂载完毕
    mounted = () => {
        let firstTimer = setInterval(() => {
            let userList = []
            if (/部经理/.test(this.state.producemsUserType)) {
                userList = this.props.userList.map(item => {
                    if (item.depGuid === this.state.departmentGuid) return { value: item.userName }
                }).filter(item => item)
            } else {
                userList = this.props.userList.map(item => ({ value: item.userName }))
            }
            if (userList[0]) {
                clearInterval(firstTimer)
                userList.unshift({ value: '全选' })
                this.setState({ userList })
            }
        }, 100)

        if (this.isStatistics === '1') {
            // 工时统计页面初始化
            let projectNameList = [], workTypeList = [], workCategoryList = []
            let timer = setInterval(() => {
                projectNameList = this.props.listProject.map(item => ({ value: item.guid, label: item.name }))  // 初始化项目名称
                workCategoryList = this.props.workCategory.map(item => ({ value: item.guid, label: item.name })) // 初始化工作类目
                // 在初始化完成后检查是否所有列表都已经初始化完成
                if (projectNameList[0] && workCategoryList[0]) {
                    // 如果所有列表都已初始化完成，清除定时器
                    clearInterval(timer);
                    projectNameList.unshift({ value: '全选' })
                    workCategoryList.unshift({ value: '全选' })
                    let departmentMember = []
                    departmentMember = this.props.depList.map(item => ({
                        value: item.guid,
                        title: <div style={{ position: 'relative' }}>{item.name}<span
                            style={{ position: 'absolute', right: '5vw', color: 'gray' }} onClick={e => {
                                e.stopPropagation();
                                this.handleStatisticsOption('selectAllMember', item.guid)
                            }}>＋</span></div>,
                        children: this.props.userList.map(i => {
                            if (i.depGuid === item.guid) return { value: i.userGuid, title: i.userName }
                        }).filter(item => item)
                    }))
                    this.setState({ projectNameList, workCategoryList, departmentMember })
                    if (this.state.isStatisticsDetail) {
                        this.getStatisticsList('项目')
                        this.getStatisticsList('成员')
                    }
                }
            }, 500);

        } else {
            // 列表页面
            let producemsDepName = []
            producemsDepName.push(this.state.departmentName)
            this.setState({
                selectDepGuid: this.state.producemsUserType === '总经理' ? [] : [this.state.departmentGuid],
                selectUserGuid: this.state.producemsUserType === '总经理' ? '' : this.state.createGuid,
                selectStatus: this.state.producemsUserType === '总经理' ? '3' : ''
            }, () => {
                this.isSearch === '1' ? this.getWorkOrderList() : this.getWorkOrderListByStatus()
            })
        }
    }

    // 初始化报单
    initWorkList = () => {
        // 新建报单
        let workList = [initWorkOrder()]
        this.setState({
            isSubmit: true,
            workList,
            isDetail: true,
        })
    }

    // 获取项目列表
    getFilterProjectListByUser = async (createGuid) => {
        let data = await http.post('project/listProjectByUserGuid', {
            currentLoginGuid: createGuid,
            depName: getCurrentUserDepName()
        })
        if (data.code !== 1) {
            message.error('获取当前人员相关项目列表失败')
            return
        }

        let filterProjectList = []
        // 等一下 listProject 的数据
        await new Promise((resolve, reject) => {
            let timeSecond = 0
            let awaitList = setInterval(() => {
                timeSecond = timeSecond + 1000
                if (this.props.listProject[0]) {
                    resolve()
                    clearInterval(awaitList)
                }
                if (timeSecond > 15000) {
                    reject()
                    clearInterval(awaitList)
                }
            }, 200)
        })
        data.data.map(async item => {
            this.props.listProject.filter(i => i.guid === item && i.executionStatus === projectExecutionStatusEnum.EXECUTING).map(i => {
                filterProjectList.push({ value: i.guid, label: i.name })
            })
        })
        this.setState({ filterProjectList })
    }

    // 获取工单列表
    getWorkOrderList = () => {
        console.log('获取工单列表')
        let obj = {
            status: this.state.selectStatus,
            createGuid: this.state.selectUserGuid,
            departmentGuid: this.state.selectDepGuid.join('、'),
            projectGuid: this.state.selectProjectGuid,
            startTime: this.state.selectStartTime,
            endTime: this.state.selectEndTime
        }
        http.post('workOrder/listWorkOrder', obj).then(data => {
            if (data.code !== 1) {
                message.error('获取工单列表失败')
                return
            }
            let workOrderList = data.data
            // 时间倒序
            workOrderList.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
            this.setState({ workOrderList, searchRules: obj })
        })
    }

    // 工单查询的 导出excel   obj无法保证最新 加个变量控制
    searchListExportToExcel = () => {
        let obj = this.state.searchRules
        // 查询规则如果出错
        if (!obj) {
            message.error('错误')
            console.log(obj)
        }
        message.loading({
            content: '请稍后',
            key: 'exportWorkOrder',
            duration: 0
        })
        // 参数同 workOrder/listWorkOrder
        http.post('workOrder/exportWorkOrder', obj, { responseType: 'blob' }).then(data => {
            message.destroy('exportWorkOrder')
            saveAs(data, '工单明细表' + obj.startTime + '——' + obj.endTime + '.xlsx')
        })
    }

    // 根据状态获取工单列表，个人查询
    getWorkOrderListByStatus = async () => {
        let data = await http.post('workOrder/listWorkOrderByStatus', {
            status: this.status,
            reviewGuid: this.pageType === 'myCheck' ? this.state.createGuid : '',
            currentLoginGuid: ['waitToSubmit', 'waitToCheck', 'searchList'].includes(this.pageType) ? this.state.createGuid : ''
        })
        if (data.code !== 1) {
            message.error('获取工单列表失败', 1)
            console.log('listWorkOrderByStatus error')
            return
        }
        let workOrderList = data.data
        workOrderList = multiConditionSort(workOrderList, [
            { key: "createTime", order: -1 },
            { key: "createName", order: 1 },
            { key: "departmentName", order: 1 },
            { key: "workType", order: 1 },
            { key: "projectName", order: 1 },
            { key: "workCategory", order: 1 },
            { key: "workItem", order: 1 },
            { key: "content", order: 1 },
            { key: "workDuration", order: -1 }
        ])
        this.setState({
            workOrderList,
            isSubmit: true
        })
    }

    // 获取工单详情
    openSheetInfo = async (record) => {
        return new Promise(async (resolve, reject) => {
            let workList = []
            if (localStorage.getItem('temp_oldWorkList')) {
                workList = JSON.parse(localStorage.getItem('temp_oldWorkList'))
                localStorage.setItem('temp_oldWorkList', '')
            }
            if (!record) {
                record = {
                    createGuid: this.state.createGuid,
                    createTime: moment().format('YYYY-MM-DD')
                }
            }
            message.loading({
                content: '请稍后',
                key: 'getWorkOrder',
                duration: 0
            })
            let data = await http.post('workOrder/getWorkOrder', {
                createTime: record.createTime,
                createGuid: record.createGuid,
            })
            message.destroy('getWorkOrder')
            if (data.code !== 1) {
                message.error('获取工单详情失败')
                return
            }
            workList = [...workList, ...data.data.reverse()]
            // 获取功能点
            for (let i = 0; i < workList.length; i++) {
                let record = workList[i]
                if (!record.projectGuid || record.workCategory !== '软件开发') continue // 非 软件开发 不存在项目名时，不获取功能点
                let produceGuid = this.props.listProject.find(item => item.guid === record.projectGuid).produceGuid
                record = await this.listNodes(record, produceGuid)
            }
            this.setState({
                workList,
                createTime: record.createTime,
                isDetail: true
            }, async () => {
                if (!workList[0]) await this.pushInitToList()
                resolve()
            })
        })
    }

    // 修改input内容
    handleInputChange = (record, type, value) => {
        if (record.status !== 1) {
            message.error('禁止修改', 1)
            return
        }
        record[type] = value
        this.setState({})
    }

    // 修改select内容
    handleSelectChange = async (record, type, value) => {
        if (record.status !== 1) {
            message.error('禁止修改', 1)
            return
        }
        switch (type) {
            // 工作类型
            case 'workType':
                record.workTypeGuid = value
                record.workType = this.props.workType.find(item => item.guid === value)?.name
                record.workCategoryGuid = ''
                record.workCategory = ''
                record.workItemGuid = ''
                record.workItem = ''
                if (record.workType === '技术勘探研发类') {
                    record.projectGuid = ''
                    record.projectName = ''
                }
                break
            // 工作类目
            case 'workCategory':
                record.workCategoryGuid = value
                record.workCategory = this.props.workCategory.find(item => item.guid === value)?.name
                record.workItemGuid = ''
                record.workItem = ''
                break
            case 'workItem':
                record.workItemGuid = value
                record.workItem = this.props.workItem.find(item => item.guid === value)?.name
                break
            case 'projectName':
                record.projectGuid = value
                record.projectName = this.props.listProject.find(item => item.guid === value).name
                break
            case 'demandItemName':
                record.demandItemName = value
                record.demandItemGuid = this.nodeList.find(item => item.name === value)?.guid
                break
            case 'projectDepworkTypeId':
                record.projectDepworkTypeId = value
                break
        }

        if (value === '功能需求') record.demandItemGuid = 'func-demand'
        else if (value === '非功能需求') record.demandItemGuid = 'nofunc-demand'

        // 修改工作类目、项目名称是时，清除旧功能点，获取新功能点列表
        if (['workCategory', 'projectName'].includes(type) && record.workCategory === '软件开发' && record.projectGuid) {
            //清除选中的旧功能点
            record.demandItemGuid = ''
            record.demandItemName = ''
            // 获取新功能点列表
            let produceGuid = this.props.listProject.find(item => item.guid === record.projectGuid).produceGuid
            record = await this.listNodes(record, produceGuid)
        }

        // 修改了record指向的workList，需要刷新render
        this.setState({})
    }

    // 提交工单
    handleSubmit = async (workListTemp) => {
        let workList = deepCopy(workListTemp.filter(i => i.status === 1))
        for (let i = 0; i < workList.length; i++) {
            let selectWorkOrder = workList[i]
            // 判断逻辑
            if (!selectWorkOrder.createTime) {
                message.error('报单日期不能为空', 1)
                return
            }
            // if (!selectWorkOrder.reason && moment(selectWorkOrder.createTime).isBefore(moment().subtract(7, 'days'))) {
            //     message.error('报单过期，不可提交', 1)
            //     return
            // }
            if (moment(selectWorkOrder.createTime).isAfter(moment())) {
                message.error('报单不可提前提交', 1)
                return
            }
            if (!selectWorkOrder.workType) {
                message.error('工作类型不能为空', 1)
                return
            }
            if (!selectWorkOrder.workCategory) {
                message.error('工作类目不能为空', 1)
                return
            }
            if (selectWorkOrder.workType === '产品项目类' && !selectWorkOrder.workItem) {
                message.error('工作条目不能为空', 1)
                return
            }
            if (!selectWorkOrder.projectName && selectWorkOrder.workType != '技术勘探研发类') {
                message.error('项目名称不能为空', 1)
                return
            }
            if (selectWorkOrder.workCategory === '软件开发' && ['前端开发', '后端开发', '服务开发', '缺陷修改'].includes(selectWorkOrder.workItem) && !selectWorkOrder.demandItemName) {
                message.error('功能点不能为空', 1)
                return
            }
            if (!selectWorkOrder.workDuration) {
                message.error('工作时长不能为空', 1)
                return
            }
            if (selectWorkOrder.workDuration % 0.5 || selectWorkOrder.workDuration < 0) {
                message.error('时长填写错误', 1)
                return
            }
            if (this.state.isProjectDep && !selectWorkOrder.projectDepworkTypeId) {
                message.error('项目部工作不能为空', 1)
                return
            }
            if (!selectWorkOrder.content) {
                message.error('工作内容不能为空', 1)
                return
            }
        }
        if (this.getTotalWorkLength(workListTemp, [1, 2, 3]) > 24) {
            message.error('今日累计工作时长超过了24小时，请修改', 1)
            return
        }

        // 最后保存
        this.setState({ isSubmit: false })
        await this.asynGetProjectUser()
        this.setState({ isSubmit: true })
    }

    // 发送异步请求获取项目分配资源
    asynGetProjectUser = async () => {
        let workList = deepCopy(this.state.workList)
        return new Promise(async (resolve, reject) => {
            // 循环设置审核人
            let reviewObj = this.state.reviewRelationshipList.find(item => item.userGuid === this.state.createGuid)
            if (reviewObj) {
                for (let item of workList) {
                    item.reviewGuid = reviewObj.reviewGuid
                }
            }

            this.setState({ workList }, () => {
                this.saveWorkOrder()
                resolve()
            })
        })
    }

    // 保存草稿 isEdit true为保存为编辑存量信息
    saveWorkOrder = async (isEdit) => {
        if (!localStorage.getItem('producemsUserInfo')) {
            message.error('未获取到用户信息，请稍后重试', 1)
            return
        }
        this.setState({ isSubmit: false })
        let workList = deepCopy(this.state.workList.filter(i => i.status === 1))
        message.loading({
            content: '保存中，请稍后',
            key: 'updateWorkOrder',
            duration: 0
        })
        let data = await http.post('workOrder/updateWorkOrder', { workOrderList: JSON.stringify(workList) })
        message.destroy('updateWorkOrder')
        if (data.code !== 1) {
            message.error('保存失败')
            this.setState({ isSubmit: true })
            return
        }

        // 留存编辑记录
        if (!isEdit && this.state.producemsDepName === '研发部') {
            localStorage.setItem("workorderInfo", JSON.stringify(workList))
        }

        // 如果是存草稿
        if (this.state.saveOfDraft) {
            message.success('保存成功')
            // 统计数量
            let data = await http.post('workOrder/countWorkOrderStatus', {
                userGuid: this.state.createGuid
            })
            if (data.code !== 1) {
                message.error(data.message)
                return
            }
            this.props.saveRedux('workOrderMessageList', data.data)

            // 报单提交 流转状态
        } else {
            let data = await http.post('workOrder/updateWorkOrderStatus', {
                createUserGuid: this.state.createGuid,
                createTime: this.state.createTime,
                status: 2,
                reason: '',
                guids: workList.filter(i => i.status === 1).map(i => i.guid).join(','),
                reviewGuid: ''       //审核人
            })
            if (data.code !== 1) {
                message.success(data.message)
                return
            }
            message.success('保存成功')
        }
        // 存到本地一份初始化报单信息
        localStorage.setItem('temp_workOrder_Obj', JSON.stringify(this.state.workList[0]))
        this.setState({ isDetail: false }, () => {
            this.getWorkOrderListByStatus() // 重新请求列表数据
            this.setState({ isSubmit: true })
        })
    }

    // 删除工单
    deleteWorkOrder = async (record) => {
        if (!confirm('确认删除？')) return
        message.loading({
            content: '删除中，请稍后',
            key: 'deleteWorkOrder',
            duration: 0
        })
        let data = await http.post('workOrder/deleteWorkOrder', { guid: record.guid })
        message.destroy('deleteWorkOrder')
        if (data.code === 1) {
            message.success('删除成功')
            this.state.workList = this.state.workList.filter(item => item.guid != record.guid) //如果是详情页面删除
            this.getWorkOrderListByStatus() // 重新请求列表
        } else {
            message.error('删除失败')
        }

    }

    // 撤回审核工单
    handelWithdraw = async (guids) => {
        if (!confirm('确认撤回？')) return
        message.loading({
            content: '撤回中，请稍后',
            key: 'updateWorkOrderStatus',
            duration: 0
        })
        let data = await http.post('workOrder/updateWorkOrderStatus', {
            createUserGuid: this.state.createGuid,
            createTime: this.state.createTime,
            status: 1,
            reason: '',
            guids: guids || '',//如果有值，则仅处理这些票的状态，否则处理当天的
            reviewGuid: ''       //审核人
        })
        message.destroy('updateWorkOrderStatus')
        if (data.code !== 1) {
            message.error(data.message)
            return
        }
        (guids || '').split(',').map(item => {
            this.state.workList.map(i => {
                if (item === i.guid) {
                    i.status = 1
                }
            })
        })
        this.getWorkOrderListByStatus() // 重新请求列表
        message.success('撤回成功')
    }

    // 更改工单状态（审核操作 过/不过）
    changeWorkOrderStatus = async (type, workList) => {
        if (!confirm(type === 'noPass' ? '确认退单？' : '确认审核通过？')) return
        // 退单
        let reasonModal
        let reasonContent = ''

        if (type === 'noPass') {
            await new Promise((resolve, reject) => {
                reasonModal = Modal.confirm({
                    title: '退单',
                    content: <div>
                        <TextArea placeholder="请输入退单原因" onChange={(e) => { reasonContent = e.target.value }} />
                    </div>,
                    onOk: () => resolve(),
                    onCancel: () => {
                        reject('取消操作')
                    }
                })
            })
        }
        if (type === 'noPass' && !reasonContent) {
            message.error('请填写退单理由，方可退单')
            return
        }
        let data = await http.post('workOrder/updateWorkOrderStatus', {
            createUserGuid: this.state.workList[0].createGuid,
            createTime: this.state.createTime,
            status: type === 'pass' ? 3 : 1,
            reason: reasonContent,
            guids: workList.map(item => item.guid).join(','),
            reviewGuid: this.state.createGuid       //审核人
        })
        if (data.code !== 1) {
            message.error(data.message)
            return
        }
        if (type === 'pass') message.success('审核通过')
        if (type === 'noPass') {
            reasonModal?.destroy()
            message.success('退单成功')
        }
        // 刷新列表
        ['searchList'].includes(this.pageType) ? this.getWorkOrderList() : this.getWorkOrderListByStatus()

        await this.openSheetInfo({
            createTime: this.state.createTime,
            createGuid: this.state.workList[0].createGuid,
        })
        // 是否返回列表页
        if (
            ['myCheck'].includes(this.pageType) && !this.state.workList.some(item => item.status === 2)
            || ['searchList'].includes(this.pageType) && !this.state.workList.some(item => item.status === 3)
        ) {
            this.setState({
                isDetail: false
            })
        }
    }

    // 处理选择区
    handleSearchOption = (key, value) => {
        let obj = {}
        // 部门
        if (key === 'selectDepGuid') {
            obj.selectDepGuid = value
        }

        // 员工
        if (key === 'selectUserGuid') {
            obj.selectUserGuid = value
            // 当查别人的 只能看已审核了的
            this.handleSearchOption('selectStatus', value != this.state.createGuid ? '3' : '')
        }

        // 项目
        if (key === 'selectProjectGuid') {
            obj.selectProjectGuid = value
        }

        // 日期段
        if (key === 'selectRangePiker') {
            obj.selectStartTime = value[0]
            obj.selectEndTime = value[1]
        }

        // 状态
        if (key === 'selectStatus') {
            obj.selectStatus = value
        }

        this.setState(obj)


        // if (key === 'selectStatus'
        //     && /(部经理|分管副总|总经理)/.test(this.state.producemsUserType)
        //     && this.state.producemsUserName !== this.state.producemsUserInfo.currentInfo.producemsUserName
        //     && value !== '已审核'
        // ) {
        //     message.error('只能查询已审核的工单')
        //     return
        // } 

        // if (type === 'producemsUserName') this.setState({ selectStatus: '已审核' }) // 此逻辑是分管副总以上的人更改查询名字时，自动将查询状态改为已审核
        // if (typeof value === 'object' && value[value.length - 1] === '全选') {
        //     this.setState({ [type]: '全选' })
        // } else {
        //     this.setState({ [type]: typeof value === 'object' ? value.filter(item => item !== '全选') : value })
        // }
    }

    // 处理多选日期
    handleRangeDate = (dates) => {
        this.setState({
            startTime: dates[0].format('YYYY-MM-DD'),
            endTime: dates[1].format('YYYY-MM-DD')
        })
    }

    // 处理统计选择框
    handleStatisticsOption = (type, value, label, extra) => {
        if (type === 'selectAllMember') {
            let selectMember = deepCopy(this.state.selectMember)
            selectMember.push(value)
            this.setState({ selectMember })
            return
        }
        if (type === 'selectMember' && this.state.selectMember.length > value.length) {
            for (let dep of this.props.depList) {
                if (extra.triggerValue === dep.guid) {
                    this.setState({ selectMember: value })
                    break
                }
            }
        }
        if (value[value.length - 1] === '全选') {
            this.setState({ [type]: '全选' })
        } else {
            this.setState({ [type]: typeof value === 'object' ? value.filter(item => item !== '全选') : value })
        }
    }

    // 统计工时提交按钮
    handleCountHours = () => {
        if (!this.state.selectMember[0]) {
            message.error('请选择需要统计的成员')
            return
        }
        if (!this.state.selectWorkType[0] || !this.state.selectWorkCategory[0]) {
            message.error('工作类型、工作类目不能为空')
            return
        }
        if (!this.state.projectName[0]) {
            message.error('项目名称不能为空')
            return
        }
        if (moment(this.state.startTime).isAfter(moment(this.state.endTime)) || moment(this.state.startTime).isAfter(moment()) || moment(this.state.endTime).isAfter(moment())) {
            message.error('开始时间或结束时间选择错误')
            return
        }
        this.getStatisticsList('项目')
        this.getStatisticsList('成员')
    }

    getStatisticsList = (type) => {
        let isProjectDep = true // 用于判断是否是项目部
        let ProjectDepGuid = this.props.depList.find(item => item.name === '项目部').guid
        // 此处只是用来判断是不是项目部成员
        for (let item of this.state.selectMember) {
            for (let i = 0; i < this.props.depList.length; i++) {
                if (this.props.depList[i].guid === item) {
                    if (item !== ProjectDepGuid) isProjectDep = false
                    break
                } else if (i === this.props.depList.length - 1) {
                    if (this.props.userList.find(user => user.userGuid === item).depGuid !== ProjectDepGuid) {
                        isProjectDep = false
                        break
                    }
                }
            }
        }
        let selectMember = []
        this.state.selectMember.forEach(value => {
            //判断value是否为部门的guid如果是则获取部门下的所有员工
            let depList = this.props.depList.filter((item) => {
                return item.guid === value
            })
            if (depList.length !== 0) {
                let userList = this.props.userList.filter((item) => {
                    return item.depGuid === value
                })
                for (let userListElement of userList) {
                    selectMember.push(userListElement.userGuid)
                }
            }
        })
        this.setState({ isProjectDep }, () => {
            let url = type === '项目' ? 'workOrder/statisticProjectWorkDuration' : 'workOrder/statisticUserWorkDuration'
            http.post(url, {
                createUserGuid: selectMember.join('、') + "、" + this.state.selectMember.filter((item, index, self) => self.indexOf(item) === index).join('、'),
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                workTypeGuid: this.state.selectWorkType === '全选' ? '' : this.state.selectWorkType.join('、'),
                projectGuid: this.state.projectName === '全选' ? '' : this.state.projectName.join('、'),
                workCategoryGuid: this.state.selectWorkCategory === '全选' ? '' : this.state.selectWorkCategory.join('、'),
            }).then(data => {
                if (data.code === 1) {
                    type === '项目' ? this.setState({
                        statisticsByProject: data.data.sort(function (a, b) {
                            return a.projectName === b.projectName ? a.createName.localeCompare(b.createName) : a.projectName.localeCompare(b.projectName)
                        }), isStatisticsDetail: true
                    }, () => {
                        let trElement = document.createElement('tr')
                        for (let i = 0; i < 8; i++) {
                            let thElement = document.createElement('th')
                            thElement.style.backgroundColor = '#fff'
                            thElement.style.color = '#000'
                            thElement.style.textAlign = 'center'
                            if (i === 0) {
                                thElement.innerText = '开始日期'
                            } else if (i === 1) {
                                thElement.innerText = moment(this.state.startTime).format('YYYY/MM/DD')
                            } else if (i === 2) {
                                thElement.innerText = '结束日期'
                            } else if (i === 3) {
                                thElement.innerText = moment(this.state.endTime).format('YYYY/MM/DD')
                            }
                            // 将 thElement 添加到 trElement 中
                            trElement.appendChild(thElement)
                        }
                        let theadElement = document.getElementsByClassName('ant-table-thead')[0]
                        theadElement.insertBefore(trElement, theadElement.firstChild)
                    }) : this.setState({
                        statisticsByUser: data.data,
                        isStatisticsDetail: true
                    })
                }
            })
        })
    }

    // 导出excel
    exportToExcel = () => {
        let option = {}
        let mergeArray = []
        let cellStyles = []//表样式信息
        let sheetFilter = []
        let sheetHeader = ['开始日期', moment(this.state.startTime).format('YYYY/MM/DD'), '结束日期', moment(this.state.endTime).format('YYYY/MM/DD')]
        let multiHeader = []
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let tableData = this.state.activeType === '项目' ? this.state.statisticsByProject : this.state.statisticsByUser
        if (this.state.activeType === '项目') {
            tableData.forEach(obj => {
                obj.workType = this.props.workType.find(item => item.guid === obj.workTypeGuid) ? this.props.workType.find(item => item.guid === obj.workTypeGuid).name : ''
                obj.workCategory = this.props.workCategory.find(item => item.guid === obj.workCategoryGuid) ? this.props.workCategory.find(item => item.guid === obj.workCategoryGuid).name : ''
                obj.workItem = this.props.workItem.find(item => item.guid === obj.workItemGuid) ? this.props.workItem.find(item => item.guid === obj.workItemGuid).name : ''
            })
            sheetFilter = ['projectNo', 'projectName', 'workType', 'workCategory', 'workItem', 'createName', 'workDuration', 'allWorkDuration', 'projectWorkDuration', 'proportion']
            multiHeader = ['项目编号', '项目名称', '工作类型', '工作类目', '工作条目', '员工姓名', '工时', '总工时', '项目总工时', '项目占比']
            if (this.state.isProjectDep) {
                sheetFilter.splice(1, 0, 'projectDepworkType')
                sheetFilter.splice(6, 0, 'projectDepworkDuration') // 等后端字段名
                multiHeader.splice(1, 0, '项目部工作')
                multiHeader.splice(6, 0, '项目部工作工时')
            }
            for (let i = 0; i < 10; i++)
                for (let j = 1; j <= this.state.statisticsByProject.length + 2; j++)
                    j === 2 ? cellStyles.push({
                        name: alphabet[i] + j,
                        style: {
                            alignment: { horizontal: "center", vertical: "center" },
                            fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "01a7f0" } },
                            font: { color: { rgb: "FFFFFF" } }
                        }
                    }) :
                        cellStyles.push({
                            name: alphabet[i] + j,
                            style: { alignment: { horizontal: "center", vertical: "center" } }
                        })
        } else {
            tableData.forEach(obj => {
                obj.projectNo = this.props.listProject.find(item => item.guid === obj.projectGuid) ? this.props.listProject.find(item => item.guid === obj.projectGuid).projectNo : ''
            })
            for (let i = 0; i < 5; i++)
                for (let j = 1; j <= this.state.statisticsByUser.length + 2; j++)
                    j === 2 ? cellStyles.push({
                        name: alphabet[i] + j,
                        style: {
                            alignment: { horizontal: "center", vertical: "center" },
                            fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "01a7f0" } },
                            font: { color: { rgb: "FFFFFF" } }
                        }
                    }) :
                        cellStyles.push({
                            name: alphabet[i] + j,
                            style: { alignment: { horizontal: "center", vertical: "center" } }
                        })
            sheetFilter = ['createName', 'projectNo', 'projectName', 'projectWorkDuration', 'allWorkDuration']
            multiHeader = ['成员姓名', '项目编号', '项目名称', '工时', '人员总工时']
        }
        if (tableData.length > 0) {
            /** 表头合并 */
            mergeArray = this.state.activeType === '项目' ? this.handleProjectMerge() : this.handleUserMerge()
            //样式  可循环输入全部单元格
            // cellStyles.push({ name: `A1`, style: { alignment: { height: 90, wrapText: true, horizontal: "center", vertical: "center" } } })
            //生成其他信息
            option.fileName = `${moment().format('YYYY-MM-DD')}工时统计`;
            option.datas = [
                {
                    sheetData: tableData,
                    sheetName: `${moment().format('YYYY-MM-DD')}工时统计`,
                    sheetFilter: sheetFilter,
                    sheetHeader: sheetHeader,
                    cellStyles: cellStyles,
                    columnWidths: this.state.activeType === '项目' ? [{ wpx: 100 }, { wpx: 200 }, { wpx: 100 }, { wpx: 110 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 100 }] : [{ wpx: 80 }, { wpx: 150 }, { wpx: 200 }, { wpx: 110 }, { wpx: 100 }],
                    merges: mergeArray,
                    multiHeader: multiHeader
                }
            ];
            exportExcel(option).saveExcel();
        } else {
            message.warning('没有可导出的数据');
        }
    }

    // 获取功能菜单
    listNodes = (record, produceGuid) => {
        return new Promise(async (resolve, reject) => {
            let data = await http.post('softwareCheck/listNodes', { produceGuid })
            record.funcDemandChild = []
            record.nofuncDemandChild = []
            if (data.code !== 1) {
                message.error(record.projectName + '项目，获取需求节点失败')
                resolve(record)
                return
            }
            if (!data.data || !data.data[0]) {
                message.error(record.projectName + '项目，需求节点为空')
                resolve(record)
                return
            }
            // 数据正确时
            record.funcDemandChild = this.createFuncDemandNode(data.data, 1)
            record.nofuncDemandChild = this.createFuncDemandNode(data.data, 2)
            resolve(record)
        })
    }

    // 处理项目合并
    handleProjectMerge = () => {
        // { s: { c: 0, r: 0 }, e: { c: 0, r: 1 } }
        let { statisticsByProject } = this.state
        let index = 0
        let arr = []
        let maxRowSpan = 0
        while (index < statisticsByProject.length) {
            maxRowSpan = 0
            for (let i = 0; i < statisticsByProject.length; i++) {
                if (statisticsByProject[index].projectName === statisticsByProject[i].projectName
                ) maxRowSpan++
            }
            if (index !== 0 && this.state.statisticsByProject[index].projectName === this.state.statisticsByProject[index - 1].projectName) {
                arr.push({ s: { c: 0, r: index + 2 }, e: { c: 0, r: index + 2 } })
                arr.push({ s: { c: 1, r: index + 2 }, e: { c: 1, r: index + 2 } })
                arr.push({ s: { c: 10, r: index + 2 }, e: { c: 10, r: index + 2 } })
                arr.push({ s: { c: 11, r: index + 2 }, e: { c: 11, r: index + 2 } })
            } else {
                arr.push({ s: { c: 0, r: index + 2 }, e: { c: 0, r: index + 1 + maxRowSpan } })
                arr.push({ s: { c: 1, r: index + 2 }, e: { c: 1, r: index + 1 + maxRowSpan } })
                arr.push({ s: { c: 10, r: index + 2 }, e: { c: 10, r: index + 1 + maxRowSpan } })
                arr.push({ s: { c: 11, r: index + 2 }, e: { c: 11, r: index + 1 + maxRowSpan } })

            }
            index++
        }

        // 导出单元格合并  项目工作类型和工作类型工时
        if (this.state.isProjectDep) {
            index = 0
            let maxRowSpan = 0
            while (index < statisticsByProject.length) {
                maxRowSpan = 0
                for (let i = 0; i < statisticsByProject.length; i++) {
                    if (statisticsByProject[index].projectName === statisticsByProject[i].projectName
                        && statisticsByProject[index].createName === statisticsByProject[i].createName
                        && statisticsByProject[index].projectDepworkType === statisticsByProject[i].projectDepworkType) maxRowSpan++
                }
                if (index !== 0 && this.state.statisticsByProject[index].projectName === this.state.statisticsByProject[index - 1].projectName
                    && this.state.statisticsByProject[index].createName === this.state.statisticsByProject[index - 1].createName
                    && this.state.statisticsByProject[index].projectDepworkType === this.state.statisticsByProject[index - 1].projectDepworkType
                ) {
                    arr.push({ s: { c: 1, r: index + 2 }, e: { c: 1, r: index + 2 } })
                    arr.push({ s: { c: 6, r: index + 2 }, e: { c: 6, r: index + 2 } })
                } else {
                    arr.push({ s: { c: 1, r: index + 2 }, e: { c: 1, r: index + 1 + maxRowSpan } })
                    arr.push({ s: { c: 6, r: index + 2 }, e: { c: 6, r: index + 1 + maxRowSpan } })
                }
                index++
            }
        }
        let maxRowSpan1 = 0
        index = 0
        while (index < statisticsByProject.length) {
            maxRowSpan1 = 0
            for (let i = 0; i < statisticsByProject.length; i++) {
                if (statisticsByProject[index].projectName === statisticsByProject[i].projectName
                    && statisticsByProject[index].createName === statisticsByProject[i].createName
                ) maxRowSpan1++
            }
            if (index !== 0 && this.state.statisticsByProject[index].projectName === this.state.statisticsByProject[index - 1].projectName
                && this.state.statisticsByProject[index].createName === this.state.statisticsByProject[index - 1].createName) {
                arr.push({ s: { c: 5, r: index + 2 }, e: { c: 5, r: index + 2 } })
                arr.push({ s: { c: 8, r: index + 2 }, e: { c: 8, r: index + 2 } })
            } else {
                arr.push({ s: { c: 5, r: index + 2 }, e: { c: 5, r: index + 1 + maxRowSpan1 } })
                arr.push({ s: { c: 8, r: index + 2 }, e: { c: 8, r: index + 1 + maxRowSpan1 } })
            }
            index++
        }
        return arr
    }

    // 处理成员合并
    handleUserMerge = () => {
        let { statisticsByUser } = this.state
        let index = 0
        let arr = []
        while (index < statisticsByUser.length) {
            if (index === statisticsByUser.length - 1) {
                break
            }
            for (let i = index + 1; i <= statisticsByUser.length; i++) {
                if (i === statisticsByUser.length) {
                    if (index + 1 === i) break
                    arr.push({ s: { c: 0, r: index + 2 }, e: { c: 0, r: i + 1 } })
                    arr.push({ s: { c: 4, r: index + 2 }, e: { c: 4, r: i + 1 } })
                    index = i - 1
                    break
                } else if (statisticsByUser[index].createName !== statisticsByUser[i].createName) {
                    if (index + 1 === i) break
                    arr.push({ s: { c: 0, r: index + 2 }, e: { c: 0, r: i + 1 } })
                    arr.push({ s: { c: 4, r: index + 2 }, e: { c: 4, r: i + 1 } })
                    index = i - 1
                    break
                }
            }
            index++
        }
        return arr
    }

    //创建需求节点
    createFuncDemandNode = (item, classType) => {
        let newNodeList = []
        item.forEach((i) => {
            if (i.classType == classType) {
                newNodeList.push(this.createTreeItem(
                    i.name,
                    i.name,
                    <img src={file} style={{
                        width: '1.0vw',
                        verticalAlign: 'text-bottom'
                    }} />,
                    i.child.length === 0 ? '' : this.createFuncDemandNode(i.child, classType),
                    i.nodeType
                ))
                this.nodeList.push({ guid: i.guid, name: i.name })
            }
        })
        return newNodeList;
    }

    //生成tree项
    createTreeItem = (title, value, icon, children, disabled) => {
        return {
            value,
            icon,
            children,
            title,
            disabled: !disabled,//样式与选中完全禁用
            // selectable: disabled,//有样式显示但是禁用选中 
        };
    }

    // 根据条件修改table列
    changeColunms = (colunms) => {
        //我评审的
        if (this.isReview === '1') {
            colunms.unshift({
                title: '员工姓名',
                dataIndex: 'createName',
                key: 'createName'
            }, {
                title: '部门',
                key: 'depName',
                render: (text, record, index) => {
                    return this.props.userList[0] && this.props.depList[0] ? this.props.depList.find(item => item.guid === this.props.userList.find(i => i.userName === record.createName).depGuid).name : ''
                }
            })
            //统计查询
        } else if (this.isSearch === '1') {
            colunms.unshift({
                title: '员工姓名',
                dataIndex: 'createName',
                key: 'createName'
            }, {
                title: '审核人',
                dataIndex: 'reviewName',
                key: 'reviewName'
            })
        }
        return colunms
    }

    pushInitToList = () => {
        return new Promise(async (resolve, reject) => {
            let newObj = deepCopy(initWorkOrder())
            newObj.createTime = this.state.createTime
            // 获取新功能点列表
            if (newObj.projectGuid && newObj.workCategory === '软件开发') {  // 非 软件开发 不存在项目名时，不获取功能点
                let produceGuid = this.props.listProject.find(item => item.guid === newObj.projectGuid).produceGuid
                newObj = await this.listNodes(newObj, produceGuid)
            }

            this.setState({
                workList: [newObj, ...this.state.workList]
            }, () => {
                resolve()
            })
        })
    }

    // 获取总共的工作时长
    getTotalWorkLength = (workList, status) => {
        let total = 0
        workList.filter(item => status.includes(item.status)).map(item => total = total + item.workDuration)
        return total
    }

    // 超八小时提醒
    workLengthMessage = (workList) => {
        return new Promise((resolve, reject) => {
            if (this.getTotalWorkLength(workList, [1, 2, 3]) > 8) {
                let warningModal = Modal.confirm({
                    title: '温馨提示',
                    content: '您当天的工作时长已超过8小时，请与项目经理确认好工作安排',
                    onOk: () => {
                        resolve()
                        warningModal.destroy()
                    },
                    onCancel: () => {
                        reject()
                        warningModal.destroy()
                    }
                })
                return
            }
            resolve()
        })
    }

    // 根据提交报单的人createGuid，获取审核人
    getReViewName = (guid, relaList, userList) => {
        let reviewGuid = relaList.find(i => i.userGuid === guid)?.reviewGuid
        let reviewObj = userList.find(i => i.userGuid === reviewGuid)?.userName
        return reviewObj
    }

    render() {
        const { workOrderList } = this.state
        return <div id="work-submit">
            <div className="head-title">
                <div>工作报单</div>

                {/* 工单查询 */}
                {this.isSearch === '1' && !this.state.isView && !this.state.isDetail ? <div className="serach-menu">
                    <Select
                        style={{ width: '15vw' }}
                        showSearch
                        mode="multiple"
                        showArrow
                        value={this.state.selectDepGuid}
                        placeholder='全选'
                        options={this.props.depList.map(item => ({ label: item.name, value: item.guid }))}
                        onChange={(value) => {
                            this.handleSearchOption('selectDepGuid', value)
                            this.handleSearchOption('selectUserGuid', '')
                        }}
                        disabled={!/(分管副总|总经理)/.test(this.state.producemsUserType)}
                    />
                    <Select
                        style={{ width: '7vw' }}
                        showSearch
                        value={this.state.selectUserGuid}
                        options={[{ label: '全部', value: '' }].concat(this.props.userList.filter(item => this.state.selectDepGuid.includes(item.depGuid)).map(i => ({ label: i.userName, value: i.userGuid })))}
                        onChange={(value) => { this.handleSearchOption('selectUserGuid', value) }}
                    // disabled={!/(部经理|分管副总|总经理)/.test(this.state.producemsUserType)}
                    />
                    <Select
                        style={{ width: '19vw' }}
                        showSearch
                        value={this.state.selectProjectGuid}
                        placeholder='全选'
                        showArrow
                        options={[{ value: '', label: '全选' }, ...this.props.listProject.map(item => ({ value: item.guid, label: item.name }))]}
                        onChange={(value) => { this.handleSearchOption('selectProjectGuid', value) }}
                    />
                    <RangePicker
                        style={{ width: '18vw' }}
                        value={this.state.selectStartTime && this.state.selectEndTime ? [moment(this.state.selectStartTime), moment(this.state.selectEndTime)] : null}
                        format={'YYYY-MM-DD'}
                        onChange={(e, date) => { this.handleSearchOption('selectRangePiker', date) }}
                    />
                    <Select
                        style={{ width: '6vw' }}
                        placeholder='全选'
                        value={this.state.selectStatus}
                        options={[{ value: '', label: '全选' }, { value: '1', label: '待提交' }, { value: '2', label: '待审核' }, { value: '3', label: '已审核' }]}
                        onChange={(value) => { this.handleSearchOption('selectStatus', value) }}
                        disabled={this.state.selectUserGuid != this.state.createGuid}
                    />
                    <Button
                        type="primary"
                        style={{ marginLeft: '1vw', }}
                        onClick={() => { this.getWorkOrderList() }}
                    >搜索</Button>
                    <Button
                        type="primary"
                        style={{ marginLeft: '1vw', }}
                        onClick={() => this.searchListExportToExcel()}
                        disabled={!this.state.workOrderList[0]}
                    >导出excel</Button>
                </div> : null}

                {/* 新建工单 */}
                {!this.state.isDetail && ['waitToSubmit'].includes(this.pageType) ? <Button
                    type="primary"
                    onClick={async () => {
                        await this.openSheetInfo({
                            createGuid: this.state.createGuid,
                            createTime: moment().format('YYYY-MM-DD')
                        })
                        this.status = 1
                        this.isReview = '0'
                    }}
                >新建工单</Button> : null}
            </div>

            {/* 统计工时页面 */}
            {['countPage'].includes(this.pageType) && <div className="statistics-page">
                <div className="head-title">
                    <div>
                        {this.state.isStatisticsDetail && <>
                            <img src={back}
                                style={{ width: '1.5vw', verticalAlign: 'text-bottom' }} />
                            <span style={{ fontSize: '1.2vw', color: '#1D79FC', cursor: 'pointer' }} onClick={() => {
                                this.setState({
                                    isDetail: false,
                                    isView: false,
                                    workOrderList: [],
                                    isStatisticsDetail: false,
                                    statisticsByProject: [],
                                    statisticsByUser: [],
                                    createTime: ''
                                })
                            }}>返回</span>
                        </>}
                        <span className="blue-title">工时统计</span>
                    </div>
                </div>

                {/* 工时统计 详情*/}
                {this.state.isStatisticsDetail && <div className="statistics-detail">
                    <div className="statistics-result">
                        <span>工时统计结果</span>
                        <span
                            className={this.state.activeType === '项目' ? 'active' : ''}
                            onClick={() => this.setState({ activeType: '项目' })}
                        >按项目</span>
                        <span
                            className={this.state.activeType === '成员' ? 'active' : ''}
                            onClick={() => this.setState({ activeType: '成员' })}
                        >按成员</span>
                        <Button
                            type={'primary'}
                            className="export-btn"
                            onClick={this.exportToExcel}
                        >工时导出</Button>
                    </div>
                    <div className="statistics-table">
                        {/* 按项目 */}
                        {this.state.activeType === '项目' ? <Table
                            columns={this.statisticsByProjectColumns}
                            dataSource={this.state.statisticsByProject}
                            bordered
                            pagination={false}
                            rowKey={(record, index) => index}
                        /> : null}
                        {/* 按成员 */}
                        {this.state.activeType === '成员' ? <Table
                            columns={this.statisticsByUserColumns}
                            dataSource={this.state.statisticsByUser}
                            bordered
                            pagination={false}
                            rowKey={(record, index) => index}
                        /> : null}
                    </div>
                </div>}

                {/* 工时统计 初始条件页*/}
                {!this.state.isStatisticsDetail && <div className="statistics-body">
                    <div>
                        <span>
                            <span>选择成员：</span>
                            <Button
                                style={{
                                    backgroundColor: 'rgb(1,167,240)',
                                    color: '#fff',
                                    display: this.state.isShowSelectMember ? 'none' : 'inline-block'
                                }}
                                onClick={() => { this.setState({ isShowSelectMember: true }) }}
                            >选择成员</Button>
                            {this.state.isShowSelectMember ? <TreeSelect
                                showSearch
                                style={{ width: '12vw', }}
                                value={this.state.selectMember}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', }}
                                multiple
                                showArrow
                                onChange={(value, label, extra) => this.handleStatisticsOption('selectMember', value, label, extra)}
                                treeData={this.state.departmentMember}
                            /> : ''}
                        </span>
                    </div>
                    <div>
                        <span>
                            <span>开始时间：</span>
                            <DatePicker
                                value={this.state.startTime ? moment(this.state.startTime) : ''}
                                onChange={(value) => { this.handleStatisticsOption('startTime', value ? moment(value).format('YYYY-MM-DD') : '') }}
                            />
                        </span>
                        <span style={{ marginLeft: '3vw' }}>
                            结束时间：<DatePicker
                                value={this.state.endTime ? moment(this.state.endTime) : ''}
                                onChange={(value) => { this.handleStatisticsOption('endTime', value ? moment(value).format('YYYY-MM-DD') : '') }}
                            />
                        </span>
                    </div>
                    <div>
                        <span>
                            <span>选择工作类型：</span>
                            <Select mode="multiple"
                                options={this.props.workTypeList}
                                showArrow
                                value={this.state.selectWorkType}
                                onChange={(value) => {
                                    this.handleStatisticsOption('selectWorkType', value)
                                }}
                            />
                        </span>
                    </div>
                    <div>
                        <span>
                            <span>选择项目名称：</span>
                            <Select showSearch mode="multiple"
                                options={this.state.projectNameList}
                                showArrow
                                value={this.state.projectName}
                                onChange={(value) => {
                                    this.handleStatisticsOption('projectName', value)
                                }}
                            />
                        </span>
                    </div>
                    <div>
                        <span>
                            <span>选择工作类目：</span>
                            <Select mode="multiple"
                                options={this.state.workCategoryList}
                                showArrow
                                value={this.state.selectWorkCategory}
                                onChange={(value) => {
                                    this.handleStatisticsOption('selectWorkCategory', value)
                                }}
                            />
                        </span>
                    </div>
                    <Button className="statistics-btn" onClick={this.handleCountHours}>统计工时</Button>
                </div>}
            </div>}

            {/* 报单详情页面 */}
            {this.state.isDetail && <div className="Edit-page">
                <div className="head-title">
                    <div>
                        <img src={back} style={{ width: '1.5vw', verticalAlign: 'text-bottom' }} />
                        <span
                            style={{ fontSize: '1.2vw', color: '#1D79FC', cursor: 'pointer' }}
                            onClick={() => {
                                this.setState({ isDetail: false, isView: false })
                            }}>返回</span>
                        {this.isReview === '0' ? <span>新建工作报单</span> : ''}
                    </div>
                </div>
                <div className="edit-content">
                    <div className="edit-list">
                        <span>员工姓名：<Input value={this.state.workList[0] && this.state.workList[0].createName} disabled /></span>
                        <span>部门：<Input value={this.state.workList[0]?.departmentName} disabled /></span>
                        <span>
                            报单日期：
                            <DatePicker
                                id="createTime"
                                value={this.state.createTime ? moment(this.state.createTime) : moment()}
                                format={'YYYY-MM-DD'}
                                disabled={!['waitToSubmit'].includes(this.pageType)}
                                onChange={async (e, value) => {
                                    if (value) {
                                        let oldWorkList = this.state.workList.filter(item => item.status === 1 && item.content).map(item => {
                                            item.createTime = value
                                            item.guid = getGuid()
                                            return item
                                        })
                                        if (!oldWorkList[0]) {
                                            this.openSheetInfo({
                                                createGuid: this.state.createGuid,
                                                createTime: value
                                            })
                                            return
                                        }
                                        let warningModal = oldWorkList[0] && Modal.warning({
                                            title: '存在待提交报单且工作内容不为空，是否将本页的待提交报单移动到指定日期',
                                            content: <div style={{ display: 'flex', justifyContent: 'space-around', margin: '1.5rem auto 0' }}>
                                                <Button
                                                    type='primary'
                                                    onClick={async () => {
                                                        localStorage.setItem('temp_oldWorkList', JSON.stringify(oldWorkList))
                                                        await this.openSheetInfo({
                                                            createGuid: this.state.createGuid,
                                                            createTime: value
                                                        })
                                                        warningModal.destroy()
                                                    }}
                                                >移动</Button>
                                                <Button
                                                    type='primary'
                                                    danger
                                                    onClick={async () => {
                                                        await this.openSheetInfo({
                                                            createGuid: this.state.createGuid,
                                                            createTime: value
                                                        })
                                                        warningModal.destroy()
                                                    }}
                                                >不需要</Button>
                                            </div>,
                                            closable: 'true',
                                            okButtonProps: { style: { display: 'none' } }
                                        })
                                    }
                                }}
                            />
                        </span>
                        <b>合计工作时长：{this.getTotalWorkLength(this.state.workList, [1, 2, 3])}小时</b>
                    </div>
                    {(this.state.createGuid === this.state.workList[0]?.createGuid || ['waitToSubmit'].includes(this.pageType)) && <div className="create-work-sheet">新增工作内容<i onClick={() => this.pushInitToList()}>+</i></div>}
                    {this.state.workList.sort((a, b) => a.status - b.status).filter(item => !(this.isSearch === '1' && item.createGuid != this.state.createGuid && item.status != 3)).map((item, index) => <div
                        className="edit-list"
                        key={'edit-list-item-' + index}
                        style={{
                            display: this.isReview === '1' && item.status === 1 ? 'none' : 'block',
                            background: item.status === 1 ? '#fff' : item.status === 2 ? '#ffc0cb26' : item.status === 3 ? '#00800012' : '#fff',
                        }}
                    >
                        <div>
                            <b>当前状态：
                                {item.status === 1 ? '待提交' : null}
                                {item.status === 2 ? '待审核' : null}
                                {item.status === 3 ? '已审核' : null}
                            </b>
                            {item.reviewName && <b style={{ margin: '0 1vw' }}>审核人：{item.reviewName}</b>}

                            {/* 仅限编辑人 在 待提交、待审核时 点击 */}
                            {this.isReview === '0' && [1, 2].includes(item.status) ? <Button
                                style={{ margin: '0 0 0 1vw' }}
                                type="primary"
                                onClick={() => {
                                    this.deleteWorkOrder(item)
                                }}
                            >删除</Button> : null}

                            {this.isReview === '0' && item.status === 2 ? <Button
                                style={{ background: 'rgb(255 75 0)', margin: '0 0 0 1vw', color: '#fff' }}
                                onClick={() => { this.handelWithdraw(item.guid) }}
                            >撤回</Button> : null}

                            {this.isReview === '1' && item.status === 2 ? <Button
                                style={{ background: 'green', margin: '0 0 0 1vw', color: '#fff' }}
                                onClick={() => { this.changeWorkOrderStatus('pass', [item]) }}
                            >通过</Button> : null}

                            {this.isReview === '1' && item.status === 2 ? <Button
                                style={{ background: 'rgb(255 75 0)', margin: '0 0 0 1vw', color: '#fff' }}
                                onClick={() => this.changeWorkOrderStatus('noPass', [item])}
                            >退单</Button> : null}
                            {/* 工单查询  审核允许退单  评审中，待实现 提交时间限制*/}
                            {this.isSearch === '1' && item.status === 3 && this.state.createName === this.getReViewName(this.state.workList[0].createGuid, this.state.reviewRelationshipList, this.props.userList) ? <Button
                                style={{ background: 'rgb(255 75 0)', margin: '0 0 0 1vw', color: '#fff' }}
                                onClick={() => this.changeWorkOrderStatus('noPass', [item])}
                            >退单</Button> : null}
                        </div>
                        {/* 限制某些情况下禁掉鼠标 */}
                        <span>
                            <span className="mini-title">工作类型：</span>
                            <Select
                                value={item.workTypeGuid}
                                onChange={value => this.handleSelectChange(item, 'workType', value)}
                                options={this.props.workType.map(item => ({ value: item.guid, label: item.name }))}
                            />
                        </span>
                        <span>
                            <span className="mini-title">工作类目：</span>
                            <Select
                                value={item.workCategoryGuid}
                                onChange={value => { this.handleSelectChange(item, 'workCategory', value) }}
                                options={this.props.workCategory.map(i => item.workTypeGuid === i.workOrderTypeGuid ? { value: i.guid, label: i.name } : null).filter(Boolean)}
                            />
                        </span>
                        <span>
                            <span className="mini-title">工作条目：</span>
                            <Select
                                value={item.workItemGuid}
                                onChange={value => { this.handleSelectChange(item, 'workItem', value) }}
                                options={this.props.workItem.map(i => item.workCategoryGuid === i.workOrderCategoryGuid ? { value: i.guid, label: i.name } : null).filter(Boolean)}
                            />
                        </span>
                        <span>
                            <span className="mini-title">项目名称：</span>
                            <Select
                                value={item.projectName}
                                showSearch
                                filterOption={(input, option) => pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1}
                                onChange={value => this.handleSelectChange(item, 'projectName', value)}
                                options={this.state.filterProjectList}
                                disabled={item.workType === '技术勘探研发类'}
                            />
                        </span>
                        {item.workCategory === '软件开发' && ['前端开发', '后端开发', '服务开发', '缺陷修改'].includes(item.workItem) ? <span>
                            <span className="mini-title">功能点：</span>

                            <TreeSelect
                                showSearch
                                value={item.demandItemName}
                                dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto',
                                }}
                                showArrow
                                onChange={(value) => {
                                    this.handleSelectChange(item, 'demandItemName', value)
                                }}
                                treeData={[
                                    this.createTreeItem('功能需求', '功能需求', <img src={file} style={{
                                        width: '1.0vw',
                                        verticalAlign: 'text-bottom'
                                    }} />, item.funcDemandChild, false),
                                    this.createTreeItem('非功能需求', '非功能需求', <img src={file} style={{
                                        width: '1.0vw',
                                        verticalAlign: 'text-bottom'
                                    }} />, item.nofuncDemandChild, false),
                                ]}
                            />
                        </span> : ''}
                        <span>
                            <span className="mini-title">工作时长：</span>
                            <Input
                                value={item.workDuration}
                                placeholder="0.5的倍数"
                                onChange={e => {
                                    this.handleInputChange(item, 'workDuration', Number(e.target.value))
                                }}
                                type="number"
                                min={0.5}
                                max={24}
                                step={0.5}
                            />
                        </span>
                        {this.state.departmentName === '项目部' && <span>
                            <span className="mini-title">项目部工作：</span>
                            <Select
                                loading={!this.props.projectDepworkTypeList[0]}
                                disabled={!this.state.workList[0]}
                                value={item.projectDepworkTypeId}
                                onChange={(value) => this.handleSelectChange(item, 'projectDepworkTypeId', value)}
                            >
                                {this.props.projectDepworkTypeList.map(i => <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>)}
                            </Select>
                        </span>}
                        <div className="workContent">
                            <span className="mini-title">工作内容：</span>
                            <Input.TextArea
                                style={{ resize: 'none' }}
                                autoSize={{ minRows: 4 }}
                                value={item.content}
                                onChange={e => this.handleInputChange(item, 'content', e.target.value)}
                            />
                        </div>
                    </div>)}

                    {/* 新建报单 按钮区域 */}
                    {<div className="bottom-btn">
                        {/* 自己的报单显示 保存为草稿/提交 按钮 */}
                        {this.state.workList[0]?.createGuid === this.state.createGuid ? <>
                            {this.state.workList.filter(i => i.status === 1)[0] ? <WaitButton
                                waitTime={1000}
                                onClick={() => {
                                    this.setState({ saveOfDraft: true }, () => this.saveWorkOrder(true))
                                }}
                            >
                                <Button style={{ background: 'rgb(123, 123, 220)' }}>保存为草稿</Button>
                            </WaitButton> : null}
                            {this.state.workList.filter(i => i.status === 1)[0] ? <WaitButton
                                waitTime={1000}
                                onClick={async () => {
                                    await this.workLengthMessage(this.state.workList)
                                    this.setState({ saveOfDraft: false }, () => this.handleSubmit(this.state.workList))
                                }}
                            >
                                <Button style={{ background: 'rgb(1, 167, 240)' }}>提交</Button>
                            </WaitButton> : null}
                        </> : null}
                        {/* 评审页面 按钮 */}
                        {this.isReview === '1' && this.state.workList.filter(i => i.status === 2)[0] ? <WaitButton
                            waitTime={1000}
                            onClick={async () => {
                                this.changeWorkOrderStatus('pass', this.state.workList.filter(item => item.status === 2))
                            }}
                        >
                            <Button style={{ background: 'green', color: '#fff', margin: '0 0 0 1vw' }}>全部通过</Button>
                        </WaitButton> : null}
                    </div>}
                </div>
            </div>}

            {/* 工单列表 不是详情页并且不是统计*/}
            {!this.state.isDetail && !['countPage'].includes(this.pageType) && <div className="work-order-list">

                {/* 待提交 待审核 我评审的*/}
                {['waitToSubmit', 'waitToCheck', 'myCheck'].includes(this.pageType) ? <Table
                    style={{ border: 'none' }}
                    dataSource={workOrderList}
                    columns={[
                        {
                            title: '报单时间',
                            dataIndex: 'createTime',
                            key: 'createTime',
                            onCell: (record, index) => mergesFilter(this.state.workOrderList, record, ['createTime'])
                        }, {
                            title: '员工姓名',
                            dataIndex: 'createName',
                            key: 'createName',
                            onCell: (record, index) => mergesFilter(this.state.workOrderList, record, ['createTime', 'createName'])
                        }, {
                            title: '部门',
                            key: 'depName',
                            render: (text, record, index) => {
                                return this.props.userList[0] && this.props.depList[0] ? (this.props.depList.find(item => item.guid === this.props.userList.find(i => i.userName === record.createName).depGuid).name) : ''
                            },
                            onCell: (record, index) => {
                                return mergesFilter(this.state.workOrderList, record, ['createTime', 'createName', 'depName'])
                            }
                        }, {
                            title: '工作类型',
                            dataIndex: 'workType',
                            key: 'workType',
                            render: (text, record, index) => {
                                return text
                            },
                            onCell: (record, index) => {
                                return mergesFilter(this.state.workOrderList, record, ['createTime', 'createName', 'depName', 'workType'])
                            }
                        }, {
                            title: '项目名称',
                            dataIndex: 'projectName',
                            key: 'projectName',
                            width: '15vw',
                            onCell: (record, index) => {
                                return mergesFilter(this.state.workOrderList, record, ['createTime', 'createName', 'depName', 'workType', 'projectName'])
                            }
                        }, {
                            title: '工作类目',
                            dataIndex: 'workCategory',
                            key: 'workCategory',
                            onCell: (record, index) => {
                                return mergesFilter(this.state.workOrderList, record, ['createTime', 'createName', 'depName', 'workType', 'projectName', 'workCategory'])
                            }
                        }, {
                            title: '工作条目',
                            dataIndex: 'workItem',
                            key: 'workItem',
                            onCell: (record, index) => {
                                return mergesFilter(this.state.workOrderList, record, ['createTime', 'createName', 'depName', 'workType', 'projectName', 'workCategory', 'workItem'])
                            }
                        }, this.state.departmentName === '项目部' && {
                            title: '项目部工作',
                            key: 'projectDepworkType',
                            render: (text, record, index) => {
                                return this.props.projectDepworkTypeList.find(i => i.id === record.projectDepworkTypeId)?.name || ''
                            }
                        }, {
                            title: '工作内容',
                            key: 'content',
                            dataIndex: 'content',
                            width: '20%',
                            render: (text, record, index) => {
                                return <div
                                    style={Object.assign({ wordBreak: 'break-all' }, (record.reason ? { color: 'red' } : {}))}
                                    className="table-td-content"
                                >{text}</div>
                            }
                        }, {
                            title: '时长',
                            key: 'workDuration',
                            dataIndex: 'workDuration'
                        }, {
                            title: '状态',
                            key: 'status',
                            render: (text, record, index) => {
                                return <>
                                    {record.status === 1 ? <Button style={{ backgroundColor: 'rgb(128,128,255)' }}>待提交 </Button> : null}
                                    {record.status === 2 && this.isReview === '1' ? <Button style={{ backgroundColor: 'rgb(245, 155, 34)' }}>待评审</Button> : null}
                                    {record.status === 2 && this.isReview !== '1' ? <Button style={{ backgroundColor: 'rgb(245, 155, 34)' }}>待审核</Button> : null}
                                    {record.status === 3 ? <Button style={{ backgroundColor: 'rgb(1,167,240)' }}>已审核</Button> : null}
                                </>
                            },
                            onCell: (record, index) => mergesFilter(this.state.workOrderList, record, ['createTime', 'createName'])
                        }, {
                            title: '操作',
                            key: 'options',
                            render: (text, record, index) => {
                                return <div className="option-btn">
                                    {record.status === 1 ? <>
                                        <span onClick={() => { this.openSheetInfo(record) }}>编辑</span>
                                        <span onClick={() => { if (confirm('确认是否删除？')) this.deleteWorkOrder(record) }}>删除</span>
                                    </> : null}

                                    {record.status === 2 && this.isReview === '0' ? <span
                                        onClick={() => { this.openSheetInfo(record) }}
                                    >查看</span> : null}

                                    {record.status === 2 && this.isReview === '1' ? <span
                                        onClick={() => { this.openSheetInfo(record) }}
                                    >评审</span> : null}

                                    {record.status === 3 ? <span
                                        onClick={() => { this.openSheetInfo(record) }}
                                    >查看</span> : null}
                                </div>
                            },
                            onCell: (record, index) => mergesFilter(this.state.workOrderList, record, ['createTime', 'createName'])
                        }].filter(Boolean)
                    }
                    rowKey={record => record.guid}
                    pagination={false}
                    title={() => ['waitToSubmit'].includes(this.pageType) ? <div className="tip" >注：被退回的工单工作内容为红色字体</div> : ''}
                /> : null}

                {/* 工单查询*/}
                {['searchList'].includes(this.pageType) ? <Table
                    style={{ border: 'none' }}
                    dataSource={workOrderList}
                    columns={[{
                        title: '员工姓名',
                        dataIndex: 'createName',
                        key: 'createName'
                    }, {
                        title: '审核人',
                        key: 'reviewName',
                        width: '5vw',
                        render: (text, record, index) => <div>
                            {record.reviewName}
                        </div>
                    }, {
                        title: '工作类型',
                        dataIndex: 'workType',
                        key: 'workType',
                        render: (text, record, index) => {
                            return this.status === '1' && record.reason ? <div><img src={withdraw} alt="" style={{
                                width: '25px',
                                position: 'absolute',
                                left: '5px'
                            }} />{text}</div> : text
                        }
                    }, {
                        title: '项目名称',
                        dataIndex: 'projectName',
                        key: 'projectName',
                        width: '15vw',
                    }, {
                        title: '工作类目',
                        dataIndex: 'workCategory',
                        key: 'workCategory',
                    }, {
                        title: '工作条目',
                        dataIndex: 'workItem',
                        key: 'workItem',
                    }, {
                        title: '报单时间',
                        dataIndex: 'createTime',
                        key: 'createTime',
                    }, {
                        title: '时长',
                        key: 'workDuration',
                        dataIndex: 'workDuration',
                        width: '3vw',
                    }, {
                        title: '工作内容',
                        key: 'content',
                        dataIndex: 'content',
                        width: '20%',
                        render: (text) => <div className="table-td-content">
                            {text}
                        </div>

                    }, {
                        title: '状态',
                        key: 'status',
                        render: (text, record, index) => {
                            return <>
                                {record.status === 1 ? <Button style={{ backgroundColor: 'rgb(128,128,255)' }}>待提交</Button> : null}
                                {record.status === 2 && this.isReview === '1' ? <Button style={{ backgroundColor: 'rgb(245, 155, 34)' }}>待评审</Button> : null}
                                {record.status === 2 && this.isReview !== '1' ? <Button style={{ backgroundColor: 'rgb(245, 155, 34)' }}>待审核</Button> : null}
                                {record.status === 3 ? <Button style={{ backgroundColor: 'rgb(1,167,240)' }}>已审核</Button> : null}
                            </>
                        }
                    }, {
                        title: '操作',
                        key: 'options',
                        render: (text, record, index) => {
                            return <div className="option-btn">
                                {/* 待提交的，自己的票可以操作 */}
                                {record.status === 1 && record.createGuid === this.state.createGuid ? <>
                                    <span onClick={() => { this.openSheetInfo(record) }}>编辑</span>
                                    <span onClick={() => { if (confirm('确认是否删除？')) this.deleteWorkOrder(record) }}>删除</span>
                                </> : null}

                                {/* 待审核 */}
                                {record.status === 2 ? <>
                                    <span onClick={() => { this.openSheetInfo(record) }}>查看</span>
                                    {/* 自己的票可以撤回 */}
                                    {record.createGuid === this.state.createGuid ? <span onClick={() => { this.handelWithdraw(record.guid) }}>撤回</span> : null}
                                </> : null}
                                {/* 已审核通过 */}
                                {record.status === 3 ? <>
                                    <span onClick={() => { this.openSheetInfo(record) }}>查看</span>
                                    {/* 质量部允许撤回已通过的，前提能搜到(未实现) */}
                                    {/* {['质量部'].includes(this.state.departmentName) && <span onClick={() => { this.handelWithdraw(record.guid) }}>撤回</span>} */}
                                </> : null}
                            </div>
                        }
                    }]}
                    rowKey={record => record.guid}
                    pagination={{
                        pageSize: this.state.pageSize,
                        onChange: (page, pageSize) => this.setState({ pageSize })

                    }}
                    scroll={{ x: 'auto', y: '60vh' }}
                /> : null}
            </div>}
        </div>
    }
}

export default connect(
    state => ({
        workType: state.workType, // 工单类型
        workItem: state.workItem, // 工单条目
        workCategory: state.workCategory, // 工单类目
        listProject: state.listProject, // 项目名称
        userList: state.userList, // 公司员工
        depList: state.depList, // 部门列表
        projectDepworkTypeList: state.projectDepworkTypeList,
        produceList: state.produceList
    }), {
    saveRedux
}
)(WorkSubmit)
