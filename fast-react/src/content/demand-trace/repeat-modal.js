import {Modal} from "antd";

const RepeatModal = ({repealModalFlag, setRepealModalFlag}) => {
    return <Modal
        open={repealModalFlag}
        centered={true}
        title={false}
        onOk={() => {
            setRepealModalFlag(false)
        }}
        footer={false}
        onCancel={() => {
            setRepealModalFlag(false)
        }}
    >
        <span>请对本次作废条目增加新的需求跟踪用于需求调整</span>
    </Modal>
}
export default RepeatModal
