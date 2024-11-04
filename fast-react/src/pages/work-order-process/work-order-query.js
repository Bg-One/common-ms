import {Button, DatePicker, Form, Select, Space, Table, TimePicker} from "antd";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import {useEffect, useState} from "react";
import {listUserApi} from "../../common/api/sys/user-api";
import {listDeptApi} from "../../common/api/sys/deptinfo-api";
import {listAllProjectApi} from "../../common/api/producems/project";
import {useSelector} from "react-redux";
import withdraw from '../../static/images/withdraw.png'
import {getWorkOrderApi, listWorkOrderApi} from "../../common/api/producems/workorder";
import moment from "moment";
import WorkOrderDetail from "./work-order-detail";
import dayjs from "dayjs";
import WorkOrderTable from "./work-order-table";
import {multiConditionSort} from "../../utils/table";

const {RangePicker} = DatePicker
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
    useEffect(() => {
        !workorderDetailVisible && listWorkOrder()
    }, [workorderDetailVisible])
    const listWorkOrder = async () => {
        let values = searchForm.getFieldsValue();
        let res = await listWorkOrderApi({
            workStatus: values.workStatus,
            createGuid: values.createGuid,
            departmentGuid: values.departmentGuid,
            projectGuid: values.projectGuid,
            startTime: values.timerange[0].format('YYYY-MM-DD'),
            endTime: values.timerange[1].format('YYYY-MM-DD')
        })
        setDataSource(multiConditionSort(res.data, [
            {key: "createTime", order: -1},
            {key: "createName", order: 1},
            {key: "departmentName", order: 1},
            {key: "workType", order: 1},
            {key: "projectName", order: 1},
            {key: "workCategory", order: 1},
            {key: "workItem", order: 1},
            {key: "content", order: 1},
            {key: "workDuration", order: -1}
        ]))
    }
    const onFinish = async () => {
        await listWorkOrder()
    }
    return <div id={'query-workorder'}>
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
                        workStatus: '100',
                        timerange: [dayjs(moment().startOf('month').format('YYYY-MM-DD')), dayjs(moment().format('YYYY-MM-DD'))]
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item label="选择部门：" name={'departmentGuid'}>
                        <Select
                            style={{width: '8vw'}}
                            showSearch
                            mode="multiple"
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
                        <RangePicker
                            style={{width: '18vw'}}
                            format={'YYYY-MM-DD'}
                        />
                    </Form.Item>
                    <Form.Item label={'工单状态'} name={'workStatus'}>
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
                <WorkOrderTable
                    dataSource={dataSource}
                    tableTitle={'注：被退回的工单工作内容为红色字体'}
                    isReview={false}
                    listWorkOrder={listWorkOrder}
                    setWorkorderDetailVisible={setWorkorderDetailVisible}
                    setWorkorderDetailList={setWorkorderDetailList}
                />
            </>
        }
    </div>
}
export default WorkOrderQuery
