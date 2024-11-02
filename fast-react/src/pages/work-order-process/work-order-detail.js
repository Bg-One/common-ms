import {Button, DatePicker, Input, message, Modal, Select, TreeSelect} from "antd";
import moment from "moment";
import back from '../../static/images/back.png'
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import WorkOrderContentItem from "./work-order-content-item";
import {listUserApi} from "../../common/api/sys/use-api";
import {
    countWorkOrderStatusApi, getWorkOrderApi,
    listProjectDepworkTypeApi,
    listWorkOrderCategoryApi,
    listWorkOrderItemApi,
    listWorkOrderTypeApi, updateWorkOrderStatusApi, submitWorkOrderApi
} from "../../common/api/producems/workorder";
import {listProjectByUserGuidApi} from "../../common/api/producems/project";
import {FileAddOutlined} from "@ant-design/icons";
import {deepCopy} from "../../utils/table";
import {isDept} from "../../utils/user";
import TextArea from "antd/es/input/TextArea";

const WorkOrderDetail = ({
                             setWorkorderDetailVisible,
                             workorderDetailList,
                             setWorkorderDetailList,
                             isReview,
                             isSearch
                         }) => {
    const userInfo = useSelector(state => state.user.userInfo)
    const [createGuid] = useState(userInfo.user.userGuid)
    const [workTypeList, setWorkTypeList] = useState([])
    const [workCategoryList, setWorkCategoryList] = useState([])
    const [workItemList, setWorkItemList] = useState([])
    const [projectDepworkTypeList, setProjectDepworkTypeList] = useState([])
    const [projectByUserList, setProjectByUserList] = useState([])

    useEffect(() => {
        listWorkOrderTypeApi().then(res => setWorkTypeList(res.data))
        listWorkOrderCategoryApi().then(res => setWorkCategoryList(res.data))
        listWorkOrderItemApi().then(res => setWorkItemList(res.data))
        listProjectDepworkTypeApi().then(res => setProjectDepworkTypeList(res.data))
        listProjectByUserGuidApi().then(res => setProjectByUserList(res.data))
    }, [])

    // 获取总共的工作时长
    const getTotalWorkLength = (workList, status) => {
        let total = 0
        workList.filter(item => status.includes(item.status)).map(item => total = total + item.workDuration)
        return total
    }
    // 获取工单详情
    const openSheetInfo = async () => {
        let obj = initWorkOrder();
        setWorkorderDetailList([obj, ...deepCopy(workorderDetailList)])
    }
// 初始化报单模板
    const initWorkOrder = () => {
        let temp_workOrderObj = localStorage.getItem('temp_workOrder_Obj') && JSON.parse(localStorage.getItem('temp_workOrder_Obj')) || {}
        let nowObj = {
            // 每个小报单
            createName: userInfo.user.nickName,
            createGuid: userInfo.user.userGuid,
            departmentName: userInfo.user.dept.deptName,
            departmentGuid: userInfo.user.deptGuid,
            workDuration: 0,
            workTypeGuid: '',
            projectGuid: '',
            workCategoryGuid: '',
            workItemGuid: '',
            demandItemGuid: '',
            createTime: moment().format('YYYY-MM-DD'),  // 报单日期
            content: '',  // 工作内容
            status: 1,
            projectDepWorkType: '',// 项目部工作
        }
        if (temp_workOrderObj.createGuid === nowObj.createGuid) {
            nowObj.workTypeGuid = temp_workOrderObj.workTypeGuid, nowObj.workCategoryGuid = temp_workOrderObj.workCategoryGuid,
                nowObj.workItemGuid = temp_workOrderObj.workItemGuid, nowObj.projectGuid = temp_workOrderObj.projectGuid
        }
        return nowObj
    }

    // 超八小时提醒
    const workLengthMessage = (workList) => {
        return new Promise((resolve, reject) => {
            if (getTotalWorkLength(workList, [workOrderEnum.DRAFT, workOrderEnum.SUBMIT, workOrderEnum.CHECKEN]) > 8) {
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
    const handleSubmit = async (workListTemp) => {
        if (getTotalWorkLength(workListTemp, [workOrderEnum.DRAFT, workOrderEnum.SUBMIT, workOrderEnum.CHECKEN]) > 24) {
            message.error('今日累计工作时长超过了24小时，请修改', 1)
            return
        }
        let workList = deepCopy(workListTemp.filter(i => i.status === workOrderEnum.DRAFT))
        for (let i = 0; i < workList.length; i++) {
            let selectWorkOrder = workList[i]
            // 判断逻辑
            if (!selectWorkOrder.createTime) {
                message.error('报单日期不能为空', 1)
                return
            }
            if (!selectWorkOrder.reason && moment(selectWorkOrder.createTime).isBefore(moment().subtract(7, 'days'))) {
                message.error('报单过期，不可提交', 1)
                return
            }
            if (moment(selectWorkOrder.createTime).isAfter(moment())) {
                message.error('报单不可提前提交', 1)
                return
            }
            if (!selectWorkOrder.workTypeGuid) {
                message.error('工作类型不能为空', 1)
                return
            }
            if (!selectWorkOrder.workCategoryGuid) {
                message.error('工作类目不能为空', 1)
                return
            }
            if (selectWorkOrder.workType === '产品项目类' && !selectWorkOrder.workItem) {
                message.error('工作条目不能为空', 1)
                return
            }
            if (!selectWorkOrder.projectGuid) {
                message.error('项目名称不能为空', 1)
                return
            }
            if (selectWorkOrder.workCategory === '软件开发' && ['前端开发', '后端开发', '服务开发', '缺陷修改'].includes(selectWorkOrder.workItem) && !selectWorkOrder.demandItemGuid) {
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
            if (isDept(userInfo, '项目部') && !selectWorkOrder.projectDepWorkType) {
                message.error('项目部工作不能为空', 1)
                return
            }
            if (!selectWorkOrder.content) {
                message.error('工作内容不能为空', 1)
                return
            }
        }
        workList.forEach(item => item.status = workOrderEnum.SUBMIT)
        await submitWorkOrderApi({workOrderList: JSON.stringify(workList)})
        message.success('保存成功')
        // 存到本地一份初始化报单信息
        localStorage.setItem('temp_workOrder_Obj', JSON.stringify(workorderDetailList[0]))
        setWorkorderDetailVisible(false)
    }
    // 保存工单
    const saveWorkOrder = async () => {
        let workList = deepCopy(workorderDetailList.filter(i => i.status === workOrderEnum.DRAFT))
        await submitWorkOrderApi({workOrderList: JSON.stringify(workList)})
        // 留存编辑记录
        message.success('保存成功')
        // 存到本地一份初始化报单信息
        localStorage.setItem('temp_workOrder_Obj', JSON.stringify(workorderDetailList[0]))
        setWorkorderDetailVisible(false)
    }
    // 全部通过
    const changeWorkOrderStatus = async (type, workList) => {
        if (!confirm('确认审核通过？')) return
        // 退单
        await updateWorkOrderStatusApi({
            createGuid: workorderDetailList[0].createGuid,
            createTime: workorderDetailList[0].createTime,
            status: workOrderEnum.CHECKEN,
            reason: '',
            guids: workList.map(item => item.guid).join(','),
            reviewGuid: userInfo.user.userGuid,
            reviewName: userInfo.user.nickName//审核人
        })
        if (type === 'pass') message.success('审核通过')
        setWorkorderDetailVisible(false)
    }

    return <div id="edit-page">
        <div className="head-title">
            <img src={back} style={{width: '1.5vw', verticalAlign: 'text-bottom'}}/>
            <span style={{fontSize: '1.2vw', color: '#1D79FC', cursor: 'pointer'}} onClick={() => {
                setWorkorderDetailVisible(false)
            }}>返回</span>
            {!isReview && !isSearch &&
                <span style={{fontSize: '1.2vw', color: '#1D79FC', marginLeft: '2vw'}}>新建工作报单</span>}
        </div>
        <div className="edit-content">
            <div className="edit-list">
                <span>员工姓名：<Input
                    value={workorderDetailList[0] ? workorderDetailList[0].createName : userInfo.user.nickName}
                    disabled/></span>
                <span>部门：<Input
                    value={workorderDetailList[0] ? workorderDetailList[0].departmentName : userInfo.user.dept.deptName}
                    disabled/></span>
                <span>报单日期：
                    <DatePicker
                        id="createTime"
                        value={workorderDetailList[0] ? moment(workorderDetailList[0].createTime) : moment()}
                        format={'YYYY-MM-DD'}
                        disabled={isReview}
                        onChange={async (e, value) => {
                            if (value) {
                                let oldWorkList = workorderDetailList.filter(item => item.status === workOrderEnum.DRAFT && item.content).map(item => {
                                    item.createTime = value
                                    return item
                                })
                                if (!oldWorkList[0]) {
                                    openSheetInfo({createGuid: createGuid, createTime: value})
                                    return
                                }
                                let warningModal = oldWorkList[0] && Modal.warning({
                                    title: '存在待提交报单且工作内容不为空，是否将本页的待提交报单移动到指定日期',
                                    content: <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        margin: '1.5rem auto 0'
                                    }}>
                                        <Button
                                            type='primary'
                                            onClick={async () => {
                                                localStorage.setItem('temp_oldWorkList', JSON.stringify(oldWorkList))
                                                await openSheetInfo({
                                                    createGuid: createGuid, createTime: value
                                                })
                                                warningModal.destroy()
                                            }}
                                        >移动</Button>
                                        <Button
                                            type='primary'
                                            danger
                                            onClick={async () => {
                                                await openSheetInfo({
                                                    createGuid: createGuid, createTime: value
                                                })
                                                warningModal.destroy()
                                            }}
                                        >不需要</Button>
                                    </div>,
                                    closable: 'true',
                                    okButtonProps: {style: {display: 'none'}}
                                })
                            }
                        }}/>
                </span>
                <b>合计工作时长：{getTotalWorkLength(workorderDetailList, [workOrderEnum.DRAFT, workOrderEnum.SUBMIT, workOrderEnum.CHECKEN])}小时</b>
            </div>
        </div>
        {(createGuid === workorderDetailList[0]?.createGuid || !isReview) &&
            <Button type={'link'} icon={<FileAddOutlined/>} onClick={openSheetInfo}>新增工作内容</Button>
        }

        {workorderDetailList.filter(item => !(isSearch && item.createGuid !== createGuid && item.status !== workOrderEnum.CHECKEN))
            .map((item, index) => {
                return <WorkOrderContentItem
                    key={index}
                    item={item}
                    index={index}
                    isReview={isReview}
                    isSearch={isSearch}
                    workTypeList={workTypeList}
                    workCategoryList={workCategoryList}
                    workItemList={workItemList}
                    projectDepworkTypeList={projectDepworkTypeList}
                    projectByUserList={projectByUserList}
                    workorderDetailList={workorderDetailList}
                    setWorkorderDetailList={setWorkorderDetailList}
                />
            })
        }
        {/* 新建报单 按钮区域 */}
        {<div className="bottom-btn">
            {/* 自己的报单显示 保存为草稿/提交 按钮 */}
            {workorderDetailList[0]?.createGuid === createGuid && <>
                {workorderDetailList.filter(i => i.status === workOrderEnum.DRAFT)[0] &&
                    <Button onClick={() => {
                        saveWorkOrder()
                    }} style={{background: 'rgb(123, 123, 220)'}}>保存为草稿</Button>
                }
                {workorderDetailList.filter(i => i.status === workOrderEnum.DRAFT)[0] &&
                    <Button onClick={async () => {
                        await workLengthMessage(workorderDetailList)
                        handleSubmit(workorderDetailList)
                    }} style={{background: 'rgb(1, 167, 240)'}}>提交</Button>
                }
            </>}
            {/* 评审页面 按钮 */}
            {isReview && workorderDetailList.filter(i => i.status === workOrderEnum.SUBMIT)[0] &&
                <Button onClick={async () => {
                    changeWorkOrderStatus('pass', workorderDetailList.filter(item => item.status === workOrderEnum.SUBMIT))
                }} style={{background: 'green', color: '#fff', margin: '0 0 0 1vw'}}>全部通过</Button>
            }
        </div>
        }
    </div>
}
export default WorkOrderDetail
