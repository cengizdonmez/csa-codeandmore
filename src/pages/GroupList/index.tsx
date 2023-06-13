import { Button, ConfigProvider, Divider, message, Popconfirm, Typography } from 'antd';
import React, {useRef, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons/lib';
import {connect} from 'umi';
import {Dispatch} from '@@/plugin-dva/connect';
import {GroupStateType} from '@/pages/GroupList/model';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {trTRIntl} from '@ant-design/pro-provider';
import {queryGroup} from './service';
import {GroupListItem} from './data.d';
import CreateForm from './components/CreateForm';
import UpdateForm, {FormValueType} from './components/UpdateForm';
import {messages} from "@/constants/appConst";
import {UsergroupAddOutlined  } from '@ant-design/icons';
import CustomPageContainer from '../../components/CustomPageContainer';
import { history, Redirect, useIntl } from 'umi';
const {Text} = Typography;

interface GroupListProps {
  groupList: GroupStateType,
  operationClaimList: GroupStateType,
  dispatch: Dispatch,
}

const GroupList: React.FC<GroupListProps> = (props) => {
  const { locale } = useIntl();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const isPermCreate = true;
  const isPermDelete = true;
  const isPermUpdate = true;
  const isPermList = true;
  const {
    dispatch,
  } = props;

  const handleAdd = async (fields: GroupListItem, selectedOperationClaimIds: number[]) => {
    const hide = message.loading(messages.createLoading);
    try {
      dispatch({
        type: 'groupList/submit',
        payload: {...fields, operationClaimIds: selectedOperationClaimIds},
      });
      hide();
      message.success(messages.createSuccess);
      return true;
    } catch (error) {
      hide();
      message.error(messages.createError);
      return false;
    }
  };

  const handleUpdate = async (fields: FormValueType, selectedOperationClaimIds: number[]) => {
    const hide = message.loading(messages.updateLoading);
    try {
      dispatch({
        type: 'groupList/submit',
        payload: {...fields, operationClaimIds: selectedOperationClaimIds},
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

  const handleRemove = async (token: number) => {
    const hide = message.loading(messages.deleteLoading);
    try {
      dispatch({
        type: 'groupList/submit',
        payload: {
          token: token,
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
  const columns: ProColumns<GroupListItem>[] = [
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'userGroup',
      render: (val: any) => <Text>{val.id}</Text>,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'token',
      key: 'token',
      dataIndex: 'token',
      render: (val: any) => <Text>{val.token}</Text>,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Adı',
      key: 'userGroup',
      dataIndex: 'userGroup',
      render: (val: any) => <Text>{val.name}</Text>,
    }
    ,
    {
      title: isPermDelete && isPermUpdate ? 'İşlemler' : " " ,
      key: 'option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
         {isPermUpdate && (
          <Button style={{color: '#00A8A2'}}
                  onClick={() => {
                    handleUpdateModalVisible(true);
                    const {userGroup, ...rest} = record;
                    setFormValues({
                      ...rest,
                      ...userGroup
                    });
                  }}
          >
            Güncelle
          </Button>
            )}
            {isPermDelete && (
              <>
          <Divider type="vertical"/>
          <Popconfirm
            title={messages.deleteConfirm}
            onConfirm={
              () => {
                const success = handleRemove(record.userGroup.token);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
                return success;
              }
            }
            okText="Evet"
            cancelText="Hayır">
            <a>Sil</a>
          </Popconfirm>
        </>
          )}
          </>
      ),
    },
  ];
  if(!isPermList) {
    return <Redirect to="/"  />
  }


  return (
    <CustomPageContainer icon={<UsergroupAddOutlined />} breadcrumbShow>
      <ConfigProvider
        locale={{ locale }}
      >
        <ProTable<GroupListItem>
          options={{density:false}}
          headerTitle="Kullanıcı Grupları Listesi"
          actionRef={actionRef}
          rowKey="key"
          toolBarRender={() => [
            <Button type="primary" onClick={() => handleModalVisible(true)}
                    style={{backgroundColor: '#00a8a2', borderColor: '#00a8a2'}}>
              <PlusOutlined/> Yeni Kullanıcı Grubu Ekle
            </Button>,
          ]}
          pagination={{defaultPageSize: 100, showSizeChanger: false, hideOnSinglePage: true,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
          request={(params, filter) => {
            const {pageSize, current, _timestamp, ...rest} = params;
            return queryGroup({
              PageSize: pageSize,
              PageNumber: (current || 1),
              filter: {...filter, ...rest},
            });
          }}
          columns={columns}
        />
        {isPermCreate && (
          <CreateForm
          onCancel={() => {
            handleModalVisible(false);
            setFormValues({});
          }}
          createModalVisible={createModalVisible}
          onSubmit={async (value, selectedOperationClaimIds) => {
            const success = await handleAdd(value, selectedOperationClaimIds);
            if (success) {
              handleModalVisible(false);
              setFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />

        )}
        {isPermUpdate && (
          <UpdateForm
          onSubmit={async (value, selectedOperationClaimIds: any) => {
            const success = await handleUpdate(value, selectedOperationClaimIds);
            if (success) {
              handleUpdateModalVisible(false);
              setFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={formValues}
        />

        )}

      </ConfigProvider>
    </CustomPageContainer>
  );
};

export default connect(
  ({
     groupList
   }: {
    groupList: GroupStateType;
  }) => ({
    groupList
  }),
)(GroupList);

