import React from 'react';
import { history } from 'umi';
import { Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PullRequestOutlined } from '@ant-design/icons';

interface Props {
  children: React.ReactNode | React.ReactNodeArray;
  icon: any;
  newPath?: string;
  breadcrumbShow?: boolean;
}

const CustomPageContainer = ({ children, icon, newPath, breadcrumbShow }: Props) => {
  const breadCrumbProps = breadcrumbShow ? {} : { breadcrumb: {} };
  return (
    <PageContainer
      header={{
        avatar: { icon: icon === "new" ? <PullRequestOutlined /> : icon, style: { background: '#de4500' } },
        ...breadCrumbProps,
        extra: [
          newPath ? (
            <Button
              type="primary"
              onClick={() => {
                history.push(newPath);
              }}
            >
              Yeni Ekle
            </Button>
          ) : null,
        ],
      }}
    >
      {children}
    </PageContainer>
  );
};

export default CustomPageContainer;
