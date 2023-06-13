import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, Modal, Tree} from 'antd';
import {GroupListItem, OperationClaim} from '@/pages/GroupList/data';
import {queryOperationClaim} from '@/pages/GroupList/service';
import {permissionNames} from '@/constants/appConst';

export interface FormValueType extends Partial<GroupListItem> {
  name?: string;
  operationClaimIds?: [];
}

interface CreateFormProps {
  createModalVisible: boolean;
  onSubmit: (values: FormValueType, selectedOperationClaimIds: number[]) => void;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {createModalVisible, onCancel: handleCreateModalVisible, onSubmit: handleCreate} = props;

  const [form] = Form.useForm();
  const [formVals, setFormVals] = useState<FormValueType>({
    name: '',
    operationClaimIds: [],
  });

  const [operationClaims, setOperationClaims] = useState([]);
  const enumPermissions: any[] = Object.keys(permissionNames).map((key) => permissionNames[key]);
  const [selectedOperationClaimIds, setSelectedOperationClaimIds] = useState([]);

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
    form.resetFields();
  }, [props.createModalVisible]);

  useEffect(() => {
    (async () => {
      const data = await queryOperationClaim();
      setOperationClaims(data);
    })();
  }, [1]);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({...formVals, ...fieldsValue});
    handleCreate({...formVals, ...fieldsValue}, selectedOperationClaimIds);
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

  function onCheckChange(checkedValues: any) {
    const x = checkedValues.filter((v: any) => typeof v === 'number');
    setSelectedOperationClaimIds(x);
  }

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="name"
          label="Grup Başlığı"
          rules={[{required: true, message: 'Lütfen Grup Başlığı Giriniz！'}]}
        >
          <Input/>
        </FormItem>
        <Card style={{maxHeight: 300, overflowY: "scroll"}}>
          <FormItem name="operationClaimIds" label="İzinler" valuePropName="checked">
            <Tree
              treeData={operationTree}
              checkable
              onCheck={onCheckChange}
              selectedKeys={formVals.operationClaimIds}
              defaultExpandAll
            />
          </FormItem>
        </Card>
      </>
    );
  };
  return (
    <Modal
      destroyOnClose
      width={1300}
      title="Yeni Kullanıcı Grubu"
      visible={createModalVisible}
      onCancel={() => handleCreateModalVisible(false)}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          operationClaimIds: formVals.operationClaimIds,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
