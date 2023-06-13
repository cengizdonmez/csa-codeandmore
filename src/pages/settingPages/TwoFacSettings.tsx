import CustomPageContainer from "@/components/CustomPageContainer";
import { SettingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  notification,
  Row,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import { useGetOne, useCreate } from "../CategoryPages/services";

type SmsMail = {
  id: number;
  email: string;
  name: string | null;
  mailServer: string;
  mailPort: number;
  mailPassword: string;
  smsUserName: string;
  smsPassword: string;
  senderName: string;
  smsApiUrl: string;
  activeSet: boolean;
};

const TwoFacSettings = () => {
  const [getSmsMail, data, status] = useGetOne<SmsMail>("/SmsMail");
  const [initialValues, setInitialValues] = useState<SmsMail | null>(null);
  const [onEditAsync, response, UpdateStatus] = useCreate<SmsMail, string>(
    "/SmsMail/update"
  );

  useEffect(() => {
    getSmsMail("/get?id=1").then((data) => {
      setInitialValues({
        email: data.email,
        id: data.id,
        name: data.name,
        mailServer: data.mailServer,
        mailPort: data.mailPort,
        mailPassword: data.mailPassword,
        activeSet: data.activeSet,
        senderName: data.senderName,
        smsApiUrl: data.smsApiUrl,
        smsPassword: data.smsPassword,
        smsUserName: data.smsUserName,
      });
    });
  }, []);

  const [form] = Form.useForm();

  const handleFinish = async (_fields: any) => {
    const postData: SmsMail = {
      ..._fields,
      id: data?.id,
      name: "null",
    };
    await onEditAsync(postData).then((result: string) => {
      notification.open({ message: "Bilgilendirme", description: result });
    });
  };

  return (
    <CustomPageContainer icon={<SettingOutlined />}>
      <Card style={{ marginBottom: 5 }}>
        <Row style={{ justifyContent: "space-between", marginBottom: "20px" }}>
          <Col>
            <h2 style={{ margin: 0, padding: 0 }}>Two Factor Auth Aç/Kapat</h2>
          </Col>
        </Row>
        {!!data && initialValues && (
          <Form
            initialValues={{ ...initialValues }}
            form={form}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            onFinish={handleFinish}
            autoComplete="off"
          >
            <Row>
              <Col lg={12} md={24}>
                <Form.Item
                  label="E-Mail"
                  name="email"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mail Server"
                  name="mailServer"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Port"
                  name="mailPort"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mail Password"
                  name="mailPassword"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={24}>
                <Form.Item
                  label="Sms Kullanıcı Adı"
                  name="smsUserName"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Sms Password"
                  name="smsPassword"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Gönderici Adı"
                  name="senderName"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Sms Api URL"
                  name="smsApiUrl"
                  rules={[{ required: true, message: "Zorunlu Alan!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Col>
              <Button style={{ float: "right" }} htmlType="submit">
                Kaydet
              </Button>
            </Col>
          </Form>
        )}
      </Card>
    </CustomPageContainer>
  );
};
export default TwoFacSettings;
