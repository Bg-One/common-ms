import React, {useEffect, useState} from "react";
import {Table, Button, Input, Select, message, Popconfirm, Form, Space} from 'antd';
import './index.scss'

import {
    addOrEditProjectApi,
    listOnsiteaAcceptApi, onsiteaAccepttApi,
    updateAcceptanceProjectApi
} from "../../common/api/producems/project";
import {SearchOutlined} from "@ant-design/icons";
import {hasPermi} from "../../utils/permi";
import {listProjectApi} from "../../common/api/producems/project";
import {handleSave} from "../../utils/table";


//现场验收
const OnsiteAccept = () => {
    const [searchForm] = Form.useForm()
    const [projectList, setProjectList] = useState([])
    const [acceptanceProject, setAcceptanceProject] = useState({})
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1, pageSize: 10, total: 0, totalPages: 0
    })

    useEffect(() => {
        listOnsiteaAccept({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue()
        })
    }, [])

    const listOnsiteaAccept = async (values) => {
        const res = await listOnsiteaAcceptApi({executionStatus: 100, ...values})
        setProjectList(res.data.list)
        setPageInfo({
            currentPage: res.data.currentPage,
            pageSize: res.data.pageSize,
            total: res.data.total,
            totalPages: res.data.totalPages
        })

    }

    //编辑项目
    const updateAcceptanceProject = async (obj) => {
        await addOrEditProjectApi({...acceptanceProject, ...obj})
        message.success('保存成功')
        onSearch(searchForm.getFieldsValue())
    }

    const onsiteaAccept = (values) => {
        onsiteaAccepttApi({...values}).then(res => {
            message.success('操作成功')
            onSearch(searchForm.getFieldsValue())
        })
    }

    const onSearch = (values) => {
        listOnsiteaAccept({
            currentPage: 1,
            pageSize: 10,
            ...values
        })
    }

    return <div id="home-appearanceaccept">
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 7,
                }}
                initialValues={{acceptanceFlag: 1}}
                onFinish={onSearch}
                autoComplete="off"
            > <Form.Item
                label="项目名称"
                name="name"
            >
                <Input/>
            </Form.Item>
                <Form.Item
                    style={{width: '15vw'}}
                    label="验收状态"
                    name="acceptanceFlag"
                >
                    <Select
                        style={{width: '5vw'}}
                        options={[
                            {
                                value: 0,
                                label: '未验收'
                            }, {
                                value: 1,
                                label: '已验收'
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 10,
                        offset: 10,
                    }}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>查询</Button>
                </Form.Item>
            </Form>
        </div>
        <Table
            dataSource={projectList}
            columns={[{
                title: '序号',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            }, {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '验收报告',
                render: (text, record, index) => {
                    return <div className='actionlist'>
                        <Input style={{color: 'blue', textDecoration: 'underline', width: '100%'}}
                               bordered={false}
                               value={record.acceptReportLink}
                               onBlur={() => updateAcceptanceProject({})}
                               onChange={(e) => {
                                   handleSave(index, 'acceptReportLink', e.target.value, projectList, setProjectList)
                                   setAcceptanceProject({
                                       guid: record.guid,
                                       acceptReportLink: e.target.value,
                                   })
                               }}
                               onDoubleClick={() => {
                                   window.open(record.factoryReportLink, '_blank')
                               }}
                        />
                    </div>
                }
            }, {
                title: '产品负责人',
                dataIndex: 'produceManagerName',
                key: "produceManagerName"
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime'
            },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record, index) => {
                        return <Popconfirm
                            title={record.acceptanceFlag ? `您确认将${record.name}项目取消现场验收吗？` : `您确认将${record.name}项目现场验收吗？`}
                            onConfirm={(e) => onsiteaAccept({
                                guid: record.guid,
                                acceptanceFlag: record.acceptanceFlag ? 0 : 1
                            })}
                            okText="确定"
                            cancelText="取消"
                        > <span style={{color: '#1D79FC', cursor: 'pointer'}}
                                size="small">{record.acceptanceFlag ? '取消验收' : '验收'}</span>
                        </Popconfirm>

                    }
                }]}
            rowKey={record => record.guid}
            pagination={{
                pageSize: pageInfo.pageSize,
                pageNumber: pageInfo.currentPage,
                total: pageInfo.total,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                    listOnsiteaAccept({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />
    </div>

}

export default OnsiteAccept
