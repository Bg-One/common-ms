import './index.scss'
import {Button, Table, TreeSelect, message} from 'antd'
import {listReviewRelationshipApi, saveReviewRelationshipApi} from "../../common/api/producems/workorder";
import {getUserTreeData} from "../../utils/user";
import {useEffect, useState} from "react";
import {listUserApi} from "../../common/api/sys/user-api";
import {listDeptApi} from "../../common/api/sys/deptinfo-api";
import {useSelector} from "react-redux";

const ReviewManage = () => {
    const [relaList, setRelaList] = useState([])
    const [userList, setUserList] = useState([])
    const [depList, setDepList] = useState([])
    const userInfo = useSelector(state => state.user.userInfo)
    const tableSource = userList.filter(item => item.deptGuid === (userInfo.user.dept.deptGuid || ''))


    useEffect(() => {
        getRelaList()
        getDepList()
        getUserList()
    }, [])


    const getDepList = async () => {
        listDeptApi().then(deptRes => {
            setDepList(deptRes.data)
        })
    }
    const getUserList = async () => {
        listUserApi().then(userRes => {
            setUserList(userRes.data)
        })
    }

    // 获取审核关系列表
    const getRelaList = async () => {
        let result = await listReviewRelationshipApi()
        setRelaList(result.data)
    }

    const saveRelaList = async () => {
        let data = relaList.filter(i => i.editReviewGuid).map(item => ({
            reviewGuid: item.editReviewGuid,
            userGuid: item.userGuid
        }))
        if (!data[0]) {
            message.error('没有数据需要更新')
            return
        }
        let result = await saveReviewRelationshipApi({relationshipList: JSON.stringify(data)})
        message.success('保存成功')
        // 处理本地数据
        getRelaList()
    }
    return <div id="review-relation-m">
        <div>
            <div className='module-head'>
                <Button type='primary' onClick={saveRelaList}>保存</Button>
            </div>
            <Table
                dataSource={tableSource}
                columns={[{
                    title: '序号',
                    key: '',
                    width: '5vw',
                    render: (text, record, index) => <div>
                        {tableSource.findIndex(item => JSON.stringify(item) === JSON.stringify(record)) + 1}
                    </div>
                }, {
                    title: (userInfo.user.dept.deptName || '') + '成员',
                    key: '',
                    width: '30vw',
                    render: (text, record, index) => <div>
                        {record.userName}
                    </div>
                }, {
                    title: '审核人',
                    key: '',
                    width: '30vw',
                    render: (text, record, index) => <div>
                        <TreeSelect
                            style={{width: '100%'}}
                            showSearch
                            treeData={getUserTreeData(depList, userList, true)}
                            value={relaList.find(item => item.userGuid === record.userGuid)?.editReviewGuid || relaList.find(item => item.userGuid === record.userGuid)?.reviewGuid || ''}
                            onChange={(value) => {
                                // 不正当关系
                                if (value === record.userGuid) {
                                    message.error('提交人与审核人重复')
                                    return
                                }
                                let relaObj = relaList.find(item => item.userGuid === record.userGuid)
                                // 新建关系
                                if (!relaObj) {
                                    relaObj = {}
                                    relaObj.userGuid = record.userGuid
                                    relaObj.reviewGuid = ''
                                    relaObj.editReviewGuid = value
                                    setRelaList([...relaList, relaObj])
                                    return
                                }
                                // 变更关系
                                relaObj.editReviewGuid = value
                                setRelaList([...relaList])
                            }}
                        />
                    </div>
                }]}
                pagination={{
                    pageSize: 10
                }}
                rowClassName={(record) => relaList.find(item => item.userGuid === record.userGuid)?.editReviewGuid ? 'row-edit' : ''}
                rowKey={(record) => record.userGuid}
            />
        </div>
    </div>

}

export default ReviewManage
