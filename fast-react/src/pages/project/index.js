import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Popconfirm, Select, Space, Table, TreeSelect} from 'antd';
import './index.scss'
import pinyinUtil from '../../common/react-pinyin-master/pinyinUtil'
import {teamresourceEnum} from "../../common/enmus/teamresource-enum";
import {
    addOrEditProjectApi,
    delProjectApi,
    listProjectApi,
    listProjectMemListApi
} from "../../common/api/producems/project";
import {listAllProduceApi, listProduceMemListApi} from "../../common/api/producems/produce";
import {AppstoreAddOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {hasPermi} from "../../utils/permi";
import {changeGroupMems, changManage, getUserGiudsByDepGuids, getUserTreeData} from "../../utils/user";
import {listUserApi} from "../../common/api/sys/use-api";
import {listDeptApi} from "../../common/api/sys/deptinfo-api";
import {projectExecutionStatusEnum} from "../../common/enmus/project-exe-status-enum";


const Project = (props) => {
    const [formInstance] = Form.useForm()
    const [searchForm] = Form.useForm()

    const [projectList, setProjectList] = useState([])
    const [produceList, setProduceList] = useState([])

    const [teamResourcesList, setTeamResourcesList] = useState([{teamResource: teamresourceEnum.TECHNICAL_GROUP}, {teamResource: teamresourceEnum.PROJECT_GROUP}])
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [addFlag, setAddFlag] = useState(false)
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1, pageSize: 10, total: 0, totalPages: 0
    })
    const [userList, setUserList] = useState([])
    const [deptList, setDeptGuid] = useState([])
    useEffect(() => {
        listProject({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue()
        })
        listAllProduce()
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
    //获取项目列表
    const listProject = (values) => {
        listProjectApi({...values}).then((res) => {
            setProjectList(res.data.list)
            setPageInfo({
                currentPage: res.data.currentPage,
                pageSize: res.data.pageSize,
                total: res.data.total,
                totalPages: res.data.totalPages
            })
        })

    }

    //搜索
    const onSearch = (values) => {
        listProject({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...values
        })
    }
    //发送异步请求删除项目
    const asynDelProject = async (guid) => {
        await delProjectApi({guid})
        listProject()
        message.success('删除项目成功', 1)
    }
    /**
     * 获取产品
     * @returns {Promise<void>}
     */
    const listAllProduce = () => {
        listAllProduceApi().then((res) => {
            setProduceList(res.data)
        })
    }


    //保存或者更新团队资源
    const saveOrEditProject = async () => {
        let fieldsValue = formInstance.getFieldsValue(true);
        formInstance.validateFields().then(async (values) => {
            for (let teamResourcesListElement of teamResourcesList) {
                if (!teamResourcesListElement.managerGuid) {
                    message.error('请填写完整相关负责人！')
                    return
                }
                teamResourcesListElement.groupMemsGuids = getUserGiudsByDepGuids(userList, deptList, teamResourcesListElement.groupMemsGuids.split('、')).join('、')
            }
            await addOrEditProjectApi({
                ...fieldsValue,
                projectState: projectExecutionStatusEnum.NOEXECUTE,
                factoryReportLink: '',
                acceptReportLink: '',
                projectMemberList: JSON.stringify(teamResourcesList)
            })
            setAddModalOpen(false)
            formInstance.resetFields()
            setAddFlag(false)
            setTeamResourcesList([{teamResource: teamresourceEnum.TECHNICAL_GROUP}, {teamResource: teamresourceEnum.PROJECT_GROUP}])
            listProject({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                ...searchForm.getFieldsValue()
            })
            message.success('项目保存成功', 1)
        })
    }

    const getProjectInfo = (record) => {
        listProjectMemListApi({guid: record.guid}).then(res => {
            setTeamResourcesList(res.data)
            formInstance.setFieldsValue({
                produceGuid: record.produceGuid,
                name: record.name,
                projectNo: record.projectNo,
                executionStatus: record.executionStatus,
                guid: record.guid
            })
        })
    }

    return <div id="home-project-list">
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 7,
                }}
                initialValues={{
                    executionStatus: 100
                }}
                onFinish={onSearch}
                autoComplete="off"
            > <Form.Item
                label="产品名称"
                name="produceGuid"
            >
                <Select
                    allowClear
                    placeholder={'请选择产品名称'}
                    showSearch={true}
                    filterOption={(input, option) => {
                        return pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1
                    }}
                    options={
                        produceList.map((item) => {
                            return {
                                value: item.guid,
                                label: item.name,
                            }
                        })
                    }
                />
            </Form.Item>
                <Form.Item
                    label="项目名称"
                    name="name"
                >
                    <Input placeholder="请输入项目名称"/>
                </Form.Item>
                <Form.Item
                    label="产品编号"
                    name="projectNo">
                    <Input placeholder="请输入项目编号"/>
                </Form.Item>
                <Form.Item
                    style={{width: '20vw'}}
                    label="项目执行状态"
                    name="executionStatus">
                    <Select
                        style={{width: '5vw'}}
                        placeholder="请选择项目执行状态"
                        options={[{
                            value: 100, label: '全部',
                        }, {
                            value: 0, label: '未执行'
                        }, {
                            value: 1, label: '执行中'
                        }, {
                            value: 2, label: '暂停'
                        }, {
                            value: 3, label: '中止'
                        }, {
                            value: 4, label: '完结'
                        }, {
                            value: 5, label: '取消'
                        }]}
                    />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 10, offset: 5,
                    }}>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                            查询
                        </Button>
                        <Button htmlType="button" icon={<ReloadOutlined/>} onClick={() => {
                            searchForm.resetFields()
                            listProject({
                                currentPage: pageInfo.currentPage,
                                pageSize: pageInfo.pageSize,
                                ...searchForm.getFieldsValue()
                            })
                        }}>
                            重置
                        </Button>
                        <Button type="primary" htmlType="button"
                            // disabled={!hasPermi(userInfo, "producems:produce:add")}
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
            dataSource={projectList}
            columns={[{
                title: '序号', render: (text, record, index) => {
                    return index + 1
                }
            }, {
                title: '项目名称', dataIndex: 'name', key: 'name'
            }, {
                title: '产品名称', dataIndex: 'produceName', key: 'produceName'
            }, {
                title: '项目编号', dataIndex: 'projectNo', key: 'projectNo'
            }, {
                title: '产品负责人', dataIndex: 'produceManagerName', key: 'produceManagerName'
            }, {
                title: '生产负责人', dataIndex: 'technicalManagerName', key: 'technicalManagerName'
            }, {
                title: '项目工程负责人', dataIndex: 'projectManagerName', key: 'projectManagerName'
            }, {
                title: '项目执行状态', render: (text, record, index) => {
                    return <div>{projectExecutionStatusEnum.getName(record.executionStatus)}</div>
                }
            }, {
                title: '操作', key: 'action', render: (text, record, index) => {
                    return <div className='actionlist'>
                        <Button type={'link'} onClick={(e) => {
                            setAddModalOpen(true)
                            getProjectInfo(record)
                        }} size="small">编辑</Button>
                        <Popconfirm
                            title={`您确认删除${record.name}项目吗？`}
                            onConfirm={() => asynDelProject(record.guid)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type={'link'} size="small">删除</Button>
                        </Popconfirm>
                    </div>
                }
            }]}
            rowKey={record => record.guid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listProject({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />

        < Modal
            open={addModalOpen}
            centered={true}
            title={!addFlag ? '项目修改' : '项目新增'}
            width='50%'
            footer={false}
            onCancel={() => {
                setAddModalOpen(false)
                formInstance.resetFields()
                setTeamResourcesList([{teamResource: teamresourceEnum.TECHNICAL_GROUP}, {teamResource: teamresourceEnum.PROJECT_GROUP}])
            }}
            className='project-add-moadl'
        ><Form
            form={formInstance}
            name="basic"
            labelCol={{
                span: 4,
            }}
        >
            <Form.Item
                label="产品名称:"
                name="produceGuid"
                rules={[{required: true, message: '产品名称不能为空!'}]}
            >
                <Select
                    showSearch
                    filterOption={(input, option) => pinyinUtil.getFirstLetter(option.label).indexOf(input.toUpperCase()) !== -1 || option.label.indexOf(input.toUpperCase()) !== -1}
                    options={
                        produceList.map((item) => {
                            return {
                                value: item.guid,
                                label: item.name,
                            }
                        })
                    }
                />
            </Form.Item>
            <Form.Item
                label="项目名称"
                name="name"
                rules={[{
                    required: true, message: '项目名称不能为空!',
                }]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="项目编号"
                name="projectNo"
                rules={[{
                    required: true, message: '项目编号不能为空',
                }]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="项目执行状态:"
                name="executionStatus"
                rules={[{
                    required: true, message: '项目执行状态不能为空',
                }]}
            >
                <Select
                    options={[{
                        value: 0, label: '未执行'
                    }, {
                        value: 1, label: '执行中'
                    }, {
                        value: 2, label: '暂停'
                    }, {
                        value: 3, label: '中止'
                    }, {
                        value: 4, label: '完结'
                    }, {
                        value: 5, label: '取消'
                    }]}
                />
            </Form.Item>
        </Form>
            <div className="project-user">团队建设</div>
            <Table
                columns={[{//团队资源项目列
                    title: '团队资源', width: '15vw', render: (text, record, index) => {
                        return teamresourceEnum.getName(record.teamResource)
                    },
                }, {
                    title: '负责人', width: '15vw', render: (text, record, index) => {
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
                                userList.map((item) => {
                                    return {
                                        value: item.userGuid,
                                        label: item.nickName,
                                    }
                                })
                            }
                        />
                    },
                }, {
                    title: '项目组成员', width: '15vw', render: (text, record, index) => {
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
                            showCheckedStrategy={TreeSelect.SHOW_PARENT}//
                            showSearch
                        />

                    }
                }]}
                dataSource={teamResourcesList}
                rowKey={(record) => {
                    return JSON.stringify(record)
                }}
                pagination={false}
            />
            <Button type={'primary'} onClick={saveOrEditProject}>保存</Button>
        </Modal>
    </div>
}

export default Project
