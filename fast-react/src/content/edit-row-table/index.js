import React, {useState} from 'react';
import {Form, Input, InputNumber, Popconfirm, Table, Typography} from 'antd';
import {v4 as uuidv4} from 'uuid';

const EditableTable = ({dateSoure, setDateSource, columns, inputType}) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              inputType,
                              record,
                              index,
                              children,
                              ...restProps
                          }) => {
        const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    <span onDoubleClick={(e) => {
                        edit(record)
                    }}>{children}</span>
                )}
            </td>
        );
    };
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                rowKey={record => record.guid !== '' && record.guid != null ? record.guid : uuidv4()}
                bordered
                dataSource={dateSoure}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
            />
        </Form>
    );
};
export default EditableTable;
