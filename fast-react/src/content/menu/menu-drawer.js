import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, Select, Radio, InputNumber, TreeSelect} from 'antd';
import {ReloadOutlined, SaveOutlined} from "@ant-design/icons";
import MyIcon from "../custom-icon";

const MenuDrawer = ({open, form, menuData, userAction, closeMenuInfoDrawer}) => {
    const menuType = Form.useWatch('menuType', form);
    const icon = Form.useWatch('icon', form);

    return (
        <Drawer
            title="菜单/权限编辑"
            width={'30vw'}
            onClose={closeMenuInfoDrawer}
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
                    name="parentGuid"
                    label="上级目录"
                >
                    <TreeSelect
                        showSearch
                        placeholder="请选择上级目录..."
                        allowClear
                        treeDefaultExpandAll
                        treeData={menuData}/>
                </Form.Item>

                <Form.Item
                    name="menuName"
                    label="菜单名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入菜单名称',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="menuType"
                    label="菜单类型"
                    rules={[
                        {
                            required: true,
                            message: '请选择菜单类型',
                        },
                    ]}
                >
                    <Select
                        options={[
                            {
                                value: 'M',
                                label: '目录',
                            },
                            {
                                value: 'C',
                                label: '菜单',
                            },
                            {
                                value: 'F',
                                label: '按钮/行为'
                            }
                        ]}
                    />
                </Form.Item>
                {
                    menuType === 'C' && <Form.Item
                        name="component"
                        label="组件名"
                        rules={[
                            {
                                required: true,
                                message: '请输入组件名',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                }

                {
                    menuType !== 'F' && <>
                        <Form.Item
                            name="icon"
                            label="菜单图标"
                        >
                            <Input
                                prefix={<MyIcon type={icon}/>}
                            />
                        </Form.Item>
                        <Form.Item
                            name="path"
                            label="路由"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入路由地址',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item> <Form.Item
                        name="isFrame"
                        label="是否外链"
                    >
                        <Radio.Group>
                            <Radio value={'1'}>是</Radio>
                            <Radio value={'0'}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                        <Form.Item
                            name="visible"
                            label="显示状态"
                        >
                            <Radio.Group>
                                <Radio value={'1'}>显示</Radio>
                                <Radio value={'0'}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </>
                }

                <Form.Item
                    name="orderNum"
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
                {
                    (menuType === 'C' || menuType === 'F') && (
                        <Form.Item
                            label={'权限标识'}
                            name={"perms"}
                        >
                            <Input/>
                        </Form.Item>
                    )
                }

                <Form.Item
                    name="remark"
                    label="备注"
                >
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Drawer>
    );
};
export default MenuDrawer;
