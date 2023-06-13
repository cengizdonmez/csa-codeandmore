import React, { ReactElement, useState, useLayoutEffect } from 'react';
import CustomPageContainer from '../../components/CustomPageContainer';
import { Card, Button, message, Spin } from 'antd';
import { useListAll, useEdit, useGetOne } from '../CategoryPages/services';
import { SystemValueUrls } from '../SettingsPage/service';
import { ThemeSetting, ThemeSettingData } from '../SettingsPage/models';
import { SettingOutlined } from '@ant-design/icons';
import FormGenerator from '../SettingsPage/components/FormGenerator';
import useLanguage from '../../hoxmodels/language';
import usePerms from '../../hoxmodels/perms';

interface Props {}

function SliderSetting({}: Props): ReactElement {
  const { language } = useLanguage();
  const [getSystemValue, systemValue, systemValueStatus] = useGetOne(
    '/SystemValue/getbylangcode?langCode=',
  );
  const [data, setData] = useState<ThemeSettingData['theme_setting'] | null>(null);
  const [editSystemValue, , editStatus] = useEdit<any, any>(SystemValueUrls.edit);
  const [activeData, setActiveData] = useState<ThemeSetting | null>(null);
  const { perms } = usePerms();

  async function onGetSystemValue() {
    if (language) {
      setData(null);
      setActiveData(null);
      const sv = await getSystemValue(language.abbreviationName);
      if (sv) {
        setData(JSON.parse(sv.sliderSettings)['theme_setting']);
        setActiveData(JSON.parse(sv.sliderSettings)['theme_setting'][0]);
      }
    }
  }

  async function onEdit() {
    const editData = {
      theme_setting: data,
    };
    await editSystemValue({
      ...systemValue,
      sliderSettings: JSON.stringify(editData),
      token: systemValue.token,
      id: systemValue.id,
      langCode: systemValue.langCode,
      menuPosition: systemValue.menuPosition,
    });
    message.success('Slider Ayarları Güncellendi');
    if (language) {
      onGetSystemValue(language.abbreviationName);
    }
  }

  useLayoutEffect(() => {
    onGetSystemValue();
  }, [language]);

  if (!data || systemValueStatus !== 'fulfilled' || !perms) {
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
                list: perms['slider.List'],
                create: perms['slider.NewRecord'],
                update: perms['slider.UpdateRecord'],
                delete: perms['slider.DeleteRecord'],
              }}
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default SliderSetting;
