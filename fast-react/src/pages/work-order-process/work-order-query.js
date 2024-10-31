import {Button, DatePicker, Form, Select, Space, Table, TimePicker} from "antd";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import {useEffect, useState} from "react";
import {listUserApi} from "../../common/api/sys/use-api";
import {listDeptApi} from "../../common/api/sys/deptinfo-api";
import {listAllProjectApi} from "../../common/api/producems/project";
import {useSelector} from "react-redux";
import withdraw from '../../static/images/withdraw.png'
import {getWorkOrderApi, listWorkOrderApi} from "../../common/api/producems/workorder";
import moment from "moment";
import WorkOrderDetail from "./work-order-detail";

const WorkOrderQuery = () => {
    const [searchForm] = Form.useForm();
    const [userList, setUserList] = useState([])
    const [deptList, setDeptGuid] = useState([])
    const [projectList, setProjectList] = useState([])
    const userInfo = useSelector(state => state.user.userInfo)
    const [selectDepGuid, setSelectDepGuid] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [workorderDetailVisible, setWorkorderDetailVisible] = useState(false)
    const [workorderDetailList, setWorkorderDetailList] = useState([])
    useEffect(() => {
        listUserApi().then(userRes => {
            setUserList(userRes.data)
        })
        listDeptApi().then(deptRes => {
            setDeptGuid(deptRes.data)
        })
        listAllProjectApi().then((res) => {
            setProjectList(res.data)
        })

    }, [])
    const listWorkOrder = async (values) => {
        let res = await listWorkOrderApi({
            ...values
        })
        setDataSource(res.data)
    }
    const onFinish = async (values) => {
        await listWorkOrder({
            statuss: values.statuss,
            createGuid: values.createGuid,
            departmentGuid: values.departmentGuid.join("、"),
            projectGuid: values.projectGuid,
            startTime: values.timerange[0].format('YYYY-MM-DD'),
            endTime: values.timerange[1].format('YYYY-MM-DD')
        })
    }
    const editWorkOrder = async (record) => {
        let res = await getWorkOrderApi({
            createTime: record.createTime,
            createGuid: record.createGuid
        })
        setWorkorderDetailVisible(true)
        setWorkorderDetailList(res.data)
    }
    const columns = [
        {
            title: '员工姓名',
            dataIndex: 'createName',
            key: 'createName'
        }, {
            title: '审核人',
            key: 'reviewName',
            dataIndex: 'reviewName',
            width: '5vw',
        }, {
            title: '工作类型',
            dataIndex: 'workType',
            key: 'workType',
            render: (text, record, index) => {
                return record.status === '1' && record.reason ? <div><img src={withdraw} style={{
                    width: '25px',
                    position: 'absolute',
                    left: '5px'
                }}/>{text}</div> : text
            }
        }, {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: '15vw',
        }, {
            title: '工作类目',
            dataIndex: 'workCategory',
            key: 'workCategory',
        }, {
            title: '工作条目',
            dataIndex: 'workItem',
            key: 'workItem',
        }, {
            title: '报单时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }, {
            title: '时长',
            key: 'workDuration',
            dataIndex: 'workDuration',
            width: '3vw',
        }, {
            title: '工作内容',
            key: 'content',
            dataIndex: 'content',
            width: '20%',
        }, {
            title: '状态',
            key: 'status',
            render: (text, record, index) => {
                return <>
                    {record.status === workOrderEnum.DRAFT ? <span>待提交</span> : null}
                    {record.status === workOrderEnum.SUBMIT ? <span>待审核</span> : null}
                    {record.status === workOrderEnum.CHECKEN ? <span>已审核</span> : null}
                </>
            }
        }, {
            title: '操作',
            key: 'options',
            render: (text, record, index) => {
                return <div className="option-btn">
                    {/* 待提交的，自己的票可以操作 */}
                    {record.status === workOrderEnum.DRAFT && record.createGuid === userInfo.user.userGuid && <>
                        <Button type={'link'} onClick={() => {
                            editWorkOrder(record)
                        }}>编辑</Button>
                        <Button type={'link'} onClick={() => {
                        }}>删除</Button>
                    </>
                    }
                    {/*待审核*/}
                    {record.status === workOrderEnum.SUBMIT && <><Button type={'link'} onClick={() => {
                        editWorkOrder(record)
                    }}>查看</Button>
                        {/* 自己的票可以撤回 */}
                        {record.createGuid === userInfo.user.userGuid ? <Button type={'link'} onClick={() => {
                        }}>撤回</Button> : null}
                    </>
                    }
                    {/* 已审核通过 */}
                    {record.status === workOrderEnum.CHECKEN && <Button type={'link'} onClick={() => {
                        editWorkOrder(record)
                    }}>查看</Button>
                    }
                </div>
            }
        }]
    return <div>

        {workorderDetailVisible ?
            <WorkOrderDetail setWorkorderDetailVisible={setWorkorderDetailVisible}
                             workorderDetailList={workorderDetailList}
                             setWorkorderDetailList={setWorkorderDetailList}
                             isReview={false}
                             isSearch={true}/>
            : <>
                <Form
                    layout={'inline'}
                    form={searchForm}
                    initialValues={{
                        departmentGuid: userInfo.user.deptGuid,
                        createGuid: '100',
                        projectGuid: '100',
                        statuss: '100',
                    }}

                    onFinish={onFinish}
                >
                    <Form.Item label="选择部门：" name={'departmentGuid'}>
                        <Select
                            style={{width: '8vw'}}
                            showSearch
                            mode="multiple"
                            showArrow
                            onChange={(v) => {
                                setSelectDepGuid(v)
                            }}
                            options={deptList.map(item => ({label: item.deptName, value: item.deptGuid}))}
                        />
                    </Form.Item>
                    <Form.Item label="选择员工：" name={'createGuid'}>
                        <Select
                            style={{width: '8vw'}}
                            showSearch
                            options={[{
                                label: '全部',
                                value: '100'
                            }].concat(userList.filter(item => selectDepGuid.includes(item.deptGuid)).map(i => ({
                                label: i.nickName,
                                value: i.userGuid
                            })))}

                        />
                    </Form.Item>
                    <Form.Item label="选择项目：" name={'projectGuid'}>
                        <Select
                            style={{width: '10vw'}}
                            showSearch
                            options={[{value: '100', label: '全选'}, ...projectList.map(item => ({
                                value: item.guid,
                                label: item.name
                            }))]}
                        />
                    </Form.Item>
                    <Form.Item label="选择时间：" name={'timerange'}>
                        <DatePicker.RangePicker
                            style={{width: '15vw'}}
                        />
                    </Form.Item>
                    <Form.Item label={'工单状态'} name={'statuss'}>
                        <Select
                            style={{width: '5vw'}}
                            options={[{value: '100', label: '全选'}, {value: '1', label: '待提交'}, {
                                value: '2',
                                label: '待审核'
                            }, {value: '3', label: '已审核'}]}

                        />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType={'submit'}>搜索</Button>
                            <Button type="primary" onClick={() => searchListExportToExcel()}
                                    disabled={dataSource.length === 0}>导出excel</Button>
                        </Space>
                    </Form.Item>
                </Form>

                <Table
                    rowKey={record => record.guid}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 50,
                    }}
                />
            </>
        }
    </div>
}
export default WorkOrderQuery
