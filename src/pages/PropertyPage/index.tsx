import React, {ReactElement, useState} from 'react';
import {Button, Col, Form, Input, List, Row} from 'antd';
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

interface Props {
  properties: any,
  setProperties: any
}

export interface Property {
  id: number,
  title: string,
  description: string
}

function PropertyPage({properties, setProperties}: Props): ReactElement {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
  };
  const [currentId, setCurrentId] = useState<number>(1);

  const onAdd = (values: Property) => {
    const prop = values;
    if (currentId != null) {
      prop.id = currentId;
    }
    setProperties([...properties, values]);
    form.resetFields();
    setCurrentId(1 + currentId);
  };

  function onDelete(id: number) {
    const newPropList = properties.filter(item => item.id !== id)
    setProperties(newPropList);
  }

  return (
    <>
      <Row>
        <Col span={10} style={{backgroundColor: "white", padding: 15, border: "1px #e9e9e9 solid"}}>
          <Form name="propForm" onFinish={onAdd} autoComplete="off" form={form} {...layout}>
            <Form.Item
              label="Özellik Adı"
              name="title"
              rules={[{required: true, message: 'Please input your username!'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="Özellik Açıklaması"
              name="description"
              rules={[{required: true, message: 'Please input your username!'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit">
                <PlusOutlined/> Ekle
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={13} offset={1} style={{backgroundColor: "white", padding: 15, border: "1px #e9e9e9 solid"}}>
          <List
            itemLayout="horizontal"
            dataSource={properties}
            renderItem={(item: Property) => (
              <List.Item style={{padding:4}}
                actions={[<Button type="primary" danger onClick={() => onDelete(item.id)}>
                  <DeleteOutlined/>
                </Button>]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}

export default PropertyPage;
