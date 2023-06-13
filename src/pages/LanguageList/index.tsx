import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Divider, message, Popconfirm, Spin, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './CreateForm';
import UpdateForm, { FormValueType } from './UpdateForm';
import { LanguageListItem } from './data.d';
import { queryLanguage } from './service';
import { Dispatch, LanguageStateType } from '@@/plugin-dva/connect';
import { connect, Redirect, useIntl } from 'umi';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import capitalizePropNames from '@/utils/capitalizePropNames';
import { messages } from '@/constants/appConst';
import { TranslationOutlined } from '@ant-design/icons';
import CustomPageContainer from '../../components/CustomPageContainer';
import usePerms from '../../hoxmodels/perms';

interface LanguageListProps {
  languageList: LanguageStateType;
  dispatch: Dispatch;
}

const LanguageList: React.FC<LanguageListProps> = (props) => {
  const { perms } = usePerms();
  const { locale } = useIntl();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const { dispatch } = props;
  const handleAdd = (fields: LanguageListItem, onFinish?: (b: boolean) => any) => {
    const hide = message.loading(messages.createLoading);
    dispatch({
      type: 'languageList/submit',
      payload: { ...capitalizePropNames(fields) },
      onSuccess: () => {
        hide();
        message.success(messages.createSuccess);
        if (onFinish) {
          onFinish(true);
        }
      },
      onFailure: (error) => {
        hide();
        message.error('Ekleme Hatalı.'); // TODO: Mesaj yazırılacak
        if (onFinish) {
          onFinish(false);
        }
      },
    });
  };

  const handleUpdate = (fields: FormValueType, onFinish?: (b: boolean) => any) => {
    const hide = message.loading(messages.updateLoading);
    dispatch({
      type: 'languageList/submit',
      payload: { ...fields },
      onSuccess: () => {
        hide();
        message.success(messages.updateSuccess);
        if (onFinish) {
          onFinish(true);
        }
      },
      onFailure: (error) => {
        hide();
        message.error(messages.updateError);
        if (onFinish) {
          onFinish(false);
        }
      },
    });
    return true;
  };

  const handleRemove = async (langToken: string) => {
    const hide = message.loading(messages.deleteLoading);
    try {
      dispatch({
        type: 'languageList/submit',
        payload: {
          token: langToken,
        },
      });
      hide();
      message.success(messages.deleteSuccess);
      return true;
    } catch (error) {
      hide();
      message.error(messages.deleteError);
      return false;
    }
  };

  const handleSwitchChange = (record: LanguageListItem) => {
    record.status = !record.status;
    handleUpdate(record, (success) => {
      if (success) {
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms['dil-ayarlari.NewRecord'];
  const isPermDelete = perms['dil-ayarlari.DeleteRecord'] ;
  const isPermUpdate = perms['dil-ayarlari.UpdateRecord'];
  const isPermList = perms['dil-ayarlari.List'];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  const columns: ProColumns<LanguageListItem>[] = [
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
      render: (val: any) => <Text>{val.id}</Text>,
    },
    {
      title: 'Token',
      key: 'token',
      dataIndex: 'token',
      hideInSearch: true,
      hideInTable: true,
      render: (val: any) => <Text>{val.token}</Text>,
    },
    {
      title: 'Dillere Ait Bayraklar',
      key: 'flagPath',
      dataIndex: 'flagPath',
      render: (val) => <img src={`${val}`} alt="flag" />,
      hideInForm: true,
      filters: true,
      hideInSearch: true,
    },
    {
      title: 'Dil Kodu',
      key: 'abbreviationName',
      dataIndex: 'abbreviationName',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: 'Dil Adı',
      key: 'name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Aktif / Pasif',
      key: 'status',
      dataIndex: 'status',
      render: (e: any, record) => {
        return record.abbreviationName !== 'TR' && isPermUpdate ? (
          <Switch onChange={() => handleSwitchChange(record)} defaultChecked={e} />
        ) : null;
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('disabled');
        return <Switch checked={status} />;
      },
    },
    {
      title: 'İşlemler',
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {isPermUpdate && (
            <Button
              style={{ color: '#00A8A2' }}
              onClick={() => {
                setStepFormValues(record);
                handleUpdateModalVisible(true);
              }}
            >
              Güncelle
            </Button>
          )}
          <Divider type="vertical" />
          {record.abbreviationName !== 'TR' && isPermDelete && (
            <Popconfirm
              title={messages.deleteConfirm}
              onConfirm={() => {
                const success = handleRemove(record.token);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
                return success;
              }}
              okText="Evet"
              cancelText="Hayır"
            >
              <a>Sil</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return (
    <CustomPageContainer icon={<TranslationOutlined />} breadcrumbShow>
     <ConfigProvider locale={{ locale }}>
        <ProTable<LanguageListItem>
          options={{ density: false }}
          headerTitle="Dil Listesi"
          actionRef={actionRef}
          rowKey="key"
          toolBarRender={
            isPermCreate
              ? () => [
                  <Button
                    type="primary"
                    onClick={() => handleModalVisible(true)}
                    style={{ backgroundColor: '#00a8a2', borderColor: '#00a8a2' }}
                  >
                    <PlusOutlined /> Yeni Dil Ekle
                  </Button>,
                ]
              : undefined
          }
          request={(params, filter) => {
            const { pageSize, current, _timestamp, ...rest } = params;
            return queryLanguage({
              PageSize: pageSize,
              PageNumber: current || 1,
              filter: { ...filter, ...rest },
            });
          }}
          pagination={{
            defaultCurrent: 1,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
          columns={columns}
        />
        <CreateForm
          onCancel={() => {
            handleModalVisible(false);
            setStepFormValues({});
          }}
          createModalVisible={createModalVisible}
          onSubmit={(value) => {
            handleAdd(value, (success: boolean) => {
              if (success) {
                handleModalVisible(false);
                setStepFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            });
          }}
        />
        {updateModalVisible && (
          <UpdateForm
            onSubmit={(value) => {
              handleUpdate(value, (success: boolean) => {
                if (success) {
                  handleUpdateModalVisible(false);
                  setStepFormValues({});
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              });
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setStepFormValues({});
            }}
            updateModalVisible
            values={stepFormValues}
          />
        )}
      </ConfigProvider>
    </CustomPageContainer>
  );
};

export default connect(({ languageList }: { languageList: LanguageStateType }) => ({
  languageList,
}))(LanguageList);
