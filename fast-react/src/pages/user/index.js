import React, {useEffect, useRef, useState} from 'react';

import {listDeptApi} from "../../common/api/sys/deptinfo-api";

import DeptTreeData from "../../content/dept/dept-tree-data";
import {handleTree} from "../../utils/tree-data";
import {Button, Form, Input, message, Modal, Popconfirm, Select, Space, Switch, Table, TreeSelect} from "antd";
import {
    changeStatusApi,
    deleteUserApi,
    editUserApi,
    insertUserApi,
    listUserApi,
    resetPwdApi
} from '../../common/api/sys/user-api'
import {DownloadOutlined, PlusOutlined, UploadOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import UserInfoDrawer from "../../content/user/user-info-drawer";
import './index.scss'
import {sexEnum} from "../../common/enmus/sex-enum";
import {useForm} from "antd/es/form/Form";
import {sm3} from "sm-crypto";
import {listRoleApi} from "../../common/api/sys/role-api";
import {listPostApi} from "../../common/api/sys/post-api";

const User = () => {
        const [searchForm] = useForm();//查询表单
        const [userInfoform] = useForm();//用户信息表单
        const [selectedKeys, setSelectedKeys] = useState([]);//tree所选节点唯一标识
        const [treeData, setTreeData] = useState([]);//tree数据
        const [userData, setUserData] = useState([]);//用户数据
        const [open, setOpen] = useState(false);//用户信息抽屉
        const [selectUser, setSelectUser] = useState({});//当前操作用户
        const [isModalOpen, setIsModalOpen] = useState(false)//弹窗是否开启
        const [password, setPassword] = useState('')//修改密码
        const [roleList, setRoleList] = useState([])//角色列表
        const [postList, setPostList] = useState([])//岗位列表
        useEffect(() => {
            listDepList()
        }, [])

        useEffect(() => {
            listUser()
        }, [selectedKeys])
        //获取单位列表
        const listDepList = (obj) => {
            listDeptApi(obj).then(res => {
                if (res.data.length !== 0) {
                    let treeData = handleTree(res.data, "deptGuid", 'deptName');
                    setTreeData(treeData)
                    //默认选择第一项，展示其基本信息
                    setSelectedKeys([treeData[0].deptGuid])
                }
            })
        }

        //获取角色列表
        const getRoleList = (obj = {}) => {
            listRoleApi(obj).then((res) => {
                let newRoleList = res.data.map(item => {
                    return {
                        value: item.roleGuid,
                        label: item.roleName,
                    }
                });
                setRoleList(newRoleList)
            })
        }
        //获取岗位列表
        const getPostList = (obj = {}) => {
            listPostApi(obj).then(res => {
                let newPostList = res.data.map(item => {
                    return {
                        value: item.postGuid,
                        label: item.postName,
                    }
                });
                setPostList(newPostList)
            })
        }
        //获取用户列表
        const listUser = (obj) => {
            if (selectedKeys.length !== 0) {
                listUserApi({...obj, 'deptGuid': selectedKeys[0]}).then(res => {
                    setUserData(res.data)
                })
            }
        }
        //修改用户禁用/启用状态
        const changeStatus = (e, record) => {
            changeStatusApi({
                userGuid: record.userGuid,
                status: e ? 0 : 1,
                userName: record.userName
            }).then(res => {
                message.success('修改成功')
                listUser()
            })
        }
        //查询
        const onSearch = (values) => {
            listUser(values)
        };
        //新增用户
        const addUser = (values) => {
            insertUserApi({...values, password: sm3(values.password)}).then(res => {
                setOpen(false)
                userInfoform.resetFields()
                message.success('新增成功')
                listUser({})
            })
        }
        //编辑用户
        const editUser = (values) => {
            editUserApi({
                ...values,
                userGuid: selectUser.userGuid,
                roleGuids:  values.roleGuids?values.roleGuids.join(","):''
            }).then(res => {
                message.success('编辑成功')
                closeUserInfoDrawer()
                listUser({})
            })
        }
        //关闭用户信息抽屉
        const closeUserInfoDrawer = () => {
            userInfoform.resetFields()
            setOpen(false)
            setSelectUser({})
        }
        //删除用户
        const deleteUser = (record) => {
            deleteUserApi({"userGuid": record.userGuid, "userName": record.userName}).then(res => {
                message.success('删除成功')
                listUser(searchForm.getFieldsValue())
            })
        }
        //重置密码
        const resetPassword = () => {
            resetPwdApi({
                userName: selectUser.userName,
                password: sm3(password),
                userGuid: selectUser.userGuid
            }).then(() => {
                setIsModalOpen(false)
                setSelectUser({})
                message.success('修改成功')
            })

        }
        return (
            <div id={'sys-user'}>
                <DeptTreeData className={'sys-dep-info'} listDepList={listDepList} selectedKeys={selectedKeys}
                              setSelectedKeys={setSelectedKeys} treeData={treeData}/>
                <div className={'search-area'}>
                    <Form
                        className={'search-form'}
                        form={searchForm}
                        layout="inline"
                        labelCol={{
                            span: 5,
                        }}
                        onFinish={onSearch}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="用户名"
                            name="userName"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="手机号"
                            name="phonenumber"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="状态"
                            name="status"
                            labelCol={{
                                span: 10,
                            }}
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
                                    listUser({})
                                }}>
                                    重置
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                    <div className={'btn-area'}>
                        <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => {
                            getRoleList({})
                            getPostList({})
                            setOpen(true)
                        }}>新增</Button>
                        <Button type={"primary"} icon={<DownloadOutlined/>}>导入</Button>
                        <Button type={"primary"} icon={<UploadOutlined/>}>导出</Button>
                    </div>
                    <Table
                        rowKey={record => record.userGuid}
                        dataSource={userData}
                        columns={[
                            {
                                title: '序号',
                                render: (text, record, index) => {
                                    return index + 1
                                },
                            },
                            {
                                title: '用户名',
                                dataIndex: 'userName',
                                key: 'userName',
                            },
                            {
                                title: '用户昵称',
                                dataIndex: 'nickName',
                                key: 'nickName',
                            },
                            {
                                title: '性别',
                                dataIndex: 'sex',
                                render: (text, record, index) => {
                                    return <>{sexEnum.getName(Number(record.sex))}</>
                                },
                            },
                            {
                                title: '部门',
                                render: (text, record, index) => {
                                    return <>{record.dept.deptName}</>
                                },
                            },
                            {
                                title: '岗位',
                                render: (text, record, index) => {
                                    return <>{record.postNames}</>
                                },
                            },
                            {
                                title: '手机号',
                                dataIndex: 'phonenumber',
                                key: 'phonenumber',
                            },
                            {
                                title: '状态',
                                dataIndex: 'status',
                                key: 'status',
                                render: (text, record, index) => {
                                    return <Switch
                                        checkedChildren="启用" unCheckedChildren="禁用"
                                        checked={record.status === '1'}
                                        onChange={(checked) => {
                                            changeStatus(checked, record)
                                        }}/>
                                },
                            },
                            {
                                title: '创建时间',
                                dataIndex: 'createTime',
                                key: 'createTime',
                            },
                            {
                                title: '操作',
                                width: '15vw',
                                render: (text, record, index) => {
                                    return <div>
                                        <Button type={'link'} onClick={() => {
                                            setSelectUser(record)
                                            userInfoform.setFieldsValue({...record})
                                            setOpen(true)
                                            getRoleList({})
                                            getPostList({})
                                        }}>编辑</Button>
                                        <Popconfirm
                                            title="删除提醒"
                                            description="您确定删除该用户吗？"
                                            onConfirm={() => {
                                                deleteUser(record)
                                            }}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <Button type={'link'}>删除</Button>
                                        </Popconfirm>
                                        <Button type={'link'} onClick={() => {
                                            setSelectUser(record)
                                            setIsModalOpen(true)
                                        }}>修改密码</Button>
                                    </div>
                                },
                            }]}
                    />
                </div>
                <Modal title="修改密码" open={isModalOpen} onOk={resetPassword} onCancel={() => {
                    setIsModalOpen(false)
                    setSelectUser({})
                }}>
                    <Input type={'password'} placeholder={'请输入新密码'} value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }}/>
                </Modal>
                <UserInfoDrawer
                    open={open}
                    closeUserInfoDrawer={closeUserInfoDrawer}
                    deptTreeData={treeData}
                    userAction={Object.keys(selectUser).length !== 0 ? editUser : addUser}
                    form={userInfoform}
                    edit={Object.keys(selectUser).length !== 0}
                    roleList={roleList}
                    postList={postList}
                />
            </div>
        );
    }
;
export default User
