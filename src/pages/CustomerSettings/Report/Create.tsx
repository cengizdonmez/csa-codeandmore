import React, { ReactElement } from "react";
import { history, Redirect } from "umi";
import { Row, Col, Form, Input, Button, Card, notification } from "antd";

import "react-quill/dist/quill.snow.css";
import CustomPageContainer from "../../../components/CustomPageContainer";
import useLanguage from "../../../hoxmodels/language";

import usePerms from "../../../hoxmodels/perms";
import { ReportAdd } from "./report";
import { useCreate } from "@/pages/CategoryPages/services";

function ReportNew(): ReactElement {
  const { language } = useLanguage();
  const { perms } = usePerms();
  const [form] = Form.useForm<ReportAdd>();

  if (!perms) return <Redirect to="/not-perm" />;

  const isPermCreate = perms["raporlar.NewRecord"];

  if (!isPermCreate) {
    return <Redirect to="/not-perm" />;
  }

  const [reportCreate, reportResponse, reportStatus] = useCreate<
    ReportAdd,
    string
  >("/CustomerReports/add");

  const onFinish = async (values: ReportAdd) => {
    values.status = true;
    values.createDate = new Date();
    values.createdBy = "";
    values.updateDate = new Date();
    values.updatedBy = "";
    const result = await reportCreate(values);
    if (result.success) {
      notification.info({
        message: "Bilgilendirme",
        description: result.message,
      });
      history.push("/customer/report/list");
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
                      label="Rapor Ekle"
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
                        placeholder="Rapor İsmi Giriniz..."
                        onChange={({ currentTarget: { value } }) => {
                          form.setFieldValue("reportName", value);
                        }}
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

export default ReportNew;
