import {Modal} from "antd/lib";
import {Button, Form, Input, Select, Space, TreeSelect} from "antd";
import moment from "moment/moment";
import React from "react";
import {useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";

const DemandTraceAddModal = ({addModalFlag, setAddModalFlag, projectList, addDemandTrace}) => {
    const userInfo = useSelector(state => state.user.userInfo);
    const [searchParams, setSearchParams] = useSearchParams()
    let [form] = Form.useForm();
    return <Modal
        open={addModalFlag}
        centered={true}
        title={'需求变更新增'}
        footer={false}
        onCancel={() => {
            setAddModalFlag(false)
        }}
    >
        <Form
            className={'search-form'}
            labelCol={{
                span: 7,
            }}
            form={form}
            autoComplete="off"
            initialValues={{
                priority: 0
            }}
            onFinish={async (values) => {
                await addDemandTrace({
                    ...values,
                    submitName: userInfo.user.nickName,
                    proposer: userInfo.user.nickName,
                    submitTime: moment().format("YYYY-MM-DD"),
                    produceGuid: searchParams.get('produceGuid')
                })
                form.resetFields()
            }}
        > <Form.Item
            label="项目名称"
            name="projectGuid"
            rules={[
                {
                    required: true,
                    message: '项目不能为空！',
                }
            ]}
        >
            <Select
                options={projectList.map((item) => {
                    return {
                        value: item.guid,
                        label: item.name,
                    }
                })}
            />
        </Form.Item>
            <Form.Item
                label="需求类型"
                name="demandType"
                rules={[
                    {
                        required: true,
                        message: '需求类型为空！',
                    }
                ]}
            >
                <Select
                    style={{width: '10vw'}}
                    placeholder="请选择需求类型"
                    options={[
                        {
                            value: 0,
                            label: '新增需求',
                        }, {
                            value: 1,
                            label: '变更需求'
                        }
                    ]}
                />
            </Form.Item>
            <Form.Item
                label="需求描述"
                name="demandDescription"
                rules={[
                    {
                        required: true,
                        message: '需求描述为空！',
                    }
                ]}
            >
                <Input.TextArea autoSize={{minRows: 1, maxRows: 6}}/>
            </Form.Item>
            <Form.Item
                label="优先级"
                name="priority"
            >
                <Select
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
            </Form.Item>
            <Form.Item
                label="提出时间"
                name="submitTime"
            >
                <span>{moment().format("YYYY-MM-DD")}</span>
            </Form.Item>
            <Form.Item
                label="提出人"
                name="proposer"
            >
                <span>{userInfo.user.nickName}</span>
            </Form.Item>
            <Form.Item
                label="提交人"
                name="submitName"
            >
                <span>{userInfo.user.nickName}</span>
            </Form.Item>
            <Form.Item
                wrapperCol={{span: 10, offset: 10,}}>
                <Space>
                    <Button type={'primary'} onClick={() => {
                        setAddModalFlag(false)
                        form.resetFields()
                    }}>关闭</Button>
                    <Button type={'primary'} htmlType={'submit'}>保存</Button>
                </Space>
            </Form.Item>
        </Form>
    </Modal>
}
export default DemandTraceAddModal
