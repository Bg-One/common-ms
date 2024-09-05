import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, InputNumber, Select, TreeSelect} from 'antd';
import {ReloadOutlined, SaveOutlined} from "@ant-design/icons";

const PostInfoDrawer = ({open, closeUserInfoDrawer, userAction, form}) => {
    return (
        <Drawer
            title="岗位编辑"
            width={'30vw'}
            onClose={closeUserInfoDrawer}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
            footer={<div style={{textAlign: 'center'}}>
                <Button type={'primary'} icon={<SaveOutlined/>} onClick={() => {
                    userAction(form.getFieldsValue())
                }}>保存</Button>
                <Button icon={<ReloadOutlined/>} onClick={() => {
                    form.resetFields()
                }}>重置</Button>
            </div>}
        >
            <Form
                form={form}
                labelCol={{
                    span: 4,
                }}
            >
                <Form.Item
                    name="postName"
                    label="岗位名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入岗位名称',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="postCode"
                    label="岗位编码"
                    rules={[
                        {
                            required: true,
                            message: '请输入岗位编码',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="状态"
                >
                    <Select
                        options={[
                            {
                                value: '0',
                                label: '禁用',
                            },
                            {
                                value: '1',
                                label: '启用',
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name="postSort"
                    label="排序"
                    rules={[
                        {
                            required: true,
                            message: '请输入排序',
                        },
                    ]}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    name="renark"
                    label="备注"
                >
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Drawer>
    );
};
export default PostInfoDrawer;
