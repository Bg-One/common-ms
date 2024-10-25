import {Button, Input, message, Popconfirm, Table} from "antd";
import {useEffect, useState} from "react";
import {checkChanges, deepCopy, handleSave} from "../../utils/table";
import {
    addOrEditIssuesToConfirmApi,
    deleteIssuesToBeConfirmedApi,
    listIssuesToBeConfirmedApi
} from "../../common/api/producems/demand";
import {useSearchParams} from "react-router-dom";

const QuestionConfirmed = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    let [issuestobeconfirmedList, setIssuestobeconfirmedList] = useState([])
    let [originalIssuestobeconfirmedList, setOriginalIssuestobeconfirmedList] = useState([])


    useEffect(() => {
        listIssuestobeconfirmed()
    }, [])

    const listIssuestobeconfirmed = () => {
        let guid = searchParams.get('demandGuid')
        listIssuesToBeConfirmedApi({guid: guid}).then(data => {
            setIssuestobeconfirmedList(deepCopy(data.data))
            setOriginalIssuestobeconfirmedList(deepCopy(data.data))
        })
    }

    //保存待确认问题列表
    const saveIssuestobeconfirmed = async () => {
        let changes = checkChanges(originalIssuestobeconfirmedList, issuestobeconfirmedList, 'guid')
        let newIssuestobeconfirmedList = [...changes.addArr, ...changes.changeArr]
        newIssuestobeconfirmedList.forEach((item) => {
            item.demandGuid = searchParams.get('demandGuid')
        })
        if (newIssuestobeconfirmedList.length === 0) {
            return;
        }
        await addOrEditIssuesToConfirmApi({
            issuesToConfirmList: JSON.stringify(newIssuestobeconfirmedList)
        })
        listIssuestobeconfirmed()
        message.success('保存成功', 1)

    }
    const deleteIssuesToBeConfirmed = async (guid, index) => {
        //判断当前是否有唯一标识有调接口没有删内存
        if (!guid) {
            let deepissuestobeconfirmedList = deepCopy(issuestobeconfirmedList);
            deepissuestobeconfirmedList.splice(index, 1);
            setIssuestobeconfirmedList(deepissuestobeconfirmedList)
        } else {
            await deleteIssuesToBeConfirmedApi({
                guid,
            })
            listIssuestobeconfirmed()
            message.success('删除成功', 1)
        }
    }
//待确认问题列表列
    let questionConfirmedColumns = [{
        title: '序号',
        width: '3vw',
        render: (text, record, index) => {
            return <div>
                {index + 1}
            </div>
        }
    }, {
        title: '问题',
        width: '15vw',
        render: (text, record, index) => {
            return <div>
                <Input
                    onChange={(e) => {
                        handleSave(index, 'issuesContent', e.target.value, issuestobeconfirmedList, setIssuestobeconfirmedList)
                    }}
                    style={{textAlign: 'center'}}
                    bordered={false}
                    value={record.issuesContent}/>
            </div>
        }
    }, {
        title: '操作',
        key: 'action',
        width: '10vw',
        render: (text, record, index) => {
            return <Popconfirm
                title={`您确认删除${record.issuesContent}待确认问题吗？`}
                onConfirm={(e) => deleteIssuesToBeConfirmed(record.guid, index)}
                okText="确定"
                cancelText="取消"
            >
                <Button type={'link'}>删除</Button>
            </Popconfirm>
        }
    }]
    return <div className="question-confirmed-area">
        <Button type={'primary'} onClick={() => {
            let oldIssuestobeconfirmedList = deepCopy(issuestobeconfirmedList)
            oldIssuestobeconfirmedList.unshift({issuesContent: ''})
            setIssuestobeconfirmedList(oldIssuestobeconfirmedList)
        }}
        >新增</Button>

        <Button type={'primary'} onClick={saveIssuestobeconfirmed}>保存</Button>
        <Table
            dataSource={issuestobeconfirmedList}
            rowKey={(record, index) => record.guid + index}
            columns={questionConfirmedColumns}
            pagination={false}
        />
    </div>
}
export default QuestionConfirmed
