import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {listWorkOrderApi} from "../../common/api/producems/workorder";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import WorkOrderTable from "./work-order-table";
import WorkOrderDetail from "./work-order-detail";

const WaitChecking = () => {

    const [dataSource, setDataSource] = useState([])
    const userInfo = useSelector(state => state.user.userInfo)
    const [workorderDetailVisible, setWorkorderDetailVisible] = useState(false)
    const [workorderDetailList, setWorkorderDetailList] = useState([])
    useEffect(() => {
        listWorkOrder()
    }, [])

    const listWorkOrder = async () => {
        let res = await listWorkOrderApi({
            reviewGuid: 'c038f991-daf2-43f3-b415-95b1ee13783c',
            statuss: workOrderEnum.SUBMIT
        })
        setDataSource(res.data)
    }
    return <div id={'checking-order'}>
        {workorderDetailVisible ?
            <WorkOrderDetail setWorkorderDetailVisible={setWorkorderDetailVisible}
                             workorderDetailList={workorderDetailList}
                             setWorkorderDetailList={setWorkorderDetailList}
                             isReview={true}
                             isSearch={false}/> :
            <WorkOrderTable
                dataSource={dataSource}
                tableTitle={'注：被退回的工单工作内容为红色字体'}
                isReview={true}
                listWorkOrder={listWorkOrder}
                setWorkorderDetailVisible={setWorkorderDetailVisible}
                setWorkorderDetailList={setWorkorderDetailList}
            />
        }
    </div>

}
export default WaitChecking
