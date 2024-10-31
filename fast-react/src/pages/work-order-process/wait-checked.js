import {Button} from "antd";
import WorkOrderTable from "./work-order-table";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {listWorkOrderApi} from "../../common/api/producems/workorder";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import './index.scss'
import WorkOrderDetail from "./work-order-detail";

const WaitChecked = () => {
    const [workorderDetailVisible, setWorkorderDetailVisible] = useState(false)
    const [workorderDetailList, setWorkorderDetailList] = useState([])
    const [dataSource, setDataSource] = useState([])
    const userInfo = useSelector(state => state.user.userInfo)

    useEffect(() => {
        listWorkOrder()
    }, [])

    const listWorkOrder = async () => {
        let res = await listWorkOrderApi({
            createGuid: 'c038f991-daf2-43f3-b415-95b1ee13783c',
            statuss: workOrderEnum.SUBMIT
        })
        setDataSource(res.data)
    }
    return <div id={'wait-checked-order'}>
        {workorderDetailVisible ?
            <WorkOrderDetail setWorkorderDetailVisible={setWorkorderDetailVisible}
                             workorderDetailList={workorderDetailList}
                             setWorkorderDetailList={setWorkorderDetailList}
                             isReview={false}
                             isSearch={false}/>
            :
            <WorkOrderTable
                dataSource={dataSource}
                tableTitle={'注：被退回的工单工作内容为红色字体'}
                isReview={false}
                listWorkOrder={listWorkOrder}
                setWorkorderDetailVisible={setWorkorderDetailVisible}
                setWorkorderDetailList={setWorkorderDetailList}
            />}
    </div>
}
export default WaitChecked
