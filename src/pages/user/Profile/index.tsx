import React, { useLayoutEffect } from 'react';
import CustomPageContainer from '@/components/CustomPageContainer';
import { Form, Input, Card, Row, Col, Button, message, Spin } from 'antd';
import { useEdit, useGetOne } from '@/pages/CategoryPages/services';
import { history } from 'umi';
import FileManager from '@/components/FileManager';

function Profile() {
  const [form] = Form.useForm<any>();
  const [onEdit, , editStatus] = useEdit('/User/update');
  const [getUser, userOne, userOneStatus] = useGetOne('/User/getbyid?id=');

  async function _getUser() {
    const jwt = localStorage.getItem('user');
    if (!!jwt) {
      const user = JSON.parse(jwt);
      try {
        const _user = await getUser(user.id);
        form.setFieldsValue({
          email: _user.email,
          firstName: _user.firstName,
          lastName: _user.lastName,
          filePath: _user.filePath,
        });
      } catch (error) {
        history.push('/');
      }
    }
  }

  useLayoutEffect(() => {
    _getUser();
  }, []);

  async function onValid(values: any) {
    const jwt = localStorage.getItem('user');
    if (!!jwt) {
      const user = JSON.parse(jwt);
      console.log({ user });
      try {
        await onEdit({ ...userOne, ...values });
        message.success('Profil bilgileri başarıyla güncellendi');
      } catch (error) {
        message.error('Hata oluştu!');
      }
    }
  }

  if(!!!userOne) {
    return <Spin />
  }

  return (
    <CustomPageContainer icon={null} breadcrumbShow>
      <Form layout="vertical" form={form} onFinish={onValid} onFinishFailed={() => {}}>
        <Card title="">
          <Row gutter={12}>
            <Col md={24} xs={24}>
              <Form.Item
                label="Email"
                name="email"
                required
                requiredMark="optional"
                rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                label="Ad"
                name="firstName"
                required
                requiredMark="optional"
                rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
              >
                <Input placeholder="Ad" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item label="Soyad" name="lastName">
                <Input placeholder="Soyad" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item label="Resim" name="filePath">
                <FileManager
                  defaultValue={form.getFieldValue('filePath')}
                  onChange={(value) => form.setFieldsValue({ filePath: value.path })}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'right' }}>
            <Button htmlType="submit">Güncelle</Button>
          </div>
        </Card>
      </Form>
    </CustomPageContainer>
  );
}

export default Profile;
