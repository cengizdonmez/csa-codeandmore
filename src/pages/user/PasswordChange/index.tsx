import CustomPageContainer from "@/components/CustomPageContainer";
import { Form, Input, Card, Row, Col, Button, message } from "antd";
import React from "react";
import { useEdit, useGetOne } from "@/pages/CategoryPages/services";

function PasswordChange() {
  const [form] = Form.useForm<any>();
  const [onEdit, , editStatus] = useEdit<PasswordChangeRequest, any>(
    "/User/updatepassword"
  );
  const [getUser, userOne, userOneStatus] = useGetOne("/User/getbyid?id=");

  async function onValid(values) {
    const jwt = localStorage.getItem("user");
    if (!!jwt) {
      const user = JSON.parse(jwt);
      console.log({ user });
      try {
        const data: any = await getUser(user.id);
        const passwordChangeReqData: PasswordChangeRequest = {
          id: user.id,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        };

        const result = await onEdit(passwordChangeReqData);
        if (result.success) {
          message.success("Şifre başarıyla değiştirildi!");
          form.resetFields();
        } else {
          message.error(result.message);
        }
      } catch (error) {
        message.error("Şifre değiştirilirken hata oluştu!");
        form.resetFields();
      }
    }
  }

  return (
    <CustomPageContainer icon={null} breadcrumbShow>
      <Card>
        <Form
          layout="vertical"
          form={form}
          onFinish={onValid}
          onFinishFailed={() => {}}
        >
          <Row gutter={12}>
            <Col md={12} xs={24}>
              <Form.Item
                name="currentPassword"
                label="Mevcut Şifre"
                rules={[
                  {
                    required: true,
                    message:
                      "Lütfen en az bir büyük harf, bir küçük harf, bir rakam ve karakter(!? *.) içeren en az 8 karakter uzunluğunda bir şifre giriniz!",
                    min: 8,
                    pattern: new RegExp(
                      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/ //büyük küçük harf karakter ve rakam içermelidir min 8 karakterli regex
                    ),
                  },
                ]}
                hasFeedback
              >
                <Input.Password iconRender={() => {}} type="password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col md={12} xs={24}>
              <Form.Item
                name="newPassword"
                label="Şifre"
                rules={[
                  {
                    required: true,
                    message:
                      "Lütfen en az bir büyük harf, bir küçük harf, bir rakam ve karakter(!? *.) içeren en az 8 karakter uzunluğunda bir şifre giriniz!",
                    min: 8,
                    pattern: new RegExp(
                      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/ //büyük küçük harf karakter ve rakam içermelidir min 8 karakterli regex
                    ),
                  },
                ]}
                hasFeedback
              >
                <Input.Password iconRender={() => {}} type="password" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="confirm"
                label="Şifre Tekrar"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message:
                      "Lütfen en az bir büyük harf, bir küçük harf, bir rakam ve karakter(!? *.) içeren en az 8 karakter uzunluğunda bir şifre giriniz!",
                    min: 8,
                    pattern: new RegExp(
                      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/ //büyük küçük harf karakter ve rakam içermelidir min 8 karakterli regex
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Şifreler uyuşmuyor!"));
                    },
                  }),
                ]}
              >
                <Input.Password iconRender={() => {}} type="password" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: "right" }}>
            <Button
              disabled={editStatus === "pending"}
              loading={editStatus === "pending"}
              htmlType="submit"
            >
              Değiştir
            </Button>
          </div>
        </Form>
      </Card>
    </CustomPageContainer>
  );
}

export default PasswordChange;

interface PasswordChangeRequest {
  id: string;
  newPassword: string;
  currentPassword: string;
}
