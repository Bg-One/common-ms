import {Button, Form, Input, Modal, Space} from "antd";
import React, {useEffect} from "react";

const {TextArea} = Input;

const ChangenodeModal = ({
                             checkChangNotesObj,
                             addOrEditCheckChangNote,
                             setCheckChangNotesObj,
                         }) => {

    const [changeNodeForm] = Form.useForm()

    useEffect(() => {
        changeNodeForm.setFieldsValue({...checkChangNotesObj})
    }, [checkChangNotesObj])
    return <Modal
        open={checkChangNotesObj.open}
        centered={true}
        closable={true}
        footer={false}
        forceRender={true}
        onCancel={() => {
            setCheckChangNotesObj({...checkChangNotesObj, open: false})
        }}
        title={'变更说明'}
    >
        <div className={'search-area'}>
            <Form
                layout={'horizontal'}
                className={'search-form'}
                form={changeNodeForm}
                name="basic"
                labelCol={{span: 7}}
                initialValues={{...checkChangNotesObj}}
                onFinish={addOrEditCheckChangNote}
                autoComplete="off"
            > <Form.Item
                label="数据库修改"
                name="dbChange"
            >
                <TextArea
                    autoSize={{minRows: 3, maxRows: 6}}
                />
            </Form.Item>
                <Form.Item
                    label="配置项修改"
                    name="configurationChange"
                >
                    <TextArea
                        autoSize={{minRows: 3, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item
                    label="影响范围"
                    name="scopeOfInfluence"
                >
                    <TextArea
                        autoSize={{minRows: 3, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item
                    label="测试建议"
                    name="checkSuggestion"
                >
                    <TextArea
                        autoSize={{minRows: 3, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 10,
                        offset: 10,
                    }}>
                    <Space>
                        <Button type={'primary'} htmlType={'submit'}>保存</Button>
                        <Button type={'primary'} onClick={(e) => {
                            setCheckChangNotesObj({...checkChangNotesObj, open: false})
                        }}>关闭</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    </Modal>
}
export default ChangenodeModal;
