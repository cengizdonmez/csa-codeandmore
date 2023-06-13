import React, { ReactElement, useState, useLayoutEffect } from "react";
import CustomPageContainer from "../../components/CustomPageContainer";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Tree,
  Table,
  Switch,
  Tabs,
  Spin,
  message,
} from "antd";
import {
  useCreate,
  useListAll,
  useGetOne,
  useEdit,
  useDelete,
} from "../CategoryPages/services";
import { Moduls, UserGroups, UserGroupOne, UserGroup } from "./data";
import { userPermissionsUrls } from "./services";
import GroupModule from "./groupModule.json";
import { messages } from "@/constants/appConst";
import usePerms from "../../hoxmodels/perms";
import { Redirect } from "umi";

interface Props {}
interface Permissions {
  create: boolean;
  list: boolean;
  edit: boolean;
  delete: boolean;
  publisher: boolean;
}
interface GroupModules {
  title: string;
  permissions: Permissions;
}

function UserPermissionsPage({}: Props): ReactElement {
  const [form] = Form.useForm();
  const { perms } = usePerms();

  const [getModuls, moduls, modulsStat] = useListAll<Moduls>(
    userPermissionsUrls.getModelList
  );
  const [getUserGroups, userGroups, userGroupsStat] = useListAll<UserGroups>(
    userPermissionsUrls.getUserGroups
  );
  const [
    getUserGroupOne,
    userGroupOne,
    userGroupOneStat,
  ] = useGetOne<UserGroupOne>(userPermissionsUrls.one);
  const [onEditUserGroup, , userGroupStat] = useEdit<any, any>(
    userPermissionsUrls.userGroupEdit
  );
  const [onCreateUserGroup, , userCreateStat] = useCreate<any, any>(
    userPermissionsUrls.userGroupCreate
  );
  const [onDeleteGroup] = useDelete(userPermissionsUrls.delete);
  const [groupModule, setGroupModule] = useState<GroupModules[]>([]);
  const [
    selectedGroupModuleIndex,
    setSelectedGroupModuleIndex,
  ] = useState<number>(-1);
  const [fields, setFields] = useState<UserGroup[]>([]);
  const [selectedFieldIndex, setSelectedField] = useState<number>(-1);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [title, setTitle] = useState<string>("");

  async function onChangeSelectedField(newIndex: number) {
    setSelectedField(newIndex);
    if (newIndex === -1) {
      setTitle("");
      const tmpGroupModul: any[] = [];
      moduls.forEach((_modul) => {
        tmpGroupModul.push({
          id: _modul.id,
          title: _modul.name,
          permModel: {},
          permissions: {
            create: false,
            list: false,
            edit: false,
            delete: false,
            publisher: false,
          },
        });
      });
      setGroupModule(tmpGroupModul);
    } else {
      const _groupOne = await getUserGroupOne(groups[newIndex].id);
      const tmpGroupModul: any[] = [];
      _groupOne.userGroupModulList.forEach((perm) => {
        let _modul = moduls.find((m) => m.id === perm.modulId);
        if (_modul) {
          tmpGroupModul.push({
            id: _modul.id,
            title: _modul.name,
            permModel: { ...perm },
            permissions: {
              create: perm.newRecord,
              list: perm.list,
              edit: perm.updateRecord,
              delete: perm.deleteRecord,
              publisher : perm.publisher
            },
          });
        }
      });
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
        userGroup: userGroupOne?.userGroup,
        userGroupModulList: groupModule.map((_group) => ({
          ..._group.permModel,
          list: _group.permissions.list,
          newRecord: _group.permissions.create,
          deleteRecord: _group.permissions.delete,
          updateRecord: _group.permissions.edit,
          publisher: _group.permissions.publisher
        })),
      });
    } else {
      await onCreateUserGroup({
        userGroup: { name: title },
        userGroupModulDtoList: groupModule.map((_group) => ({
          ..._group.permModel,
          modulId: _group.id,
          list: _group.permissions.list,
          newRecord: _group.permissions.create,
          deleteRecord: _group.permissions.delete,
          updateRecord: _group.permissions.edit,
          publisher: _group.permissions.publisher
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
            create: false,
            list: false,
            edit: false,
            delete: false,
            publisher: false
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
      await onDeleteGroup(groups[selectedFieldIndex].token);
      setFieldsByUserGroups();
    }
  }

  function getTreeData() {
    const treeData = [];
    (selectedGroupModuleIndex === -1
      ? groupModule
      : groupModule.filter((_, index) => _.id === selectedGroupModuleIndex)
    ).forEach((group) => {
      treeData.push({
        title: group.title + " | Listeleme",
        key: group.title + "-list",
        children: [],
      });
      treeData.push({
        title: group.title + " | Silme",
        key: group.title + "-delete",
        children: [],
      });
      treeData.push({
        title: group.title + " | Oluşturma",
        key: group.title + "-create",
        children: [],
      });
      treeData.push({
        title: group.title + " | Güncelleme",
        key: group.title + "-edit",
        children: [],
      });
      treeData.push({
        title: group.title + " | Publisher",
        key: group.title + "-publisher",
        children: [],
      });
    });
    return treeData;
  }

  function getCheckedPermissions(): any[] {
    const listData: any[] = [];
    groupModule.forEach((group) => {
      if (group.permissions.create) {
        listData.push({
          title: group.title + " | Oluşturma",
          key: group.title + "-create",
          children: [],
        });
      }
      if (group.permissions.list) {
        listData.push({
          title: group.title + " | Listeleme",
          key: group.title + "-list",
          children: [],
        });
      }
      if (group.permissions.delete) {
        listData.push({
          title: group.title + " | Silme",
          key: group.title + "-delete",
          children: [],
        });
      }

      if (group.permissions.edit) {
        listData.push({
          title: group.title + " | Güncelleme",
          key: group.title + "-edit",
          children: [],
        });
      }
      if (group.permissions.publisher) {
        listData.push({
          title: group.title + " | Publisher",
          key: group.title + "-publisher",
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
    const [modulKey, permissionKey] = key.split("-");
    let tmpGroupModul = [...groupModule];
    tmpGroupModul.some((modul) => {
      if (modul.title === modulKey) {
        modul.permissions[permissionKey] = !modul.permissions[permissionKey];
        return;
      }
    });
    setGroupModule(tmpGroupModul);
  }

  async function setFieldsByUserGroups() {
    setSelectedField(-1);
    onGetModuls();
    const userGroups = await getUserGroups();
    setGroups(userGroups);
  }

  async function onGetModuls() {
    const _moduls = await getModuls();
    const tmpGroupModul: any[] = [];
    _moduls.forEach((_modul) => {
      tmpGroupModul.push({
        id: _modul.id,
        title: _modul.name,
        permModel: {},
        permissions: {
          create: false,
          list: false,
          edit: false,
          delete: false,
          publisher: false,
        },
      });
    });
    setGroupModule(tmpGroupModul);
  }

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["kullanici-izinleri.NewRecord"];
  const isPermDelete = perms["kullanici-izinleri.DeleteRecord"];
  const isPermUpdate = perms["kullanici-izinleri.UpdateRecord"];
  const isPermList = perms["kullanici-izinleri.List"];

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
              style={{ marginLeft: 20 }}
              onChange={({ currentTarget: { value } }) => {
                if (selectedFieldIndex !== -1) {
                  onChangeFieldTitle(value);
                } else {
                  setTitle(value);
                }
              }}
            />
          </div>

          <div
            style={{ marginLeft: 20, display: "flex", alignItems: "center" }}
          >
            {selectedFieldIndex !== -1 && isPermDelete && (
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
            {(selectedFieldIndex !== -1 ? isPermUpdate : isPermCreate) && (
              <Button
                type="primary"
                onClick={() => {
                  onAddField();
                }}
                disabled={
                  (selectedFieldIndex === -1 && !title) ||
                  (selectedFieldIndex !== -1 &&
                    !!!groups[selectedFieldIndex].name)||
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

export default UserPermissionsPage;

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
