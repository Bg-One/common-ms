import {Button, Form, Input, message, Select, Space} from "antd";
import TinymceEditor from "../tinymce";
import React from "react";
import {addOrEditDemandItemApi} from "../../common/api/producems/demand";

const {TextArea} = Input;
const DemandItemContent = ({demandItem, setDemandItem}) => {
    const [form] = Form.useForm()

    const addOrEditDemandItem = async () => {

        // if (this.state.demandTraceGuid === '') {
        //     message.error('需求跟踪为必填项!', 1)
        //     return
        // }
        await addOrEditDemandItemApi({
            ...demandItem,
            ...form.getFieldsValue(),
        })
        message.success('保存成功', 1)
    }

    return <div style={{height: '79vh', overflowY: 'auto'}}>
        <Form
            layout="horizontal"
            // disabled={true}
            labelAlign={'right'}
            labelCol={{
                span: 2,
            }}
            form={form}
            initialValues={{
                ...demandItem
            }}
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
                        value={demandItem.degreeOfImportance}
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
                        value={demandItem.priority}
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
                        value={demandItem.demandState}
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
                    {/*<span>关联跟踪:</span>*/}
                    {/*<Select*/}
                    {/*    mode="multiple"*/}
                    {/*/>*/}
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
                <TinymceEditor id={'eventStream'} data={demandItem.eventStream} func={(data) => {
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
                    <Button type={'primary'}>研发明确</Button>
                    <Button type={'primary'}>研发完成</Button>
                    <Button type={'primary'} onClick={addOrEditDemandItem}>保存</Button>
                </div>
            </Form.Item>
        </Form>
    </div>
}
export default DemandItemContent
