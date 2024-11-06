import {Button, Form, Input, InputNumber, Select, Space, TreeSelect} from "antd";
import React, {useEffect} from "react";
import {ReloadOutlined, SaveOutlined} from "@ant-design/icons";


const DeptInfoForm = ({deptForm, selectTreeData, submit}) => {

    return (
        <Form
            form={deptForm}
            labelCol={{
                span: 3,
            }}
            onFinish={submit}
            autoComplete="off"
        >
            <Form.Item
                label="部门名称"
                name="deptName"
                rules={[
                    {
                        required: true,
                        message: '请填写部门名称',
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="所属上级"
                name="parentGuid"
            >
                <TreeSelect
                    showSearch
                    placeholder="请选择上级部门..."
                    allowClear
                    treeDefaultExpandAll
                    treeData={selectTreeData}
                />
            </Form.Item>
            <Form.Item
                label="负责人"
                name="leader"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="联系方式"
                name="phone"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="邮箱"
                name="email"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="区域码"
                name="areaCode"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="排序"
                name="orderNum"
            >
                <InputNumber/>
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    span: 10,
                    offset: 10,
                }}>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined/>}>
                        保存
                    </Button>
                    <Button htmlType="button" icon={<ReloadOutlined/>} onClick={() => {
                        deptForm.resetFields()
                    }}>
                        重置
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default DeptInfoForm
