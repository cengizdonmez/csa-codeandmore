import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Card, Col, Form, Input, notification, Row, Select, Spin } from "antd";
import { useEdit, useGetOne } from "@/pages/CategoryPages/services";
import { CustomerType } from "./customerType";

export type CategoryEditRef = {
  submit: () => void;
};

interface Props {
  token: number | string;
  onClose: () => void;
}

const Edit = forwardRef<CategoryEditRef, Props>(({ onClose, token }, ref) => {
  const [form] = Form.useForm<CustomerType>();
  const [
    getCustomerType,
    customerTypeResponse,
    getCustomerTypeStatus,
  ] = useGetOne<CustomerType>("/CustomerType/getbyid?id=");
  const [onEdit, , editStatus] = useEdit<CustomerType, CustomerType>(
    "/CustomerType/update"
  );
  const onFinish = async ({ name, mail, customerCode }: CustomerType) => {
    const data: CustomerType = {
      ...customerTypeResponse,
      name: name,
      mail: mail,
      customerCode: customerCode,
    } as CustomerType;
    console.log(data);
    const result = await onEdit(data);
    if (onClose) onClose();
    if (result.success)
      notification.info({
        message: "Bilgi",
        description: result.message,
      });
  };

  const onFinishFailed = (errorInfo: any) => {};

  const onGetCustomerTypes = async () => {
    const data = await getCustomerType(token);
    form.setFieldsValue({
      ...data,
    });
  };

  useEffect(() => {
    onGetCustomerTypes();
  }, []);

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));

  if (getCustomerTypeStatus === "pending" || editStatus === "pending") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 500,
        }}
      >
        <Spin size="large" spinning />
      </div>
    );
  }

  if (getCustomerTypeStatus === "rejected") {
    return (
      <div>
        <h1>Hata Oluştu</h1>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "3em" }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={12}>
          <Col xs={24} md={24} span="16">
            <Card title="Genel Bilgiler">
              <Form.Item
                label="Müşteri"
                required
                requiredMark="optional"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Input
                  placeholder="Müşteri Tipi Giriniz..."
                  onChange={(e) => {
                    form.setFieldsValue({
                      name: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Müşteri Maili"
                required
                requiredMark="optional"
                name="mail"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                    type: "email",
                  },
                ]}
              >
                <Input
                  placeholder="Müşteri Maili Giriniz..."
                  onChange={(e) => {
                    form.setFieldsValue({ mail: e.target.value });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Müşteri Kodu"
                required
                requiredMark="optional"
                name="customerCode"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Input
                  placeholder="Müşteri Kodu Giriniz..."
                  onChange={(e) => {
                    form.setFieldsValue({
                      customerCode: e.target.value,
                    });
                  }}
                  type="number"
                  min={0}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default Edit;
