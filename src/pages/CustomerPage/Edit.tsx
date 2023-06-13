import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Spin,
  notification,
} from "antd";
import { useListAll, useGetOne, useEdit } from "../CategoryPages/services";
import { MaskedInput } from "antd-mask-input";
import usePerms from "../../hoxmodels/perms";
import { Redirect } from "umi";
import { CustomerType } from "../CustomerSettings/CustomerType/customerType";
import { Plan } from "../CustomerSettings/Plan/planType";
import { Customer, CustomerGroup, CustomerRoleByPlanId } from "./customer";
import FileManager from "@/components/FileManager";

export type medicalEditRef = {
  submit: () => void;
};

interface Props {
  id: number | string;
  onClose: () => void;
}

const CustomerEditPage = forwardRef<medicalEditRef, Props>(
  ({ onClose, id }, ref) => {
    const [form] = Form.useForm<Customer>();
    const [image, setImage] = useState<string>("");

    const [getUser, userOne, userOneStatus] = useGetOne<Customer>(
      "/Customer/getbyid?id="
    );
    const [
      getCustomerType,
      customerTypeList,
      customerTypeStatus,
    ] = useListAll<CustomerType>("/CustomerType/getall"); //Müşteri Tipi

    const [getPlanList, PlanListResp, PlanListStatus] = useListAll<Plan>( //müşteri planı
      "/CustomerPlans/getall"
    );

    // const [
    //   getCustomerGroup,
    //   customerGroupList,
    //   customerGroupStatus,
    // ] = useListAll<CustomerGroup>("/CustomerGroup/getall"); //müşteri rolü

    const [getRoles, roleResponse, roleStatus] = useGetOne<
      CustomerRoleByPlanId[]
    >("/CustomerGroupModul/getbygroupidbyplanid"); //müşteri planı

    const [onEdit, , editStatus] = useEdit("/Customer/update");
    const { perms } = usePerms();

    if (!perms) {
      return <Spin spinning />;
    }

    const isPermUpdate = perms["musteriler.UpdateRecord"];

    if (!isPermUpdate) {
      return <Redirect to="/not-perm" />;
    }

    function handlePlanChange(e: string) {
      getRoles(`?planId=${e}`);
      form.setFieldValue("customerGroupId", null);
    }

    async function onGetUser() {
      const data = await getUser(id);
      if (data) {
        getRoles(`?planId=${data.customerPlanId}`);
        form.setFieldsValue({ ...data });
        setImage(data.filePath);
      }
    }

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.submit();
      },
    }));

    useLayoutEffect(() => {
      onGetUser();
      getCustomerType();
      getPlanList();
      //getCustomerGroup();
    }, []);

    async function edit(fields: any) {
      try {
        const result = await onEdit(fields);
        if (result.success) {
          if (onClose) onClose();
          notification.info({
            message: "Bilgilendirme",
            description: result.message,
          });
        }
      } catch (error) {}
    }

    function matchCurrentUser(id: string) {
      const currentUser = localStorage.getItem("userId");
      return `${id}` === currentUser;
    }

    const onFinish = (values: Customer) => {
      edit({
        ...values,
        filePath: image,
        id: userOne?.id,
        status: true,
      });
    };

    const onFinishFailed = (errorInfo: any) => {};

    if (
      userOneStatus === "pending" ||
      customerTypeStatus === "pending" ||
      PlanListStatus === "pending" ||
      editStatus === "pending"
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

    if (userOneStatus === "rejected") {
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
          <Row style={{ justifyContent: "center" }} gutter={12}>
            <Col xs={24} md={12}>
              <Card title="Genel Bilgiler">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen zorunlu alanı doldurunuz!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Ad"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen zorunlu alanı doldurunuz!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Soyad"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen zorunlu alanı doldurunuz!",
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
                  <MaskedInput
                    mask="+(00) 000 000 00 00"
                    defaultValue={userOne?.phoneNumber}
                  />
                </Form.Item>
                {/* <Form.Item
                  label="Cari Kod"
                  name="customerCode"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen zorunlu alanı doldurunuz!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item> */}
                {/* <Form.Item
                label="Telefon Numarası"
                name="phoneNumber"
                rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
              >
                <Input />
              </Form.Item> */}
                {/* <Form.Item label="Parola" name="password">
                <Input type="password" />
              </Form.Item> */}
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
                    defaultValue={image}
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
                    disabled={userOne ? matchCurrentUser(userOne.id) : false}
                  >
                    {userGroups &&
                      userGroups.map((userGroup, index) => (
                        <Select.Option value={userGroup.id} key={index}>
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
                    defaultValue={image}
                  />
                </Form.Item>
              </Card>
            </Col> */}
          </Row>
        </Form>
      </div>
    );
  }
);

export default CustomerEditPage;
