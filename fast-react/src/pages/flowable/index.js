import React, {useEffect, useState} from "react";
import BpmnDesigner from "../../content/bpmn-designer";
import {listFlowableApi} from "../../common/api/flowable/folwable-define";
import {Button, Popconfirm, Table} from "antd";
import './index.scss'

const Flowable = () => {
    let [flowableList, setFlowableList] = useState();
    useEffect(() => {
        listFlowable()
    }, [])


    //获取流程设计器列表
    const listFlowable = async () => {
        const res = await listFlowableApi()
        setFlowableList(res.data)
    }

    return (
        <div id={'flowable'}>
            {/*<div className={'active-btn'}>*/}
            {/*    <Button type={'primary'}>新增流程</Button>*/}
            {/*</div>*/}
            {/*<Table*/}
            {/*    dataSource={flowableList}*/}
            {/*    columns={[*/}
            {/*        {*/}
            {/*            title: '流程名称',*/}
            {/*            dataIndex: 'name'*/}
            {/*        },*/}
            {/*        {*/}
            {/*            title: '流程标识',*/}
            {/*            dataIndex: 'flowKey'*/}
            {/*        }, {*/}
            {/*            title: '流程分类',*/}
            {/*            dataIndex: 'category'*/}
            {/*        },*/}
            {/*        {*/}
            {/*            title: '流程描述',*/}
            {/*            dataIndex: 'description'*/}
            {/*        },*/}
            {/*        {*/}
            {/*            title: '流程版本',*/}
            {/*            dataIndex: 'version'*/}
            {/*        },*/}
            {/*        {*/}
            {/*            title: '流程状态',*/}
            {/*            dataIndex: 'suspensionState'*/}
            {/*        }, {*/}
            {/*            title: '部署时间',*/}
            {/*            dataIndex: 'deploymentTime'*/}
            {/*        }, {*/}
            {/*            title: '操作',*/}
            {/*            width: '15vw',*/}
            {/*            render: (text, record, index) => {*/}
            {/*                return <div>*/}
            {/*                    <Button type={'link'}>编辑</Button>*/}
            {/*                    <Button type={'link'}>查看</Button>*/}
            {/*                    <Button type={'link'}>删除</Button>*/}
            {/*                </div>*/}
            {/*            },*/}
            {/*        }*/}
            {/*    ]}*/}
            {/*    rowKey={record => record.id}*/}
            {/*/>*/}
            <BpmnDesigner type={'add'}/>
        </div>
    )
}
export default Flowable
