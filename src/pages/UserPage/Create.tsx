import React, { ReactElement, useLayoutEffect, useState } from "react";
import { history, Redirect, useIntl } from "umi";
import CustomPageContainer from "../../components/CustomPageContainer";
import { UserOutlined } from "@ant-design/icons";
import { Row, Col, Card, Form, Input, Select, Button, message } from "antd";
import FileManager from "../../components/FileManager";
import { useListAll, useCreate } from "../CategoryPages/services";
import ReactPasswordStrength from "react-password-strength";
import { MaskedInput } from "antd-mask-input";

interface Props {}

interface TableItem {
  id?: number;
  name?: string;
  token?: string;
}

function UserPage({}: Props): ReactElement {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const [getUserGroups, userGroups, userGroupsStat] = useListAll(
    "/UserGroup/getall"
  );
  const [create] = useCreate("/Auth/register");
  const [image, setImage] = useState("");

  function onFinishForm(fields: any) {
    const createFields = {
      ...fields,
      filePath: image,
      userGroupId: fields.userGroupId,
    };
    onCreate(createFields);
  }

  async function onCreate(data) {
    try {
      await create({ ...data }).then((result) => {
        if (result.success) {
          history.push("/setting/users");
        } else {
          message.error(result.message);
        }
      });
    } catch (error) {
      alert("Kullanıcı Oluşturulamadı");
    }
  }

  useLayoutEffect(() => {
    getUserGroups();
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
        <Row style={{ justifyContent: "center" }} gutter={12}>
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
                <Input.Password iconRender={()=>{}} type="password" />
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
                <Input.Password iconRender={()=>{}} type="password" />
              </Form.Item>

              {/* <Form.Item
                label="Parola"
                name="password"
                rules={[
                  {
                    required: true,
                    message:"Lütfen minimum 6 karakter içeren bir şifre giriniz!",
                    min: 6,
                  },
                ]}
              >
                <ReactPasswordStrength
                  style={{ padding: "0" }}
                  minLength={1}
                  minScore={2}
                  scoreWords={["Zayıf", "İyi", "Güzel", "Güçlü", "Kilitli"]}
                  changeCallback={(foo) => {
                    form.setFieldsValue({
                      password: foo.isValid ? foo.password : null,
                    });
                  }}
                  inputProps={{
                    type: "password",
                    autoComplete: "off",
                    style: { padding: 4 },
                  }}
                />
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
          </Col>
        </Row>
      </Form>
    </CustomPageContainer>
  );
}

export default UserPage;
