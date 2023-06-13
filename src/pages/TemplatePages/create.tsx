import CustomPageContainer from '@/components/CustomPageContainer';
import FileManager from '@/components/FileManager';
import { Card, Col, Form, Input, Row, Button, message, Select } from 'antd';
import React, { ReactElement } from 'react';
import { useCreate } from '../CategoryPages/services';

interface Props {}

function Create({}: Props): ReactElement {
  const [form] = Form.useForm();
  const [create, , createStat] = useCreate('/Template/add');
  async function onValid(fields: any) {

    await create({...fields, typeId: !!fields.typeId ? parseInt(fields.typeId) : null});
    message.success("Template Oluşturuldu");
    form.resetFields();
  }

  return (
    <CustomPageContainer icon={null}>
      <Card>
        <Row>
          <Col md={12}>
            <Form onFinish={onValid} form={form} layout="vertical" >
              <Form.Item label="Template Adı" name="name" rules={[{ required: true }]}>
                <Input type="text" />
              </Form.Item>
              <Form.Item label="Template Fotoğrafı" name="imagePath">
                <FileManager
                  onChange={(_val) => {
                    form.setFieldsValue({ imagePath: _val.path });
                  }}
                />
              </Form.Item>
              <Form.Item label="Template Tipi" name="typeId" rules={[{ required: true }]}>
                <Select>
                  <option value="1">Sayfa</option>
                  <option value="2">Yazı</option>
                  <option value="3">Kategori</option>
                </Select>
              </Form.Item>
              <Form.Item label="Özellik Tipi" name="display_type" rules={[{ required: false }]}>
                <Select>
                  <option value="tip-1">tip-1</option>
                </Select>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button htmlType="submit" danger loading={createStat === "pending"}>Kaydet</Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </CustomPageContainer>
  );
}

export default Create;
