import {Button} from "antd";
import TinymceEditor from "../tinymce";
import React from "react";

const Reader = ({demandManage, setDemandManage, saveDemand}) => {

    return <div className="reader-area">
        <Button type={'primary'} onClick={saveDemand}>保存</Button>
        <span className="title-span">读者对象</span>
        <TinymceEditor id={'reader'} data={demandManage.reader} func={(data) => {
            setDemandManage({
                ...demandManage,
                reader: data
            })
        }}/>
    </div>
}
export default Reader
