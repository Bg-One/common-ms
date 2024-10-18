import React, {useEffect, useState} from "react";
import './index.scss'
import {
    Button,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    TreeSelect
} from "antd";
import {AppstoreAddOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {
    addProduceApi,
    deleteProduceApi,
    listProduceApi,
    listProduceMemListApi, updateLockProduceToUserApi
} from "../../common/api/producems/produce";
import {teamresourceEnum} from "../../common/enmus/teamresource-enum";
import {listUserApi} from "../../common/api/sys/use-api";
import {changeGroupMems, changManage, getUserGiudsByDepGuids, getUserTreeData} from "../../utils/user";
import {listDeptApi} from "../../common/api/sys/deptinfo-api";
import pinyinUtil from "../../common/react-pinyin-master";
import {hasPermi} from '../../utils/permi'
import {useSelector} from "react-redux";


const Produce = (props) => {
    const [formInstance] = Form.useForm()
    const [searchForm] = Form.useForm()
    const [produceList, setProduceList] = useState([])
    const [teamResourcesList, setTeamResourcesList] = useState([{teamResource: teamresourceEnum.DEMAND_GROUP}, {teamResource: teamresourceEnum.RD_GROUP}, {teamResource: teamresourceEnum.TEST_GROUP}])
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [addFlag, setAddFlag] = useState(false)
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    })
    const [userList, setUserList] = useState([])
    const [deptList, setDeptGuid] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    let userInfo = useSelector(state => state.user.userInfo);
    useEffect(() => {
        listProduce({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
        })
    }, [])
    useEffect(() => {
        if (addModalOpen) {
            listUserApi().then(userRes => {
                setUserList(userRes.data)
            })
            listDeptApi().then(deptRes => {
                setDeptGuid(deptRes.data)
            })
        }
    }, [addModalOpen])
    //获取产品列表
    const listProduce = (values) => {
        listProduceApi({...values}).then(res => {
            //获取锁定的产品列表的guid
            setSelectedRowKeys(res.data.list.length !== 0 ? res.data.list[0].lockProduceGuids : [])
            setProduceList(res.data.list)
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
        })
    }
    //s搜索
    const onSearch = (values) => {
        listProduce({
            currentPage: 1,
            pageSize: 10,
            ...values
        })
    }
    //获取产品资源
    const getProduceInfo = (record) => {
        listProduceMemListApi({guid: record.guid}).then(res => {
            setTeamResourcesList(res.data)
            formInstance.setFieldsValue({
                produceGuid: record.produceGuid,
                name: record.name,
                number: record.number,
                produceManager: record.produceManager,
                guid: record.guid
            })
        })
    }


    //新增项目
    const addProduce = () => {
        let fieldsValue = formInstance.getFieldsValue(true)
        formInstance.validateFields().then(async (values) => {
            for (let teamResourcesListElement of teamResourcesList) {
                if (!teamResourcesListElement.managerGuid) {
                    message.error('请填写完整相关负责人！')
                    return
                }
                teamResourcesListElement.groupMemsGuids = getUserGiudsByDepGuids(userList, deptList, teamResourcesListElement.groupMemsGuids.split('、')).join('、')
            }
            let res = await addProduceApi({
                ...fieldsValue,
                teamReasourcesList: JSON.stringify(teamResourcesList)
            })
            if (res) {
                listProduce({
                    currentPage: pageInfo.currentPage,
                    pageSize: pageInfo.pageSize,
                })
                setAddModalOpen(false)
                formInstance.resetFields()
                setAddFlag(false)
                setTeamResourcesList([{teamResource: teamresourceEnum.DEMAND_GROUP}, {teamResource: teamresourceEnum.RD_GROUP}, {teamResource: teamresourceEnum.TEST_GROUP}])
                message.success('保存成功', 1)
            }
        })
    }
    //处理产品绑定行为
    const handleLockProduce = (selectedRowKeys) => {
        const unionSet = new Set([...selectedRowKeys, ...produceList[0].lockProduceGuids]);
        updateLockProduceToUserApi({
            produceGuids: [...unionSet].join(','),
        }).then((() => {
            listProduce({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                ...searchForm.getFieldsValue()
            })
            message.success('锁定成功', 1)
        }))
    }

    return <div id="produce-list">
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 7,
                }}
                onFinish={onSearch}
                autoComplete="off"
            > <Form.Item
                label="产品名称"
                name="name"
            >
                <Input/>
            </Form.Item>
                <Form.Item
                    label="产品编号"
                    name="number"
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
                            listProduce({
                                currentPage: 1,
                                pageSize: 10,
                            })
                        }}>
                            重置
                        </Button>
                        <Button type="primary" htmlType="button"
                                disabled={!hasPermi(userInfo, "producems:produce:add")}
                                icon={<AppstoreAddOutlined/>}
                                onClick={() => {
                                    setAddModalOpen(true)
                                    setAddFlag(true)
                                }}>
                            新增
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>

        <Table
            dataSource={produceList}
            rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    handleLockProduce(selectedRowKeys)
                },
            }}
            columns={[
                {
                    title: '序号',
                    render: (text, record, index) => {
                        return <div>{index + 1}</div>
                    }
                }, {
                    title: '产品名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '产品编号',
                    dataIndex: 'number',
                    key: 'number'
                }, {
                    title: '产品负责人',
                    dataIndex: 'produceManagerName',
                    key: 'produceManagerName',
                }, {
                    title: '需求负责人',
                    dataIndex: 'demandManagerName',
                    key: 'demandManagerName',
                }, {
                    title: '研发负责人',
                    dataIndex: 'devManagerName',
                    key: 'devManagerName',
                }, {
                    title: '测试负责人',
                    dataIndex: 'checkManagerName',
                    key: 'checkManagerName',
                }, {
                    title: '项目数',
                    dataIndex: 'count',
                    key: 'count'
                }, {
                    title: '产品创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                }, {
                    title: '操作',
                    key: 'action',
                    render: (text, record, index) => {
                        return <>
                            <Button
                                disabled={!hasPermi(userInfo, "producems:produce:update")}
                                type={'link'} size="small"
                                onClick={() => {
                                    setAddModalOpen(true)
                                    getProduceInfo(record)
                                }}>编辑</Button>
                            <Popconfirm
                                disabled={!hasPermi(userInfo, "producems:produce:del")}
                                title={`您确认删除${record.name}产品吗？`}
                                onConfirm={(e) => deleteProduceApi({guid: record.guid})
                                    .then(() => {
                                            listProduce({
                                                currentPage: pageInfo.currentPage,
                                                pageSize: pageInfo.pageSize,
                                            })
                                        }
                                    )}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button disabled={!hasPermi(userInfo, "producems:produce:del")}
                                        type={'link'} size="small">删除</Button>
                            </Popconfirm>
                        </>
                    }
                }]}
            rowKey={(record) => {
                return record.guid
            }}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                current: pageInfo.currentPage,
                total: pageInfo.total,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listProduce({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />

        <Modal
            open={addModalOpen}
            centered={true}
            title={!addFlag ? '产品修改' : '产品新增'}
            width='50%'
            footer={false}
            onCancel={() => {
                formInstance.resetFields()
                setTeamResourcesList([{teamResource: teamresourceEnum.DEMAND_GROUP}, {teamResource: teamresourceEnum.RD_GROUP}, {teamResource: teamresourceEnum.TEST_GROUP}])
                setAddModalOpen(false)
                setAddFlag(false)
            }}
            className={'produce-add-moadl'}
        >
            <Form
                form={formInstance}
                name="basic"
                labelCol={{
                    span: 4,
                }}
            >
                <Form.Item
                    label="产品名称:"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '产品名称不能为空！',
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="产品编号:"
                    name="number"
                    rules={[
                        {
                            required: true,
                            message: '产品编号不能为空',
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="产品负责人:"
                    name="produceManager"
                    rules={[
                        {
                            required: true,
                            message: '产品负责人不能为空！',
                        }
                    ]}
                >
                    <Select
                        showSearch={true}
                        filterOption={(input, option) => {
                            return pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1
                        }}
                        options={userList.map((item) => {
                            return {
                                value: item.userGuid,
                                label: item.nickName,
                            }
                        })}
                    />
                </Form.Item>
            </Form>
            <div className="produce-user">团队建设</div>
            <Table
                columns={[
                    {
                        title: '团队资源',
                        width: '15vw',
                        render: (text, record, index) => {
                            return teamresourceEnum.getName(Number(record.teamResource))
                        },
                    },
                    {
                        title: '负责人',
                        width: '15vw',
                        render: (text, record, index) => {
                            return <Select
                                showSearch={true}
                                filterOption={(input, option) => {
                                    return pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1
                                }}
                                style={{width: '15vw'}}
                                value={record.managerGuid}
                                onChange={(v, option) => {
                                    setTeamResourcesList(changManage(index, v, option, teamResourcesList))
                                }}
                                options={userList.map((item) => {
                                    return {
                                        value: item.userGuid,
                                        label: item.nickName,
                                    }
                                })}
                            />
                        },
                    },
                    {
                        title: '项目组成员',
                        width: '15vw',
                        render: (text, record, index) => {
                            return <TreeSelect
                                style={{width: '15vw'}}
                                multiple
                                treeData={getUserTreeData(deptList, userList, false)}
                                value={record.groupMemsGuids ? record.groupMemsGuids.split('、') : []}
                                placeholder='请选择项目组成员'
                                onChange={(v, option) => {
                                    setTeamResourcesList(changeGroupMems(v, [], index, teamResourcesList))
                                }}
                                treeCheckable={true} //
                                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                                showSearch
                            />
                        }
                    }
                ]}
                dataSource={teamResourcesList}
                rowKey={(record) => {
                    return JSON.stringify(record)
                }}
                pagination={false}
            />
            <Button type={'primary'} onClick={addProduce}>保存</Button>
        </Modal>
    </div>
}

export default Produce
