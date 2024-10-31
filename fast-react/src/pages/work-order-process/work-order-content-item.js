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
import {getWorkOrderApi, listWorkOrderApi, updateWorkOrderStatusApi} from "../../common/api/producems/workorder";

const WorkOrderContentItem = ({
                                  item,
                                  index,
                                  isReview,
                                  isSearch,
                                  workTypeList,
                                  workCategoryList,
                                  workItemList,
                                  reviewRelationshipList,
                                  userList,
                                  projectByUserList,
                                  projectDepworkTypeList,
                                  workorderDetailList,
                                  setWorkorderDetailList
                              }) => {
    let [workorderForm] = Form.useForm();
    const userInfo = useSelector(state => state.user.userInfo)
    const [createName] = useState(userInfo.user.nickName)
    const [deptName] = useState(userInfo.user.dept.deptName)
    const [demandItemTreeData, setDemandItemTreeData] = useState([])

    useEffect(() => {
        listNodes(item.projectGuid)
    }, [])
    //创建需求节点

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
    const deleteWorkOrder = async (record) => {
    }
    // 根据提交报单的人createGuid，获取审核人//
    const getReViewName = (guid, relaList, userList) => {
        let reviewGuid = relaList.find(i => i.userGuid === guid)?.reviewGuid
        return userList.find(i => i.userGuid === reviewGuid)?.nickName
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
        let data = await updateWorkOrderStatusApi({
            createUserGuid: workorderDetailList[0].createGuid,
            createTime: this.state.createTime,
            status: type === 'pass' ? workOrderEnum.CHECKEN : workOrderEnum.DRAFT,
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
        await getWorkOrder({
            createTime: workorderDetailList[0].createTime,
            createGuid: workorderDetailList[0].createGuid,
        })
    }


    const getWorkOrder = async (record) => {
        let res = await getWorkOrderApi({
            createTime: record.createTime,
            createGuid: record.createGuid
        })
        setWorkorderDetailList(res.data)
    }

    const onValuesChange = async (changedValues, allValues) => {
        let changeKey = Object.keys(changedValues)[0];
        if (changeKey === 'workTypeGuid') {
            allValues.workCategoryGuid = ''
            allValues.workItemGuid = ''
        } else if (changeKey === 'workCategoryGuid') {
            allValues.workItemGuid = ''
        } else if (changeKey === 'projectGuid') {
            allValues.demandItemGuid = ''
            let res = await listNodes(changedValues.projectGuid)
            if (res.data.length === 0) {
                message.warning('该项目暂无需求')
            }
        }
        workorderForm.setFieldsValue({...allValues})
        let map = workorderDetailList.map((workorder, i) => {
            if (i === index) {
                return {...workorder, ...allValues}
            }
            return workorder
        });
        setWorkorderDetailList(map)
    };

    // 撤回审核工单
    const handelWithdraw = async (guids) => {
        if (!confirm('确认撤回？')) return
        message.loading({
            content: '撤回中，请稍后',
            key: 'updateWorkOrderStatus',
            duration: 0
        })
        let data = await updateWorkOrderStatusApi({
            createUserGuid: workorderDetailList[0].createGuid,
            createTime: workorderDetailList[0].createTime,
            status: workOrderEnum.DRAFT,
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
            workorderDetailList.map(i => {
                if (item === i.guid) {
                    i.status = workOrderEnum.DRAFT
                }
            })
        })
        getWorkOrder({
            createTime: workorderDetailList[0].createTime,
            createGuid: workorderDetailList[0].createGuid,
        }) // 重新请求列表
        message.success('撤回成功')
    }
    return <div id="work-order-list" key={'edit-list-item-' + item.guid}
                style={{
                    display: isReview && item.status === workOrderEnum.DRAFT ? 'none' : 'block',
                    background: item.status === workOrderEnum.DRAFT ? '#fff' : item.status === workOrderEnum.SUBMIT ? '#ffc0cb26' : item.status === workOrderEnum.CHECKEN ? '#00800012' : '#fff',
                }}
    >
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
            {isSearch && item.status === workOrderEnum.CHECKEN && createName === getReViewName(item.createGuid, reviewRelationshipList, userList) &&
                <Button style={{background: 'rgb(255 75 0)', margin: '0 0 0 1vw', color: '#fff'}}
                        onClick={() => changeWorkOrderStatus('noPass', [item])}
                >退单</Button>}
        </div>
        {/*限制某些情况下禁掉鼠标 */}
        <Form
            layout="inline"
            // onFinish={onSearch}
            autoComplete="off"
            initialValues={{
                ...item
            }}
            form={workorderForm}
            onValuesChange={onValuesChange}
        >
            <Form.Item
                style={{width: '18vw', margin: '1vh'}}
                name={'workTypeGuid'}
                label={'工作类型'}>

                <Select
                    value={item.workTypeGuid}
                    options={workTypeList.map(item => ({value: item.guid, label: item.name}))}
                />
            </Form.Item>
            <Form.Item
                style={{width: '18vw', margin: '1vh'}}
                name={'workCategoryGuid'}
                label={'工作类目'}>
                <Select
                    options={workCategoryList.filter(i => i.workOrderTypeGuid === item.workTypeGuid).map(i => {
                        return {
                            value: i.guid,
                            label: i.name
                        }
                    })}
                />
            </Form.Item>
            <Form.Item
                style={{width: '18vw', margin: '1vh'}}
                name={'workItemGuid'}
                label={'工作条目'}>
                <Select
                    options={workItemList.filter(i => i.workOrderCategoryGuid === item.workCategoryGuid).map(i => {
                        return {
                            value: i.guid,
                            label: i.name
                        }
                    })}/>
            </Form.Item>
            <Form.Item
                style={{width: '18vw', margin: '1vh'}}
                name={'projectGuid'}
                label={'项目名称'}
            >
                <Select
                    showSearch
                    filterOption={(input, option) => pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1}
                    options={projectByUserList.map(i => {
                        return {
                            value: i.guid,
                            label: i.name
                        }
                    })}
                />
            </Form.Item>
            <Form.Item
                style={{width: '18vw', margin: '1vh'}}
                name={'workDuration'}
                label={'工作时长'}>
                <Input
                    type="number"
                    min={0.5}
                    max={24}
                    step={0.5}
                />
            </Form.Item>
            {item.workCategory === '软件开发' && ['前端开发', '后端开发', '服务开发', '缺陷修改'].includes(item.workItem) &&
                <Form.Item
                    style={{width: '18vw', margin: '1vh'}}
                    name={'demandItemGuid'}
                    label={'   功能点'}>
                    <TreeSelect
                        filterTreeNode={(input, option) => pinyinUtil.getFirstLetter(option.title).indexOf(input.toUpperCase()) !== -1
                            || option.title.indexOf(input.toUpperCase()) !== -1}
                        showSearch
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                        }}
                        treeData={demandItemTreeData}
                    />
                </Form.Item>}
            {deptName === '项目部' &&
                <Form.Item
                    style={{width: '18vw', margin: '1vh'}}
                    name={'projectDepworkTypeId'}
                    label={'项目部工作内容'}>
                    <Select
                        options={projectDepworkTypeList.map(i => {
                            return {
                                value: i.id,
                                label: i.name
                            }
                        })}
                    />
                </Form.Item>
            }
            <Form.Item
                style={{width: '75vw', margin: '1vh'}}
                name={'content'}
                label={'工作内容'}>
                <Input.TextArea
                    style={{resize: 'none'}}
                    autoSize={{minRows: 4}}
                />
            </Form.Item>
        </Form>
    </div>
}
export default WorkOrderContentItem
