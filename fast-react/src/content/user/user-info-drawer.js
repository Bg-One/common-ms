import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, Select, TreeSelect} from 'antd';
import {ReloadOutlined, SaveOutlined} from "@ant-design/icons";

const UserInfoDrawer = ({open, closeUserInfoDrawer, deptTreeData, userAction, form, edit, roleList, postList}) => {
    return (
        <Drawer
            title="用户编辑"
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
                    name="nickName"
                    label="用户昵称"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户昵称',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="deptGuid"
                    label="所属部门"
                    rules={[
                        {
                            required: true,
                            message: '请选择部门',
                        },
                    ]}
                >
                    <TreeSelect showSearch treeData={deptTreeData}/>
                </Form.Item>
                <Form.Item
                    name="userName"
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                {
                    edit ? '' : <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                }
                <Form.Item
                    name="phonenumber"
                    label="手机号码"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="邮箱"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="sex"
                    label="性别"
                >
                    <Select
                        options={[
                            {
                                value: '0',
                                label: '女',
                            },
                            {
                                value: '1',
                                label: '男',
                            },
                        ]}
                    />
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
                    name="postGuids"
                    label="岗位"
                >
                    <Select
                        showSearch
                        mode="multiple"
                        options={postList}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    name="roleGuids"
                    label="角色"
                >
                    <Select
                        showSearch
                        options={roleList}
                        mode="multiple"
                        allowClear
                    />
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
export default UserInfoDrawer;
