import CustomPageContainer from "@/components/CustomPageContainer";
import { useDelete, useListAll } from "@/pages/CategoryPages/services";
import { MedicineBoxOutlined } from "@ant-design/icons";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import {
  Button,
  ConfigProvider,
  Divider,
  Modal,
  notification,
  Popconfirm,
  Spin,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Redirect, useIntl } from "umi";
import EditForm from "./Edit";
import usePerms from "../../../hoxmodels/perms";
import { Plan } from "./planType";

export type CustomerTypeEditRef = {
  submit: () => void;
};

const List = () => {
  const { perms } = usePerms();
  const [editItem, setEditItem] = useState<string | number | null>(null);

  const [getPlanList, PlanListResp, PlanListStatus] = useListAll<Plan>(
    "/CustomerPlans/getall"
  );
  const [deletePlan] = useDelete("/CustomerPlans/delete?id=");
  useEffect(() => {
    onGetPlanList();
  }, []);

  const onGetPlanList = async () => {
    await getPlanList();
  };

  const editRef = useRef<CustomerTypeEditRef>(null);

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["musteri-plani.NewRecord"];
  const isPermDelete = perms["musteri-plani.DeleteRecord"];
  const isPermUpdate = perms["musteri-plani.UpdateRecord"];
  const isPermList = perms["musteri-plani.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  const { formatMessage, locale } = useIntl();

  const columns: ProColumns<Plan>[] = [
    {
      title: "Planlar",
      dataIndex: "planType",
    },
    {
      title: isPermDelete && isPermUpdate ? "İşlemler" : " ",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <>
          {isPermUpdate && (
            <Button
              style={{ color: "#00A8A2" }}
              onClick={() => {
                setEditItem(record.id);
              }}
            >
              Güncelle
            </Button>
          )}
          {isPermDelete && (
            <>
              <Divider type="vertical" />
              <Popconfirm
                title={"Silmek istediğnize emin misiniz?"}
                onConfirm={async () => {
                  try {
                    const result = await deletePlan(record.id);
                    console.log(result);
                    if (result) {
                      await getPlanList();
                      notification.info({
                        message: "Bilgilendirme",
                        description: "Başarılı",
                      });
                    }
                  } catch (error) {
                    notification.error({
                      message: "Hata",
                      description: "Hata meydana geldi!",
                    });
                  }
                }}
                okText="Evet"
                cancelText="Hayır"
              >
                <a>Sil</a>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];
  return (
    <CustomPageContainer
      icon={<MedicineBoxOutlined />}
      newPath={isPermCreate ? "/customer/plan/create" : undefined} //yeni ekleme sayfa linki gelecek
    >
      <ConfigProvider locale={{ locale }}>
        <ProTable<Plan>
          //options={{ density: false }}
          //size="small"
          columns={columns}
          dataSource={PlanListResp}
          search={false}
          // onLoad={beforeRender}
          rowKey="id"
          // params={{ keywords }}
          loading={PlanListStatus !== "fulfilled"}
          pagination={{
            defaultCurrent: 1,
            showTotal: (total, range) => (
              <>{`${range[0]}-${range[1]} of ${total}`}</>
            ),
          }}
        />
      </ConfigProvider>
      {isPermUpdate && (
        <Modal
          open={!!editItem}
          destroyOnClose
          onOk={async () => {
            await editRef.current?.submit();
          }}
          onCancel={() => {
            setEditItem(null);
          }}
          width={1000}
          cancelText="İptal"
          okText="Güncelle"
        >
          {!!editItem && (
            <EditForm
              ref={editRef}
              token={editItem}
              onClose={async () => {
                setEditItem(null);
                await getPlanList();
              }}
            />
          )}
        </Modal>
      )}
    </CustomPageContainer>
  );
};

export default List;
