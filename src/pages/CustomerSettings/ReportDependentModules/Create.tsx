import React, { ReactElement, useLayoutEffect } from "react";
import { history, Redirect } from "umi";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  Select,
  Spin,
  notification,
} from "antd";

import "react-quill/dist/quill.snow.css";
import CustomPageContainer from "../../../components/CustomPageContainer";
import useLanguage from "../../../hoxmodels/language";

import usePerms from "../../../hoxmodels/perms";
import { useCreate, useListAll } from "@/pages/CategoryPages/services";
import { Report } from "../Report/report";
import { Plan } from "../Plan/planType";

interface CreateForm {
  name: string;
  customerReportId: string;
  customerPlans: string[];
}

interface FinishFormObject {
  customerReportId: string;
  name: string;
  createDate: string;
  createdBy: string;
  langCode: string;
  token: string;
  customerPlans: {
    id: string;
  }[];
  customerModulesPlan: {
    id: string;
    customerModuleId: string;
    customerPlanId: string;
    createDate: string;
    createdBy: string;
  };
}
function ReportDependentModuleNew(): ReactElement {
  const { language } = useLanguage();
  const { perms } = usePerms();
  const [form] = Form.useForm<CreateForm>();

  const [getReport, reportList, reportStatus] = useListAll<Report>(
    "/CustomerReports/getall"
  );

  const [getPlanList, PlanListResp, PlanListStatus] = useListAll<Plan>(
    "/CustomerPlans/getall"
  );

  const [moduleAdd, moduleAddResponse, moduleAddStatus] = useCreate<
    FinishFormObject,
    any
  >("/CustomerModule/add");

  if (!perms) return <Redirect to="/not-perm" />;

  const isPermCreate = perms["musteri-modulu.NewRecord"];

  if (!isPermCreate) {
    return <Redirect to="/not-perm" />;
  }

  useLayoutEffect(() => {
    getReport();
    getPlanList();
  }, []);

  if (reportStatus === "pending" || PlanListStatus === "pending") {
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

  if (reportStatus === "rejected" || PlanListStatus === "rejected") {
    return (
      <div>
        <h1>Hata Oluştu</h1>
      </div>
    );
  }

  const onFinish = (values: CreateForm) => {
    var customerPlansArr = values.customerPlans.map((plans, i) => {
      return { id: plans }; //hata bu satırda oluşuyor
    });
    var finishObject: FinishFormObject = {
      customerReportId: values.customerReportId,
      name: values.name,
      createDate: "2023-02-20T15:00:42.906Z",
      createdBy: "string",
      langCode: "",
      token: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      customerPlans: customerPlansArr,
      customerModulesPlan: {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        customerModuleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        customerPlanId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        createDate: "2023-02-20T15:00:42.906Z",
        createdBy: "",
      },
    };

    moduleAdd(finishObject).then((result) => {
      if (result.success) {
        history.push("/customer/report-dependent-modules/list");
        notification.info({
          message: "Bilgilendirme",
          description: result.message,
        });
      }
    });
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
          <Col xs={24} md={24}>
            <Card>
              <Row>
                <Col md={12} style={{ padding: "0 1rem" }}>
                  <Form.Item
                    label="Rapora Ait Modül Adı"
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
                      placeholder="Rapor İsmi Giriniz..."
                      onChange={({ currentTarget: { value } }) => {}}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} style={{ padding: "0 1rem" }}>
                  <Form.Item
                    label="Bağlı Olduğu Rapor"
                    required
                    requiredMark="optional"
                    name="customerReportId"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen zorunlu alanı doldurunuz!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select a person"
                      optionFilterProp="children"
                      onChange={() => {}}
                      onSearch={() => {}}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {reportList.map((report, i) => (
                        <Select.Option key={i} value={report.id}>
                          {report.reportName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={12} style={{ padding: "0 1rem" }}>
                  <Form.Item
                    label="Hangi Planlarda Görünsün"
                    required
                    requiredMark="optional"
                    name="customerPlans"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen zorunlu alanı doldurunuz!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      mode="multiple"
                      placeholder="Select a person"
                      optionFilterProp="children"
                      onChange={() => {}}
                      onSearch={() => {}}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {PlanListResp.map((plan, i) => (
                        <Select.Option key={i} value={plan.id}>
                          {plan.planType}
                        </Select.Option>
                      ))}
                    </Select>
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
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </CustomPageContainer>
  );
}

export default ReportDependentModuleNew;
