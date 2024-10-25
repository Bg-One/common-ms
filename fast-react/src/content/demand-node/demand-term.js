import {Button, Input, message, Popconfirm, Table} from "antd";
import {checkChanges, deepCopy, handleSave} from "../../utils/table";
import {useEffect, useState} from "react";
import {addOrEditDemandTermApi, deleteDemandTermApi, listDemandTermApi} from "../../common/api/producems/demand";
import {useSearchParams} from "react-router-dom";

const DemandTerm = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [demandTermList, setDemandTermList] = useState([])
    const [origDemandTermList, setOrigDemandTermList] = useState([])

    useEffect(() => {
        listDemandTermList()
    }, [])

    //获取需求术语
    const listDemandTermList = async () => {
        let res = await listDemandTermApi({
            demandGuid: searchParams.get("demandGuid")
        })
        setDemandTermList(res.data)
        setOrigDemandTermList(res.data)
    }
    //保存需求术语
    const saveDemandTerm = () => {
        let changes = checkChanges(origDemandTermList, demandTermList, 'guid')
        let newDemandTermList = [...changes.changeArr, ...changes.addArr]
        newDemandTermList.forEach((item) => {
            item.demandGuid = searchParams.get("demandGuid")
        })
        if (newDemandTermList.length === 0) {
            return;
        }
        addOrEditDemandTermApi({demandTermList: JSON.stringify(newDemandTermList)}).then(data => {
            listDemandTermList()
            message.success('保存成功', 1)
        })
    }
    const deleteDemandTerm = async (guid, index) => {
        //判断当前是否有唯一标识有调接口没有删内存
        if (!guid) {
            let deepCopyDemandTermList = deepCopy(demandTermList);
            deepCopyDemandTermList.splice(index, 1);
            setDemandTermList(deepCopyDemandTermList)
        } else {
            await deleteDemandTermApi({
                guid,
            })
            listDemandTermList()
        }
    }
    let demandTermColumns = [{
        title: '序号',
        width: '3vw',
        render: (text, record, index) => {
            return <div>
                {index + 1}
            </div>
        }
    }, {
        title: '词汇',
        width: '15vw',
        render: (text, record, index) => {
            return <Input
                onChange={(e) => {
                    handleSave(index, 'words', e.target.value, demandTermList, setDemandTermList)
                }}
                style={{textAlign: 'center'}}
                bordered={false}
                value={record.words}
            />

        }
    }, {
        title: '解释',
        width: '15vw',
        render: (text, record, index) => {
            return <div>
                <Input
                    onChange={(e) => {
                        handleSave(index, 'explain', e.target.value, demandTermList, setDemandTermList)
                    }}
                    style={{textAlign: 'center'}}
                    bordered={false}
                    value={record.explain}/>
            </div>
        }
    }, {
        title: '操作',
        key: 'action',
        width: '10vw',
        render: (text, record, index) => {
            return <Popconfirm
                title={`您确认删除${record.words}词汇吗？`}
                onConfirm={(e) => deleteDemandTerm(record.guid, index)}
                okText="确定"
                cancelText="取消"
            >
                <Button type={'link'}>删除</Button>
            </Popconfirm>
        }
    }]

    return <div id="demand-term-area">
        <div>
            <Button type={'primary'} onClick={() => {
                let oldDemandTermList = deepCopy(demandTermList)
                oldDemandTermList.unshift({words: '', explain: ''})
                setDemandTermList(oldDemandTermList)
            }}>新增</Button>
            <Button type={'primary'} onClick={saveDemandTerm}>保存</Button>
        </div>

        <Table
            dataSource={demandTermList}
            columns={demandTermColumns}
            rowKey={(record, index) => record.guid + index}
            pagination={false}
        />
    </div>
}
export default DemandTerm
