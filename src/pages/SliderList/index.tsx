import { Button, Divider, message, Popconfirm, Switch, ConfigProvider } from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {PlusOutlined} from '@ant-design/icons/lib';
import { connect, useIntl } from 'umi';
import {Dispatch} from '@@/plugin-dva/connect';
import {SliderStateType} from '@/pages/SliderList/model';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import {trTRIntl} from '@ant-design/pro-provider';
import {querySlider} from './service';
import {SliderListItem} from './data.d';
import CreateForm from './components/CreateForm';
import UpdateForm, {FormValueType} from './components/UpdateForm';
import InfoModal from './components/InfoModal';
import DragSortingTable from '@/components/DraggableGrid/DraggableGrid';
import {queryAllLanguage} from '@/pages/LanguageList/service';
import CustomPageContainer from '../../components/CustomPageContainer';

interface SliderListProps {
  sliderList: SliderStateType,
  dispatch: Dispatch,
}

const SliderList: React.FC<SliderListProps> = (props) => {
  const { locale } = useIntl();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [infoModalVisible, handleInfoModalVisible] = useState<boolean>(false);

  const [formValues, setFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const {
    sliderList,
    dispatch,
  } = props;

  const [languageList, setLanguageList] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await queryAllLanguage();
      setLanguageList(data);
    })();
  }, [1]);

  const handleAdd = async (fields: SliderListItem) => {
    const hide = message.loading('Ekleniyor');
    try {
      dispatch({
        type: 'sliderList/submit',
        payload: { ...fields},
      });
      hide();
      message.success('Başarılı');
      return true;
    } catch (error) {
      hide();
      message.error('Hata！');
      return false;
    }
  };

  const handleUpdate = async (fields: FormValueType, file?: any) => {
    const hide = message.loading('Güncelleniyor');
    try {
      if (file)
        dispatch({
          type: 'sliderList/submit',
          payload: { ...fields, icon: file },
        });
      else
        dispatch({
          type: 'sliderList/submit',
          payload: { ...fields },
        });
      hide();
      message.success('Güncelleme Başarılı!\n');
      return true;
    } catch (error) {
      hide();
      message.error('Güncelleme başarısız, lütfen tekrar deneyin\n！');
      return false;
    }
  };
  const handleSwitchChange = async (record: SliderListItem) => {
    record.status = !record.status;
    const success = await handleUpdate(record);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };
  const handleRemove = async (key: number) => {
    const hide = message.loading('siliniyor');
    try {
      dispatch({
        type: 'sliderList/submit',
        payload: {
          key,
        },
      });
      hide();
      message.success('başarıyla silindi, yenileniyor');
      return true;
    } catch (error) {
      hide();
      message.error('Silme başarısız, lütfen tekrar deneyin');
      return false;
    }
  };
  const columns: ProColumns<SliderListItem>[] = [
      {
        title: 'Mini Slider Başlığı',
        dataIndex: 'title',
      },
      {
        title: 'İkon',
        dataIndex: 'iconPath',
        render: (val) => <img src={`${val || 'https://www.codeandmore.com.tr//assets/images/logo.jpg'}`} alt="slider" />,
        hideInForm: true,
        filters: true,
        hideInSearch: true,
      },
      {
        title: 'Aktif / Pasif',
        dataIndex: 'status',
        render: (e: any, record) => (
          <Switch onChange={() => handleSwitchChange(record)} defaultChecked={e} />
        ),
        renderFormItem: (item, { defaultRender, ...rest }, form) => {
          const status = form.getFieldValue('disabled');
          return <Switch checked={status} />;
        },
      },
      {
        title: 'Sıralama',
        dataIndex: 'rowNumber',
        valueType: 'digit',
        sortOrder: 'ascend',
        sorter: (a, b) => a.rowNumber - b.rowNumber,
      }
      ,
      {
        title: 'İşlemler',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => (
          <>
            <Button type="primary"
                    onClick={() => {
                      handleInfoModalVisible(true);
                    }}
            >
              Bilgi
            </Button>
            <Divider type="vertical" />
            <Button style={{ color: '#00A8A2' }}
                    onClick={() => {
                      handleUpdateModalVisible(true);
                      setFormValues(record);
                    }}
            >
              Güncelle
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Silmek istediğinize emin misiniz?"
              onConfirm={() => {
                const success = handleRemove(record.id!);
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
          </>
        ),
      },
    ]
  ;


  return (
    <CustomPageContainer icon={null} breadcrumbShow>
      <ConfigProvider
      locale={{ locale }}
      >
        <DragSortingTable<SliderListItem>
          headerTitle="Slider Listesi"
          actionRef={actionRef}
          rowKey="key"
          toolBarRender={() => [
            <Button type="primary" onClick={() => handleModalVisible(true)}
                    style={{ backgroundColor: '#00a8a2', borderColor: '#00a8a2' }}>
              <PlusOutlined /> Yeni Slider Ekle
            </Button>,
          ]}
          pagination={{ defaultPageSize: 100, showSizeChanger: false, hideOnSinglePage: true }}
          request={(params, filter) => {
            const { pageSize, current, _timestamp, ...rest } = params;
            return querySlider({
              PageSize: pageSize,
              PageNumber: (current || 1),
              filter: { ...filter, ...rest },
            });
          }}
          updateItem={async (item: SliderListItem) => {
          }}
          columns={columns}
        />
        <CreateForm
          onCancel={() => {
            handleModalVisible(false);
            setFormValues({});
          }}
          createModalVisible={createModalVisible}
          languageList={languageList}
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              setFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
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
          languageList={languageList}
        />
        <InfoModal
          onCancel={() => {
            handleInfoModalVisible(false);
          }}
          infoModalVisible={infoModalVisible}
        />
      </ConfigProvider>
    </CustomPageContainer>
  );
};

export default connect(
  ({
     sliderList,
   }: {
    sliderList: SliderStateType;
  }) => ({
    sliderList,
  }),
)(SliderList);

