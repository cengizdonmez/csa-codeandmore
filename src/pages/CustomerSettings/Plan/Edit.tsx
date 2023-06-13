import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Card, Col, Form, Input, notification, Row, Select, Spin } from "antd";
import { useGetOne, useEdit, useListAll } from "@/pages/CategoryPages/services";
import { Plan } from "./planType";

export type CategoryEditRef = {
  submit: () => void;
};

interface Props {
  token: number | string;
  onClose: () => void;
}

const Edit = forwardRef<CategoryEditRef, Props>(({ onClose, token }, ref) => {
  const [form] = Form.useForm<Plan>();

  const [plan, planResponse, planStatus] = useGetOne<Plan>(
    "/CustomerPlans/getbyid?id="
  );
  const [getPlanList, PlanListResp, PlanListStatus] = useListAll<Plan>(
    "/CustomerPlans/getall"
  );
  const [onEdit, , editStatus] = useEdit<Plan, Plan>("/CustomerPlans/update");
  const [filterSubPlans, setFilterSubPlans] = useState<Plan[] | [] | undefined>(
    []
  );
  const onFinish = async ({ planType, subPlans, ...plan }: Plan) => {
    const data: Plan = {
      ...planResponse,
      planType: planType,
      subPlans: subPlans ? subPlans.join(",") : "",
      order: plan.order,
    } as Plan;
    const result = await onEdit(data);
    if (result.success) {
      if (onClose) onClose();
      notification.info({
        message: "Bilgilendirme",
        description: result.message,
      });
    }
  };

  const getPlan = async (): Promise<Plan> => {
    var data = await plan(token);
    form.setFieldsValue({
      ...data,
      subPlans:
        data?.subPlans.length > 0 ? data?.subPlans.split(",") : undefined,
    });
    return data;
  };
  const getDatas = async () => {
    const data = await getPlan();
    await getPlanList().then((result) => {
      let filterPlan = result.filter((p) => p.id !== data?.id);
      setFilterSubPlans(filterPlan);
    });
  };
  useEffect(() => {
    getDatas();
  }, []);

  // useEffect(() => {
  //   if (PlanListResp.length > 0) {
  //     let filterPlan = PlanListResp.filter((p) => p.id !== planResponse?.id);
  //     setFilterSubPlans(filterPlan);
  //   }
  // }, [PlanListResp]);

  const handleSelectedPlans = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("subPlans", undefined);
    const order = Number(e.target.value);
    let selectedPlan = PlanListResp.filter(
      (p) => p.order < order && p.id !== planResponse?.id
    );
    setFilterSubPlans(selectedPlan);
  };

  const onFinishFailed = (errorInfo: any) => {};

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));

  if (planStatus === "pending" || editStatus === "pending") {
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

  if (planStatus === "rejected") {
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
                label="Plan Tipi"
                required
                requiredMark="optional"
                name="planType"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Input
                  placeholder="Plan Adı Giriniz..."
                  onChange={(e) => {
                    form.setFieldsValue({ planType: e.target.value });
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Sıra"
                required
                requiredMark="optional"
                name="order"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                    
                  },
                ]}
              >
                <Input
                  placeholder="Sıra Numarası Giriniz..."
                  onChange={(e) => handleSelectedPlans(e)}
                  type="number"
                  min={0}
                />
              </Form.Item>

              <Form.Item
                label="Alt Plan"
                requiredMark="optional"
                name="subPlans"
              >
                {PlanListStatus === "fulfilled" && (
                  <Select
                    allowClear
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    placeholder="Alt Plan Seçiniz..."
                  >
                    {filterSubPlans?.map((plan, i) => (
                      <Select.Option key={i} value={plan.id}>
                        {plan.planType}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default Edit;
