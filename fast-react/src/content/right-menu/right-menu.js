import {Button, Input, Modal, message} from "antd";
import './index.scss'
import {useState} from "react";
import {addNodesApi, deleteNodesApi, editNodesApi} from "../../common/api/producems/demand";

const RightMenu = ({nodeGuid, classType, parentNodeGuid, moduleGuid, nodeOrder, listNodes}) => {
    const [nodeName, setNodeName] = useState('')
    const [nodeModalOpen, setNodeModalOpen] = useState(false)
    const [nodeEditFlag, setNodeEditFlag] = useState(false)
    const [nodeType, setNodeType] = useState(false)

    //删除节点
    const deleteNodes = () => {
        deleteNodesApi({
            guid: nodeGuid,
        }).then(data => {
            message.success('删除成功', 1)
            listNodes()
            setNodeModalOpen(false)
        })
    }
    //新增或者编辑节点
    const addOrEditNodes = async () => {
        if (nodeName === '') {
            message.error('节点名称不能为空')
            return
        }
        if (nodeEditFlag) {
            await editNodesApi({
                guid: nodeGuid,
                nodeName: nodeName,
            })
            message.success('保存成功', 1)
        } else {
            await addNodesApi({
                moduleGuid: moduleGuid,
                classType: classType,
                name: nodeName,
                nodeType: nodeType,
                parentNodeGuid: parentNodeGuid,
                nodeOrder: nodeOrder
            })
            message.success('保存成功', 1)
        }
        listNodes()
        setNodeModalOpen(false)
    }

    return <div className={'right-menu'}>
        <span className={'menu-item'} onClick={() => {
            setNodeModalOpen(true)
            setNodeEditFlag(false)
            setNodeType(false)
        }}>添加分类</span>
        <span className={'menu-item'} onClick={() => {
            setNodeModalOpen(true)
            setNodeEditFlag(false)
            setNodeType(true)
        }}>添加需求</span>
        <div>
            <span className={'menu-item'} onClick={() => {
                setNodeModalOpen(true)
                setNodeEditFlag(true)
                setNodeType(false)
            }}>修改</span>
            <span className={'menu-item'} onClick={deleteNodes}>删除</span>
        </div>
        <Button type={'primary'}>取消</Button>
        <Modal
            open={nodeModalOpen}
            centered={true}
            closable={true}
            onCancel={() => setNodeModalOpen(false)}
            title={false}
            footer={false}
        >
            <span>节点名:</span>
            <Input value={nodeName} onChange={e => setNodeName(e.target.value)}/>
            <div style={{textAlign: 'center', marginTop: '2vh'}}>
                <Button type={'primary'} onClick={addOrEditNodes}>保存</Button>
                <Button type={'primary'} onClick={() => setNodeModalOpen(false)}>取消</Button>
            </div>
        </Modal>
    </div>
}
export default RightMenu
