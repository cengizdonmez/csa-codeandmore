import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import { connect, Redirect, useIntl } from 'umi';
import {Dispatch} from '@@/plugin-dva/connect';
import {LogStateType} from '@/pages/LogList/model';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {trTRIntl} from '@ant-design/pro-provider';
import {queryLog} from './service';
import {LogListItem} from './data.d';
import { ConfigProvider, Spin, Tag } from "antd";
import { AlignCenterOutlined} from '@ant-design/icons';
import CustomPageContainer from '../../components/CustomPageContainer';
import Moment from 'moment'
import usePerms from '../../hoxmodels/perms';

interface LogListProps {
  logList: LogStateType,
  dispatch: Dispatch,
}

const LogList: React.FC<LogListProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { perms } = usePerms();
  const { locale } = useIntl();
  

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermList = perms['loglar.List']

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
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
    },
    {
      title: 'Kullanıcı Bilgisi',
      dataIndex: 'userInfo',
    },
   
    {
      title: 'İstek Durumu',
      dataIndex: 'responseStatus',
    },
    {
      title: 'Method İsmi',
      dataIndex: 'methodName',
    },
    {
      title: 'Log Parametreleri',
      dataIndex: 'logParameters',
      key: "logParameters"
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      render: (dom, entity) => (
      <span>{Moment(entity.date).format("DD/MM/YYYY HH:mm")}</span>
      )
    }
    ,
    {
      title: 'Tip',
      dataIndex: 'audit',
    }
  ];

  return (
    <CustomPageContainer icon={<AlignCenterOutlined />} breadcrumbShow>
      <ConfigProvider
        locale={{ locale }}>
        <ProTable<LogListItem>
          options={{density: false, fullScreen:false, search:false,setting:false}}
          headerTitle="Log Listesi"
          actionRef={actionRef}
          rowKey="id"
          pagination={{defaultPageSize: 10, showSizeChanger: false, hideOnSinglePage: true,showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
          request={(params, filter) => {
            const {pageSize, current, _timestamp, ...rest} = params;
            return queryLog({
              PageSize: pageSize,
              PageNumber: (current || 1),
              filter: {...filter, ...rest},
            });
          }}
          columns={columns}
        />
      </ConfigProvider>
    </CustomPageContainer>
  );
};

export default connect(
  ({
     logList,
   }: {
    logList: LogStateType;
  }) => ({
    logList,
  }),
)(LogList);
