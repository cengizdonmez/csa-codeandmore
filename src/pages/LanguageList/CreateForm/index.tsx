import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Form, Input, Modal } from 'antd';
import country from 'country-list-js';
import { LanguageListItem } from '@/pages/LanguageList/data';

export interface FormValueType extends Partial<LanguageListItem> {
  name?: string;
  abbreviationName?: string;
  flagPath?: string;
  status?: boolean;
}

interface CreateFormProps {
  createModalVisible: boolean;
  onSubmit: (values: FormValueType) => void;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    name: '',
    abbreviationName: '',
    flagPath: '',
    status: false,
  });
  const { createModalVisible, onCancel: handleCreateModalVisible, onSubmit: handleCreate } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (props.createModalVisible) {
      form.resetFields();
    }
  }, [props.createModalVisible]);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleCreate({ ...formVals, ...fieldsValue });
  };
  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleCreateModalVisible(false)}>İptal</Button>
        <Button type="primary" onClick={() => handleNext()}>
          Kaydet
        </Button>
      </>
    );
  };
  const onCountryChange = async (changedValue: any) => {
    const abbreviation = await country.findByName(changedValue).code.iso2;
    form.setFieldsValue({ abbreviationName: abbreviation === "US" ? "EN" : abbreviation });
    form.setFieldsValue({ flagPath: `https://www.countryflags.io/${abbreviation}/flat/64.png` });
  };
  const countryNames = country.names();

  const renderContent = () => {
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
          <Input
            disabled
            placeholder="Lütfen en az 2 karakter girin"
          />
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
  return (
    <Modal
      destroyOnClose
      width={1300}
      title="Yeni Bir Dil Ekle"
      visible={createModalVisible}
      onCancel={() => handleCreateModalVisible(false)}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: '',
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
