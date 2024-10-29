import {Button, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import './index.scss'
import back from '../../static/images/back.png'
import {useSelector} from "react-redux";
import {ArrowLeftOutlined} from "@ant-design/icons";

const WorkHourStatisticsDetail = ({statisticsByProjectList, statisticsByUserList, setStatisticsResultVisible}) => {
    const [activeType, setActiveType] = useState('项目')

    useEffect(() => {

    })
    const exportToExcel = () => {

    }
    const mergeUserCell = (record, field, index) => {
        let maxRowSpan = 0
        for (let i = 0; i < statisticsByUserList.length; i++) {
            if (record[field] === statisticsByUserList[i][field]) maxRowSpan++
        }
        if (index !== 0 && record[field] === statisticsByUserList[index - 1][field]) {
            return {rowSpan: 0}
        } else {
            return {rowSpan: maxRowSpan}
        }
    }
    const mergeProjectCell = (record, field, index) => {
        let maxRowSpan = 0
        for (let i = 0; i < statisticsByProjectList.length; i++) {
            if (record[field] === statisticsByProjectList[i][field]) maxRowSpan++
        }
        if (index !== 0 && record[field] === statisticsByProjectList[index - 1][field]) {
            return {rowSpan: 0}
        } else {
            return {rowSpan: maxRowSpan}
        }
    }
    const mergeProjectUserCell = (record, index) => {
        let maxRowSpan = 0
        for (let i = 0; i < statisticsByProjectList.length; i++) {
            if (record.projectGuid === statisticsByProjectList[i].projectGuid && record.createGuid === statisticsByProjectList[i].createGuid) maxRowSpan++
        }
        if (index !== 0 && record.projectGuid === statisticsByProjectList[index - 1].projectGuid
            && record.createGuid === statisticsByProjectList[index - 1].createGuid) {
            return {rowSpan: 0}
        } else {
            return {rowSpan: maxRowSpan}
        }
    }
    // 按项目
    const statisticsByProjectColumns = [{
        title: `开始时间:2024-11-11 结束时间 12345679`, children: [{
            title: '项目编号', dataIndex: 'projectNo', key: 'projectNo', onCell: (record, index) => {
                return mergeProjectCell(record, 'projectGuid', index)
            },
        }, {
            title: '项目名称', dataIndex: 'projectName', key: 'projectName',
            onCell: (record, index) => {
                return mergeProjectCell(record, 'projectGuid', index)
            },
        }, {
            title: '工作类型', dataIndex: 'workTypeName', key: 'workTypeName',
        }, {
            title: '工作类目', dataIndex: 'workCategoryName', key: 'workCategoryName',
        }, {
            title: '工作条目', dataIndex: 'workItemName', key: 'workItemName',
        }, , {
            title: '员工姓名', dataIndex: 'createName', key: 'createName',
            onCell: (record, index) => {
                return mergeProjectUserCell(record, index)
            },
        }, {
            title: '工时', dataIndex: 'workDuration', key: 'workDuration',
        }, {
            title: '总工时', dataIndex: 'allWorkDuration', key: 'allWorkDuration',
            onCell: (record, index) => {
                return mergeProjectUserCell(record, index)
            },
        }, {
            title: '项目部工作', key: 'projectDepworkType',
        }, {
            title: '项目部工作工时', dataIndex: 'projectDepworkDuration', key: 'projectDepworkDuration',
        }, {
            title: '项目总工时', dataIndex: 'projectWorkDuration', key: 'projectWorkDuration',
            onCell: (record, index) => {
                return mergeProjectCell(record, 'projectGuid', index)
            },
        }, {
            title: '项目占比', dataIndex: 'proportion', key: 'proportion',
            onCell: (record, index) => {
                return mergeProjectCell(record, 'projectGuid', index)
            },
        }]
    }]

// 按人员
    const statisticsByUserColumns = [{
        title: `开始时间:2024-11-11 结束时间 12345679`, children: [{
            title: '成员姓名', dataIndex: 'createName', key: 'createName', onCell: (record, index) => {
                return mergeUserCell(record, 'createGuid', index)
            },
        }, {
            title: '项目编号', dataIndex: 'projectName', key: 'projectName',
        }, {
            title: '项目名称', dataIndex: 'projectName', key: 'projectName',
        }, {
            title: '工时', dataIndex: 'projectWorkDuration', key: 'projectWorkDuration',
        }, {
            title: '人员总工时', dataIndex: 'allWorkDuration', key: 'allWorkDuration',
            onCell: (record, index) => {
                return mergeUserCell(record, 'createGuid', index)
            },
        }, {}]
    }]
    return <div id={'statistics-result-detail'}>

        <Tabs
            destroyInactiveTabPane={true}
            items={[{
                label: `按项目`, key: '项目'
            }, {
                label: `按人员`, key: '人员'
            }]}
            onChange={(v) => {
                setActiveType(v)
            }}
        />

        <Button type={'link'} onClick={() => {
            setStatisticsResultVisible(false)
        }} icon={<ArrowLeftOutlined/>}>返回</Button>
        <Button type={'primary'} onClick={exportToExcel}>工时导出</Button>
        <Table
            columns={activeType === '项目' ? statisticsByProjectColumns : statisticsByUserColumns}
            dataSource={activeType === '项目' ? statisticsByProjectList : statisticsByUserList}
            bordered
            pagination={false}
            rowKey={(record, index) => index}
        />
    </div>
}
export default WorkHourStatisticsDetail
