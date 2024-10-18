import {Modal} from "antd";
import React from "react";
import {auto} from "html-webpack-plugin/lib/chunksorter";
const DemandEventstreamModal = ({eventStreamModalInfo, setEventStreamModalInfo}) => {
    return <Modal
        open={eventStreamModalInfo.open}
        centered={true}
        closable={true}
        footer={false}
        forceRender={true}
        width={auto}
        onCancel={() => {
            setEventStreamModalInfo({...eventStreamModalInfo, open: false})
        }}
        title={false}
    >
        <div id="eventStream">
            <div dangerouslySetInnerHTML={{__html: eventStreamModalInfo.eventStream}}></div>
        </div>
    </Modal>
}
export default DemandEventstreamModal
