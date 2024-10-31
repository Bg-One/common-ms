import {Button, DatePicker, Input, Modal, Select, TreeSelect} from "antd";
import moment from "moment";
import back from '../../static/images/back.png'
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import WorkOrderContentItem from "./work-order-content-item";
import {listUserApi} from "../../common/api/sys/use-api";
import {
    listProjectDepworkTypeApi,
    listReviewRelationshipApi,
    listWorkOrderCategoryApi,
    listWorkOrderItemApi,
    listWorkOrderTypeApi
} from "../../common/api/producems/workorder";
import {listProjectByUserGuidApi} from "../../common/api/producems/project";

const WorkOrderDetail = ({
                             setWorkorderDetailVisible,
                             workorderDetailList,
                             setWorkorderDetailList,
                             isReview,
                             isSearch
                         }) => {
    const userInfo = useSelector(state => state.user.userInfo)
    const [createGuid] = useState(userInfo.user.userGuid)
    const [userList, setUserList] = useState([])
    const [reviewRelationshipList, setReviewRelationshipList] = useState([])
    const [workTypeList, setWorkTypeList] = useState([])
    const [workCategoryList, setWorkCategoryList] = useState([])
    const [workItemList, setWorkItemList] = useState([])
    const [projectDepworkTypeList, setProjectDepworkTypeList] = useState([])
    const [projectByUserList, setProjectByUserList] = useState([])

    useEffect(() => {
        listUserApi().then(res => setUserList(res.data))
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
    const openSheetInfo = async (record) => {
    }
    const pushInitToList = () => {
    }


// 初始化报单模板
    const initWorkOrder = () => {
        let temp_workOrderObj = localStorage.getItem('temp_workOrder_Obj') && JSON.parse(localStorage.getItem('temp_workOrder_Obj')) || {}
        let nowObj = {
            // 每个小报单
            createName: userInfo.user.nickName,
            createGuid: userInfo.user.userGuid,
            departmentName: userInfo.user.deptName,
            departmentGuid: userInfo.user.deptGuid,
            workDuration: 0,
            createTime: moment().format('YYYY-MM-DD'),  // 报单日期
            status: 1,
            projectDepworkTypeId: null,// 项目部工作
        }
        if (temp_workOrderObj.createGuid === nowObj.createGuid) {
            nowObj.workType = temp_workOrderObj.workType, nowObj.workTypeGuid = temp_workOrderObj.workTypeGuid, nowObj.workCategory = temp_workOrderObj.workCategory, nowObj.workCategoryGuid = temp_workOrderObj.workCategoryGuid, nowObj.workItem = temp_workOrderObj.workItem, nowObj.workItemGuid = temp_workOrderObj.workItemGuid, nowObj.projectName = temp_workOrderObj.projectName, nowObj.projectGuid = temp_workOrderObj.projectGuid
        }
        return nowObj
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
                <span>员工姓名：<Input value={workorderDetailList[0] && workorderDetailList[0].createName}
                                      disabled/></span>
                <span>部门：<Input value={workorderDetailList[0]?.departmentName} disabled/></span>
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
            <div className="create-work-sheet">新增工作内容<i onClick={pushInitToList}>+</i></div>
        }

        {workorderDetailList.filter(item => !(isSearch && item.createGuid !== createGuid && item.status !== workOrderEnum.CHECKEN))
            .map((item, index) => {
                return <WorkOrderContentItem item={item}
                                             index={index}
                                             isReview={isReview}
                                             isSearch={isSearch}
                                             workTypeList={workTypeList}
                                             workCategoryList={workCategoryList}
                                             workItemList={workItemList}
                                             reviewRelationshipList={reviewRelationshipList}
                                             userList={userList}
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
            {workorderDetailList?.createGuid === createGuid && <>
                {workorderDetailList.filter(i => i.status === 1)[0] &&
                    <Button onClick={() => {
                    }} style={{background: 'rgb(123, 123, 220)'}}>保存为草稿</Button>
                }
                {workorderDetailList.filter(i => i.status === 1)[0] &&
                    <Button onClick={async () => {
                    }} style={{background: 'rgb(1, 167, 240)'}}>提交</Button>
                }
            </>}
            {/* 评审页面 按钮 */}
            {isReview && workorderDetailList.filter(i => i.status === 2)[0] &&
                <Button onClick={async () => {
                }} style={{background: 'green', color: '#fff', margin: '0 0 0 1vw'}}>全部通过</Button>
            }
        </div>
        }
    </div>
}
export default WorkOrderDetail
