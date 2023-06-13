import React, { ReactElement, useState, useLayoutEffect } from "react";
import CustomPageContainer from "../../components/CustomPageContainer";
import {
  Card,
  Button,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  Divider,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import useLanguage from "../../hoxmodels/language";
import { useGetOne, useEdit } from "@/pages/CategoryPages/services";
import FormGenerator from "@/pages/SettingsPage/components/FormGenerator";
import {
  ThemeSettingData,
  ThemeSetting,
  itemType,
} from "@/pages/SettingsPage/models";
import { SystemValueUrls } from "@/pages/SettingsPage/service";
import usePerms from "../../hoxmodels/perms";
import { Redirect } from "umi";
import slugify from "@/helper/slug";

// import JSONDATA from './special.json';

interface Props {
  systemValueKey: string;
  permKey: string;
}

interface _Setting {
  description: string;
  title: string;
  status: boolean;
  item?: string;
  key: string;
  value: string;
  itemtype: itemType;
}

function Setting({ systemValueKey, permKey }: Props): ReactElement {
  console.log(systemValueKey, permKey, "bennn");
  const { language } = useLanguage();
  const [getSystemValue, systemValue, systemValueStatus] = useGetOne<any>(
    "/SystemValue/getbylangcode?langCode="
  );
  const [data, setData] = useState<ThemeSettingData["theme_setting"] | null>(
    null
  );
  const [editSystemValue, , editStatus] = useEdit<any, any>(
    SystemValueUrls.edit
  );
  const [activeData, setActiveData] = useState<ThemeSetting | null>(null);
  const { perms } = usePerms();
  const [addModal, setAddModal] = useState<any>(false);
  const [form] = Form.useForm();
  const [keys, setKeys] = useState<string[]>([]);

  async function onFinishForm(_fields: any) {
    const createFields: _Setting = {
      description: "",
      title: _fields.title,
      status: true,
      item: null,
      key: _fields.key,
      value: _fields.value,
      itemtype: _fields.itemtype,
    };
    // setDeneme(JSON.stringify(createFields))
    await onAdd(createFields);
    form.resetFields();
    setAddModal(false);
  }

  async function onAdd(result: _Setting) {
    await data[0].setting.push({ ...result });
    const addData = {
      theme_setting: data,
    };

    await editSystemValue({
      ...systemValue,
      [systemValueKey]: JSON.stringify(addData),
      token: systemValue.token,
      id: systemValue.id,
      langCode: systemValue.langCode,
      menuPosition: systemValue.menuPosition,
    });
    message.success("Dil Sabiti Eklendi.");
    if (language) {
      onGetSystemValue(language.abbreviationName);
    }
  }

  async function onGetSystemValue() {
    if (language) {
      setData(null);
      setActiveData(null);
      const sv: any = await getSystemValue(language.abbreviationName);
      if (sv) {
        try {
          console.log(sv);
          setData(JSON.parse(sv[systemValueKey])["theme_setting"]);
          setActiveData(JSON.parse(sv[systemValueKey])["theme_setting"][0]);
          setKeys(
            JSON.parse(sv[systemValueKey])["theme_setting"][0]["setting"].map(
              (data: { key: any }) => {
                return data.key;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
        // setData(JSONDATA['theme_setting']);
        // setActiveData(JSONDATA['theme_setting'][0]);
      }
    }
  }

  async function onEdit() {
    const editData = {
      theme_setting: data,
    };
    // console.log({
    //   ...systemValue,
    //   [systemValueKey]: JSON.stringify(editData),
    //   token: systemValue.token,
    //   id: systemValue.id,
    //   langCode: systemValue.langCode,
    //   menuPosition: systemValue.menuPosition,
    // });
    await editSystemValue({
      ...systemValue,
      [systemValueKey]: JSON.stringify(editData),
      token: systemValue.token,
      id: systemValue.id,
      langCode: systemValue.langCode,
      menuPosition: systemValue.menuPosition,
    });
    message.success("Ayarlar Güncellendi");
    if (language) {
      onGetSystemValue(language.abbreviationName);
    }
  }

  //Burada modaldaki key değerinin daha önce kullanılıp kullanılmadığını sorguluyorum.
  const checkKey = async (_: any, value: any) => {
    if (!keys.includes(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Bu key daha önce kullanılmış..."));
  };

  useLayoutEffect(() => {
    onGetSystemValue();
  }, [language]);

  if (!data || systemValueStatus !== "fulfilled" || !perms) {
    return <Spin spinning />;
  }

  if (!perms[`${permKey}.List`]) {
    return <Redirect to="/not-perm" />;
  }

  return (
    <CustomPageContainer icon={<SettingOutlined />}>
      <Card>
        {!activeData ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Seçim Yapılmadı</h3>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>{activeData.title}</h2>
              {perms[`${permKey}.UpdateRecord`] && (
                <div>
                  {activeData.title === "Dil Sabitleri" ? (
                    <Button
                      color="green"
                      htmlType="submit"
                      type="primary"
                      onClick={() => setAddModal(true)}
                      loading={editStatus === "pending"}
                    >
                      Ekle
                    </Button>
                  ) : null}{" "}
                  <Button
                    color="green"
                    htmlType="submit"
                    type="primary"
                    onClick={onEdit}
                    loading={editStatus === "pending"}
                  >
                    Kaydet
                  </Button>
                </div>
              )}
            </div>
            <FormGenerator
              settings={activeData.setting}
              setData={setData}
              data={data}
              activeData={activeData}
              save={onEdit}
              perms={{
                list: perms[`${permKey}.List`],
                create: perms[`${permKey}.NewRecord`],
                update: perms[`${permKey}.UpdateRecord`],
                delete: perms[`${permKey}.DeleteRecord`],
              }}
            />
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {perms[`${permKey}.UpdateRecord`] && (
            <Button
              color="green"
              htmlType="submit"
              type="primary"
              onClick={onEdit}
              loading={editStatus === "pending"}
            >
              Kaydet
            </Button>
          )}
        </div>
      </Card>

      <Modal
        visible={addModal}
        onCancel={() => setAddModal(false)}
        onOk={() => {
          form.submit();
        }}
      >
        <Card title="Dil Sabiti Ekle" style={{ marginTop: 20 }}>
          <Form layout="vertical" onFinish={onFinishForm} form={form}>
            <Form.Item
              label="Başlık"
              name="title"
              required
              requiredMark="optional"
              rules={[
                { required: true, message: "Lütfen zorunlu alanı doldurunuz!" },
              ]}
            >
              <Input placeholder="Başlık Giriniz..." />
            </Form.Item>
            <Form.Item
              label="Anahtar Sözcük"
              name="key"
              required
              requiredMark="optional"
              rules={[
                { required: true, message: "Lütfen zorunlu alanı doldurunuz!" },
                { validator: checkKey },
              ]}
            >
              <Input
                placeholder="Anahtar sözcük Giriniz..."
                onChange={(e) => {
                  form.setFieldsValue({ key: slugify(e.target.value) });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Değer"
              name="value"
              required
              requiredMark="optional"
              rules={[
                { required: true, message: "Lütfen zorunlu alanı doldurunuz!" },
              ]}
            >
              <Input placeholder="Değer Giriniz..." />
            </Form.Item>
            <Form.Item
              label="Tür"
              name="itemtype"
              required
              requiredMark="optional"
              rules={[
                { required: true, message: "Lütfen zorunlu alanı doldurunuz!" },
              ]}
            >
              <Select
                allowClear
                optionFilterProp="children"
                placeholder="Seçiniz"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                showSearch
              >
                <Select.Option value="textbox">TextBox</Select.Option>
                <Select.Option value="text_editor">Text Editör</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </CustomPageContainer>
  );
}

export default Setting;
