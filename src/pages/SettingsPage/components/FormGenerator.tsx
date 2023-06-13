import React, {
  FC,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Slider,
  Spin,
  Switch,
} from "antd";
import FileManager from "../../../components/FileManager";
import { Setting, itemType, ThemeSetting, ThemeSettingData } from "../models";
import {
  useListAll,
  CategoryUrl,
  useListByLang,
} from "../../CategoryPages/services";

import TreeAndSort from "@/components/TreeAndSort";
import Tinymce, { Editor } from "@tinymce/tinymce-react";
import ListGenerator from "./List";
import useLanguage from "../../../hoxmodels/language";
import { Redirect } from "umi";
import { Space, Typography } from "antd";

interface Props {
  settings: Setting[];
  data: ThemeSettingData["theme_setting"];
  setData: any;
  activeData: ThemeSetting;
  save: () => void;
}

function FormGenerator({
  settings,
  data,
  setData,
  activeData,
  save,
  perms,
}: Props): ReactElement {
  if (perms && !perms.list) {
    return <Redirect to="/not-perm" />;
  }
  function generateInput(itemType: itemType, item: Setting) {
    switch (itemType) {
      case "textbox":
        return (
          <Row justify="space-around">
            <Col span={activeData.title === "Dil Sabitleri" ? 22 : 24}>
              <Input
                type="text"
                //value={item.value}
                defaultValue={item.value}
                onChange={({ currentTarget: { value } }) => {
                  changeData(item.key, value ? value : null);
                }}
              />
              <Typography.Text code>Key: {item.key}</Typography.Text>
            </Col>
            {activeData.title === "Dil Sabitleri" ? (
              <Col span={1}>
                <Button
                  onClick={() => {
                    Delete(item);
                  }}
                >
                  Sil
                </Button>
              </Col>
            ) : null}
          </Row>
        );
      case "textarea":
        return (
          <>
            <Input.TextArea
              defaultValue={item.value}
              value={item.value}
              onChange={({ currentTarget: { value } }) => {
                changeData(item.key, !!value ? value : "");
              }}
            />
            <Typography.Text code>Key: {item.key}</Typography.Text>
          </>
        );
      case "text_editor":
        return (
          !!item.value && (
            <Row justify="space-around">
              <Col span={activeData.title === "Dil Sabitleri" ? 22 : 24}>
                <Editor
                  initialValue={item.value}
                  onEditorChange={(value) => {
                    changeData(item.key, !!value ? value : "");
                  }}
                  init={{
                    menubar: false,
                  }}
                />
                <Typography.Text code>Key: {item.key}</Typography.Text>
              </Col>
              <Col span={1}>
                {activeData.title === "Dil Sabitleri" ? (
                  <Button
                    onClick={() => {
                      Delete(item);
                    }}
                  >
                    Sil
                  </Button>
                ) : null}
              </Col>
            </Row>
          )
        );
      case "numeric":
        return (
          <Input
            type="number"
            defaultValue={item.value}
            value={item.value}
            onChange={({ currentTarget: { value } }) => {
              changeData(item.key, !!value ? value : null);
            }}
            style={{}}
          />
        );
      case "image":
        return (
          <FileManager
            defaultValue={item.value || ""}
            onChange={(_v) => {
              changeData(item.key, !!_v && !!_v.path ? _v.path : null);
            }}
          />
        );
      case "multiselect_kategoriler":
        return (
          <Multiselect
            value={item.value}
            onChange={(_v) => {
              changeData(item.key, _v);
            }}
            url={CategoryUrl.listByLang}
          />
        );
      case "select_kategori":
        return (
          <Selectbox
            item={item}
            value={item.value}
            onChange={(_v) => {
              changeData(item.key, _v);
            }}
            url={CategoryUrl.listByLang}
          />
        );
      case "json_form":
        return (
          <ListGenerator
            save={save}
            itemList={item.itemlist!}
            datavalue={item.value !== "" ? JSON.parse(item.value) : []}
            onChange={(_v) => {
              changeData(item.key, JSON.stringify(_v));
            }}
            perms={perms}
          />
        );
      case "range-slider":
        return (
          <Slider
            defaultValue={item.value}
            onChange={(_v) => {
              changeData(item.key, !!_v ? _v : 0);
            }}
          />
        );
      case "checkbox":
        return (
          <Switch
            defaultChecked={item.value}
            onChange={(_v) => {
              changeData(item.key, !!_v);
            }}
          />
        );
      default:
        return <small>Yapılmadı Daha</small>;
    }
  }
  function changeData(key: any, newValue: any) {
    let tmpData = [...data];
    tmpData.some((item) => {
      if (item.key === activeData.key) {
        item.setting.some((_setting) => {
          if (_setting.key === key) {
            _setting.value = newValue;
            return;
          }
          return;
        });
        return;
      }

      return;
    });
    setData(tmpData);
  }

  async function Delete(item: Setting) {
    let tmpData = [...data];
    tmpData.map((data) => {
      data.setting.map((itm, index) => {
        if (itm.key == item.key) {
          data.setting.splice(index, 1);
        }
      });
    });
    await setData(tmpData);
    save();
  }

  useEffect(() => {}, [data, settings]);

  return (
    <div>
      <Form layout="vertical">
        {settings.map((setting, index) => (
          <Form.Item
            name={setting.key}
            key={index}
            label={setting.title}
            help={<small>{setting.description}</small>}
          >
            {generateInput(setting.itemtype, setting)}
          </Form.Item>
        ))}
      </Form>
    </div>
  );
}

export default FormGenerator;

export function Multiselect({ value, onChange, url, ...props }) {
  const [getList, list, status] = useListByLang<any>(url);
  const { language } = useLanguage();
  useLayoutEffect(() => {
    if (language) {
      getList(language.abbreviationName);
    }
  }, []);

  return (
    <Select
      allowClear
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      showSearch
      mode="multiple"
      onChange={(data) => onChange(!!data ? data : [])}
      value={Array.isArray(props.item.value) ? props.item.value : []}
    >
      {list.map((item, key) => (
        <Select.Option value={item.id}>{item.name || item.title}</Select.Option>
      ))}
    </Select>
  );
}

export function Selectbox({ value, onChange, url, ...props }) {
  const [getList, list, status] = useListByLang<any>(url);
  const { language } = useLanguage();
  useLayoutEffect(() => {
    if (language) {
      getList(language.abbreviationName);
    }
  }, []);
  return (
    <Select
      allowClear
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      showSearch
      onChange={(data) => onChange(!!data ? data : null)}
      value={
        !isNaN(parseInt(props.item.value)) && !!props.item.value
          ? parseInt(props.item.value)
          : null
      }
    >
      {list.map((item, key) => (
        <Select.Option value={item.id}>{item.name || item.title}</Select.Option>
      ))}
    </Select>
  );
}

function TreeSort({ defaultValue, onChange, url }) {
  const [getList, list, status] = useListByLang<any>(url);
  const { language } = useLanguage();
  const [_list, setList] = useState(null);
  useLayoutEffect(() => {
    if (language) {
      getList(language.abbreviationName).then((res) => {
        setList(res);
      });
    }
  }, []);
  if (!list || status !== "fulfilled" || _list === null) {
    return <Spin />;
  }
  const _listRow = defaultValue
    ? defaultValue.map((doctorId) => {
        const _doctor = _list.find((_d) => _d.id === doctorId);
        return _doctor;
      })
    : [];
  return (
    <TreeAndSort
      loading={status === "pending"}
      list={list}
      defaultValue={_listRow.filter((_item) => !!_item)}
      onChange={(data) => {
        onChange(data.map((item) => item.id));
      }}
    />
  );
}
