import React, {useEffect, useState} from "react";
import './index.scss'
import {Button, Checkbox, Form, Input, message, Modal, Popconfirm, Select, Table, TreeSelect} from "antd";
import {addProduceApi, deleteProduceApi, listAllProduceApi, updateLockProduceToUserApi} from "../../common/api/produce";


let Produce = (props) => {
    let [formInstance] = Form.useForm()
    let [name, setName] = useState('')
    let [number, setNumber] = useState('')
    let [produceList, setProduceList] = useState([])
    let [teamResourcesList, setTeamResourcesList] = useState([{teamResource: 1}, {teamResource: 2}, {teamResource: 3}])
    let [addModalOpen, setAddModalOpen] = useState(false)
    let [addFlag, setAddFlag] = useState(false)

    let [pageSize, setPageSize] = useState(10)
    useEffect(() => {
        listProduce()
    }, [])

    /**
     * 获取产品
     * @returns {Promise<void>}
     */
    let listProduce = async () => {
        let res = await listAllProduceApi({userGuid: getCurrentUserGuid()})
        if (res.code === 1) {
            iniData = deepCopy(res.data)
            saveRedux('produceList', res.data)
            dealProjectListOrder(res.data)
        } else {
            message.error('listAllProduceApi error')
        }
    }
    /**
     * 搜索
     */
    let search = () => {
        let newProduceList = iniData.filter(item => (name ? item.name.indexOf(name) !== -1 : true) && (number ? item.number.indexOf(number) !== -1 : true));
        setProduceList(newProduceList)
    }
    /**
     * 新增项目
     * @returns {Promise<void>}
     */
    let addProduce = () => {
        let fieldsValue = formInstance.getFieldsValue(true)
        formInstance.validateFields().then(async (values) => {
            for (let teamResourcesListElement of teamResourcesList) {
                if (!teamResourcesListElement.managerGuid) {
                    message.error('请填写完整相关负责人！')
                    return
                }
                teamResourcesListElement.groupMemsGuids = getUserGUidsByDepGuids(props.userList, props.depList, teamResourcesListElement.groupMemsGuids.split('、')).join('、')
            }
            let res = await addProduceApi({
                ...fieldsValue,
                'teamReasourcesList': JSON.stringify(teamResourcesList)
            })
            if (res.code === 1) {
                listProduce()
                setAddModalOpen(false)
                formInstance.resetFields()
                setAddFlag(false)
                setTeamResourcesList([{teamResource: 1}, {teamResource: 2}, {teamResource: 3}])
                message.success('保存成功', 1)
            } else {
                message.error('保存失败')
            }
        }).catch((errorInfo) => {

        });

    }
    //编辑用户锁定项目
    let updateLockProduceToUser = async (record, v) => {
        let res = await updateLockProduceToUserApi({
            userGuid: getCurrentUserGuid(),
            produceGuid: record.guid,
            lockFlag: record.lockFlag === 1 ? 0 : 1,
        })
        if (res.code === 1) {
            listProduce()
            message.success('更新成功', 1)
        } else {
            message.error('更新失败', 1)
        }
    }

    //处理产品列表顺序，锁定在上未锁定在下，且按时间排序
    let dealProjectListOrder = (data) => {
        let lockProduceList = data.filter((item) => {
            return item.lockFlag === 1
        })//锁定的项目列表
        let noLockProduceList = data.filter((item) => {
            return item.lockFlag === 0
        })//未锁定项目列表
        lockProduceList.sort((a, b) => {
            b.createTime < a.createTime ? -1 : 1
        })
        noLockProduceList.sort((a, b) => {
            b.createTime < a.createTime ? -1 : 1
        })
        let newProjectList = [...lockProduceList, ...noLockProduceList]
        setProduceList(newProjectList)
    }
    /**
     * 删除产品
     * @param guid
     * @returns {Promise<void>}
     */
    let deleteProduce = async (guid) => {
        let res = await deleteProduceApi({guid})
        if (res.code === 1) {
            listProduce()
            message.success('删除成功')
        } else if (HttpErrorCode.DELETE_PRODUCE_FAILD === res.code) {
            message.error(res.message)
        } else if (HttpErrorCode.DELETE_EXIT_ORDER === res.code) {
            message.error(res.message)
        } else {
            message.error('删除失败')
        }
    }
    /**
     * 产品列
     * @type {[{width: string, title: string, render: (function(*, *, *): string|JSX.Element)},{width: string, title: string, render: (function(*, *, *): *)},{dataIndex: string, width: string, title: string, key: string},{dataIndex: string, width: string, title: string, key: string},{width: string, title: string, render: (function(*, *, *): string|*)},null,null,null,null,null,null]}
     */
    let prodeuceColumns = [
        {
            title: '锁定',
            width: '4vw',
            render: (text, record, index) => {
                return record.children ? '' : <Checkbox
                    onChange={(v) => {
                        updateLockProduceToUser(record, v)
                    }}
                    checked={record.lockFlag === 1}/>
            },
        }, {
            title: '序号',
            width: '3vw',
            render: (text, record, index) => {
                return <div>
                    {index + 1}
                </div>
            }
        }, {
            title: '产品名称',
            width: '20vw',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '产品编号',
            width: '15vw',
            dataIndex: 'number',
            key: 'number'
        }, {
            title: '产品负责人',
            width: '15vw',
            render: (text, record, index) => {
                return props.userList.length !== 0 ? props.userList.filter(item => item.userGuid === record.produceManager)[0].userName : ''
            }
        }, {
            title: '需求负责人',
            width: '15vw',
            render: (text, record, index) => {
                return props.userList.length !== 0 ? props.userList.filter(item => item.userGuid === record.producememberList.filter(i => i.teamResource === 1)[0].managerGuid)[0].userName : ''
            }
        }, {
            title: '研发负责人',
            width: '15vw',
            render: (text, record, index) => {
                return props.userList.length !== 0 ? props.userList.filter(item => item.userGuid === record.producememberList.filter(i => i.teamResource === 2)[0].managerGuid)[0].userName : ''
            }
        }, {
            title: '测试负责人',
            width: '15vw',
            render: (text, record, index) => {
                return props.userList.length !== 0 ? props.userList.filter(item => item.userGuid === record.producememberList.filter(i => i.teamResource === 3)[0].managerGuid)[0].userName : ''
            }
        }, {
            title: '项目数',
            width: '5vw',
            dataIndex: 'count',
            key: 'count'
        }, {
            title: '产品创建时间',
            width: '15vw',
            dataIndex: 'createTime',
            key: 'createTime',
        }, {
            title: '操作',
            key: 'action',
            width: '10vw',
            render: (text, record, index) => {
                return <>
                    <Button type={'link'} disabled={!sysAdminJudgment()} size="small" onClick={() => {
                        setAddModalOpen(true)
                        formInstance.setFieldsValue({
                            produceGuid: record.produceGuid,
                            name: record.name,
                            number: record.number,
                            produceManager: record.produceManager,
                            guid: record.guid
                        })
                        setTeamResourcesList(record.producememberList)
                    }}
                    >编辑</Button>
                    <Popconfirm
                        disabled={!sysAdminJudgment()}
                        title={`您确认删除${record.name}产品吗？`}
                        onConfirm={(e) => deleteProduce(record.guid)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type={'link'} disabled={!sysAdminJudgment()} size="small">删除</Button>
                    </Popconfirm>
                </>
            }
        }]
    /**
     * 项目资源列
     * @type {[{width: string, title: string, render: (function(*, *, *): *|*[])},{width: string, title: string, render: (function(*, *, *): *)},{width: string, title: string, render: (function(*, *, *): *)}]}
     */
    let produceUserColumns = [
        {
            title: '团队资源',
            width: '15vw',
            render: (text, record, index) => {
                return teamResourceEnum.getMessage(record.teamResource)
            },
        }, {
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
                    options={
                        props.userList.map((item) => {
                            return {
                                value: item.userGuid,
                                label: item.userName,
                                key: item.userGuid
                            }
                        })
                    }
                />
            },
        }, {
            title: '项目组成员',
            width: '15vw',
            render: (text, record, index) => {
                return <TreeSelect
                    style={{width: '15vw'}}
                    multiple
                    treeData={getUserTreeData(props.depList, props.userList, false)}
                    value={record.groupMemsGuids ? record.groupMemsGuids.split('、') : []}
                    placeholder='请选择项目组成员'
                    onChange={(v, option) => {
                        setTeamResourcesList(changeGroupMems(v, [], index, teamResourcesList))
                    }}
                    treeCheckable={true} //
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}//
                    showSearch
                    filterOption={(input, option) => {
                        return pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1
                    }}
                />
            }
        }]
    return <div id="produce-list">
        <div className={'query'}>
            <Input placeholder="请输入产品名称" value={name} onChange={(v) => {
                setName(v.target.value)
            }}/>
            <Input placeholder="请输入产品编号" value={number} onChange={(v) => {
                setNumber(v.target.value)
            }}/>
            <Button type={'primary'} onClick={search}>搜索</Button>
            <Button type={'primary'} disabled={!sysAdminJudgment()} onClick={() => {
                setAddModalOpen(true), setAddFlag(true)
            }}>新增</Button>
        </div>
        <Table
            dataSource={produceList}
            columns={prodeuceColumns}
            rowKey={(record) => {
                return record.guid
            }}
            pagination={{
                pageSize: pageSize,
                onChange: (page, pageSize) => setPageSize(pageSize)
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
                setTeamResourcesList([{teamResource: 1}, {teamResource: 2}, {teamResource: 3}])
                setAddModalOpen(false)
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
                        }, {
                            validator: (_, value) => {
                                if (!addFlag || !value || produceList.filter(item => item.name === value).length === 0) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(new Error('产品名称重复请核实!'))
                            }
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
                        }, {
                            validator: (_, value) => {
                                if (!addFlag || !value || produceList.filter(item => item.number === value).length === 0) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(new Error('产品编号重复请核实!'))
                            }
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
                        options={props.userList.map((item) => {
                            return {
                                value: item.userGuid,
                                label: item.userName,
                                key: item.userGuid
                            }
                        })}
                    />
                </Form.Item>
            </Form>
            <div className="produce-user">团队建设</div>
            <Table
                columns={produceUserColumns}
                dataSource={teamResourcesList}
                rowKey={(record) => {
                    return JSON.stringify(record)
                }}
                pagination={false}
            />
            <Button type={'primary'}>保存</Button>
        </Modal>
    </div>
}

export default Produce
