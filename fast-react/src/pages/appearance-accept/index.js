import React, {useEffect, useState} from "react";
import {Table, Button, Input, Select, message, Popconfirm, Form, Space} from 'antd';
import './index.scss'


import {SearchOutlined} from "@ant-design/icons";
import {hasPermi} from "../../utils/permi";
import {addProduceApi, listAllProduceApi, listProduceApi} from "../../common/api/producems/produce";
import {handleSave} from "../../utils/table";


//出厂验收
const AppearanceAccept = () => {
    const [searchForm] = Form.useForm()
    const [produceList, setProduceList] = useState([])
    const [appearanceAcceptProduce, setAppearanceAcceptProduce] = useState({})
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1, pageSize: 10, total: 0, totalPages: 0
    })

    useEffect(() => {
        listProduce({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
            ...searchForm.getFieldsValue()
        })
    }, [])

    const listProduce = async (values) => {
        const res = await listProduceApi({...values})
        setProduceList(res.data.list)
        setPageInfo({
            currentPage: res.data.currentPage,
            pageSize: res.data.pageSize,
            total: res.data.total,
            totalPages: res.data.totalPages
        })

    }

    //编辑产品
    const updateAppearanceAcceptProduce = async (obj) => {
        await addProduceApi({...appearanceAcceptProduce, ...obj})
        message.success('保存成功')
        onSearch(searchForm.getFieldsValue())
    }

    const onSearch = (values) => {
        listProduce({
            currentPage: pageInfo.currentPage,
            pageSize: pageInfo.pageSize,
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
                label="产品名称"
                name="name"
            >
                <Input/>
            </Form.Item>
                <Form.Item
                    style={{width: '15vw'}}
                    label="出厂状态"
                    name="acceptanceFlag"
                >
                    <Select
                        style={{width: '5vw'}}
                        options={[
                            {
                                value: 0,
                                label: '未出厂'
                            }, {
                                value: 1,
                                label: '已出厂'
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
            dataSource={produceList}
            columns={[{
                title: '序号',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            }, {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '出厂报告',
                render: (text, record, index) => {
                    return <Input style={{color: 'blue', textDecoration: 'underline', width: '100%'}}
                                  bordered={false}
                                  value={record.factoryReportLink}
                                  onBlur={() => updateAppearanceAcceptProduce({})}
                                  onChange={(e) => {
                                      handleSave(index, 'factoryReportLink',  e.target.value, produceList, setProduceList)
                                      setAppearanceAcceptProduce({
                                          guid: record.guid,
                                          factoryReportLink: e.target.value,
                                          acceptanceFlag: record.acceptanceFlag,
                                      })
                                  }}
                                  onDoubleClick={() => {
                                      window.open(record.factoryReportLink, '_blank')
                                  }}
                    />

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
                            title={record.acceptanceFlag ? `您确认将${record.name}项目取消出厂验收吗？` : `您确认将${record.name}项目出厂验收吗？`}
                            onConfirm={(e) => updateAppearanceAcceptProduce({
                                guid: record.guid,
                                factoryReportLink: record.factoryReportLink,
                                acceptanceFlag: record.acceptanceFlag ? 0 : 1
                            })}
                            okText="确定"
                            cancelText="取消"
                        > <span style={{color: '#1D79FC', cursor: 'pointer'}}
                                size="small">{record.acceptanceFlag ? '取消出厂' : '出厂'}</span>
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
                    listProduce({
                        currentPage: page,
                        pageSize: pageSize,
                        ...searchForm.getFieldsValue()
                    })
                }
            }}
        />
    </div>

}

export default AppearanceAccept
