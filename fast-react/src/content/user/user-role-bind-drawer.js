import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, Select, Space, Table, TreeSelect} from 'antd';
import {ReloadOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";


const UserRoleBindDrawer = ({
                                userRoleBindOpen,
                                roleUserBindList,
                                closeUserRoleDrawer,
                                getUserRoleBindList,
                                authUser, cancelCuthUser
                            }) => {


        return (<Drawer
                className={'user-role-bind-drawer'}
                title="用户角色绑定"
                width={'35vw'}
                onClose={closeUserRoleDrawer}
                open={userRoleBindOpen}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <Form
                    layout="inline"
                    onFinish={(values) => {
                        getUserRoleBindList(values)
                    }}
                    initialValues={{bindFlag: 1}}
                >
                    <Form.Item
                        name="userName"
                        label="用户名称"
                        wrapperCol={{
                            span: 10,
                        }}
                    >
                        <Input
                        />
                    </Form.Item>
                    <Form.Item
                        labelCol={{
                            span: 10,
                        }}

                        name="bindFlag"
                        label="是否绑定"
                    >
                        <Select
                            style={{width: '5vw'}}
                            options={[
                                {
                                    value: 0,
                                    label: '未绑定',
                                },
                                {
                                    value: 1,
                                    label: '绑定',
                                }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            span: 10,
                            offset: 10,
                        }}>

                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                            查询
                        </Button>
                    </Form.Item>
                </Form>
                <Table
                    className={'user-role-bind-drawer-table'}
                    rowKey={record => record.userGuid}
                    dataSource={roleUserBindList.sysUserList}
                    columns={[{
                        title: '序号',
                        render: (text, record, index) => {
                            return index + 1
                        },
                    }, {
                        title: '用户名称',
                        dataIndex: 'userName',
                    }, {
                        title: '用户昵称',
                        dataIndex: 'nickName',
                    }, {
                        title: '操作',
                        render: (text, record) => {
                            return roleUserBindList.bindFlag === 1 ? <Button type={'link'} onClick={() => {
                                    cancelCuthUser({userGuids: record.userGuid})
                                }}>取消授权</Button> :
                                <Button type={'link'} onClick={() => {
                                    authUser({userGuids: record.userGuid})
                                }}>授权</Button>
                        }
                    }]}
                />
            </Drawer>
        );
    }
;
export default UserRoleBindDrawer;
