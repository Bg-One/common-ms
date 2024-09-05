import React, {useEffect, useState} from 'react';
import {Button, Input, message, Popconfirm, Select, Space, Switch, Table} from 'antd';
import {Form} from "antd/lib";
import {DownloadOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UploadOutlined} from "@ant-design/icons";
import {useForm} from "antd/es/form/Form";
import './index.scss'
import {addMenuApi, deleteSysMenuApi, editMenuApi, listMenuApi} from "../../common/api/menu-api";
import {handleTree} from "../../utils/tree-data";
import MenuDrawer from "../../content/menu/menu-drawer";
import MyIcon from "../../content/custom-icon";
import {menuTypeEnum} from "../../common/enmus/menu-type-enum";

const Authority = () => {
    const [searchForm] = useForm();
    const [menuInfoForm] = useForm();
    const [menuData, setMenuData] = useState();
    const [open, setOpen] = useState();
    const [selectMenu, setSelectMenu] = useState({})
    useEffect(() => {
        listMenu()
    }, [])

    //获取菜单/权限
    const listMenu = (obj) => {
        listMenuApi({...obj}).then(res => {
            setMenuData(handleTree(res.data, 'menuGuid', 'menuName'))
        })
    }
    //编辑权限/菜单
    const editMenu = (values) => {
        editMenuApi({...values, menuGuid: selectMenu.menuGuid}).then(res => {
            message.success('编辑成功')
            setOpen(false)
            listMenu(searchForm.getFieldsValue())
        })

    }
    //新增权限/菜单
    const addMenu = (values) => {
        addMenuApi({...values}).then(res => {
            message.success('新增成功')
            setOpen(false)
            menuInfoForm.resetFields()
            listMenu(searchForm.getFieldsValue())
        })
    }
    //关闭权限信息抽屉
    const closeMenuInfoDrawer = () => {
        menuInfoForm.resetFields()
        setOpen(false)
        setSelectMenu({})
    }
    //删除菜单
    const deleteMenu = (record) => {
        deleteSysMenuApi({menuGuid: record.menuGuid}).then(res => {
            message.success('删除成功')
            listMenu(searchForm.getFieldsValue())
        })
    }
    return (
        <div id={'authority'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 6,
                }}
                onFinish={(values) => {
                    listMenu(values)
                }}
                autoComplete="off"
            >
                <Form.Item
                    label="菜单名称"
                    name="menuName"
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
                            listMenu({})
                        }}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
            <div className={'btn-area'}>
                <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => {
                    setOpen(true)
                }}>新增</Button>
                <Button type={"primary"} icon={<DownloadOutlined/>}>导入</Button>
                <Button type={"primary"} icon={<UploadOutlined/>}>导出</Button>
            </div>
            <Table
                rowKey={record => record.menuGuid}
                columns={[
                    {
                        title: '菜单名',
                        dataIndex: 'menuName',
                        key: 'menuName',
                    },
                    {
                        title: '类型',
                        dataIndex: 'menuType',
                        key: 'menuType',
                        render: (text, record, index) => {
                            return <>{menuTypeEnum.getName(text)}</>
                        }
                    },
                    {
                        title: '图标',
                        dataIndex: 'icon',
                        key: 'icon',
                        render: (text, record, index) => {
                            return <MyIcon type={record.icon}/>
                        }
                    },
                    {
                        title: '排序',
                        dataIndex: 'orderNum',
                        key: 'orderNum',
                    },
                    {
                        title: '权限标识',
                        dataIndex: 'perms',
                        key: 'perms',
                    },
                    {
                        title: '组件名',
                        dataIndex: 'component',
                        key: 'component',
                    },
                    {
                        title: '路由',
                        dataIndex: 'path',
                        key: 'path',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        key: 'createTime',
                    }, {
                        title: '备注',
                        dataIndex: 'remark',
                        key: 'remark',
                        width: '20vw'
                    }, {
                        title: '操作',
                        render: (text, record, index) => {
                            return <div>
                                <Button type={'link'}
                                        onClick={() => {
                                            menuInfoForm.setFieldsValue({...record})
                                            setSelectMenu(record)
                                            setOpen(true)
                                        }}
                                >编辑</Button>
                                <Button type={'link'} onClick={() => {
                                    deleteMenu(record)
                                }}>删除</Button>
                                <Button type={'link'} onClick={() => {
                                    menuInfoForm.setFieldValue('parentGuid', record.menuGuid)
                                    setOpen(true)
                                }}>新增</Button>
                            </div>
                        },
                    },
                ]}
                dataSource={menuData}
            />
            <MenuDrawer open={open} form={menuInfoForm} menuData={menuData}
                        userAction={Object.keys(selectMenu).length !== 0 ? editMenu : addMenu}
                        closeMenuInfoDrawer={closeMenuInfoDrawer}/>
        </div>
    );
};

export default Authority;
