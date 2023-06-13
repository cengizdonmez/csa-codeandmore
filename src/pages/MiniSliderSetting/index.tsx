import React, { ReactElement, useState, useLayoutEffect } from 'react';
import CustomPageContainer from '../../components/CustomPageContainer';
import { Row, Col, Card, Button, message, Spin } from 'antd';
import { useListAll, useEdit, useGetOne } from '../CategoryPages/services';
import { SystemValueUrls } from '../SettingsPage/service';
import { ThemeSetting, ThemeSettingData } from '../SettingsPage/models';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import useLanguage from '../../hoxmodels/language';
import usePerms from '../../hoxmodels/perms';

import FormGenerator from '../SettingsPage/components/FormGenerator';

interface Props {}

function MiniSliderSetting({}: Props): ReactElement {
  const { language } = useLanguage();
  const [getSystemValue, systemValue, systemValueStatus] = useGetOne("/SystemValue/getbylangcode?langCode=")
  const [data, setData] = useState<ThemeSettingData['theme_setting'] | null>(null);
  // const [systemValue, setSettingValue] = useState<any>(null);
  const [getSystemValues, systemValues] = useListAll<any>(SystemValueUrls.listAll);
  const [editSystemValue, , editStatus] = useEdit<any, any>(SystemValueUrls.edit);
  const [activeData, setActiveData] = useState<ThemeSetting | null>(null);
  const { perms } = usePerms();

  async function onGetSystemValue() {
    if (language) {
      setData(null);
      setActiveData(null);
      const sv = await getSystemValue(language.abbreviationName);
      if (sv) {
        setData(JSON.parse(sv.miniSliderSettings)['theme_setting']);
      setActiveData(JSON.parse(sv.miniSliderSettings)['theme_setting'][0]);
      }
    }
  }

  async function onEdit() {
    const editData = {
      theme_setting: data,
    };
    await editSystemValue({
      ...systemValue,
      miniSliderSettings: JSON.stringify(editData),
      token: systemValue.token,
      id: systemValue.id,
      langCode: systemValue.langCode,
      menuPosition: systemValue.menuPosition,
    });
    message.success('Mini Slider Ayarları Güncellendi');
    onGetSystemValue();
  }

  useLayoutEffect(() => {
    onGetSystemValue();
  }, [language]);

  if (!data || systemValueStatus !== "fulfilled") {
    return <Spin spinning />;
  }

  return (
    <CustomPageContainer icon={<SettingOutlined />}>
      <Card>
        {!activeData ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Seçim Yapılmadı</h3>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{activeData.title}</h2>
              <Button
                color="green"
                htmlType="submit"
                type="primary"
                onClick={onEdit}
                loading={editStatus === 'pending'}
              >
                Kaydet
              </Button>
            </div>
            <FormGenerator
              settings={activeData.setting}
              setData={setData}
              data={data}
              activeData={activeData}
              save={onEdit}
              perms={{
                list: perms['mini-slider.List'],
                create: perms['mini-slider.NewRecord'],
                update: perms['mini-slider.UpdateRecord'],
                delete: perms['mini-slider.DeleteRecord'],
              }}
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button
                color="green"
                htmlType="submit"
                type="primary"
                onClick={onEdit}
                loading={editStatus === 'pending'}
              >
                Kaydet
              </Button>
            </div>
      </Card>
    </CustomPageContainer>
  );
}

export default MiniSliderSetting;
