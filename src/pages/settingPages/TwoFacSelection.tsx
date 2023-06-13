import CustomPageContainer from "@/components/CustomPageContainer";
import { SettingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  notification,
  Row,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import { useEdit, UseGetOneWithoutQuery } from "../CategoryPages/services";

type TwoFacSelection = {
  id: number | null | undefined;
  smsCheck: boolean;
  mailCheck: boolean;
};

const TwoFacSelection = () => {
  const [smsCheck, setSmsCheck] = useState<boolean>(true);
  const [mailCheck, setMailCheck] = useState<boolean>(false);
  const [getSmsMail, data, status] = UseGetOneWithoutQuery<TwoFacSelection>(
    "/TwoFact/get"
  );

  const [onEditAsync, response, UpdateStatus] = useEdit<
    TwoFacSelection,
    string
  >("/TwoFact/update");

  useEffect(() => {
    getSmsMail().then((data) => {
      console.log(data, "vvv");
      setSmsCheck(data.smsCheck);
      setMailCheck(data.mailCheck);
    });
  }, []);

  const [form] = Form.useForm();

  const handleFinish = async (_fields: any) => {
    const postData: TwoFacSelection = {
      id: data?.id,
      mailCheck: mailCheck,
      smsCheck: smsCheck,
    };
    console.log(postData);
    await onEditAsync(postData).then((result) => {
      console.log(result);
      notification.success({
        message: "Bilgilendirme",
        description: result,
      });
    });
  };
  useEffect(() => {
    console.log(smsCheck, mailCheck, "effect");
  }, [smsCheck, mailCheck]);

  const handleSmsChange = (e: boolean) => {
    setMailCheck(false), setSmsCheck(e);
  };

  // const handleMailChange = (e: boolean) => {
  //   setSmsCheck(false), setMailCheck(e);
  // };

  return (
    <CustomPageContainer icon={<SettingOutlined />}>
      <Card style={{ marginBottom: 5 }}>
        <Row style={{ justifyContent: "space-between", marginBottom: "20px" }}>
          <Col>
            <h2 style={{ margin: 0, padding: 0 }}>Two Factor Auth Aç/Kapat</h2>
          </Col>
        </Row>
        {!!data && (
          <Form onFinish={handleFinish} form={form}>
            <Form.Item
              label="Sms On/Off"
              name="sms"
              required
              requiredMark="optional"
            >
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                onChange={handleSmsChange}
                checked={smsCheck}
                defaultChecked={smsCheck}
              />
            </Form.Item>
            {/* <Form.Item
              label="Mail On/Off"
              name="mail"
              required
              requiredMark="optional"
            >
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                onChange={handleMailChange}
                checked={mailCheck}
                defaultChecked={mailCheck}
              />
            </Form.Item> */}
            <Button htmlType="submit">Submit</Button>
          </Form>
        )}
      </Card>
    </CustomPageContainer>
  );
};

export default TwoFacSelection;
