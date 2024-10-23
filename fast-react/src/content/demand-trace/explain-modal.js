import {Modal} from "antd";
import React from "react";

const ExplainModal = ({explainModalVisible, setExplainModalVisible}) => {
    return < Modal
        open={explainModalVisible}
        centered={true}
        title={false}
        onOk={() => {
            setExplainModalVisible(false)
        }}
        footer={false}
        onCancel={() => {
            setExplainModalVisible(false)
        }}
    >
        <ul>
            <li>签字说明
                <span className="explain-li">需求人员自动签字视为需求已编制完成;</span>
                <span className="explain-li">评审确认签字视为已评审;</span>
                <span className="explain-li">开发确认自动签字视为已知;</span>
                <span className="explain-li">需求确认签字视为已完成需求确认;</span>
                <span className="explain-li">测试确认签字视为已测试完成;</span>
            </li>
        </ul>
    </Modal>
}
export default ExplainModal
