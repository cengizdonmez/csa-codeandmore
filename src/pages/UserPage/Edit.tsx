import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from "react";
import { Row, Col, Card, Form, Input, Select, Button, Spin } from "antd";
import FileManager from "../../components/FileManager";
import {
  useCreate,
  useListAll,
  CategoryUrl,
  useGetOne,
  useEdit,
} from "../CategoryPages/services";
import { MaskedInput } from "antd-mask-input";

interface CreateForm {
  name: string;
  slug: string;
  address: string;
  description: string;
  short_Description: string;
  content: string;
  seo_Title: string;
  seo_Keyword: string;
  seo_Description: string;
  image_Path: string;
}

export type userEditRef = {
  submit: () => void;
};

interface Props {
  token: number | string;
  onClose: () => void;
}

const UserEditPage = forwardRef<userEditRef, Props>(
  ({ onClose, token }, ref) => {
    const [form] = Form.useForm<CreateForm>();
    const [image, setImage] = useState<string>("");
    const [getUserGroups, userGroups, userGroupsStat] = useListAll(
      "/UserGroup/getall"
    );
    const [getUser, userOne, userOneStatus] = useGetOne(
      "/User/getbytoken?token="
    );
    const [onEdit, , editStatus] = useEdit("/User/update");

    async function onGetUserGroup() {
      await getUserGroups();
      const data = await getUser(token);
      if (data) {
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
      onGetUserGroup();
    }, []);

    async function edit(fields: any) {
      try {
        const data = await onEdit(fields);
        if (onClose) {
          onClose();
        }
      } catch (error) {}
    }

    function matchCurrentUser(id: string) {
      const currentUser = localStorage.getItem("userId");
      return `${id}` === currentUser;
    }

    const onFinish = (values: CreateForm) => {
      edit({
        ...values,
        filePath: image,
        userGroupId: values.userGroupId,
        id: userOne?.id,
        token: userOne?.token,
        status: true,
      });
    };

    const onFinishFailed = (errorInfo: any) => {};

    if (
      userOneStatus === "pending" ||
      userGroupsStat === "pending" ||
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
                  <MaskedInput mask="+(00) 000 000 00 00" />
                </Form.Item>

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
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
);

export default UserEditPage;
