import { Button, Form, Input, Select, Space } from "antd";
import React, { FC, SetStateAction, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import "antd/dist/antd.css";
import { useIntl } from "umi";

type LangConstType = {
  setLangConst: React.Dispatch<SetStateAction<any>>;
  langConst: any[];
};

const LangConstCollapse: FC<LangConstType> = ({ setLangConst, langConst }) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const [langConstContentType, setLangConstContentType] = useState<any>(null);

  const handleFinish = (data: any) => {
    data.description = "";
    data.status = "";
    data.item = "";
    form.resetFields();
    setLangConst((prev: any) => [...prev, data]);
  };
  const handleDeleteClick = (key: string) => {
    const data = langConst.filter((d) => d.key !== key);
    setLangConst(data);
  };
  const checkKey = async (_: any, value: any) => {
    var a = langConst.map((lc, i) => {
      return lc.key === value;
    });
    console.log(a);
    if (a.includes(true)) {
      return Promise.reject(new Error("Bu Key Daha Önce Kullanıldı..."));
    }
    return Promise.resolve();
  };

  const handleItemTypeChange = (e: any, key: any) => {
    const newData = langConst.map((data, i) => {
      return data.key === key ? { ...data, itemtype: e } : data;
    });
    console.log(newData);
    setLangConst(() => newData);
  };

  const handleValueChange = (newVal: string, key: string) => {
    const newData = langConst.map((data, i) => {
      return data.key === key ? { ...data, value: newVal } : data;
    });
    console.log(newData);
    setLangConst(() => newData);
  };
  const handleTypeChange = (e: any) => {
    setLangConstContentType(e);
  };
  const { Option } = Select;
  return (
    <>
      <Form
        onFinish={handleFinish}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Space
          key={1}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Form.Item
            label="Key"
            name="key"
            rules={[
              {
                required: true,
                message: "Zorunlu Alan"
              },
              { validator: checkKey },
            ]}
          >
            <Input placeholder="Key" />
          </Form.Item>

          {(langConstContentType === "textbox" ||
            langConstContentType === null) && (
            <Form.Item
              label="Value"
              name="value"
              rules={[
                {
                  required: true,
                  message: "Zorunlu Alan"
                },
              ]}
            >
              <Input placeholder="Value" type="text" />
            </Form.Item>
          )}

          {langConstContentType === "textarea" && (
            <Form.Item
              label="Value"
              name="value"
              rules={[
                {
                  required: true,
                  message: "Zorunlu Alan"
                },
              ]}
            >
              <TextArea placeholder="Value" />
            </Form.Item>
          )}

          <Form.Item
            label="Item Type"
            name="itemtype"
            rules={[
              {
                required: true,
                message: "Zorunlu Alan"
              },
            ]}
          >
            <Select
              style={{
                width: "100%",
                maxWidth: 200,
                minWidth: 100,
              }}
              onChange={handleTypeChange}
            >
              <Option value="textbox">Text Box</Option>
              <Option value="textarea">Textarea</Option>
            </Select>
          </Form.Item>

          <Form.Item label="-">
            <Button type="primary" htmlType="submit">
              Ekle
            </Button>
          </Form.Item>
        </Space>
      </Form>
      <Form autoComplete="off" layout="vertical">
        {langConst?.map((lc, i) => (
          <Space
            key={i}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form.Item>
              <Input placeholder="Key" defaultValue={lc.key} readOnly />
            </Form.Item>

            <Form.Item>
              {lc.itemtype === "textbox" && (
                <Input
                  name="aa"
                  placeholder="Value"
                  defaultValue={lc.value}
                  onChange={(e) =>
                    handleValueChange(e.currentTarget.value, lc.key)
                  }
                />
              )}
              {lc.itemtype === "textarea" && (
                <TextArea
                  name="aa"
                  placeholder="Value"
                  defaultValue={lc.value}
                  onChange={(e) =>
                    handleValueChange(e.currentTarget.value, lc.key)
                  }
                />
              )}
            </Form.Item>

            <Form.Item>
              <Select
                style={{
                  width: "100%",
                  maxWidth: 200,
                  minWidth: 100,
                }}
                defaultValue={lc.itemtype}
                onChange={(e) => handleItemTypeChange(e, lc.key)}
              >
                <Option value="textbox">Text Box</Option>
                <Option value="textarea">Textarea</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="button"
                onClick={() => handleDeleteClick(lc.key)}
              >
               Sil
              </Button>
            </Form.Item>
          </Space>
        ))}
      </Form>
    </>
  );
};

export default LangConstCollapse;
