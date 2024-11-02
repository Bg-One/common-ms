import {workOrderEnum} from "../../common/enmus/work-order-enum";
import {Button, Form, Input, message, Modal, Select, TreeSelect} from "antd";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import './index.scss'
import {listNodesApi, listNodesByProjectApi} from "../../common/api/producems/demand";
import file from '../../static/images/file.png'
import {createFuncDemandNode, createTreeItem, handleTree} from "../../utils/tree-data";
import {deepCopy} from "../../utils/table";
import pinyinUtil from "../../common/react-pinyin-master";
import TextArea from "antd/es/input/TextArea";
import {
    deleteWorkOrderApi,
    getWorkOrderApi,
    updateWorkOrderStatusApi
} from "../../common/api/producems/workorder";
import {isDept} from "../../utils/user";

const WorkOrderContentItem = ({
                                  item,
                                  index,
                                  isReview,
                                  isSearch,
                                  workTypeList,
                                  workCategoryList,
                                  workItemList,
                                  projectByUserList,
                                  projectDepworkTypeList,
                                  workorderDetailList,
                                  setWorkorderDetailList
                              }) => {
    const userInfo = useSelector(state => state.user.userInfo)
    const [demandItemTreeData, setDemandItemTreeData] = useState([])
    useEffect(() => {
        listNodes(item.projectGuid)
    }, [])
    const listNodes = async (projectGuid) => {
        let res = await listNodesByProjectApi({projectGuid})
        let handleTreeData = handleTree(deepCopy(res.data), "guid", 'name', 'parentNodeGuid');
        let newFuncNodeList = createFuncDemandNode(handleTreeData, 1)
        let newNoFuncNodeList = createFuncDemandNode(handleTreeData, 2)
        //属性结构数据
        let treeData = [
            createTreeItem('功能需求', 'func-demand', <img src={file} style={{
                width: '1.0vw',
                verticalAlign: 'text-bottom'
            }}/>, newFuncNodeList, false),
            createTreeItem('非功能需求', 'nofunc-demand', <img src={file} style={{
                width: '1.0vw',
                verticalAlign: 'text-bottom'
            }}/>, newNoFuncNodeList, false),
        ];
        setDemandItemTreeData(treeData)
        return res
    }
    //删除工单
    const deleteWorkOrder = async (record) => {
        if (!confirm('确认删除？')) return
        message.loading({
            content: '删除中，请稍后',
            key: 'deleteWorkOrder',
            duration: 0
        })
        await deleteWorkOrderApi({guid: record.guid})
        message.destroy('deleteWorkOrder')
        await getWorkOrder()
        message.success('删除成功')
    }
    // 更改工单状态（审核操作 过/不过）
    const changeWorkOrderStatus = async (type, workList) => {
        if (!confirm(type === 'noPass' ? '确认退单？' : '确认审核通过？')) return
        // 退单
        let reasonModal
        let reasonContent = ''
        if (type === 'noPass') {
            await new Promise((resolve, reject) => {
                reasonModal = Modal.confirm({
                    title: '退单',
                    content: <div>
                        <TextArea placeholder="请输入退单原因" onChange={(e) => {
                            reasonContent = e.target.value
                        }}/>
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
        await updateWorkOrderStatusApi({
            createGuid: workorderDetailList[0].createGuid,
            createTime: workorderDetailList[0].createTime,
            status: type === 'pass' ? workOrderEnum.CHECKEN : workOrderEnum.DRAFT,
            reason: reasonContent,
            guids: workList.map(item => item.guid).join(','),
            reviewGuid: userInfo.user.userGuid,
            reviewName: userInfo.user.nickName//审核人
        })
        if (type === 'pass') message.success('审核通过')
        if (type === 'noPass') {
            reasonModal?.destroy()
            message.success('退单成功')
        }
        // 刷新列表
        await getWorkOrder()
    }
    //获取工单
    const getWorkOrder = async () => {
        let res = await getWorkOrderApi({
            createTime: workorderDetailList[0].createTime,
            createGuid: workorderDetailList[0].createGuid,
        })
        setWorkorderDetailList(res.data)
    }
    const handleSelectChange = async (record, type, value) => {
        if (record.status !== workOrderEnum.DRAFT) {
            message.error('禁止修改', 1)
            return
        }
        switch (type) {
            // 工作类型
            case 'workType':
                record.workTypeGuid = value
                record.workType = workTypeList.find(item => item.guid === value)?.name
                record.workCategoryGuid = ''
                record.workCategory = ''
                record.workItemGuid = ''
                record.workItem = ''
                break
            // 工作类目
            case 'workCategory':
                record.workCategoryGuid = value
                record.workCategory = workCategoryList.find(item => item.guid === value)?.name
                record.workItemGuid = ''
                record.workItem = ''
                break
            case 'workItem':
                record.workItemGuid = value
                record.workItem = workItemList.find(item => item.guid === value)?.name
                break
            case 'projectName':
                record.projectGuid = value
                record.projectName = projectByUserList.find(item => item.guid === value).name
                break
            case 'demandItem':
                record.demandItemGuid = value
                record.demandItemGuid = workItemList.find(item => item.guid === value).name
                break
            case 'projectDepworkTypeId':
                record.projectDepworkTypeId = value
                break
        }
        // 修改工作类目、项目名称是时，清除旧功能点，获取新功能点列表
        if (['workCategory', 'projectName'].includes(type) && record.workCategory === '软件开发' && record.projectGuid) {
            //清除选中的旧功能点
            record.demandItemGuid = ''
            record.demandItemName = ''
            let res = await listNodes(record.projectGuid)
            if (res.data.length === 0) {
                message.warning('暂无需求')
            }
        }
        updateWorkOrderDetail(record)
    }
    // 修改input内容
    const handleInputChange = (record, type, value) => {
        if (record.status !== workOrderEnum.DRAFT) {
            message.error('禁止修改', 1)
            return
        }
        record[type] = value
        updateWorkOrderDetail(record)
    }
    const updateWorkOrderDetail = (record) => {
        let map = workorderDetailList.map((workorder, i) => {
            if (i === index) {
                return {...workorder, ...record}
            }
            return workorder
        });
        setWorkorderDetailList(map)
    }

    // 撤回审核工单
    const handelWithdraw = async (guids) => {
        if (!confirm('确认撤回？')) return
        message.loading({
            content: '撤回中，请稍后',
            key: 'updateWorkOrderStatus',
            duration: 0
        })
        await updateWorkOrderStatusApi({
            createGuid: workorderDetailList[0].createGuid,
            createTime: workorderDetailList[0].createTime,
            status: workOrderEnum.DRAFT,
            reason: '',
            guids: guids || '',//如果有值，则仅处理这些票的状态，否则处理当天的
            reviewGuid: '',       //审核人
            reviewName: ''
        })
        message.destroy('updateWorkOrderStatus')
        getWorkOrder()
        message.success('撤回成功')
    }
    return <div id="work-order-list" key={'edit-list-item-' + index} style={{
        display: isReview && item.status === workOrderEnum.DRAFT ? 'none' : 'block',
        background: item.status === workOrderEnum.DRAFT ? '#fff' : item.status === workOrderEnum.SUBMIT ? '#ffc0cb26' : item.status === workOrderEnum.CHECKEN ? '#00800012' : '#fff',
    }}>
        <div>
            <b>当前状态：
                {item.status === workOrderEnum.DRAFT ? '待提交' : null}
                {item.status === workOrderEnum.SUBMIT ? '待审核' : null}
                {item.status === workOrderEnum.CHECKEN ? '已审核' : null}
            </b>
            {item.reviewName && <b style={{margin: '0 1vw'}}>审核人：{item.reviewName}</b>}
            {/* 仅限编辑人 在 待提交、待审核时 点击 */}
            {!isReview && [workOrderEnum.DRAFT, workOrderEnum.SUBMIT].includes(item.status) && <Button
                style={{margin: '0 0 0 1vw'}}
                type="primary"
                onClick={() => {
                    deleteWorkOrder(item)
                }}
            >删除</Button>}
            {!isReview && item.status === workOrderEnum.SUBMIT && <Button
                style={{background: 'rgb(255 75 0)', margin: '0 0 0 1vw', color: '#fff'}}
                onClick={() => {
                    handelWithdraw(item.guid)
                }}>撤回</Button>}
            {isReview && item.status === workOrderEnum.SUBMIT && <Button
                style={{background: 'green', margin: '0 0 0 1vw', color: '#fff'}}
                onClick={() => {
                    changeWorkOrderStatus('pass', [item])
                }}
            >通过</Button>}
            {isReview && item.status === workOrderEnum.SUBMIT && <Button
                style={{background: 'rgb(255 75 0)', margin: '0 0 0 1vw', color: '#fff'}}
                onClick={() => changeWorkOrderStatus('noPass', [item])}
            >退单</Button>}
            {/* 工单查询  审核允许退单  评审中，待实现 提交时间限制*/}
            {isSearch && item.status === workOrderEnum.CHECKEN && item.reviewGuid === userInfo.user.userGuid &&
                <Button style={{background: 'rgb(255 75 0)', margin: '0 0 0 1vw', color: '#fff'}}
                        onClick={() => changeWorkOrderStatus('noPass', [item])}
                >退单</Button>}
        </div>
        {/*限制某些情况下禁掉鼠标 */}
        <span>
           <span className="mini-title">工作类型：</span>
             <Select
                 value={item.workTypeGuid}
                 onChange={value => handleSelectChange(item, 'workType', value)}
                 options={workTypeList.map(item => ({value: item.guid, label: item.name}))}
             />
        </span>
        <span>
            <span className="mini-title">工作类目：</span>
            <Select
                value={item.workCategoryGuid}
                onChange={value => {
                    handleSelectChange(item, 'workCategory', value)
                }}
                options={workCategoryList.filter(i => i.workOrderTypeGuid === item.workTypeGuid).map(i => {
                    return {
                        value: i.guid,
                        label: i.name
                    }
                })}/>
        </span>
        <span>
            <span className="mini-title">工作条目：</span>
            <Select
                value={item.workItemGuid} onChange={value => {
                handleSelectChange(item, 'workItem', value)
            }}
                options={workItemList.filter(i => i.workOrderCategoryGuid === item.workCategoryGuid).map(i => {
                    return {
                        value: i.guid,
                        label: i.name
                    }
                })}/>
        </span>
        <span>
            <span className="mini-title">项目名称：</span>
            <Select
                value={item.projectGuid}
                showSearch
                filterOption={(input, option) => pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1}
                onChange={value => handleSelectChange(item, 'projectName', value)}
                options={projectByUserList.map(i => {
                    return {
                        value: i.guid,
                        label: i.name
                    }
                })}
            />
        </span>
        {item.workCategory === '软件开发' && ['前端开发', '后端开发', '服务开发', '缺陷修改'].includes(item.workItem) &&
            <span>
                <span className="mini-title">功能点：</span>
                <TreeSelect
                    value={item.demandItemGuid}
                    onChange={value => handleSelectChange(item, 'demandItem', value)}
                    filterTreeNode={(input, option) => pinyinUtil.getFirstLetter(option.title).indexOf(input.toUpperCase()) !== -1
                        || option.title.indexOf(input.toUpperCase()) !== -1}
                    showSearch
                    dropdownStyle={{
                        maxHeight: 400,
                        overflow: 'auto',
                    }}
                    treeData={demandItemTreeData}
                />
            </span>}
        <span>
            <span className="mini-title">工作时长：</span>
            <Input
                value={item.workDuration}
                placeholder="0.5的倍数"
                onChange={e => {
                    handleInputChange(item, 'workDuration', Number(e.target.value))
                }}
                type="number"
                min={0.5}
                max={24}
                step={0.5}
            />
        </span>
        {isDept(userInfo, '项目部') && <span>
            <span className="mini-title">项目部工作：</span>
            <Select
                value={item.projectDepworkTypeId}
                onChange={(value) => handleSelectChange(item, 'projectDepworkTypeId', value)}
                options={projectDepworkTypeList.map(i => {
                    return {
                        value: i.id,
                        label: i.name
                    }
                })}
            />
        </span>}
        <div className="workContent">
            <span className="mini-title">工作内容：</span>
            <Input.TextArea
                style={{resize: 'none'}}
                autoSize={{minRows: 4}}
                value={item.content}
                onChange={e => handleInputChange(item, 'content', e.target.value)}
            />
        </div>
    </div>
}
export default WorkOrderContentItem
