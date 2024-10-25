import {Form, Input, Select} from "antd";
import TinymceEditor from "../tinymce";

const SoftDetaildesign = () => {

    return (<div style={{height: '79vh', overflowY: 'auto'}}>
            <Form
                layout="horizontal"
                disabled={true}
                labelAlign={'right'}
                labelCol={{
                    span: 2,
                }}
            >
                <Form.Item>
                    <span>编写人：{}</span>
                    <span>当前时间：{}</span>
                </Form.Item>
                <Form.Item label={'流程分析'}>
                    <TinymceEditor id={'processAnalysis'}/>
                </Form.Item>
                <Form.Item label="配置要求">
                    <Input/>
                </Form.Item>
                <Form.Item label="类层设计">
                    <Input/>
                </Form.Item>
                <Form.Item label="数据库操作">
                    <Input/>
                </Form.Item>
                <Form.Item label="通信接口设计">
                    <Input/>
                </Form.Item>
                <Form.Item label="复杂逻辑及算法">
                    <Input/>
                </Form.Item>
                <Form.Item label="备注">
                    <Input/>
                </Form.Item>
            </Form>
        </div>
    )
}
export default SoftDetaildesign;
