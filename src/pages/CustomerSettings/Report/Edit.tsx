import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import { Card, Col, Form, Input, notification, Row, Select, Spin } from "antd";
import slugify from "../../../helper/slug";
import { Report, ReportUpdate } from "./report";
import { useEdit, useGetOne } from "@/pages/CategoryPages/services";

export type CategoryEditRef = {
  submit: () => void;
};

interface Props {
  token: number | string;
  onClose: () => void;
}

const Edit = forwardRef<CategoryEditRef, Props>(({ onClose, token }, ref) => {
  const [form] = Form.useForm<ReportUpdate>();

  const [
    getCustomerType,
    customerTypeResponse,
    getCustomerTypeStatus,
  ] = useGetOne<Report>("/CustomerReports/getbyid?id=");
  const [onEdit, , editStatus] = useEdit<ReportUpdate, ReportUpdate>(
    "/CustomerReports/update"
  );

  const onGetCustomerTypes = async () => {
    const data = await getCustomerType(token);
    form.setFieldsValue({
      ...data,
    });
  };

  useEffect(() => {
    onGetCustomerTypes();
  }, []);

  const onFinish = async (values: ReportUpdate) => {
    values.id = customerTypeResponse?.id as string;
    values.status = true;
    values.createDate = new Date();
    values.createdBy = "";
    values.updateDate = new Date();
    values.updatedBy = "";
    const result = await onEdit(values);
    if (result.success) {
      if (onClose) onClose();
      notification.info({
        message: "Bilgi",
        description: result.message,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {};

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
                label="Rapor Tipi"
                required
                requiredMark="optional"
                name="reportName"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Input
                  placeholder="Rapor Adı Giriniz..."
                  onChange={(e) => {
                    form.setFieldsValue({});
                  }}
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
