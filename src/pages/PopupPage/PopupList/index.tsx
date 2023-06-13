import React, { ReactElement, useLayoutEffect, useRef, useState } from 'react';
import { Input, Button, Divider, Popconfirm, message, Modal, Breadcrumb, Spin, ConfigProvider } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { trTRIntl } from '@ant-design/pro-provider';
import { useDelete, useListAll } from '../../CategoryPages/services';
import { TeamOutlined } from '@ant-design/icons';
import CustomPageContainer from '../../../components/CustomPageContainer';
import { PopupListItem } from '../data';
import { popupUrls } from '../services';
import { messages } from '@/constants/appConst';
import PopupEdit, { PopupEditRef } from '../PopupEdit';
import usePerms from '../../../hoxmodels/perms';
import { Redirect, useIntl } from 'umi';
interface Props {}
interface TableItem {
  id?: number;
  title?: string;
  token?: string;
}
function PopupList({}: Props): ReactElement {
  const { perms } = usePerms();
  const { locale } = useIntl();

  const [getPopupList, popupList, popupStat] = useListAll<PopupListItem>(popupUrls.list);
  const [keywords, setKeywords] = useState('');
  const [editItem, setEditItem] = useState<string | number | null>(null);
  const [deletePopup, , delPopupStat] = useDelete(popupUrls.delete);
  const editRef = useRef<PopupEditRef>(null);

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms['popup-islemleri.NewRecord'];
  const isPermDelete = perms['popup-islemleri.DeleteRecord'];
  const isPermUpdate = perms['popup-islemleri.UpdateRecord'];
  const isPermList = perms['popup-islemleri.List'];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  async function beforeRender() {
    await getPopupList();
  }

  useLayoutEffect(() => {
    beforeRender();
  }, []);

  const columns: ProColumns<TableItem>[] = [
    {
      title: 'Başlık',
      dataIndex: 'title',
    },
    {
      title: 'İşlemler',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>
        record.token ? (
          <>
            {' '}
            {isPermUpdate && (
              <Button
                style={{ color: '#00A8A2' }}
                onClick={() => {
                  setEditItem(record.token!);
                }}
              >
                Güncelle
              </Button>
            )}
            {isPermDelete && (
              <>
                <Divider type="vertical" />
                <Popconfirm
                  title={messages.deleteConfirm}
                  onConfirm={async () => {
                    const success = await deletePopup(record.token!);
                    if (success) {
                      getPopupList();
                    }
                    return success;
                  }}
                  okText="Evet"
                  cancelText="Hayır"
                >
                  <a>Sil</a>
                </Popconfirm>
              </>
            )}{' '}
          </>
        ) : null,
    },
  ];
  return (
    <CustomPageContainer icon={<TeamOutlined />} newPath={isPermCreate && "/main/popupCreate"}>
     <ConfigProvider locale={{ locale }}>
        <ProTable<TableItem, { keywords: string }>
          options={{ density: false }}
          size="small"
          search={false}
          columns={columns}
          loading={popupStat !== 'fulfilled'}
          dataSource={popupList}
          onLoad={getPopupList}
          rowKey="id"
          params={{ keywords }}
          pagination={{
            defaultCurrent: 1,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
        />
      </ConfigProvider>
      <Modal
        visible={!!editItem}
        destroyOnClose
        onOk={() => {
          editRef.current?.submit();
        }}
        onCancel={() => {
          setEditItem(null);
        }}
        width={1000}
        cancelText="İptal"
        okText="Güncelle"
      >
        {!!editItem && (
          <PopupEdit
            ref={editRef}
            token={editItem}
            onClose={() => {
              setEditItem(null);
              getPopupList();
            }}
          />
        )}
      </Modal>
    </CustomPageContainer>
  );
}

export default PopupList;
