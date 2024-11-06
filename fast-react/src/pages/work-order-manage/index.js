import React, {Component, useEffect, useState} from 'react'
import {Button, Table, Modal, Input, message, Select, Tabs, Popconfirm, Form, Space} from 'antd'
import './index.scss'
import {
    createWorkOrderCategoryApi, createWorkOrderItemApi,
    createWorkOrderTypeApi,
    deleteWorkOrderCategoryApi,
    deleteWorkOrderTypeApi,
    listWorkOrderCategoryApi,
    listWorkOrderItemApi,
    listWorkOrderTypeApi, updateWorkOrderCategoryApi, updateWorkOrderItemApi, updateWorkOrderTypeApi
} from "../../common/api/producems/workorder";

const workOrderManage = () => {
    const [form] = Form.useForm()
    const [activeKey, setActiveKey] = useState('workType')
    const [workOrderTypeList, setWorkOrderTypeList] = useState([])
    const [workOrderCategoryList, setWorkOrderCategoryList] = useState([])
    const [workOrderItemList, setWorkOrderItemList] = useState([])
    const [selectOptions, setSelectOptions] = useState([])
    const [selectLabel, setSelectLabel] = useState('')
    const [selectValue, setSelectValue] = useState('')
    const [modalObject, setModalObj] = useState({
        open: false,
        guid: '',
    })

    useEffect(() => {
        setSelectValue('')
        if (activeKey === 'workType') {
            listWorkOrderType()
        } else if (activeKey === 'workCategory') {
            setSelectLabel('工作类型:')
            listWorkOrderType()
            listWorkOrderCategory({workOrderTypeGuid: selectValue})
            setSelectOptions(workOrderTypeList.map(item => {
                return {label: item.name, value: item.guid}
            }))
        } else if (activeKey === 'workItem') {
            setSelectLabel('工作类目:')
            listWorkOrderCategory()
            listWorkOrderItem({workCategoryGuid: selectValue})
            setSelectOptions(workOrderCategoryList.map(item => {
                return {label: item.name, value: item.guid}
            }))
        }
    }, [activeKey])
    const listWorkOrderType = async (obj = {}) => {
        let res = await listWorkOrderTypeApi()
        setWorkOrderTypeList(res.data)
    }
    const listWorkOrderCategory = async (obj) => {
        let res = await listWorkOrderCategoryApi(obj)
        setWorkOrderCategoryList(res.data)
    }
    const listWorkOrderItem = async (obj) => {
        let res = await listWorkOrderItemApi(obj)
        setWorkOrderItemList(res.data)
    }
    const deleteAction = async (guid) => {
        if (activeKey === 'workType') {
            await deleteWorkOrderTypeApi({guid})
            listWorkOrderType()
        } else if (activeKey === 'workCategory') {
            await deleteWorkOrderCategoryApi({guid})
            listWorkOrderType()
        } else if (activeKey === 'workItem') {
            await deleteWorkOrderItemApi({guid})
            listWorkOrderType()
        }
        message.success('删除成功')
    }
    const searchAction = (v) => {
        setSelectValue(v)
        if (activeKey === 'workCategory') {
            listWorkOrderCategory({workOrderTypeGuid: v})
        } else if (activeKey === 'workItem') {
            listWorkOrderItem({workOrderCategoryGuid: v})
        }
    }
    const saveAction = async () => {
        if (activeKey === 'workType') {
            await createWorkOrderTypeApi({
                ...form.getFieldsValue()
            })
            listWorkOrderType()
        } else if (activeKey === 'workCategory') {
            await createWorkOrderCategoryApi({
                ...form.getFieldsValue()
            })
            listWorkOrderCategory({workOrderTypeGuid: selectValue})
        } else if (activeKey === 'workItem') {
            await createWorkOrderItemApi({
                ...form.getFieldsValue()
            })
            listWorkOrderItem({workOrderCategoryGuid: selectValue})
        }
        message.success('保存成功')
        setModalObj({
            guid: '',
            open: false
        })
        form.resetFields()
    }

    const updateAction = async () => {
        if (activeKey === 'workType') {
            await updateWorkOrderTypeApi({
                guid: modalObject.guid,
                ...form.getFieldsValue()
            })
            listWorkOrderType()
        } else if (activeKey === 'workCategory') {
            await updateWorkOrderCategoryApi({
                guid: modalObject.guid,
                ...form.getFieldsValue()
            })
            listWorkOrderCategory({workOrderTypeGuid: selectValue})
        } else if (activeKey === 'workItem') {
            await updateWorkOrderItemApi({
                guid: modalObject.guid,
                ...form.getFieldsValue()
            })
            listWorkOrderItem({workOrderCategoryGuid: selectValue})
        }
        message.success('保存成功')
        setModalObj({
            guid: '',
            open: false
        })
        form.resetFields()
    }
    let columns = [
        {
            title: '序号',
            width: '10%',
            key: 'guid',
            align: 'center', // 设置列内容居中显示
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: activeKey === 'workType' ? '工作类型' : activeKey === 'workCategory' ? '工作类目' : '工作条目',
            width: '60%',
            align: 'center',
            render: (index, record, text) => {
                return record.name
            }
        }, {
            title: '操作',
            width: '30%',
            key: 'Reverse',
            align: 'center',
            render: (index, record, text) => {
                return <div className='option-btn'>
                    <Button type={'link'} onClick={() => {
                        setModalObj({
                            open: true,
                            guid: record.guid
                        })
                        form.setFieldValue('name', record.name)
                    }}>修改</Button>
                    <Popconfirm
                        title={`是否删除选中的工作类型？`}
                        onConfirm={() => deleteAction(record.guid)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type={'link'} size="small">删除</Button>
                    </Popconfirm>
                </div>
            }
        }
    ]

    return (
        <div id='work-order-manage'>
            <Tabs
                destroyInactiveTabPane={true}
                items={[{
                    label: `工作类型维护`, key: 'workType'
                }, {
                    label: `工作类目维护`, key: 'workCategory'
                }, {
                    label: `工作条目维护`, key: 'workItem'
                }]}
                onChange={(v) => {
                    setActiveKey(v)
                }}
            />
            <div>
                {
                    activeKey !== 'workType' ? <>
                        <span>{selectLabel}</span>
                        <Select
                            style={{width: '10vw'}}
                            options={selectOptions}
                            onChange={(v) => searchAction(v)}
                            value={selectValue}
                        />
                    </> : ''
                }
                <Button type={'primary'} onClick={() => {
                    setModalObj({
                        open: true,
                        guid: ''
                    })
                }}>新增</Button>
            </div>
            <Table
                dataSource={activeKey === 'workType' ? workOrderTypeList : activeKey === 'workCategory' ? workOrderCategoryList : workOrderItemList}
                columns={columns}
                rowKey={record => record.guid}
                pagination={{
                    pageSize: 10
                }}
            />
            <Modal
                open={modalObject.open}
                footer={false}
                centered={true}
                onCancel={() => {
                    setModalObj({open: false, guid: ''})
                    form.resetFields()
                }}
                title={'工单维护配置编辑'}
            >
                <Form
                    className={'search-form'}
                    form={form}
                    layout='horizontal'
                    labelCol={{
                        span: 7,
                    }}
                    onFinish={modalObject.guid ? updateAction : saveAction}
                    autoComplete="off"
                >
                    {activeKey !== 'workType' && modalObject.guid === '' ? <Form.Item
                        label={selectLabel}
                        name={activeKey === 'workCategory' ? 'workOrderTypeGuid' : "workOrderCategoryGuid"}
                        rules={[{required: true, message: '请选择'}]}
                    >
                        <Select
                            options={selectOptions}
                        />
                    </Form.Item> : ''}
                    <Form.Item
                        label="名称:"
                        name="name"
                        rules={[{required: true, message: '请输入名称'}]}
                    >
                        <Input placeholder="请输入名称"/>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 10, offset: 10,}}>
                        <Button type={'primary'} htmlType={'submit'}>保存</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}

export default workOrderManage
