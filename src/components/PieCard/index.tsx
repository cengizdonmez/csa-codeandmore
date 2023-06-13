import React, { useState } from 'react';
import { Card, Spin, List } from 'antd';
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface Props {
  labels: string[];
  series: number[];
  colors?: string[];
  title?: string;
  loading?: boolean;
  list?: any[];
  renderItem?: any;
  chartType?: "pie" | "polarArea"
}

function PieCard({ labels, series, colors, title, loading, list, renderItem, chartType }: Props) {
  const options: ApexOptions = {
    chart: {
      width: 380,
      type: chartType || 'pie',
    },
    title: { text: title },
    labels: labels,
    legend: {
      show: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <Card style={{ minHeight: 380, maxHeight: 400, overflowY: "scroll", overflowX: "hidden", marginBottom: 20 }}>
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
          <ApexChart options={options} series={series} type={chartType || "pie"} width={380} height={300} />
          {list && (
            <List
              size="large"
              dataSource={list}
              renderItem={renderItem}
            />
          )}
        </>
      )}
    </Card>
  );
}

export default PieCard;
