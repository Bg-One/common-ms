import {Modal} from "antd";
import React from "react";
import './explain-modal.scss'

const ExplainModal = ({explainModalVisible, setExplainModalVisible}) => {
    return < Modal
        open={explainModalVisible}
        centered={true}
        title={false}
        footer={false}
        onCancel={() => {
            setExplainModalVisible(false)
        }}
    >
        <ul>
            <li>签字说明
                <span className="explain-li">提交人签字认定bug提交;</span>
                <span className="explain-li">测试确认签字视为已确认为bug;</span>
                <span className="explain-li">开发确认签字认定开发已知;</span>
                <span className="explain-li">处理人签字认定正在处理;</span>
                <span className="explain-li">处理完成时间签署认定处理完成，可复测；</span>
                <span className="explain-li">处理状态为“已关闭”视为bug已处理;</span>
                <span className="explain-li">发布时间填写视为已为现场更新/发布;</span>
            </li>
            <li>状态说明
                <span className="explain-li">新增:bug状态为“新增”;</span>
                <span className="explain-li">挂起:暂不处理;</span>
                <span className="explain-li">未通过:修改后测试未通过;</span>
                <span className="explain-li">通过:bug修改完成关闭状态;</span>
                <span className="explain-li">重新打开:在回归测试时原有bug被发现;</span>
                <span className="explain-li">非缺陷：测试确认后认定为不是bug;</span>
            </li>
        </ul>
    </Modal>
}
export default ExplainModal
