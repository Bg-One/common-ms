import {Button, Form, Input, message, Select} from "antd";
import TinymceEditor from "../tinymce";
import React, {useEffect, useState} from "react";
import {handleSave} from "../../utils/table";
import {useSelector} from "react-redux";
import moment from "moment";
import {addOrEditDemandItemApi, addOrEditDetailDesignApi} from "../../common/api/producems/demand";
import {hasRoleOr} from "../../utils/permi";

const {TextArea} = Input;
const SoftDetaildesign = ({softDesignDetail, setSoftDesignDetail, softDesignForm}) => {
    const userInfo = useSelector(state => state.user.userInfo);
    // useEffect(() => {
    //     return () => {
    //         addOrEditDetailDesign()
    //     }
    // }, [])

    const addOrEditDetailDesign = async () => {
        await addOrEditDetailDesignApi({
            ...softDesignDetail,
            ...softDesignForm.getFieldsValue(),
            createName: userInfo.user.nickName,
            createTime: moment().format("YYYY-MM-DD"),
        })
        message.success('保存成功', 1)
    }

    return (<div style={{height: '79vh', overflowY: 'auto'}}>
            <Form
                layout="horizontal"
                disabled={!hasRoleOr(userInfo, ['rd:dept:user', 'rd:dept:manager'])}
                labelAlign={'right'}
                labelCol={{
                    span: 2,
                }}
                form={softDesignForm}
                initialValues={{...softDesignDetail}}
                clearOnDestroy={true}
            >
                <Form.Item>
                    <span style={{
                        marginLeft: '3vw',
                        marginRight: '10vw'
                    }}>编写人：{setSoftDesignDetail.createName ? setSoftDesignDetail.createName : userInfo.user.nickName}</span>
                    <span>创建时间：{setSoftDesignDetail.createTime ? setSoftDesignDetail.createTime : moment().format("YYYY-MM-DD")}</span>
                </Form.Item>
                <Form.Item label={'流程分析'}>
                    <TinymceEditor id={'processAnalysis'}
                                   data={softDesignDetail.processAnalysis === null ? '' : softDesignDetail.processAnalysis}
                                   func={(data) => {
                                       setSoftDesignDetail({
                                           ...softDesignDetail,
                                           processAnalysis: data
                                       })
                                   }}/>
                </Form.Item>
                <Form.Item label="配置要求" name={'configurationRequirements'}>
                    <TextArea
                        autoSize={{minRows: 1, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item label="类层设计" name={'classDesign'}>
                    <TextArea
                        autoSize={{minRows: 1, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item label="数据库操作" name={'dbOperate'}>
                    <TextArea
                        autoSize={{minRows: 1, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item label="通信接口设计" name={'communicationDesignDescription'}>
                    <TextArea
                        autoSize={{minRows: 1, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item label="复杂逻辑及算法" name={'complexLogic'}>
                    <TextArea
                        autoSize={{minRows: 1, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item label="备注" name={'notes'}>
                    <TextArea
                        autoSize={{minRows: 1, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item>
                    <div style={{textAlign: 'center'}}>
                        <Button type={'primary'} htmlType={'submit'} onClick={addOrEditDetailDesign}
                                disabled={!hasRoleOr(userInfo, ['rd:dept:user', 'rd:dept:manager'])}
                        >保存</Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}
export default SoftDetaildesign;
