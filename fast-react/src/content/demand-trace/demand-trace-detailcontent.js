import back from "../../static/images/back.png";
import TinymceEditor from "../tinymce";
import {Button} from "antd";
import React from "react";
import './index.scss'

const DemandTraceDetailcontent = ({
                                      detailDescriptionFlag,
                                      setDetailDescriptionFlag,
                                      detailDescription,
                                      setDetailDescription, addDemandTraceDetail
                                  }) => {
    return <div style={{display: detailDescriptionFlag ? 'block' : 'none'}}>
        <img src={back} style={{width: '1.5vw', verticalAlign: 'text-bottom'}}/>
        <span style={{fontSize: '1.5vw', color: '#1D79FC', cursor: 'pointer'}} onClick={() => {
            setDetailDescriptionFlag(false)
        }}>返回</span>
        <span className="demand-description-span">需求详述</span>
        <TinymceEditor id={'detailDescription'} data={detailDescription} func={(data) => {
            setDetailDescription(data)
        }}/>
        <div style={{textAlign: 'center'}}>
            <Button type={'primary'} onClick={addDemandTraceDetail}>保存</Button>
        </div>
    </div>
}
export default DemandTraceDetailcontent
