import React, { ReactElement, useEffect, useState } from "react";
import { history, Redirect, useIntl } from "umi";
import CustomPageContainer from "../../components/CustomPageContainer";
import { UserOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  notification,
} from "antd";
import { useListAll, useCreate, useGetOne } from "../CategoryPages/services";
import { MaskedInput } from "antd-mask-input";
import usePerms from "../../hoxmodels/perms";
import { CustomerType } from "../CustomerSettings/CustomerType/customerType";
import { Plan } from "../CustomerSettings/Plan/planType";
import FileManager from "@/components/FileManager";
import {
  CustomerCreateForm,
  CustomerGroup,
  CustomerRoleByPlanId,
} from "./customer";

interface Props {}

function UserPage({}: Props): ReactElement {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm<CustomerCreateForm>();

  const [
    getCustomerType,
    customerTypeList,
    customerTypeStatus,
  ] = useListAll<CustomerType>("/CustomerType/getall"); //Müşteri Tipi

  const [getPlanList, PlanListResp, PlanListStatus] = useListAll<Plan>( //müşteri planı
    "/CustomerPlans/getall"
  );
  const [getRoles, roleResponse, roleStatus] = useGetOne<
    CustomerRoleByPlanId[]
  >("/CustomerGroupModul/getbygroupidbyplanid"); //müşteri planı
  // const [
  //   getCustomerGroup,
  //   customerGroupList,
  //   customerGroupStatus,
  // ] = useListAll<CustomerGroup>("/CustomerGroup/getall"); //müşteri rolü

  const [create] = useCreate("/CustomerAuth/register");

  const [image, setImage] = useState("");

  const { perms } = usePerms();

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["musteriler.NewRecord"];

  if (!isPermCreate) {
    return <Redirect to="/not-perm" />;
  }

  function handlePlanChange(e: string) {
    getRoles(`?planId=${e}`);
    form.setFieldValue("customerGroupId", null);
  }

  function onFinishForm(fields: any) {
    const createFields = {
      ...fields,
      filePath: image,
    };
    onCreate(createFields);
  }

  async function onCreate(data: CustomerCreateForm) {
    try {
      await create({ ...data }).then((result) => {
        if (result.success) {
          notification.info({
            message: "Bilgilendirme",
            description: result.message,
          });
          history.push("/setting/customers");
        }
      });
    } catch (error) {
      alert("Kullanıcı Oluşturulamadı");
    }
  }

  useEffect(() => {
    getCustomerType();
    //getCustomerGroup();
    getPlanList();
  }, []);

  return (
    <CustomPageContainer icon={<UserOutlined />}>
      <Form layout="vertical" form={form} onFinish={onFinishForm}>
        <Row>
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
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Card title="Genel Bilgiler">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Lütfen email formatında bilgi giriniz!",
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={formatMessage({ id: "userpage.create.firstname" })}
                name="firstName"
                rules={[
                  {
                    required: true,
                    message:
                      "Lütfen minimum 2 harf gelecek şekilde zorunlu alanı doldurunuz!",
                    min: 2,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={formatMessage({ id: "userpage.create.lastname" })}
                name="lastName"
                rules={[
                  {
                    required: true,
                    message:
                      "Lütfen minimum 2 harf gelecek şekilde zorunlu alanı doldurunuz!",
                    min: 2,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Telefon Numarası"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                    pattern: new RegExp(
                      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
                    ),
                  },
                ]}
              >
                <MaskedInput mask="+(00) 000 000 00 00" />
              </Form.Item>

              {/* <Form.Item
                label={"Cari Kod"}
                name="customerCode"
                rules={[
                  {
                    required: true,
                    message:
                      "Lütfen minimum 2 harf gelecek şekilde zorunlu alanı doldurunuz!",
                    min: 2,
                  },
                ]}
              >
                <Input />
              </Form.Item> */}

              <Form.Item
                name="password"
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

              <Form.Item
                name="confirm"
                label="Şifre Tekrar"
                dependencies={["password"]}
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
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Şifreler uyuşmuyor!"));
                    },
                  }),
                ]}
              >
                <Input.Password iconRender={() => {}} type="password" />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Genel Bilgiler">
              <Form.Item
                label="Müşteri Tipi"
                required
                requiredMark="optional"
                name="customerTypeId"
                rules={[
                  {
                    required: true,
                    message: "Lütfen müşteri tipi seçiniz!",
                  },
                ]}
              >
                {customerTypeList.length > 0 && (
                  <Select
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    placeholder="Müşteri Tipi Seçiniz..."
                  >
                    {customerTypeList.map((customer, i) => (
                      <Select.Option key={i} value={customer.id}>
                        {customer.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="Müşteri Planı"
                required
                requiredMark="optional"
                name="customerPlanId"
                rules={[
                  {
                    required: true,
                    message: "Lütfen müşteri planı seçiniz!",
                  },
                ]}
              >
                {customerTypeList.length > 0 && (
                  <Select
                    allowClear
                    onChange={(e) => handlePlanChange(e)}
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    placeholder="Müşteri Planı Seçiniz..."
                  >
                    {PlanListResp.map((plan, i) => (
                      <Select.Option key={i} value={plan.id}>
                        {plan.planType}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="Rol"
                required
                requiredMark="optional"
                name="customerGroupId"
                rules={[
                  {
                    required: true,
                    message: "Lütfen rol seçiniz!",
                  },
                ]}
              >
                {roleStatus === "pending" ? (
                  <Spin
                    style={{ display: "flex", justifyContent: "center" }}
                    size="small"
                  />
                ) : (
                  <Select
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    placeholder="Rol Seçiniz..."
                  >
                    {roleResponse?.map((role, i) => (
                      <Select.Option key={i} value={role.id}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Resim">
                <FileManager
                  onChange={(data) => {
                    setImage(data.path || "");
                  }}
                />
              </Form.Item>
            </Card>
          </Col>
          {/* <Col xs={24} md={12}>
            <Card>
              <Form.Item
                label="Rol"
                name="userGroupId"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  loading={userGroupsStat === "pending"}
                >
                  {userGroups &&
                    userGroups.map((userGroup, index) => (
                      <Select.Option value={`${userGroup.id}`} key={index}>
                        {userGroup.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="Resim">
                <FileManager
                  onChange={(data) => {
                    setImage(data.path || "");
                  }}
                />
              </Form.Item>
            </Card>
          </Col> */}
        </Row>
      </Form>
    </CustomPageContainer>
  );
}

export default UserPage;
