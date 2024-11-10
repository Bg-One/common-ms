import {Button, Input, message, Popconfirm, Select, Table} from "antd";
import worksetmenu from "../../static/images/worksetmenu.png";
import React, {useState} from "react";
import {deepCopy, handleSave} from "../../utils/table";
import weeklyAdd from '../../static/images/weekly-add.png'

import {delWeeklyReportDetailApi} from "../../common/api/producems/weekly-report";
import EditableTable from "../edit-row-table";

const WeeklyReportContent = ({dateSource, setDateSource, type, userList, addWorkItem}) => {

    const [selectRowIndex, setSelectRowIndex] = useState(-1)

    const deleteWOrklyDetail = async (record, index) => {
        if (record.guid) {
            await delWeeklyReportDetailApi({guid: record.guid})
        }
        let deepDateSource = deepCopy(dateSource);
        deepDateSource.splice(index, 1);
        setDateSource(deepDateSource)
        message.success('删除成功', 1)
    }
    const addWeekItem = () => {
        let copyData = deepCopy(dateSource);
        addWorkItem(copyData, type === 'plan' ? 1 : 0)
        setDateSource(copyData)
    }

    let columns = [
        {
            title: '序号',
            width: '4vw',
            render: (text, record, index) => {
                return record.guid ? index + 1 : <img onClick={addWeekItem} src={weeklyAdd} style={{width: '1vw'}}/>
            }
        }, {
            title: '工作内容',
            key: 'content',
            dataIndex: 'content',
            editable: true,
            render: (text, record, index) => {
                return selectRowIndex === index ? <Input.TextArea
                        onChange={(e) => {
                            handleSave(index, 'content', e.target.value, dateSource, setDateSource)
                        }}
                        value={record.content}/> :
                    <span className={'cell-span'}>{record.content}</span>
            }
        }, {
            title: '执行人',
            width: '10vw',
            editable: true,
            render: (text, record, index) => {
                return selectRowIndex === index ? <Select
                    value={record.managerGuid}
                    style={{width: '5vw'}}
                    onChange={(v, option) => {
                        const newData = deepCopy(dateSource);
                        newData[index].managerGuid = option.value
                        newData[index].managerName = option.label
                        setDateSource(newData)
                    }}
                    options={userList.map(item => {
                        return {
                            value: item.userGuid,
                            label: item.nickName
                        }
                    })}
                /> : <span className={'cell-span'}>{record.managerName}</span>
            }
        }, {
            title: '进展阶段',
            hidden: type === 'plan',
            width: '8vw',
            editable: true,
            element: 'input',
            render: (text, record, index) => {
                return selectRowIndex === index ? <Input
                    value={record.progress}
                    onChange={e => {
                        handleSave(index, 'progress', e.target.value, dateSource, setDateSource)
                    }}
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                /> : <span className={'cell-span'} >{record.progress}</span>
            }
        }, {
            title: '操作',
            width: '15vw',
            render: (text, record, index) => {
                return <div>
                    <Button type={'link'}>查看详情</Button>
                    <Popconfirm
                        title={`是否删除此工作内容？`}
                        onConfirm={(e) => deleteWOrklyDetail(record, index)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type={'link'}>删除</Button>
                    </Popconfirm>
                </div>
            }
        }]
    return <div id={'weekly-report-content'}>
        <span className={'weekly-title-span'}>{type === 'work' ? '本周工作' : '下周计划'}<img src={worksetmenu}/></span>
        <EditableTable
            dateSoure={dateSource}
            setDateSource={setDateSource}
            columns={columns}
        />

        {/*<Table*/}
        {/*    key={type}*/}
        {/*    dataSource={dateSource}*/}
        {/*    rowKey={record => record.guid !== '' && record.guid != null ? record.guid : uuidv4()}*/}
        {/*    columns={columns}*/}
        {/*    pagination={false}*/}
        {/*/>*/}
    </div>
}
export default WeeklyReportContent
