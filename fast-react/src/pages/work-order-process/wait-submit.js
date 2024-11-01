import WorkOrderTable from "./work-order-table";
import {Button, message} from "antd";
import {useEffect, useState} from "react";
import {listWorkOrderApi} from "../../common/api/producems/workorder";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import {useSelector} from "react-redux";
import WorkOrderDetail from "./work-order-detail";
import moment from "moment";

const WaitSubmit = () => {
    const [dataSource, setDataSource] = useState([])
    const [workorderDetailVisible, setWorkorderDetailVisible] = useState(false)
    const [workorderDetailList, setWorkorderDetailList] = useState([])
    const userInfo = useSelector(state => state.user.userInfo)

    useEffect(() => {
        !workorderDetailVisible&& listWorkOrder()
    }, [workorderDetailVisible])

    const listWorkOrder = async () => {
        let res = await listWorkOrderApi({
            createGuid: 'c038f991-daf2-43f3-b415-95b1ee13783c',
            statuss: workOrderEnum.DRAFT
        })
        setDataSource(res.data)
    }

    return <div id={'wait-submit-order'}>
        {workorderDetailVisible ?
            <WorkOrderDetail setWorkorderDetailVisible={setWorkorderDetailVisible}
                             workorderDetailList={workorderDetailList}
                             setWorkorderDetailList={setWorkorderDetailList}
                             isReview={false}
                             isSearch={false}/> : <>
            <Button type={'primary'} onClick={() => {
                setWorkorderDetailVisible(true)
            }}>新建工单</Button>
                <WorkOrderTable
                dataSource={dataSource}
                tableTitle={'注：被退回的工单工作内容为红色字体'}
                isReview={false}
                listWorkOrder={listWorkOrder}
                setWorkorderDetailVisible={setWorkorderDetailVisible}
                setWorkorderDetailList={setWorkorderDetailList}
                />
                </>}
            </div>
        }
        export default WaitSubmit
