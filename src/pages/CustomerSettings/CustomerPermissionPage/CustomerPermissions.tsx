import React, { ReactElement, useState, useLayoutEffect } from "react";
import CustomPageContainer from "../../../components/CustomPageContainer";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Tree,
  Spin,
  message,
  notification,
} from "antd";
import {
  useCreate,
  useListAll,
  useGetOne,
  useEdit,
  useDelete,
} from "../../CategoryPages/services";
import usePerms from "../../../hoxmodels/perms";
import { Redirect } from "umi";
import {
  CustomerGroup,
  CustomerGroupOne,
  CustomerGroupsOne,
  Moduls,
} from "./customerPermission";
import { Plan } from "../Plan/planType";

interface Props {}
interface Permissions {
  view: boolean;
  download: boolean;
}
interface CustomerGroupModules {
  id: string;
  title: string;
  permissions: Permissions;
}

function CustomerPermissions({}: Props): ReactElement {
  const [form] = Form.useForm();
  const { perms } = usePerms();

  const [getModuls, moduls, modulsStat] = useListAll<Moduls>(
    "/CustomerModule/getall"
  );
  const [getUserGroups, userGroups, userGroupsStat] = useListAll<CustomerGroup>(
    "/CustomerGroup/getall"
  );
  const [getPlanList, PlanListResp, PlanListStatus] = useListAll<Plan>(
    "/CustomerPlans/getall"
  );
  const [
    getUserGroupOne,
    userGroupOne,
    userGroupOneStat,
  ] = useGetOne<CustomerGroupsOne>("/CustomerGroup");
  const [onEditUserGroup, , userGroupStat] = useEdit<any, any>(
    "/CustomerGroup/update"
  );
  const [onCreateUserGroup, , userCreateStat] = useCreate<any, any>(
    "/CustomerGroup/add"
  );
  const [onDeleteGroup] = useDelete("/CustomerGroup");
  const [groupModule, setGroupModule] = useState<CustomerGroupModules[]>([]);
  const [
    selectedGroupModuleIndex,
    setSelectedGroupModuleIndex,
  ] = useState<number>(-1);
  const [fields, setFields] = useState<CustomerGroup[]>([]);
  const [selectedFieldIndex, setSelectedField] = useState<number>(-1);
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [title, setTitle] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  async function onChangeSelectedField(newIndex: number) {
    setSelectedField(newIndex);
    const tmpGroupModul: any[] = [];
    if (newIndex === -1) {
      moduls.forEach((_modul) => {
        tmpGroupModul.push({
          id: _modul.id,
          title: _modul.name,
          permModel: {},
          permissions: {
            view: false,
            download: false,
          },
        });
      });
      setGroupModule(tmpGroupModul);
    }
    setSelectedPlan(null);
  }

  async function onChangeSelectedPlans(e: string) {
    setSelectedPlan(e);
    const tmpGroupModul: any[] = [];
    if (selectedFieldIndex === -1) {
      onGetModuls();
      // let _modul = moduls.find((m) => m.id === perm.customerModuleId);
      // console.log(_modul);
      // if (_modul) {
      //   tmpGroupModul.push({
      //     id: _modul.id,
      //     title: _modul.name,
      //     permModel: { ...perm },
      //     permissions: {
      //       view: perm.view,
      //       download: perm.download,
      //     },
      //   });
      // }
      // setGroupModule(tmpGroupModul);
    } else {
      const _groupOne = await getUserGroupOne(
        `/getbyid?customerGroupId=${groups[selectedFieldIndex].id}&planId=${e}`
      );
      if (_groupOne.customerGroupModulList.length > 0) {
        _groupOne.customerGroupModulList.forEach((perm) => {
          let _modul = moduls.find((m) => m.id === perm.customerModuleId);
          if (_modul) {
            tmpGroupModul.push({
              id: _modul.id,
              title: _modul.name + " > " + _modul.customerReportName,
              permModel: { ...perm },
              permissions: {
                view: perm.view,
                download: perm.download,
              },
            });
          }
        });
      } else {
        moduls.forEach((_modul) => {
          tmpGroupModul.push({
            id: _modul.id,
            title: _modul.name,
            permModel: {},
            permissions: {
              view: false,
              download: false,
            },
          });
        });
      }
      setGroupModule(tmpGroupModul);
    }
  }

  function onChangeFieldTitle(newName: string) {
    const _tmpFieldList = [...groups];
    _tmpFieldList[selectedFieldIndex].name = newName;
    setGroups((_fields) => _tmpFieldList);
  }

  async function onAddField() {
    if (selectedFieldIndex !== -1) {
      await onEditUserGroup({
        customerGroup: userGroupOne?.customerGroup,
        customerGroupModulList: groupModule.map((_group) => ({
          ..._group.permModel,
          customerPlanId: selectedPlan,
          customerModuleId: _group.id,
          customerGroupId: userGroupOne?.customerGroup.id,
          view: _group.permissions.view,
          download: _group.permissions.download,
        })),
      });
    } else {
      await onCreateUserGroup({
        customerGroup: { name: title, status: true },
        customerGroupModuleDtoList: groupModule.map((_group) => ({
          ..._group.permModel,
          customerPlanId: selectedPlan,
          customerModuleId: _group.id,
          view: _group.permissions.view,
          download: _group.permissions.download,
        })),
      });
      setTitle("");
      setTitle("");
      const tmpGroupModul: any[] = [];
      moduls.forEach((_modul) => {
        tmpGroupModul.push({
          id: _modul.id,
          title: _modul.name,
          permModel: {},
          permissions: {
            view: false,
            download: false,
          },
        });
      });
      setGroupModule(tmpGroupModul);
      setFieldsByUserGroups();
    }
    message.success("Başarıyla Kaydedildi");
  }

  async function onDeleteField() {
    if (selectedFieldIndex !== -1) {
      await onDeleteGroup(
        `/delete?customerGroupId=${groups[selectedFieldIndex].id}&customerPlanId=${selectedPlan}`
      );
      setFieldsByUserGroups();
    }
  }

  function getTreeData() {
    const treeData: any = [];
    (selectedGroupModuleIndex === -1
      ? groupModule
      : groupModule.filter((_, index) => _.id === selectedGroupModuleIndex)
    ).forEach((group) => {
      treeData.push({
        title: group.title + " | Görüntüleme",
        key: group.id + "|view",
        children: [],
      });
      treeData.push({
        title: group.title + " | İndirme",
        key: group.id + "|download",
        children: [],
      });
    });
    return treeData;
  }

  function getCheckedPermissions(): any[] {
    const listData: any[] = [];
    groupModule.forEach((group) => {
      if (group.permissions.view) {
        listData.push({
          title: group.title + " | Görüntüleme",
          key: group.id + "|view",
          children: [],
        });
      }
      if (group.permissions.download) {
        listData.push({
          title: group.title + " | İndirme",
          key: group.id + "|download",
          children: [],
        });
      }
    });
    return listData;
  }

  function onCheckTree(checkedKeys, info) {
    const {
      node: { key },
    } = info;
    const [modulKey, permissionKey] = key.split("|");
    let tmpGroupModul = [...groupModule];
    tmpGroupModul.some((modul) => {
      if (modul.id === modulKey) {
        modul.permissions[permissionKey] = !modul.permissions[permissionKey];
        return;
      }
    });
    setGroupModule(tmpGroupModul);
  }

  async function setFieldsByUserGroups() {
    setSelectedField(-1);
    onGetModuls();
    getPlanList();
    const userGroups = await getUserGroups();
    setGroups(userGroups);
  }

  async function onGetModuls() {
    const _moduls = await getModuls();
    const tmpGroupModul: any[] = [];
    _moduls.forEach((_modul) => {
      tmpGroupModul.push({
        id: _modul.id,
        title: _modul.name + " > " + _modul.customerReportName,
        permModel: {},
        permissions: {
          view: false,
          download: false,
        },
      });
    });
    setGroupModule(tmpGroupModul);
  }

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["musteri-gruplari.NewRecord"];
  const isPermDelete = perms["musteri-gruplari.DeleteRecord"];
  const isPermUpdate = perms["musteri-gruplari.UpdateRecord"];
  const isPermList = perms["musteri-gruplari.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  useLayoutEffect(() => {
    setFieldsByUserGroups();
  }, []);

  return (
    <CustomPageContainer icon={"new"} breadcrumbShow>
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Select
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              style={{ minWidth: 200 }}
              value={selectedFieldIndex}
              onChange={(_val) => {
                onChangeSelectedField(_val);
              }}
              loading={userGroupsStat === "pending"}
            >
              <Select.Option value={-1}>Yeni Oluştur</Select.Option>
              {groups.map((group, index) => (
                <Select.Option key={index} value={index}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
            <Input
              type="text"
              placeholder="Başlık giriniz..."
              value={
                selectedFieldIndex !== -1
                  ? groups[selectedFieldIndex].name
                  : title
              }
              disabled={selectedFieldIndex !== -1}
              style={{ marginLeft: 20 }}
              onChange={({ currentTarget: { value } }) => {
                if (selectedFieldIndex !== -1) {
                  onChangeFieldTitle(value);
                } else {
                  setTitle(value);
                }
              }}
            />
            {PlanListResp.length > 0 && (
              <Select
                style={{ marginLeft: 20 }}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={(e) => {
                  onChangeSelectedPlans(e);
                }}
                showSearch
                value={selectedPlan}
                placeholder="Müşteri Planı Seçiniz..."
              >
                {PlanListResp.map((plan, i) => (
                  <Select.Option key={i} value={plan.id}>
                    {plan.planType}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>

          <div
            style={{ marginLeft: 20, display: "flex", alignItems: "center" }}
          >
            {selectedFieldIndex !== -1 &&
              isPermDelete &&
              selectedPlan !== null && (
                <Button
                  danger
                  style={{ marginRight: ".8rem" }}
                  onClick={() => {
                    onDeleteField();
                  }}
                >
                  Sil
                </Button>
              )}
            {(selectedFieldIndex !== -1 ? isPermUpdate : isPermCreate) &&
              selectedPlan !== null && (
                <Button
                  type="primary"
                  onClick={() => {
                    onAddField();
                  }}
                  disabled={
                    (selectedFieldIndex === -1 && !title) ||
                    (selectedFieldIndex !== -1 &&
                      !!!groups[selectedFieldIndex].name) ||
                    userCreateStat === "pending" ||
                    userGroupStat === "pending"
                  }
                  loading={
                    userCreateStat === "pending" || userGroupStat === "pending"
                  }
                >
                  Kaydet
                </Button>
              )}
          </div>
        </div>
      </Card>
      {groupModule.length !== 0 && userGroupOneStat !== "pending" && (
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card style={{ height: 450, overflowY: "scroll" }}>
              <Select
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                showSearch
                style={{ minWidth: 200, marginBottom: 30 }}
                value={selectedGroupModuleIndex}
                onChange={(_val) => {
                  setSelectedGroupModuleIndex(_val);
                }}
              >
                <Select.Option value={-1}>Tümü</Select.Option>
                {moduls.map((item, index) => (
                  <Select.Option key={index} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
              <Tree
                checkable
                selectable={false}
                onCheck={onCheckTree}
                treeData={getTreeData()}
                checkedKeys={getCheckedPermissions().map((perm) => perm.key)}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card style={{ height: 450, overflowY: "scroll" }}>
              {getCheckedPermissions().map((permission, index) => (
                <SelectedPermissionItem
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  edPermissionItem
                  item={permission}
                  key={index}
                />
              ))}
            </Card>
          </Col>
        </Row>
      )}
      {userGroupOneStat === "pending" && (
        <Row>
          <Col xs={24}>
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin />
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </CustomPageContainer>
  );
}

export default CustomerPermissions;

function SelectedPermissionItem({ item }: { item: any }) {
  return (
    <Card size="small" style={{ marginBottom: 5 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>{item.title}</div>
      </div>
    </Card>
  );
}
