import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { List, Card, Spin } from 'antd';

interface Props {
  loading?: boolean;
  series: number[];
  labels: string[];
  list?: any[];
  renderItem: any;
  title: string;
}

function BarCard({ labels, renderItem, series, title, list, loading }: Props) {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    title: {
      text: title,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labels,
    },
  };

  return (
    <Card style={{ minHeight: 380, maxHeight: 400, overflowY: 'scroll', overflowX: 'hidden', marginBottom: 20 }}>
      {!!loading ? (
        <div
          style={{
            minHeight: 250,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <ReactApexChart options={options} series={[{ data: series }]} type="bar" height={380} />
          {list && <List size="large" dataSource={list} renderItem={renderItem} />}
        </>
      )}
    </Card>
  );
}

export default BarCard;
