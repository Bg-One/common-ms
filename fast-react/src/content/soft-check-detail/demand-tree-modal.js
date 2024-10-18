import {Modal} from "antd";
import React, {useState} from "react";
import TreeSearch from "../demand-tree-search/tree-search";

const DemandTreeModal = ({explainModalVisible, setNodeVisible, saveNode, treeData, nodeList}) => {
    const [selectNodeGuid, setSelectNodeGuid] = useState('')
    return <Modal
        className="demand-tree-modal"
        open={explainModalVisible}
        centered={true}
        closable={true}
        forceRender={true}
        style={{textAlign: 'center'}}
        onCancel={() => {
            setNodeVisible(false)
        }}
        onOk={() => {
            saveNode(selectNodeGuid)
            setNodeVisible(false)
        }}
        title={false}
    >
        <TreeSearch
            onSelect={(e, name) => {
                setSelectNodeGuid(e[0])
            }}
            defaultData={treeData}
            dataList={nodeList}
        />
    </Modal>
}
export default DemandTreeModal
