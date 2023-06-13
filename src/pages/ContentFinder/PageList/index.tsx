import React, { ReactElement, useLayoutEffect, useState } from "react";
import {
  Input,
  Spin,
  Card,
  Row,
  Col,
  ConfigProvider,
} from "antd";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import {
  useListAll,
} from "../../CategoryPages/services";
import { FileSearchOutlined } from "@ant-design/icons";
import CustomPageContainer from "../../../components/CustomPageContainer";
import { Redirect, useIntl } from "umi";
import useLanguage from "../../../hoxmodels/language";
import { RouteContent } from "../data";
import usePerms from "../../../hoxmodels/perms";

function CategoryList(): ReactElement {
  const { language } = useLanguage();
  const { perms } = usePerms();
  const { locale } = useIntl();

  const [keywords, setKeywords] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [getLanguages, languages, languagesStat] = useListAll<RouteContent>(
    "/Route/getallcontenturl" + "?lang=" + language?.abbreviationName
  );

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermList = perms["icerik-bulucu.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  useLayoutEffect(() => {
    getLanguages();
  }, [language]);

  const columns: ProColumns<{
    PageName: string;
  }>[] = [
    {
      title: "Sayfa Adı",
      dataIndex: "pageName",
    },
    {
      title: "Alan Adı",
      dataIndex: "tableName",
    },
    {
      title: "Sayfa Url",
      dataIndex: "fullUrl",
      copyable: true,
    },
    {
      title: "Durum",
      dataIndex: "isActive",
      render: (isActive) => (isActive ? "Yayında" : "Beklemede"),
    },
  ];

  return (
    <CustomPageContainer
      icon={<FileSearchOutlined />}
    >
      <ConfigProvider locale={{locale}}>
        <Card>
          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Col xs={24} md={12}>
              <Input
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </Col>
          </Row>
        </Card>

        <ProTable
          columns={columns}
          dataSource={languages.filter(
            (item) =>
              item.fullUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.pageName?.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          rowKey="id"
          search={false}
          params={{ keywords }}
          pagination={{
            defaultCurrent: 1,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
          loading={languagesStat !== "fulfilled"}
        />

      </ConfigProvider>
    </CustomPageContainer>
  );
}

export default CategoryList;
