import {Button, DatePicker, Form, Input, message, Select, Space, Table, TreeSelect} from "antd";
import React, {useEffect, useState} from "react";
import pinyinUtil from "../../common/react-pinyin-master";
import {AppstoreAddOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import './index.scss'
import {
    listWorkOrderCategoryApi,
    listWorkOrderTypeApi, statisticProjectWorkDurationApi,
    statisticUserWorkDurationApi
} from "../../common/api/producems/workorder";
import {listAllProjectApi} from "../../common/api/producems/project";
import {changeGroupMems, getUserGiudsByDepGuids, getUserTreeData} from "../../utils/user";
import {listUserApi} from "../../common/api/sys/user-api";
import {listDeptApi} from "../../common/api/sys/deptinfo-api";
import WorkHourStatisticsDetail from "./work-hour-statistics-detail";


const WorkingHourStatistics = () => {

    const [searchForm] = Form.useForm()
    const [projectList, setProjectList] = useState([])
    const [workTypeList, setWorkOrderTypeList] = useState([])
    const [workCategoryList, setWorkOrderCategoryList] = useState([])
    const [userList, setUserList] = useState([])
    const [deptList, setDeptGuid] = useState([])
    const [statisticsResultVisible, setStatisticsResultVisible] = useState(false)
    const [statisticsByProjectList, setStatisticsByProjectList] = useState([])
    const [statisticsByUserList, setStatisticsByUserList] = useState([])
    useEffect(() => {
        listAllProject()
        listWorkOrderType()
        listWorkOrderCategory()
        listUserApi().then(userRes => {
            setUserList(userRes.data)
        })
        listDeptApi().then(deptRes => {
            setDeptGuid(deptRes.data)
        })
    }, [])

    const listAllProject = async () => {
        const res = await listAllProjectApi()
        setProjectList(res.data)
    }
    const listWorkOrderType = async (obj = {}) => {
        let res = await listWorkOrderTypeApi()
        setWorkOrderTypeList(res.data)
    }
    const listWorkOrderCategory = async (obj) => {
        let res = await listWorkOrderCategoryApi(obj)
        setWorkOrderCategoryList(res.data)
    }

    const onSearch = async () => {
        const reqData = {
            createUserGuids: getUserGiudsByDepGuids(userList, deptList, searchForm.getFieldValue('createUserGuids')).join(','),
            startTime: (searchForm.getFieldValue('timerange')[0]).format('YYYY-MM-DD'),
            endTime: (searchForm.getFieldValue('timerange')[1]).format('YYYY-MM-DD'),
            workTypeGuids: searchForm.getFieldValue('workTypeGuids').join(','),
            projectGuids: searchForm.getFieldValue('projectGuids').join(','),
            workCategoryGuids: searchForm.getFieldValue('workCategoryGuids').join(',')
        }
        let projectRes = await statisticProjectWorkDurationApi(reqData)
        setStatisticsByProjectList(projectRes.data)
        let userRes = await statisticUserWorkDurationApi(reqData)
        setStatisticsByUserList(userRes.data)
        setStatisticsResultVisible(true)
    }

    const selectOnChangeActive = (field, v) => {
        let vElement = v[v.length - 1];
        if (vElement === '100') {
            searchForm.setFieldValue(field, ['100'])
        } else if (v.includes('100')) {
            searchForm.setFieldValue(field, v.filter(item => item !== '100'))
        }
    }

    return <div id={'work-hour-statistics-area'}>
        {statisticsResultVisible ? <WorkHourStatisticsDetail statisticsByProjectList={statisticsByProjectList}
                                                             statisticsByUserList={statisticsByUserList}
                                                             setStatisticsResultVisible={setStatisticsResultVisible}
                                                             startTime={(searchForm.getFieldValue('timerange')[0]).format('YYYY-MM-DD')}
                                                             endTime={(searchForm.getFieldValue('timerange')[1]).format('YYYY-MM-DD')}/> :
            <Form
                className={'search-form'}
                form={searchForm}
                layout="horizontal"
                labelCol={{
                    span: 7,
                }}
                initialValues={{
                    workCategoryGuids: ['100'],
                    workTypeGuids: ['100'],
                    projectGuids: ['100']
                }}
                onFinish={onSearch}
                autoComplete="off"
            > <Form.Item
                label="选择成员："
                name="createUserGuids"
                rules={[{required: true, message: '请选择成员'}]}
            >
                <TreeSelect
                    multiple
                    treeData={getUserTreeData(deptList, userList, false)}
                    placeholder='请选择项目组成员'
                    treeCheckable={true}
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    showSearch
                    filterTreeNode={(input, option) => pinyinUtil.getFirstLetter(option.title).indexOf(input.toUpperCase()) !== -1 || option.title.indexOf(input.toUpperCase()) !== -1}
                />
            </Form.Item>
                <Form.Item
                    label="时间范围"
                    name="timerange"
                    rules={[{required: true, message: '请选择时间范围'}]}

                >
                    <DatePicker.RangePicker/>
                </Form.Item>
                <Form.Item
                    label="选择项目名称："
                    name="projectGuids"
                    rules={[{required: true, message: '请选择项目名称'}]}
                >
                    <Select mode="multiple"
                            onChange={(v) => {
                                selectOnChangeActive('projectGuids', v)
                            }} options={[{
                        value: '100',
                        label: '全选'
                    }, ...projectList.map((item) => {
                        return {
                            value: item.guid,
                            label: item.name
                        }
                    })]}/>
                </Form.Item>
                <Form.Item
                    label="选择工作类型："
                    name="workTypeGuids"
                    rules={[{required: true, message: '请选择工作类型'}]}
                >
                    <Select
                        mode="multiple"
                        onChange={(v) => {
                            selectOnChangeActive('workTypeGuids', v)
                        }}
                        options={[{
                            value: '100',
                            label: '全选'
                        }, ...workTypeList.map((item) => {
                            return {
                                value: item.guid,
                                label: item.name
                            }
                        })]}/>
                </Form.Item>
                <Form.Item
                    label="选择工作类目"
                    name="workCategoryGuids"
                    rules={[{required: true, message: '请选择工作类目'}]}
                >
                    <Select
                        mode="multiple"
                        onChange={(v) => {
                            selectOnChangeActive('workCategoryGuids', v)
                        }}
                        options={[{
                            value: '100',
                            label: '全选'
                        }, ...workCategoryList.map((item) => {
                            return {
                                value: item.guid,
                                label: item.name
                            }
                        })]}/>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 5, offset: 10,
                    }}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                        统计工时
                    </Button>
                </Form.Item>
            </Form>}
    </div>
}

export default WorkingHourStatistics
