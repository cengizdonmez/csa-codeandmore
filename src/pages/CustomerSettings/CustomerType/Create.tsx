import React, { ReactElement } from "react";
import { history, Redirect } from "umi";
import { Row, Col, Form, Input, Button, Card, notification } from "antd";

import "react-quill/dist/quill.snow.css";
import CustomPageContainer from "../../../components/CustomPageContainer";
import useLanguage from "../../../hoxmodels/language";

import usePerms from "../../../hoxmodels/perms";
import { useCreate } from "@/pages/CategoryPages/services";
import { CustomerType } from "./customerType";

function CategoryNew(): ReactElement {
  const { language } = useLanguage();
  const { perms } = usePerms();
  const [form] = Form.useForm<CustomerType>();

  const [
    customerTypeCreate,
    customerTypeResponse,
    customerTypeStatus,
  ] = useCreate<CustomerType, string>("/CustomerType/add");

  if (!perms) return <Redirect to="/not-perm" />;

  const isPermCreate = perms["musteri-tipi.NewRecord"];

  if (!isPermCreate) {
    return <Redirect to="/not-perm" />;
  }
  const onFinish = async (values: CustomerType) => {
    try {
      values.createDate = new Date();
      values.updateDate = new Date();
      values.createdBy = "";
      values.updatedBy = "";

      var result = await customerTypeCreate(values);
      if (result.success) {
        notification.info({
          message: "Bilgilendirme",
          description: result.message,
        });
        history.push("/customer/customerType/list");
      }
      console.log(result);
    } catch (error: any) {
      notification.info({
        message: "Bilgilendirme",
        description: "Hata Meydana Geldi!",
      });
    }
  };
  const onFinishFailed = (errorInfo: any) => {};

  return (
    <CustomPageContainer icon="new" breadcrumbShow>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row style={{ justifyContent: "center" }} gutter={12}>
          <Col xs={24} md={12}>
            <Col>
              <Col xs={24} md={24} span="8">
                <Card>
                  <Col md={8} style={{ margin: "auto" }}>
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
                        onChange={({ currentTarget: { value } }) => {}}
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
                          type: "email",
                          message: "Lütfen geçerli bir mail adresi giriniz!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Müşteri Maili Giriniz..."
                        onChange={({ currentTarget: { value } }) => {}}
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
                          message:
                            "Lütfen sadece rakam olacak şekilde geçerli bir veri giriniz!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Müşteri Kodu Giriniz..."
                        onChange={({ currentTarget: { value } }) => {}}
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <div
                      style={{
                        marginBottom: 5,
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Button color="green" htmlType="submit" loading={false}>
                        Kaydet
                      </Button>
                    </div>
                  </Col>
                </Card>
              </Col>
            </Col>
          </Col>
        </Row>
      </Form>
    </CustomPageContainer>
  );
}

export default CategoryNew;
