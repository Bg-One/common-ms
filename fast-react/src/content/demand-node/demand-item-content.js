import {ColorPicker, Form, Input, Rate, Select, Slider} from "antd";
import TinymceEditor from "../tinymce";

const DemandItemContent = () => {

    return <div style={{height: '79vh', overflowY: 'auto'}}>
        <Form
            layout="horizontal"
            disabled={true}
            labelAlign={'right'}
            labelCol={{
                span: 2,
            }}
        >
            <Form.Item label="需求名称">
                <Input/>
            </Form.Item>
            <Form.Item>
                <div className="func-item">
                    <span>重要程度:</span>
                    <Select
                        options={[
                            {
                                value: 1,
                                label: '特别重要'
                            }, {
                                value: 2,
                                label: '重要'
                            }, {
                                value: 3,
                                label: '一般'
                            }
                        ]}
                    />
                    <span>优先程度:</span>
                    <Select
                        options={[
                            {
                                value: 1,
                                label: '特别优先'
                            }, {
                                value: 2,
                                label: '优先'
                            }, {
                                value: 3,
                                label: '一般'
                            }
                        ]}
                    />
                    <span>需求状态:</span>
                    <Select
                        options={[
                            {
                                value: 1,
                                label: '正常'
                            }, {
                                value: 2,
                                label: '挂起'
                            }, {
                                value: 3,
                                label: '作废'
                            }
                        ]}
                    />
                </div>
            </Form.Item>
            <Form.Item label="功能描述">
                <Input/>
            </Form.Item>
            <Form.Item label="前置条件">
                <Input/>
            </Form.Item>
            <Form.Item label="输入">
                <Input/>
            </Form.Item>
            <Form.Item label="事件流">
                <TinymceEditor id={'eventStream'}/>
            </Form.Item>
            <Form.Item label="输出">
                <Input/>
            </Form.Item>
            <Form.Item label="后置条件">
                <Input/>
            </Form.Item>
            <Form.Item label="log记录">
                <Input/>
            </Form.Item>
            <Form.Item label="其他说明">
                <Input/>
            </Form.Item>
            <Form.Item label="问题">
                <Input/>
            </Form.Item>
        </Form>
    </div>
}
export default DemandItemContent
