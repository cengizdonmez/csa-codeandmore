import React, { useState,useLayoutEffect } from "react";
import { useListAll } from "../CategoryPages/services";
import { LogListItem, User } from "./data";
import CustomPageContainer from '../../components/CustomPageContainer';
import { AlignCenterOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { trTRIntl } from '@ant-design/pro-provider';
import moment from "moment";
import { Button, Select, Modal, Space, Spin, ConfigProvider } from "antd";
import LogShowModal from "./Modal/logShowModal";
import usePerms from '../../hoxmodels/perms';
import { Redirect, useIntl } from "umi";
export default function UserRecord() {

const backendurl:string = "codeandmore.azurewebsites.net/api";
// const backendurl:string = "localhost:5001/api";
const { locale } = useIntl();
const [method,setMethod] = useState<any | null>("-");
const [name,setName] = useState<any | null>("-");
const [url,setUrl] = useState<any | null>("-");
const [modalData, setModalData] = useState<LogListItem|null>(null);
const [getUserList, userList, userListStat] = useListAll<User>('/User/getall');
const [getLogs, Logs, LogStats] = useListAll<LogListItem>(`/LogAdmin/adminlogs?Url=${url}${method}&Name=${name}&Methodby=${method}`)
const [logDatas,setLogDatas] = useState<any>(null);

function handleChangeName(value:any){
  setName(value);
}
function handleChangeUrl(value:any){
  setUrl(value);
}
function handleChangeMethod(value:any){
  setMethod(value);
}


function getLogbyParams(){
  getLogs();
  getUserList();
}

function getLogParameters(){
  Logs.map(Log=>{setLogDatas(Log.logParameters)});
}

useLayoutEffect(() => {
  getLogbyParams();
  getLogParameters();
}, [])

const { perms } = usePerms();
  
if (!perms) {
  return <Spin spinning />;
}

const isPermList = perms['loglar.List']

 if(!isPermList) {
  return (<Redirect to="/not-perm" />);
}


const columns: ProColumns<LogListItem>[] = [
  {
    title: 'Id',
    dataIndex: 'id',
    hideInSearch: true,
    hideInTable: true,
  },
  {
    title: 'Mesaj',
    dataIndex: 'message',
    hideInSearch: true,
    hideInTable: true,
  },
  {
    title: 'Kullanıcı Bilgisi',
    dataIndex: 'userInfo',
    hideInSearch: true,
    hideInTable: true,
  },
 
  {
    title: 'İstek Durumu',
    dataIndex: 'responseStatus',
    hideInSearch: true,
    hideInTable: true,
  },
  {
    title: 'Method İsmi',
    dataIndex: 'methodName',
    hideInSearch: true,
    hideInTable: true,
  },
  {
    title: 'Log Parametreleri',
    dataIndex: 'logParameters',
    key: "logParameters",
    hideInTable: true,
  }, 
  {
    title:'Alan',
    dataIndex:'alan',
    key:'alan',
    render:(_,record)=>(
      <Space>
        <p>{JSON.parse(record.logParameters)[0]["Value"]["Name"]}</p>
      </Space>
    )
  },
  {
    title: 'Log',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, record) =>
      record.id ? (
        
          <Button
            style={{ color: '#00A8A2' }}
            onClick={() => {
              setModalData(record);
            }}
            >
            İncele
          </Button>
        
      ):""
  },
  {
    title: 'Tarih',
    dataIndex: 'date',
    render: (dom, entity) => (
    <span>{moment(entity.date).format("DD/MM/YYYY HH:mm")}</span>
    )
  },
  {
    title: 'Tip',
    dataIndex: 'audit',
    hideInSearch: true,
    hideInTable: true,
  }
];

  return (
    <CustomPageContainer icon={<AlignCenterOutlined />} breadcrumbShow>
      <ConfigProvider locale={{ locale }}>
        <ProTable<LogListItem>
          options={{ density: false }}
          loading={LogStats !== 'fulfilled'}
          headerTitle={
            <Space>
            <Select 
            placeholder="Kullanici Seçiniz"
            
            onChange={handleChangeName} 
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
>           
            {userList.map(user=>(
              <Select.Option value={`${user.firstName} ${user.lastName}`}>
                {`${user.firstName} ${user.lastName}`}
              </Select.Option>))}
            
          </Select>
          <Select 
            placeholder="Alan Seçiniz" 
            
            onChange={handleChangeUrl} 
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
>
            <Select.Option value={`${backendurl}/WebPost/`}>Yazılar</Select.Option>
            <Select.Option value={`${backendurl}/Landing/`}>Landings</Select.Option>
            <Select.Option value={`${backendurl}/WebPage/`}>Web Sayfalar</Select.Option>
            <Select.Option value={`${backendurl}/WebCategory/`}>Web Kategoriler</Select.Option>
          </Select>
          <Select 
            placeholder="İşlem Seçiniz"
            onChange={handleChangeMethod} 
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
>
            <Select.Option value="Update">Güncelleme</Select.Option>
            <Select.Option value="Add">Ekleme</Select.Option>
          </Select>
            <Button onClick={()=>getLogbyParams()}>Listele</Button>
            </Space>        
          }
          size="small"
          columns={columns}
          dataSource={Logs}
          rowKey="id"
          search={false}
          pagination={{
            defaultCurrent: 1,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
        />

      </ConfigProvider>
      <Modal
      visible={!!modalData}
      onCancel={()=>{setModalData(null)}}
      onOk={()=>{setModalData(null)}}
      cancelText="İptal"
      okText="Güncelle"
      >
      <LogShowModal 
      data={modalData}
      />
      </Modal>
    </CustomPageContainer>
  )
}
