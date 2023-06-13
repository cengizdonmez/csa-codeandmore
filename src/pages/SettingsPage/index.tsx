import React, { ReactElement, useLayoutEffect, useState } from "react";
import CustomPageContainer from "../../components/CustomPageContainer";
import { Row, Col, Card, Button, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { ThemeSettingData, ThemeSetting } from "./models";
import FormGenerator from "./components/FormGenerator";
import { useGetOne, useEdit, useListAll } from "../CategoryPages/services";
import { SystemValueUrls } from "./service";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import useLanguage from "../../hoxmodels/language";
import usePerms from "../../hoxmodels/perms";
import { Redirect, useHistory } from "umi";

// import DATAJSON from './json/yedisubat.json';
import "./index.css";

interface Props {}

const SortableItem = SortableElement(
  ({ value, valIndex, onClickItem, onClickHideButton }) => {
    const { language } = useLanguage();
    const [data, setData] = useState(valIndex);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="sortable-item"
      >
        <div
          style={{
            width: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MenuOutlined />
        </div>
        <Button
          onClick={() => {
            onClickItem(value);
          }}
          style={{ flex: 1, width: "100%", border: 0, textAlign: "left" }}
        >
          {value.title}
        </Button>
        <Button
          onClick={() => {
            onClickHideButton(value, valIndex);
          }}
          style={{ width: 47, textAlign: "center", border: 0 }}
        >
          {value.hidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </Button>
      </div>
    );
  }
);

const SortableList = SortableContainer(
  ({ items, onClickItem, onClickHideButton }) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            valIndex={index}
            value={value}
            {...{ onClickItem, onClickHideButton }}
          />
        ))}
      </div>
    );
  }
);

function SettingsPage({}: Props): ReactElement {
  const { language } = useLanguage();
  const [getSystemValue, systemValue, systemValueStatus] = useGetOne(
    "/SystemValue/getbylangcode?langCode="
  );
  const [data, setData] = useState<ThemeSettingData["theme_setting"] | null>(
    null
  );
  // const [systemValue, setSettingValue] = useState<any>(null);
  const [getSystemValues, systemValues] = useListAll<any>(
    SystemValueUrls.listAll
  );
  const [editSystemValue, , editStatus] = useEdit<any, any>(
    SystemValueUrls.edit
  );
  const [activeData, setActiveData] = useState<ThemeSetting | null>(null);
  const [dummyData, setDummyData] = useState<
    ThemeSettingData["theme_setting"] | null
  >(null);
  const { perms } = usePerms();
  const history = useHistory();

  async function onGetSystemValue() {
    if (language) {
      setData(null);
      setActiveData(null);
      const sv = await getSystemValue(language.abbreviationName);
      if (sv) {
        setData(JSON.parse(sv.themeSettings)["theme_setting"]);
        // setData(DATAJSON['theme_setting']);
      }
    }
  }

  async function onEdit() {
    const editData = {
      theme_setting: data,
    };
    await editSystemValue({
      ...systemValue,
      themeSettings: JSON.stringify(editData),
      token: systemValue.token,
      id: systemValue.id,
      langCode: systemValue.langCode,
      menuPosition: systemValue.menuPosition,
    });
    message.success("Ana Sayfa işlemleri başarıyla kaydedildi!");
    // await onGetSystemValue();
    // const activeItem = localStorage.getItem('activeItem');
    // if (activeItem) {
    //   const parsed = JSON.parse(activeItem);
    //   if (parsed) {
    //     const item = data!.find((item) => item.key === parsed.key);
    //     if (item) {
    //       setActiveData(item);
    //     }
    //   }
    // }
  }

  useLayoutEffect(() => {
    onGetSystemValue();
  }, [language]);

  if (!data || systemValueStatus !== "fulfilled" || !perms) {
    return <div>Yükleniyor</div>;
  }

  if (!perms["ana-sayfa-ayarlari.List"]) {
    return <Redirect to="/" />;
  }

  return (
    <CustomPageContainer icon={<SettingOutlined />}>
      <Card style={{ marginBottom: 5 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Col>
            <h2 style={{ margin: 0, padding: 0 }}>Site Ayarları</h2>
          </Col>
          <Col>
            {perms["ana-sayfa-ayarlari.UpdateRecord"] && (
              <Button
                color="green"
                htmlType="submit"
                type="primary"
                onClick={onEdit}
              >
                Kaydet
              </Button>
            )}
          </Col>
        </Row>
      </Card>
      <Row gutter={12}>
        <Col xs={24} md={6}>
          <Card>
            <h4>Sıralanabilir Alan</h4>
            <SortableList
              items={data.filter((item) => {
                return (
                  item.title !== "Ana Sayfa Üst Bilgi Mesajı" &&
                  item.title !== "E-Bülten Ayarları" &&
                  item.title !== "Sosyal Medya Linkleri"
                );
              })}
              onClickItem={(item) => {
                setActiveData(item);
                localStorage.setItem("activeItem", JSON.stringify(item));
              }}
              onClickHideButton={(item, key) => {
                const index = data.findIndex(
                  (_item) => _item.title === item.title
                );
                let tmpData = [...data];
                tmpData[index].hidden = !tmpData[index].hidden;
                setData(tmpData);
              }}
              onSortEnd={({ oldIndex, newIndex }) => {
                setData((state) => arrayMove(state, oldIndex, newIndex));
              }}
            />
          </Card>
          <Card style={{ marginTop: "1em" }}>
            {data
              .filter(
                (item) =>
                  item.title === "Ana Sayfa Üst Bilgi Mesajı" ||
                  item.title === "E-Bülten Ayarları" ||
                  item.title === "Sosyal Medya Linkleri"
              )
              .map((item) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  className="sortable-item"
                >
                  <Button
                    onClick={() => {
                      setActiveData(item);
                      localStorage.setItem("activeItem", JSON.stringify(item));
                    }}
                    style={{
                      flex: 1,
                      width: "100%",
                      border: 0,
                      textAlign: "left",
                    }}
                  >
                    {item.title}
                  </Button>
                  <Button
                    onClick={() => {
                      const index = data.findIndex(
                        (_item) => _item.title === item.title
                      );
                      let tmpData = [...data];
                      tmpData[index].hidden = !tmpData[index].hidden;
                      setData(tmpData);
                    }}
                    style={{ width: 47, textAlign: "center", border: 0 }}
                  >
                    {item.hidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </Button>
                </div>
              ))}
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card>
            {!activeData ? (
              <h3>Seçim Yapılmadı</h3>
            ) : (
              <>
                <h2>{activeData.title}</h2>
                <FormGenerator
                  settings={activeData.setting}
                  setData={setData}
                  data={data}
                  activeData={activeData}
                  save={onEdit}
                />
              </>
            )}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {perms["ana-sayfa-ayarlari.UpdateRecord"] && (
                <Button
                  color="green"
                  htmlType="submit"
                  type="primary"
                  onClick={onEdit}
                >
                  Kaydet
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </CustomPageContainer>
  );
}

export default SettingsPage;
