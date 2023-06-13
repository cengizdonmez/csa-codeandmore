import React, { useEffect, useLayoutEffect, useState } from "react";
import { Card, Row, Col, List, Spin, Alert, Button } from "antd";
import useLanguage from "@/hoxmodels/language";
import {
  useListAll,
  useListByLang,
} from "../CategoryPages/services";
import PieCard from "@/components/PieCard";
import { useIntl } from "umi";

function Welcome() {
  const { formatMessage } = useIntl();

  return (
    <div>
      <Card style={{ marginBottom: 10 }}>
        <Alert
          message={formatMessage({ id: "component.welcome.welcome" })}
          type="success"
          showIcon
          banner
          style={{ margin: -12 }}
        />
      </Card>
      <Row gutter={10}>
        <Col span={12} xs={24} md={12}>
          <MostUsersChart />
        </Col>
        <Col span={12} xs={24} md={12}>
          <MostPostsChart />
        </Col>
        <Col span={12} xs={24} md={12}>
          <MostPagesChart />
        </Col>
        <Col span={12} xs={24} md={12}>
          <MostCategoriesChart />
        </Col>
      </Row>
    </div>
  );
}
export default Welcome;

function MostUsersChart() {
  const { language } = useLanguage();
  const { formatMessage } = useIntl();
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [getList, list, status] = useListAll("/Statistic/getusers");

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (status === "fulfilled") {
      if (!!list) {
        setChartData(
          list
            .sort((a, b) => b.loginCount - a.loginCount)
            .filter((_, index) => index < 5)
        );
      }
    }
  }, [status]);

  const labels = chartData?.map((item) => item.email);
  const series = chartData?.map((item) => item.loginCount);

  return (
    <PieCard
      title={formatMessage({ id: "component.welcome.last-login" })}
      labels={labels!}
      series={series!}
      chartType="polarArea"
      loading={!!!chartData}
      list={list.sort((a, b) => b.loginCount - a.loginCount)}
      renderItem={(item) => (
        <List.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{item.email}</span>
            </div>
            <div>{item.loginCount}</div>
          </div>
        </List.Item>
      )}
    />
  );
}
function MostPostsChart() {
  const { language } = useLanguage();
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [getCategories, list, status] = useListByLang("/Statistic/getwebposts");
  useLayoutEffect(() => {
    if (!!language) {
      getCategories(language!.abbreviationName);
    }
  }, [language]);

  useEffect(() => {
    if (status === "fulfilled") {
      if (!!list) {
        setChartData(
          list.sort((a, b) => b.hit - a.hit).filter((_, index) => index < 5)
        );
      }
    }
  }, [status]);

  const labels = chartData?.map((item) => item.pageName);
  const series = chartData?.map((item) => item.hit);

  return (
    <PieCard
      title="En Çok Ziyaret Edilen Yazılar"
      labels={labels!}
      series={series!}
      loading={!!!chartData}
      list={list.filter((item) => item.hit > 5).sort((a, b) => b.hit - a.hit)}
      renderItem={(item) => (
        <List.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{item.pageName}</span>
            </div>
            <div>{item.hit}</div>
          </div>
        </List.Item>
      )}
    />
  );
}
function MostCategoriesChart() {
  const { language } = useLanguage();
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [getCategories, list, status] = useListByLang(
    "/Statistic/getwebcategories"
  );
  useLayoutEffect(() => {
    if (!!language) {
      getCategories(language!.abbreviationName);
    }
  }, [language]);

  useEffect(() => {
    if (status === "fulfilled") {
      if (!!list) {
        setChartData(
          list.sort((a, b) => b.hit - a.hit).filter((_, index) => index < 5)
        );
      }
    }
  }, [status]);

  const labels = chartData?.map((item) => item.pageName);
  const series = chartData?.map((item) => item.hit);

  return (
    <PieCard
      title="En Çok Ziyaret Edilen Kategoriler"
      labels={labels!}
      series={series!}
      chartType="polarArea"
      loading={!!!chartData}
      list={list.filter((item) => item.hit > 5).sort((a, b) => b.hit - a.hit)}
      renderItem={(item) => (
        <List.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{item.pageName}</span>
            </div>
            <div>{item.hit}</div>
          </div>
        </List.Item>
      )}
    />
  );
}
function MostPagesChart() {
  const { language } = useLanguage();
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [getCategories, list, status] = useListByLang("/Statistic/getwebpages");
  useLayoutEffect(() => {
    if (!!language) {
      getCategories(language!.abbreviationName);
    }
  }, [language]);

  useEffect(() => {
    if (status === "fulfilled") {
      if (!!list) {
        setChartData(
          list.sort((a, b) => b.hit - a.hit).filter((_, index) => index < 5)
        );
      }
    }
  }, [status]);

  const labels = chartData?.map((item) => item.pageName);
  const series = chartData?.map((item) => item.hit);

  return (
    <PieCard
      title="En Çok Ziyaret Edilen Sayfalar"
      labels={labels!}
      series={series!}
      chartType="polarArea"
      loading={!!!chartData}
      list={list.filter((item) => item.hit > 5).sort((a, b) => b.hit - a.hit)}
      renderItem={(item) => (
        <List.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{item.pageName}</span>
            </div>
            <div>{item.hit}</div>
          </div>
        </List.Item>
      )}
    />
  );
}