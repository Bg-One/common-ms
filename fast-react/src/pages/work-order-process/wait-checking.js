import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {listWorkOrderApi} from "../../common/api/producems/workorder";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import WorkOrderTable from "./work-order-table";
import WorkOrderDetail from "./work-order-detail";
import {multiConditionSort} from "../../utils/table";
import {Button, DatePicker, Form} from "antd";
import dayjs from "dayjs";
import moment from "moment/moment";

const {RangePicker} = DatePicker

const WaitChecking = () => {
    const [searchForm] = Form.useForm();
    const userInfo = useSelector(state => state.user.userInfo)
    const [dataSource, setDataSource] = useState([])
    const [workorderDetailVisible, setWorkorderDetailVisible] = useState(false)
    const [workorderDetailList, setWorkorderDetailList] = useState([])
    useEffect(() => {
        !workorderDetailVisible && listWorkOrder()
    }, [workorderDetailVisible])


    const onFinish = async (values) => {
        listWorkOrder()
    }
    const listWorkOrder = async () => {
        let times = searchForm.getFieldValue('timerange');
        let res = await listWorkOrderApi({
            reviewGuid: userInfo.user.userGuid,
            workStatus: workOrderEnum.SUBMIT,
            startTime: times[0].format('YYYY-MM-DD'),
            endTime: times[1].format('YYYY-MM-DD')
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
    return <div id={'checking-order'}>
        {workorderDetailVisible ?
            <WorkOrderDetail setWorkorderDetailVisible={setWorkorderDetailVisible}
                             workorderDetailList={workorderDetailList}
                             setWorkorderDetailList={setWorkorderDetailList}
                             isReview={true}
                             isSearch={false}/> :
            <>
                <Form
                    layout={'inline'}
                    form={searchForm}
                    initialValues={{
                        timerange: [dayjs(moment().startOf('month').format('YYYY-MM-DD')), dayjs(moment().format('YYYY-MM-DD'))]
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item label="选择时间：" name={'timerange'}>
                        <RangePicker
                            style={{width: '18vw'}}
                            format={'YYYY-MM-DD'}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType={'submit'}>搜索</Button>
                    </Form.Item>
                </Form>
                <WorkOrderTable
                    dataSource={dataSource}
                    tableTitle={'注：被退回的工单工作内容为红色字体'}
                    isReview={true}
                    listWorkOrder={listWorkOrder}
                    setWorkorderDetailVisible={setWorkorderDetailVisible}
                    setWorkorderDetailList={setWorkorderDetailList}
                /></>

        }
    </div>

}
export default WaitChecking
