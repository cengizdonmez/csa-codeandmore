import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Tree } from 'antd';
import { GroupListItem, OperationClaim } from '../data.d';
import { queryOperationClaim } from '@/pages/GroupList/service';
import { permissionNames } from '@/constants/appConst';

export interface FormValueType extends Partial<GroupListItem> {
  id?: number;
  name?: string;
  operationClaimIds?: number[];
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType, selectedOperationClaimIds: number[]) => void;
  updateModalVisible: boolean;
  values: Partial<FormValueType>;
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;
  const [form] = Form.useForm();
  const [operationClaims, setOperationClaims] = useState([]);
  const [selectedOperationClaimIds, setSelectedOperationClaimIds] = useState([]);
  const enumPermissions: any[] = Object.keys(permissionNames).map((key) => permissionNames[key]);

  const operationTree = enumPermissions.map((value, i) => {
    return {
      title: value,
      key: value,
      children: operationClaims
        .filter((v: OperationClaim) => v.groupId === i + 1)
        .map((op: OperationClaim) => {
          return {
            title: op.name,
            key: op.id,
          };
        }),
    };
  });

  useEffect(() => {
    (async () => {
      const data = await queryOperationClaim();
      setOperationClaims(data);
    })();
  }, [1]);

  useEffect(() => {
    form.resetFields();
  }, [props.values]);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...props.values, ...fieldsValue }, selectedOperationClaimIds);
  };

  useEffect(() => {
    (async () => {
      const data = await queryOperationClaim();
      setOperationClaims(data);
    })();
  }, [1]);

  function onCheckChange(checkedValues: any) {
    const x = checkedValues.filter((v: any) => typeof v === 'number');
    setSelectedOperationClaimIds(x);
  }

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="name"
          label="İsim"
          rules={[{ required: true, message: 'Lütfen isim bilgisi giriniz！' }]}
        >
          <Input />
        </FormItem>
        <Card style={{ maxHeight: 300, overflowY: 'scroll' }}>
        <FormItem name="operationClaimIds" label="İzinler" valuePropName="checkedKeys" trigger="onCheck">
            <Tree treeData={operationTree} checkable onCheck={onCheckChange} defaultExpandAll />
        </FormItem>
        </Card>

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
      width={1200}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="Kullanıcı Grubu Güncelleme"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          id: values.id,
          name: values.name,
          operationClaimIds: values.operationClaims?.map((item) => item.id) ?? [],
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
