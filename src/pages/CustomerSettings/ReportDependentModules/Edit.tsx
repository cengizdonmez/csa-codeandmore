import React, { forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { Card, Col, Form, Input, notification, Row, Select, Spin } from "antd";
import { ModuleResponse } from "./module";
import { useEdit, useGetOne, useListAll } from "@/pages/CategoryPages/services";
import { Plan } from "../Plan/planType";
import { Report } from "../Report/report";
import { history } from "umi";

interface CreateForm {
  customerReportId: string;
  name: string;
  customerPlans: string[];
}

interface FinishFormObject {
  customerModule: {
    id: string;
    customerReportId: string;
    name: string;
    createDate: string;
    createdBy: string;
    updateDate: string;
    updatedBy: string;
    langCode: string;
    active: boolean;
    sortOrder: number;
    token: string;
  };
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

export type CategoryEditRef = {
  submit: () => void;
};

interface Props {
  id: number | string;
  onClose: () => void;
}

const Edit = forwardRef<CategoryEditRef, Props>(({ onClose, id }, ref) => {
  const [form] = Form.useForm<CreateForm>();

  const [
    getCustomerModule,
    customerModuleResponse,
    getCustomerModuleStatus,
  ] = useGetOne<ModuleResponse>("/CustomerModule/getwithplansbyid?id=");

  const [getPlanList, planListResp, planListStatus] = useListAll<Plan>(
    "/CustomerPlans/getall"
  );
  const [getReportList, reportList, reportStatus] = useListAll<Report>(
    "/CustomerReports/getall"
  );
  const [onEdit, , editStatus] = useEdit("/CustomerModule/update");

  const onFinish = (values: CreateForm) => {
    var customerPlansArr = values.customerPlans.map((plans, i) => {
      return { id: plans }; //hata bu satırda oluşuyor
    });
    var finishObject: FinishFormObject = {
      customerModule: {
        id: customerModuleResponse?.customerModuleId!!,
        customerReportId: values.customerReportId,
        name: values.name,
        createDate: "2023-02-20T15:00:42.906Z",
        createdBy: "",
        updateDate: "2023-02-20T15:00:42.906Z",
        updatedBy: "",
        langCode: "",
        active: true,
        sortOrder: 0,
        token: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      },
      customerPlans: customerPlansArr,
      customerModulesPlan: {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        customerModuleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        customerPlanId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        createDate: "2023-02-20T15:00:42.906Z",
        createdBy: "",
      },
    };
    onEdit(finishObject).then((result) => {
      if (result.success) {
        if (onClose) onClose();
        notification.info({
          message: "Bilgi",
          description: result.message,
        });
      }
    });
  };

  const onGetCustomerModule = async () => {
    const result = await getCustomerModule(id);
    form.setFieldsValue({
      name: result.customerModuleName,
      customerReportId: result.customerReportId,
      customerPlans: result.customerPlans.map((data, i) => data.id),
    });
  };

  useLayoutEffect(() => {
    onGetCustomerModule();
    getPlanList();
    getReportList();
  }, []);

  const onFinishFailed = (errorInfo: any) => {};

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));

  if (
    getCustomerModuleStatus === "pending" ||
    editStatus === "pending" ||
    reportStatus === "pending" ||
    planListStatus === "pending"
  ) {
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

  if (
    getCustomerModuleStatus === "rejected" ||
    editStatus === "rejected" ||
    reportStatus === "rejected" ||
    planListStatus === "rejected"
  ) {
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
                {planListResp.map((plan, i) => (
                  <Select.Option key={i} value={plan.id}>
                    {plan.planType}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default Edit;
