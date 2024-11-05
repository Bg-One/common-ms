import {Button, Form, Input, message, Select, Space} from "antd";
import TinymceEditor from "../tinymce";
import React, {useEffect, useState} from "react";
import {addOrEditDemandItemApi, listDemandTraceApi} from "../../common/api/producems/demand";
import {useSearchParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {hasRoleOr} from "../../utils/permi";

const {TextArea} = Input;
const DemandItemContent = ({demandItem, setDemandItem, demandItemForm}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    let userInfo = useSelector(state => state.user.userInfo);

    const addOrEditDemandItem = async () => {
        await addOrEditDemandItemApi({
            ...demandItemForm.getFieldsValue(),
            degreeOfImportance: demandItem.degreeOfImportance,
            priority: demandItem.priority,
            demandState: demandItem.demandState,
            eventStream: demandItem.eventStream,
            guid: demandItem.guid,
            nodeGuid: demandItem.nodeGuid,
            produceGuid: searchParams.get('produceGuid')
        })
        message.success('保存成功', 1)
    }

    return <div style={{height: '79vh', overflowY: 'auto'}}>
        <Form
            layout="horizontal"
            disabled={!hasRoleOr(userInfo, ['pro:dept:user', 'pro:dept:manager'])}
            labelAlign={'right'}
            labelCol={{
                span: 2,
            }}
            form={demandItemForm}
            initialValues={{
                demandName:'',
                funDescription:'',
                preconditions:'',
                entry:'',
                eventStream: '',
                output:'',
                postconditions:'',
                logRecord:'',
                otherNotes:'',
                question:'',
                ...demandItem
            }}
            clearOnDestroy={true}
        >
            <Form.Item label="需求名称" name={'demandName'}>
                <Input disabled={true}/>
            </Form.Item>
            <Form.Item>
                <div className="func-item">
                    <span>重要程度:</span>
                    <Select
                        onChange={(v) => {
                            setDemandItem({
                                ...demandItem,
                                degreeOfImportance: v
                            })
                        }}
                        value={demandItem.degreeOfImportance ? demandItem.degreeOfImportance : 1}
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
                        onChange={(v) => {
                            setDemandItem({
                                ...demandItem,
                                priority: v
                            })
                        }}
                        value={demandItem.priority?demandItem.priority:1}
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
                        onChange={(v) => {
                            setDemandItem({
                                ...demandItem,
                                demandState: v
                            })
                        }}
                        value={demandItem.demandState?demandItem.demandState:1}
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
                </div>
            </Form.Item>
            <Form.Item label="功能描述" name={'funDescription'}>
                <Input/>
            </Form.Item>
            <Form.Item label="前置条件" name={'preconditions'}>
                <Input/>
            </Form.Item>
            <Form.Item label="输入" name={'entry'}>
                <Input/>
            </Form.Item>
            <Form.Item label="事件流">
                <TinymceEditor id={'eventStream'} data={demandItem.eventStream ? demandItem.eventStream : ""}
                               func={(data) => {
                                   setDemandItem({
                                       ...demandItem,
                                       eventStream: data
                                   })
                               }}/>
            </Form.Item>
            <Form.Item label="输出" name={'output'}>
                <Input/>
            </Form.Item>
            <Form.Item label="后置条件" name={'postconditions'}>
                <Input/>
            </Form.Item>
            <Form.Item label="log记录" name={'logRecord'}>
                <Input/>
            </Form.Item>
            <Form.Item label="其他说明" name={'otherNotes'}>
                <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                />
            </Form.Item>
            <Form.Item label="问题" name={'question'}>
                <TextArea
                    autoSize={{minRows: 1, maxRows: 6}}
                />
            </Form.Item>
            <Form.Item>
                <div style={{textAlign: 'center'}}>
                    <Button type={'primary'} onClick={addOrEditDemandItem}
                            disabled={!hasRoleOr(userInfo, ['pro:dept:user', 'pro:dept:manager'])}>保存</Button>
                </div>
            </Form.Item>
        </Form>
    </div>
}
export default DemandItemContent
