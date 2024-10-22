import {Button, DatePicker, Form, Input, Modal, Select, Space, TreeSelect} from "antd";
import React, {useState} from "react";
import moment from "moment";
import {useSelector} from "react-redux";
import pinyinUtil from "../../common/react-pinyin-master";
import {paseImageFile} from "../../utils/upload";
import {useSearchParams} from "react-router-dom";

const AddSoftCheckModal = ({
                               addCheckFeedbackModalVisible,
                               setAddCheckFeedbackModalVisible,
                               projectList,
                               treeData,
                               addCheckFeedback
                           }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const userInfo = useSelector(state => state.user.userInfo);
    const [imageLink, setImageLink] = useState('')
    //发送图片
    const sendFile = async () => {
        let res = await paseImageFile()
        setImageLink(res.data[0].url)
    }
    return <Modal
        open={addCheckFeedbackModalVisible}
        centered={addCheckFeedbackModalVisible}
        title={'缺陷新增'}
        footer={false}
        onCancel={() => {
            setAddCheckFeedbackModalVisible(false)
        }}
    >
        <Form
            className={'search-form'}
            name="basic"
            labelCol={{
                span: 7,
            }}
            autoComplete="off"
            initialValues={{
                severity: 0
            }}
            onFinish={(values) => {
                addCheckFeedback({
                    ...values,
                    imageLink,
                    submitName: userInfo.user.nickName,
                    feedbackTime: moment().format("YYYY-MM-DD"),
                    produceGuid: searchParams.get('produceGuid')
                })
            }}
        > <Form.Item
            label="项目名称"
            name="projectGuid"
            rules={[
                {
                    required: true,
                    message: '项目不能为空！',
                }
            ]}
        >
            <Select
                options={projectList.map((item) => {
                    return {
                        value: item.guid,
                        label: item.name,
                    }
                })}
            />
        </Form.Item>
            <Form.Item
                label="需求名称"
                name="nodeGuid"
                rules={[
                    {
                        required: true,
                        message: '需求不能为空！',
                    }
                ]}
            >
                <TreeSelect
                    filterTreeNode={(input, option) => pinyinUtil.getFirstLetter(option.title).indexOf(input.toUpperCase()) !== -1
                        || option.title.indexOf(input.toUpperCase()) !== -1}
                    showSearch
                    dropdownStyle={{
                        maxHeight: 400,
                        overflow: 'auto',
                    }}
                    allowClear
                    treeDefaultExpandAll
                    treeData={treeData}
                />
            </Form.Item>
            <Form.Item
                label="问题描述"
                name="questionDescription"
            >
                <Input.TextArea autoSize={{minRows: 1, maxRows: 6}}/>
            </Form.Item>
            <Form.Item
                label="附图"
                name="imageLink"
            >
                <div onPaste={sendFile} suppressContentEditableWarning
                     contentEditable="true"
                     style={{height: '5vh', overflow: 'hidden', display: 'flex', width: '5vw', cursor: 'pointer'}}
                >{imageLink ? <img style={{overflow: 'hidden'}} src={imageLink}/> : null}
                </div>
            </Form.Item>
            <Form.Item
                label="优先级"
                name="severity"
            >
                <Select
                    options={[
                        {
                            value: 0,
                            label: '紧急',
                        }, {
                            value: 1,
                            label: '一般'
                        }
                    ]}
                />
            </Form.Item>
            <Form.Item
                label="反馈时间"
                name="feedbackTime"
            >
                <span>{moment().format("YYYY-MM-DD")}</span>
            </Form.Item>
            <Form.Item
                label="提交人"
                name="submitName"
            >
                <span>{userInfo.user.nickName}</span>
            </Form.Item>
            <Form.Item
                wrapperCol={{span: 10, offset: 10,}}>
                <Space>
                    <Button type={'primary'} onClick={() => {
                        setAddCheckFeedbackModalVisible(false)
                    }}>关闭</Button>
                    <Button type={'primary'} htmlType={'submit'}>保存</Button>
                </Space>
            </Form.Item>
        </Form>
    </Modal>
}
export default AddSoftCheckModal
