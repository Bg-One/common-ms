import {Button, message, Table} from "antd";
import {workOrderEnum} from "../../common/enmus/work-order-enum";
import './index.scss'
import {deleteWorkOrderApi, getWorkOrderApi} from "../../common/api/producems/workorder";
import {mergesFilter} from "../../utils/table";
import {useSelector} from "react-redux";
import {isDept} from "../../utils/user";

const WorkOrderTable = ({
                            tableTitle,
                            dataSource,
                            isReview,
                            listWorkOrder,
                            setWorkorderDetailVisible,
                            setWorkorderDetailList
                        }) => {
    const userInfo = useSelector(state => state.user.userInfo)

    const deleteWorkOrder = async (record) => {
        if (!confirm('确认删除？')) return
        message.loading({
            content: '删除中，请稍后',
            key: 'deleteWorkOrder',
            duration: 0
        })
        await deleteWorkOrderApi({guid: record.guid})
        message.destroy('deleteWorkOrder')
        message.success('删除成功')
        listWorkOrder()
    }
    const editWorkOrder = async (record) => {
        let res = await getWorkOrderApi({
            createTime: record.createTime,
            createGuid: record.createGuid
        })
        setWorkorderDetailVisible(true)
        setWorkorderDetailList(res.data)
    }
    let columns = [
        {
            title: '报单时间',
            dataIndex: 'createTime',
            key: 'createTime',
            onCell: (record, index) => mergesFilter(dataSource, record, ['createTime'])

        }, {
            title: '员工姓名',
            dataIndex: 'createName',
            key: 'createName',
            onCell: (record, index) => mergesFilter(dataSource, record, ['createTime', 'createName'])
        }, {
            title: '部门',
            key: 'departmentName',
            dataIndex: 'departmentName',
            onCell: (record, index) => {
                return mergesFilter(dataSource, record, ['createTime', 'createName', 'departmentName'])
            }
        }, {
            title: '工作类型',
            dataIndex: 'workType',
            key: 'workType',
            onCell: (record, index) => {
                return mergesFilter(dataSource, record, ['createTime', 'createName', 'departmentName', 'workType'])
            }
        }, {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            onCell: (record, index) => {
                return mergesFilter(dataSource, record, ['createTime', 'createName', 'departmentName', 'workType', 'projectName'])
            }
        }, {
            title: '工作类目',
            dataIndex: 'workCategory',
            key: 'workCategory',
            onCell: (record, index) => {
                return mergesFilter(dataSource, record, ['createTime', 'createName', 'departmentName', 'workType', 'projectName', 'workCategory'])
            }
        }, {
            title: '工作条目',
            dataIndex: 'workItem',
            key: 'workItem',
            onCell: (record, index) => {
                return mergesFilter(dataSource, record, ['createTime', 'createName', 'departmentName', 'workType', 'projectName', 'workCategory', 'workItem'])
            }
        }, isDept(userInfo, '项目部') && {
            title: '项目部工作',
            key: 'projectDepworkType',
            dataIndex: 'projectDepworkType',
        }, {
            title: '工作内容',
            key: 'content',
            dataIndex: 'content',
            render: (text, record, index) => {
                return <div
                    style={Object.assign({
                        wordBreak: 'break-all',
                        width: '10vw'
                    }, (record.reason ? {color: 'red'} : {}))}
                    className="table-td-content"
                >{text}</div>
            }
        }, {
            title: '时长',
            key: 'workDuration',
            dataIndex: 'workDuration'
        }, {
            title: '状态',
            key: 'status',
            onCell: (record, index) => mergesFilter(dataSource, record, ['createTime', 'createName']),
            render: (text, record, index) => {
                return <>
                    {record.status === workOrderEnum.DRAFT ?
                        <span>待提交 </span> : null}
                    {record.status === workOrderEnum.SUBMIT && isReview ?
                        <span>待评审</span> : null}
                    {record.status === workOrderEnum.SUBMIT && !isReview ?
                        <span>待审核</span> : null}
                    {record.status === workOrderEnum.CHECKEN ? <span>已审核</span> : null}
                </>
            },
        }, {
            title: '操作',
            key: 'options',
            onCell: (record, index) => mergesFilter(dataSource, record, ['createTime', 'createName']),
            render: (text, record, index) => {
                return <div className="option-btn">
                    {record.status === workOrderEnum.DRAFT ? <>
                        <Button type={'link'} onClick={() => {
                            editWorkOrder(record)
                        }}>编辑</Button>
                        <Button type={'link'} onClick={() => {
                            deleteWorkOrder(record)
                        }}>删除</Button>
                    </> : null}
                    {record.status === workOrderEnum.SUBMIT && !isReview ? <Button type={'link'} onClick={() => {
                        editWorkOrder(record)
                    }}>查看</Button> : null}
                    {record.status === workOrderEnum.SUBMIT && isReview ? <Button type={'link'} onClick={() => {
                        editWorkOrder(record)
                    }}>评审</Button> : null}
                    {record.status === workOrderEnum.CHECKEN ? <Button type={'link'} onClick={() => {
                        editWorkOrder(record)
                    }}>查看</Button> : null}
                </div>
            },
        }].filter(Boolean)
    return <div id={'work-order-table'}>
        <Table
            dataSource={dataSource}
            columns={columns}
            title={() => tableTitle}
            rowKey={record => record.guid}

        />
    </div>
}
export default WorkOrderTable
