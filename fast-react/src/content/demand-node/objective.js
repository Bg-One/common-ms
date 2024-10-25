import {Button} from "antd";
import TinymceEditor from "../tinymce";
import React from "react";
import './index.scss'

const Objective = ({demandManage, setDemandManage,saveDemand}) => {
    return <div className="objective-area">
        <Button type={'primary'} onClick={saveDemand}>保存</Button>
        <span className="title-span">目的</span>
        <TinymceEditor id={'objective'} data={demandManage.objective} func={(data) => {
            setDemandManage({
                ...demandManage,
                objective: data
            })
        }}/>
    </div>
}
export default Objective
