import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Popconfirm, Select, Space, Switch, Table} from 'antd';
import {DownloadOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UploadOutlined} from "@ant-design/icons";
import {useForm} from "antd/es/form/Form";
import './index.scss'
import {
    listRoleApi,
    allocatedListApi,
    authUserApi,
    cancelCuthUserApi,
    deleteRoleApi,
    addRoleApi, editRoleApi
} from "../../common/api/role-api";
import RoleInfoDrawer from "../../content/role/role-info-drawer";
import UserRoleBindDrawer from "../../content/user/user-role-bind-drawer";
import {listMenuApi, roleMenuTreeselectApi} from "../../common/api/menu-api";
import {handleTree} from "../../utils/tree-data";


const Role = () => {
    const [searchForm] = useForm();//
    const [roleInfoform] = useForm();
    const [roleList, setRoleList] = useState([])
    const [open, setOpen] = useState(false);//角色信息抽屉
    const [userRoleBindOpen, setUserRoleBindOpen] = useState(false);//角色用户信息抽屉
    const [selectRole, setSelectRole] = useState({})
    const [roleUserBindList, setRoleUserBindList] = useState([])
    const [authTreeData, setAuthTreeData] = useState([])
    const [authTreeKeys, setAuthTreeKeys] = useState([])
    useEffect(() => {
        getRoleList()
        getAuthTreeData()
    }, [])

    //获取权限列表
    const getAuthTreeData = (obj = {}) => {
        listMenuApi({...obj}).then(res => {
            setAuthTreeData(handleTree(res.data, 'menuGuid', 'menuName'))
        })
    }
    //获取角色列表
    const getRoleList = (obj = {}) => {
        listRoleApi(obj).then((res) => {
            setRoleList(res.data)
        })
    }
    //查询
    const onSearch = (values) => {
        getRoleList(values)
    };

    //关闭角色信息抽屉
    const closeUserInfoDrawer = () => {
        roleInfoform.resetFields()
        setOpen(false)
        setSelectRole({})
    }
    //获取角色用户绑定关系
    const getUserRoleBindList = (obj = {}) => {
        allocatedListApi({roleGuid: selectRole.roleGuid, ...obj}).then(res => {
            setRoleUserBindList(res.data)
            setUserRoleBindOpen(true)
        })

    }
    //关闭用户角色绑定抽屉
    const closeUserRoleDrawer = () => {
        setUserRoleBindOpen(false)
        roleInfoform.resetFields()

    }
    //授权
    const authUser = (values) => {
        authUserApi({...values, 'roleGuid': selectRole.roleGuid}).then(res => {
            let filterSysUserList = roleUserBindList.sysUserList.filter(item => values.userGuids.indexOf(item.userGuid) !== -1)
            setRoleUserBindList({...roleUserBindList, sysUserList: filterSysUserList})
            message.success('授权成功')
        })

    }
    //取消授权
    const cancelCuthUser = (values) => {
        cancelCuthUserApi({...values, 'roleGuid': selectRole.roleGuid}).then(() => {
            message.success('取消授权成功')
            let filterSysUserList = roleUserBindList.sysUserList.filter(item => values.userGuids.indexOf(item.userGuid) !== -1)
            setRoleUserBindList({...roleUserBindList, sysUserList: filterSysUserList})
        })
    }
    //编辑角色
    const editRole = (values) => {
        editRoleApi({...values, menuGuids: authTreeKeys.join(','), roleGuid: selectRole.roleGuid}).then(() => {
            message.success('编辑成功')
            roleInfoform.resetFields()
            setSelectRole({})
            setOpen(false)
            getRoleList(searchForm.getFieldsValue())
        })
    }
    //新增角色
    const addRole = (values) => {
        addRoleApi({...values, menuGuids: authTreeKeys.join(',')}).then(res => {
            message.success('新增成功')
            roleInfoform.resetFields()
            setOpen(false)
            getRoleList(searchForm.getFieldsValue())
        })

    }
    //删除橘色
    const deleteRole = (record) => {
        deleteRoleApi({roleName: record.roleName, roleGuid: record.roleGuid}).then(() => {
            message.success('删除成功')
            getRoleList(searchForm.getFieldsValue())
        })
    }
    //根据角色获取权限
    const getRoleAuth = (record) => {
        roleMenuTreeselectApi({roleGuid: record.roleGuid}).then(res => {
            setOpen(true)
            setAuthTreeKeys(res.data.checkedKeys)
            setSelectRole(record)
            roleInfoform.setFieldsValue({...record})
        })
    }
    return (
        <div id={'sys-role'}>
            <div className={'search-area'}>
                <Form
                    className={'search-form'}
                    form={searchForm}
                    name="basic"
                    layout="inline"
                    labelCol={{
                        span: 6,
                    }}
                    onFinish={onSearch}
                    autoComplete="off"
                >
                    <Form.Item
                        label="角色名"
                        name="roleName"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="权限编码"
                        name="roleKey"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            span: 10,
                            offset: 10,
                        }}>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                                查询
                            </Button>
                            <Button htmlType="button" icon={<ReloadOutlined/>} onClick={() => {
                                searchForm.resetFields()
                                getRoleList({})
                            }}>
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            <div className={'btn-area'}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => {
                    setOpen(true)
                }}>新增</Button>
                <Button type={"primary"} icon={<DownloadOutlined/>}>导入</Button>
                <Button type={"primary"} icon={<UploadOutlined/>}>导出</Button>
            </div>
            <Table
                rowKey={record => record.roleGuid}
                dataSource={roleList}
                columns={[
                    {
                        title: '序号',
                        render: (text, record, index) => {
                            return index + 1
                        },
                    },
                    {
                        title: '角色名',
                        dataIndex: 'roleName',
                        key: 'roleName',
                    },
                    {
                        title: '角色编码',
                        dataIndex: 'roleKey',
                        key: 'roleKey',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        key: 'createTime',
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        key: 'remark',
                        width: '20vw'
                    },
                    {
                        title: '操作',
                        width: '15vw',
                        render: (text, record, index) => {
                            return <div>
                                <Button type={'link'} onClick={() => {
                                    getRoleAuth(record)
                                }}>编辑</Button>
                                <Popconfirm
                                    title="删除提醒"
                                    description="您确定删除该角色吗？"
                                    onConfirm={() => {
                                        deleteRole(record)
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type={'link'}>删除</Button>
                                </Popconfirm>
                                <Button type={'link'} onClick={() => {
                                    setSelectRole(record)
                                    getUserRoleBindList({
                                        roleGuid: record.roleGuid,
                                        bindFlag: 1
                                    })
                                }}>用户关联</Button>
                            </div>
                        },
                    }]}
            />
            <RoleInfoDrawer
                open={open}
                closeUserInfoDrawer={closeUserInfoDrawer}
                form={roleInfoform}
                userAction={Object.keys(selectRole).length !== 0 ? editRole : addRole}
                authTreeData={authTreeData}
                selectRole={selectRole}
                authTreeKeys={authTreeKeys}
                setAuthTreeKeys={setAuthTreeKeys}
            />
            <UserRoleBindDrawer
                userRoleBindOpen={userRoleBindOpen}
                roleUserBindList={roleUserBindList}
                closeUserRoleDrawer={closeUserRoleDrawer}
                getUserRoleBindList={getUserRoleBindList}
                authUser={authUser}
                cancelCuthUser={cancelCuthUser}/>
        </div>
    );
};
export default Role;
