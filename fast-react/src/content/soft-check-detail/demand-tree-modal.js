import {Modal} from "antd";
import React, {useState} from "react";
import TreeSearch from "../demand-tree-search/tree-search";

const DemandTreeModal = ({nodeVisible, setNodeVisible, saveNode, treeData, nodeList}) => {
    const [selectNodeGuid, setSelectNodeGuid] = useState('')
    const [selectName, setSelectName] = useState('')

    return <Modal
        className="demand-tree-modal"
        open={nodeVisible}
        centered={true}
        closable={true}
        forceRender={true}
        style={{textAlign: 'center', paddingTop: '5vh'}}
        onCancel={() => {
            setNodeVisible(false)
        }}
        onOk={() => {
            saveNode(selectNodeGuid, selectName)
            setNodeVisible(false)
        }}
        title={'需求选择'}
    >
        <TreeSearch
            onSelect={(e, name) => {
                console.log(e, name)
                setSelectNodeGuid(e[0])
                setSelectName(name)
            }}
            defaultData={treeData}
            dataList={nodeList}
        />
    </Modal>
}
export default DemandTreeModal
