import React, {useState} from 'react';
import {Button, Drawer, Form, Input, Select, Tree, TreeSelect} from 'antd';
import {ReloadOutlined, SaveOutlined} from "@ant-design/icons";
import {findParentByKey} from "../../utils/tree-data";

const RoleInfoDrawer = ({open, closeUserInfoDrawer, form, userAction, authTreeData, authTreeKeys, setAuthTreeKeys}) => {

    const onCheck = (checkedKeysValue, info) => {
        //根据选中的节点找到所有的父节点，将父节点和当前节点选中
        let checkedKeys = checkedKeysValue.checked;
        const checkedKeysArr = [...checkedKeys]
        for (const checkedKey of checkedKeys) {
            let parentByKey = findParentByKey(authTreeData, checkedKey);
            if (parentByKey !== null) {
                checkedKeysArr.push(parentByKey.key)
            }
        }
        setAuthTreeKeys([...new Set([...checkedKeysArr])])
    };
    return (
        <Drawer
            className={'user-role-drawer'}
            title="角色编辑"
            width={'30vw'}
            onClose={() => {
                closeUserInfoDrawer()
            }}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
            footer={<div style={{textAlign: 'center'}}>
                <Button type={'primary'} icon={<SaveOutlined/>} onClick={() => {
                    userAction({...form.getFieldsValue()})
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
                    name="roleName"
                    label="角色名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入角色名称',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="roleKey"
                    label="角色编码"
                    rules={[
                        {
                            required: true,
                            message: '请输入角色编码',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <div className={'tree-area'}>
                    <span className={'title'}>菜单/权限:</span>
                    <div className={'tree-area-item'}>
                        <Tree
                            checkedKeys={authTreeKeys}
                            checkable
                            checkStrictly={true}
                            onCheck={(v, info) => {
                                onCheck(v, info)
                                // setAuthTreeKeys(v)
                            }}
                            showCheckedStrategy={TreeSelect.SHOW_PARENT}//
                            autoExpandParent
                            treeData={authTreeData}
                        />
                    </div>
                </div>
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
export default RoleInfoDrawer;
