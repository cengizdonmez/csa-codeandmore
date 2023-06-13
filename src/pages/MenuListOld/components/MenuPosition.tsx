import React, { useLayoutEffect } from 'react';
import { Form, message, Select } from 'antd';
import { SaveButton } from '@/components/SaveButton/SaveButton';
import { messages } from '@/constants/appConst';
import { Dispatch } from '@@/plugin-dva/connect';

type Props = {
  menuList?: any;
  dispatch: Dispatch;
};
export const MenuPosition = (props: Props) => {
  const { menuList, dispatch } = props;
  const handleUpdate = async (fields: any) => {
    const hide = message.loading(messages.updateLoading);
    try {
      dispatch({
        type: 'menuList/submitSetting',
        payload: fields,
      });
      hide();
      message.success(messages.updateSuccess);
      return true;
    } catch (error) {
      hide();
      message.error(messages.updateError);
      return false;
    }
  };
  const onFinish = async (values: any) => {
    const copyJson = JSON.parse(JSON.stringify(menuList.setting.jsonContent));
    copyJson.menuposition.menupositionid = values;

    const success = await handleUpdate({
      id: menuList.setting.id,
      name: menuList.setting.name,
      jsonContent: copyJson,
    });
  };

  useLayoutEffect(() => {
    dispatch({ type: 'menuList/fetchSettingByName', payload: { name: 'menuposition' } });
    dispatch({ type: 'menuList/fetchMenu' });
  }, []);

  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 15 }}
        layout="horizontal"
        onFinish={onFinish}
      >
        {menuList.setting?.jsonContent?.menuposition?.relatives?.map((value) => {
          return (
            <Form.Item
              label={value.name}
              key={value.value}
              name={value.value}
              initialValue={
                menuList.setting?.jsonContent?.menuposition?.menupositionid[value.value!]
              }
            >
              <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 placeholder="Seç">
                {menuList.menuList?.map((item) => (
                  <Select.Option value={item.id!} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          );
        })}
        <Form.Item>
          <SaveButton />
        </Form.Item>
      </Form>
    </div>
  );
};
