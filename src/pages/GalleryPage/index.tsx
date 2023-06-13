import React, {ReactElement} from 'react';
import {Button, Card, Form, Input, Space} from 'antd';
import {FileImageOutlined, MinusCircleOutlined} from '@ant-design/icons';
import FileManager from "@/components/FileManager";

const {Meta} = Card;


export interface Gallery {
  title: string,
  image: string,
  description: string,
}

interface Props {
}

function GalleryPage({}: Props): ReactElement {
  return (
    <Form.List name="gallery">
      {(fields, {add, remove}) => (
        <>
          {fields.map(field => (
            <Space key={field.key} align="start" direction="horizontal" style={{margin: 5}}>
              <Card
                style={{width: 300}}
                cover={
                  <Form.Item
                    {...field}
                    name={[field.name, 'image', 'path']}
                    fieldKey={[field.fieldKey, 'image']}
                    valuePropName="defaultValue"
                  >
                    <FileManager/>
                  </Form.Item>
                }
                actions={[
                  <MinusCircleOutlined onClick={() => remove(field.name)}/>,
                ]}
              >
                <Meta
                  title={<Form.Item
                    {...field}
                    name={[field.name, 'title']}
                    fieldKey={[field.fieldKey, 'title']}
                  >
                    <Input placeholder="Başlık"/>
                  </Form.Item>}
                  description={<Form.Item
                    {...field}
                    name={[field.name, 'description']}
                    fieldKey={[field.fieldKey, 'description']}
                  >
                    <Input placeholder="Açıklama"/>
                  </Form.Item>}
                />
              </Card>
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<FileImageOutlined/>}>
              Resim Ekle
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}

export default GalleryPage;
