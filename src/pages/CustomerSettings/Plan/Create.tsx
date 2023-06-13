import React, { ReactElement, useLayoutEffect, useState } from "react";
import { history, Redirect } from "umi";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  notification,
  Select,
} from "antd";
import "react-quill/dist/quill.snow.css";
import CustomPageContainer from "../../../components/CustomPageContainer";
import useLanguage from "../../../hoxmodels/language";
import usePerms from "../../../hoxmodels/perms";
import { useCreate, useListAll } from "@/pages/CategoryPages/services";
import { Plan } from "./planType";

interface CreateForm {
  planType: string;
  status: boolean;
  createDate: Date;
  createdBy: string;
  subPlans: any;
  order: number;
}

function PlanNew(): ReactElement {
  const { language } = useLanguage();
  const { perms } = usePerms();
  const [form] = Form.useForm<CreateForm>();
  const [selectedPlans, setSelectedPlans] = useState<Plan[] | []>([]);

  const [getPlanList, PlanListResp, PlanListStatus] = useListAll<Plan>(
    "/CustomerPlans/getall"
  );

  const [planCreate, planCreateResponse, planStatus] = useCreate<
    CreateForm,
    string
  >("/CustomerPlans/add");

  if (!perms) return <Redirect to="/not-perm" />;

  const isPermCreate = perms["musteri-plani.NewRecord"];

  if (!isPermCreate) {
    return <Redirect to="/not-perm" />;
  }

  const handleSelectedPlans = (e: React.ChangeEvent<HTMLInputElement>) => {
    const order = Number(e.target.value);
    let selectedPlan = PlanListResp.filter((p) => p.order < order);
    setSelectedPlans(selectedPlan);
  };

  const onFinish = async (values: CreateForm) => {
    try {
      values.subPlans = values?.subPlans ? values?.subPlans.join(",") : "";
      values.status = true;
      values.createdBy = "";
      values.createDate = new Date();
      var result = await planCreate(values);
      console.log("planpageresult", result);
      if (result.success) {
        history.push("/customer/plan/list");
        notification.info({
          message: "Bilgilendirme",
          description: result.message,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Hata!",
        description: "Beklenmeyen bir hata meydana geldi!",
      });
    }
  };
  const onFinishFailed = (errorInfo: any) => {};

  useLayoutEffect(() => {
    getPlanList();
  }, []);

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
                  <Col md={12} style={{ margin: "auto" }}>
                    <Form.Item
                      label="Plan Adı"
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
                        placeholder="Plan İsmi Giriniz..."
                        onChange={({ currentTarget: { value } }) => {}}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12} style={{ margin: "auto" }}>
                    <Form.Item
                      label="Sıra"
                      required
                      requiredMark="optional"
                      name="order"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen zorunlu alanı doldurunuz!",
                          min: 0,
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
                  </Col>
                  <Col md={12} style={{ margin: "auto" }}>
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
                          {selectedPlans.map((plan, i) => (
                            <Select.Option key={i} value={plan.id}>
                              {plan.planType}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
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
                      <Button
                        color="green"
                        htmlType="submit"
                        loading={planStatus === "pending"}
                      >
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

export default PlanNew;
