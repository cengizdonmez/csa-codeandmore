import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NotPerm: React.FC<{}> = () => (
  <Result
    status="403"
    title="403"
    subTitle="Yetki seviyenizden dolayı sayfada bulunan bazı alanlar gizlenmiştir."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Geri Dön
      </Button>
    }
  />
);

export default NotPerm;
