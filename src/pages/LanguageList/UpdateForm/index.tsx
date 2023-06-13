import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Col, Form, Input, Modal, Row, Switch } from 'antd';
import country from 'country-list-js';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons/lib';
import { LanguageListItem } from '../data.d';

export interface FormValueType extends Partial<LanguageListItem> {
  id?: number;
  token?: string;
  name?: string;
  abbreviationName?: string;
  flagPath?: string;
  status?: boolean;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<LanguageListItem>;
}

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  // useEffect(() => {
  //   form.resetFields();
  // }, [props.values]);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...props.values, ...fieldsValue });
  };
  const onCountryChange = async (changedValue: any) => {
    const abbreviation = await country.findByName(changedValue).code.iso2;
    form.setFieldsValue({ abbreviationName: abbreviation });
    form.setFieldsValue({ flagPath: `https://www.countryflags.io/${abbreviation}/flat/64.png` });
  };
  const renderContent = () => {
    const countryNames = country.names();
    return (
      <>
        <FormItem
          name="name"
          label="İsim"
          rules={[
            { required: true, message: 'Lütfen en az 3 karakterlik bir isim girin！', min: 3 },
          ]}
          validateStatus="success"
          hasFeedback
        >
          <AutoComplete
            dataSource={countryNames}
            onSelect={onCountryChange}
            filterOption={(inputValue, option: any) =>
              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </FormItem>
        <FormItem
          name="abbreviationName"
          label="Ülke Kodu"
          validateStatus="success"
          hasFeedback
          rules={[{ required: true, message: 'Lütfen en az 2 karakterlik bir isim girin', min: 2 }]}
        >
          <Input disabled placeholder="Lütfen en az 2 karakter girin" />
        </FormItem>
        <FormItem
          name="flagPath"
          label="Bayrak"
          validateStatus="success"
          hasFeedback
          rules={[{ required: true, message: 'Lütfen en az 5 karakterlik bir isim girin', min: 5 }]}
        >
          <Input disabled inputMode="text" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>İptal</Button>
        <Button type="primary" onClick={() => handleNext()}>
          Güncelle
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={2000}
      style={{ top: 20 }}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="Dil Güncelleme"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          token: values.token,
          id: values.id,
          name: values.name,
          abbreviationName: values.abbreviationName,
          flagPath: values.flagPath,
          status: values.status,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
