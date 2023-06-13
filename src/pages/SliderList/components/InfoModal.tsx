import React from 'react';
import {Button, Divider, Modal, Popconfirm, Table} from 'antd';


export interface InfoFormProps {
  onCancel: (flag?: boolean) => void;
  infoModalVisible: boolean;
}

const InfoModal: React.FC<InfoFormProps> = (props) => {
  const {
    onCancel: handleInfoModalVisible,
    infoModalVisible,
  } = props;


  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleInfoModalVisible(false)}>İptal</Button>
      </>
    );
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Oluşturma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Oluşturan Kullanıcı',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Güncelleme Tarihi',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    },
    {
      title: 'Güncelleyen Kullanıcı',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },

    {
      title: 'Versiyon',
      key: 'action',
      render: (_, record) => {


        return <> <Popconfirm title="Silmek istediğinize emin misiniz?" onConfirm={() => (console.log("approved"))}>
            <a>Sil</a>
          </Popconfirm>
          <Divider type="vertical"/>
          <Popconfirm title="Versiyona geri dönmek istediğinize  emin misiniz?" onConfirm={() => (console.log("approved"))} >
            <Button style={{color:"green"}}>V. geri dön</Button>
          </Popconfirm>
        </>
      },
    },
  ];
  const data = [
    {
      key: '1',
      createdAt: '20/06/2020',
      createdBy: 'Süha Uzun',
      updatedAt: '21/06/2020',
      updatedBy: 'Süha Uzun',
    },
    {
      key: '2',
      createdAt: '12/06/2020',
      createdBy: 'Süha Uzun',
      updatedAt: '21/06/2020',
      updatedBy: 'Süha Uzun',
    },
    {
      key: '3',
      createdAt: '23/06/2020',
      createdBy: 'Süha Uzun',
      updatedAt: '24/06/2020',
      updatedBy: 'Süha Uzun',
    },
  ];
  return (
    <Modal
      width={1300}
      bodyStyle={{padding: '32px 40px 48px'}}
      destroyOnClose
      title="Versiyon Bilgisi"
      visible={infoModalVisible}
      footer={renderFooter()}
      onCancel={() => handleInfoModalVisible()}
    >
      <Table columns={columns} dataSource={data}/>
    </Modal>
  );
};

export default InfoModal;
