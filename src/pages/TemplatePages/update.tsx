import FileManager from '@/components/FileManager';
import { Card, Row, Col, Input, Button, Form, Select } from 'antd';
import React, {
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import { useEdit, useGetOne } from '../CategoryPages/services';

interface Props {
  token: string | number | null;
}

export type PageEditRef = {
  submit: () => void;
};

const Update = forwardRef<PageEditRef, Props>(
  ({ token, onClose}, ref): ReactElement => {
    const [form] = Form.useForm();
    const [isLoading, setLoading] = useState(false);
    const [edit, , editStatus] = useEdit('/Template/update');
    const [getOne, one, oneStat] = useGetOne('/Template/getbyid?id=');

    async function onValid(fields: any) {

      await edit({id: one.id, ...fields, typeId:fields.typeId?parseInt(fields.typeId):null });


      /*try {
        await edit({id: one.id, ...fields, typeId:fields.typeId?parseInt(fields.typeId):null });

      } catch (error) {
        console.log(error);
      }*/


      onClose();
    }

    async function getFields() {
      setLoading(true);
      const _one = await getOne(token);
      if (_one) {
        form.setFieldsValue({
          name: _one.name,
          imagePath: _one.imagePath,
          typeId: !!_one.typeId ? _one.typeId.toString() : null,
          display_type: _one.display_type,
        });
      }
      setLoading(false);
    }

    useLayoutEffect(() => {
      getFields();

      return () => {
        form.resetFields();
      };
    }, [token]);

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.submit();
      },
    }));

    if (oneStat !== 'fulfilled' || !one || isLoading) {
      return <div>Yükleniyor</div>;
    }

    return (
      <div style={{ paddingTop: '2em' }}>
        <Card>
          <Row>
            <Col md={24}>
              <Form onFinish={onValid} form={form} layout="vertical">
                <Form.Item label="Template Adı" name="name">
                  <Input type="text" />
                </Form.Item>
                <Form.Item label="Template Fotoğrafı" name="imagePath">
                  <FileManager
                    onChange={(_val) => {
                      form.setFieldsValue({ imagePath: _val.path });
                    }}
                    defaultValue={form.getFieldValue('imagePath')}
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
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    );
  },
);

export default Update;
