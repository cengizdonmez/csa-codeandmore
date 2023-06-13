import React, {
  ReactElement,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import CustomPageContainer from "../../components/CustomPageContainer";
import {
  Row,
  Col,
  Card,
  Collapse,
  Select,
  Input,
  Button,
  Tree,
  Form,
  Tag,
  message,
  Tabs,
  Spin,
} from "antd";
import { DeleteFilled, SaveFilled, SearchOutlined } from "@ant-design/icons";
import {
  CategoryUrl,
  useListAll,
  useCreate,
  useEdit,
  useDelete,
  useListByLang,
} from "../CategoryPages/services";
import { Category } from "../CategoryPages/data";
import { PostUrl } from "../PostPages/services";
import { Post } from "../PostPages/data";
import { WebPageUrl } from "../PagePages/service";
import { WebPage } from "../PagePages/data";
import { v4 as uuid } from "uuid";
import NestableList from "../../components/Nestable";
import { menuUrls, Menu, MenuCreateField } from "./services";
import { SystemValueUrls } from "../SettingsPage/service";
import FormItem from "antd/lib/form/FormItem";
import slugify from "../../helper/slug";
import useLanguage from "../../hoxmodels/language";

import usePerms from "../../hoxmodels/perms";
import "react-sortable-tree/style.css";
import { Redirect } from "umi";
import { sorterTurkish } from "@/helper/sorter";

interface Props {}

function MenuList({}: Props): ReactElement {
  const { language } = useLanguage();
  const [getMenus, menus] = useListByLang<Menu>(menuUrls.listbylang);
  const [editMenu, , editMenuStat] = useEdit<MenuCreateField, Menu>(
    menuUrls.edit
  );
  const [createMenu, , createMenuStatus] = useCreate<MenuCreateField, Menu>(
    menuUrls.add
  );
  const [deleteMenu, , deleteMenuStatus] = useDelete(menuUrls.delete);
  const [getSystemValues, systemValues] = useListAll<any>(
    SystemValueUrls.listAll
  );
  const [systemValue, setSettingValue] = useState<any>(null);
  const [editSystemValues, , editSystemValuesStat] = useEdit<any, any>(
    SystemValueUrls.edit
  );
  const [selectedMenu, setSelectedMenu] = useState<any>(-1);
  const [menuTitle, setMenuTitle] = useState("");
  const [getCategories, categories] = useListByLang<Category>(
    CategoryUrl.listByLang
  );
  //const [getCenters, centers] = useListByLang<CenterListItem>(CenterUrls.listByLang);
  const [getPosts, posts] = useListByLang<Post>(PostUrl.listByLang);
  // const [getDoctors, doctors] = useListByLang<DoctorListItem>(
  //   doctorUrls.listByLang
  // );
  const [getPages, pages] = useListByLang<WebPage>(WebPageUrl.listByLang);

  const [sCategories, setSC] = useState([]);
  const [sCenters, setSCenter] = useState([]);
  const [sPosts, setSP] = useState([]);
  const [sDoctors, setSD] = useState([]);
  const [sPages, setSPage] = useState([]);
  const [sUtils, setSUtils] = useState([]);
  const [specialLink, setSpecialLink] = useState({
    title: "",
    slug: "",
    aID: "",
    target: 1,
    field: "Özel",
  });
  const [items, setItems] = useState<any>([]);
  const [positions, setPositions] = useState<any>(null);
  const [menuPositionJson, setMenuPositionJson] = useState<any>(null);
  const { perms } = usePerms();

  useLayoutEffect(() => {
    if (language) {
      getMenus(language!.abbreviationName);
      getCategories(language!.abbreviationName);
      //getCenters(language!.abbreviationName);
      getPosts(language!.abbreviationName);
      //getDoctors(language!.abbreviationName);
      getPages(language!.abbreviationName);
      //getUtils(language!.abbreviationName);
      onGetSystemValues();
      setSelectedMenu(-1);
      setMenuTitle("");
    }
  }, [language]);

  function handleClickAdd() {
    const categoryItems = sCategories.map((itemId) => {
      const item = categories.find((_item) => _item.id === itemId);
      return {
        id: uuid(),
        title: item?.name,
        slug: item?.slug,
        fullUrl: item?.fullUrl || "",
        target: 1,
        field: "Kategori",
        aID: slugify(item?.slug || item?.name || ""),
        data: { ...item },
      };
    });
    setSC([]);
    const postItems = sPosts.map((postId) => {
      const post = posts.find((_post) => _post.id === postId);
      return {
        id: uuid(),
        title: post?.name,
        slug: post?.slug,
        target: 1,
        fullUrl: post?.fullUrl || "",
        field: "Yazı",
        fildID: post?.id,
        aID: "",
        data: { ...post },
      };
    });
    setSP([]);

    const pageItems = sPages.map((itemId) => {
      const item = pages.find((_item) => _item.id === itemId);
      return {
        id: uuid(),
        title: item?.name,
        slug: item?.slug,
        target: 1,
        fullUrl: item?.fullUrl || "",
        field: "Sayfa",
        fildID: item?.id,
        aID: slugify(item?.slug || item?.name || ""),
        data: { ...item },
      };
    });
    setSPage([]);

    let specialLinkArr = [];
    if (!!specialLink.title) {
      specialLinkArr = [
        {
          ...{
            ...specialLink,
            title: specialLink.title,
            id: uuid(),
            fieldID: 0,
          },
        },
      ];
      setSpecialLink({
        title: "",
        slug: "",
        aID: "",
        field: "Özel",
        target: 1,
        data: {},
      });
    }
    setItems((_items) => [
      ..._items,
      ...categoryItems,
      ...postItems,
      ...pageItems,
      ...specialLinkArr,
    ]);
  }

  async function onCreate(
    name: string,
    setting: string,
    positionValue: string
  ) {
    try {
      await createMenu({
        name,
        items: setting,
        langCode: language!.abbreviationName,
      });
      getMenus(language!.abbreviationName);
      setItems([]);
      setMenuTitle("");
    } catch (error) {}
  }

  async function onEdit(
    token: string,
    name: string,
    setting: string,
    positionValue: string
  ) {
    try {
      const menuItem = menus.find((menu) => menu.token === token);
      if (menuItem) {
        await editMenu({
          ...menuItem,
          token,
          name,
          items: setting,
        });
        message.success(`${name} Güncellendi`);
        getMenus(language!.abbreviationName);
      }
    } catch (error) {}
  }

  async function onGetSystemValues() {
    const svs = await getSystemValues();
    const sv = svs.find((_sv) => _sv.langCode === language!.abbreviationName);
    if (sv) {
      setSettingValue(sv);
      setMenuPositionJson(JSON.parse(sv.menuPosition));
      setPositions(
        JSON.parse(sv.menuPosition)["menuposition"]["menupositionid"]
      );
    }
  }

  async function onEditSystemValue(newPositions: any = undefined) {
    let tmpData = { ...menuPositionJson };
    tmpData.menuposition.menupositionid =
      newPositions !== undefined ? newPositions : positions;
    await editSystemValues({
      ...systemValue,
      menuPosition: JSON.stringify(tmpData),
    });
    onGetSystemValues();
  }

  async function handleClickSave() {
    if (selectedMenu === -1) {
      try {
        await onCreate(
          menuTitle,
          JSON.stringify(items),
          JSON.stringify(positions)
        );
        message.success("Menü Başarıyla Oluşturuldu");
      } catch (error) {}
    } else {
      try {
        await onEdit(
          selectedMenu,
          menuTitle,
          JSON.stringify(items),
          JSON.stringify(positions)
        );
      } catch (error) {}
    }
  }

  async function handleClickDeleteMenu() {
    const _selectedMenu = menus.find((_menu) => _menu.token === selectedMenu);
    if (_selectedMenu) {
      setSelectedMenu(-1);
      setMenuTitle("");
      let tmpPositions = { ...positions };
      Object.entries(tmpPositions).forEach(([key, value]) => {
        if (value === _selectedMenu.id) {
          tmpPositions[key] = 0;
        }
      });
      setPositions(tmpPositions);
      onEditSystemValue(tmpPositions);
      await deleteMenu(_selectedMenu.token!);
      await getMenus(language!.abbreviationName);
      message.success("Menü Başarıyla Silindi");
    }
  }

  async function handleClickPositionSave() {
    try {
      await onEditSystemValue();
      message.success("Menü Pozisyonları Başarıyla Güncellendi!");
    } catch (error) {}
  }

  const renderItem = ({ item, index, ...others }) => {
    return (
      <Item
        value={item}
        valIndex={index}
        key={index}
        index={index}
        items={items}
        setItems={setItems}
        {...others}
      />
    );
  };

  useEffect(() => {
    if (selectedMenu !== -1 && menus) {
      const menu = menus.find((_menu) => _menu.token === selectedMenu);
      if (menu) {
        setMenuTitle(menu!.name || "");
        setItems(JSON.parse(menu.items || "[]") || []);
      }
    } else {
      setItems([]);
      setMenuTitle("");
    }
  }, [selectedMenu]);

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["menu-islemleri.NewRecord"];
  const isPermDelete = perms["menu-islemleri.DeleteRecord"];
  const isPermUpdate = perms["menu-islemleri.UpdateRecord"];
  const isPermList = perms["menu-islemleri.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

  return (
    <CustomPageContainer icon={null}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Menü İşlemleri" key="1">
          <Row gutter={12}>
            <Col xs={8}>
              <Card>
                <Collapse accordion>
                  <Collapse.Panel header="Kategoriler" key="1">
                    <TreeList
                      list={categories}
                      onChange={(data) => {
                        setSC(data);
                      }}
                      checkedKeys={sCategories}
                      searchKey="name"
                    />
                  </Collapse.Panel>
                  <Collapse.Panel header="Yazılar" key="2">
                    <TreeList
                      list={posts}
                      onChange={(data) => {
                        console.log("munü data", data);
                        setSP(data);
                      }}
                      checkedKeys={sPosts}
                      searchKey="name"
                    />
                  </Collapse.Panel>

                  <Collapse.Panel header="Sayfalar" key="5">
                    <TreeList
                      list={pages}
                      onChange={(data) => {
                        setSPage(data);
                      }}
                      checkedKeys={sPages}
                      searchKey="name"
                    />
                  </Collapse.Panel>
                  <Collapse.Panel header="Özel Bağlantı" key="6">
                    <Form layout="vertical">
                      <Form.Item label="Dolaşım Etiketi">
                        <Input
                          type="text"
                          onChange={({ currentTarget: { value } }) => {
                            setSpecialLink((_specialLink) => ({
                              ..._specialLink,
                              title: value,
                            }));
                          }}
                          value={specialLink.title}
                        />
                      </Form.Item>
                      <Form.Item label="Adres">
                        <Input
                          type="text"
                          onChange={({ currentTarget: { value } }) => {
                            setSpecialLink((_specialLink) => ({
                              ..._specialLink,
                              slug: value,
                            }));
                          }}
                          value={specialLink.slug}
                        />
                      </Form.Item>
                      <Form.Item label="Element Id">
                        <Input
                          type="text"
                          onChange={({ currentTarget: { value } }) => {
                            setSpecialLink((_specialLink) => ({
                              ..._specialLink,
                              aID: slugify(value),
                            }));
                          }}
                          value={specialLink.aID}
                        />
                      </Form.Item>
                    </Form>
                  </Collapse.Panel>
                </Collapse>
              </Card>
              <div
                style={{
                  marginTop: "1em",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {isPermCreate && (
                  <Button type="primary" onClick={handleClickAdd}>
                    Ekle
                  </Button>
                )}
              </div>
            </Col>
            <Col xs={16}>
              <Card>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    <Select
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      style={{ minWidth: 200, marginRight: 10 }}
                      value={selectedMenu}
                      onSelect={(v) => {
                        setSelectedMenu(v);
                      }}
                    >
                      <Select.Option value={-1}>
                        Yeni Menü Oluştur
                      </Select.Option>
                      {menus &&
                        menus.map((menuItem, key) => (
                          <Select.Option key={key} value={menuItem.token!}>
                            {menuItem.name}
                          </Select.Option>
                        ))}
                    </Select>
                    <Input
                      type="text"
                      placeholder="Menü İsmi"
                      value={menuTitle}
                      onChange={({ currentTarget: { value } }) => {
                        setMenuTitle(value);
                      }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    {(selectedMenu === -1 ? isPermCreate : isPermUpdate) && (
                      <Button
                        style={{ marginRight: 10 }}
                        onClick={handleClickSave}
                        disabled={!menuTitle}
                        loading={
                          editMenuStat === "pending" ||
                          createMenuStatus === "pending"
                        }
                      >
                        <SaveFilled /> <span>Kaydet</span>
                      </Button>
                    )}
                    {isPermDelete && selectedMenu !== -1 && (
                      <Button danger onClick={handleClickDeleteMenu}>
                        <DeleteFilled />
                      </Button>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ minHeight: 400 }}>
                    <NestableList
                      maxDepth={5}
                      items={items}
                      renderItem={renderItem}
                      onChange={(e) => {
                        console.log(e)
                        console.log(renderItem)
                        setItems(e);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Menü Pozisyonları" key="2">
          <Row>
            <Col xs={24}>
              <Card>
                {menuPositionJson && positions && (
                  <Form layout="vertical">
                    {menuPositionJson.menuposition.relatives.map(
                      (relative, index) => (
                        <Form.Item label={relative.name}>
                          <Select
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            showSearch
                            value={positions[relative.value]}
                            onChange={(val) => {
                              setPositions((_positions) => ({
                                ..._positions,
                                [relative.value]: val,
                              }));
                            }}
                          >
                            <Select.Option value={0}>Boş</Select.Option>
                            {menus &&
                              menus.map((_menu) => (
                                <Select.Option value={_menu.id!}>
                                  {_menu.name}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                      )
                    )}
                  </Form>
                )}
                <div style={{ marginTop: 10 }}>
                  {isPermUpdate && (
                    <Button
                      type="primary"
                      onClick={handleClickPositionSave}
                      loading={editSystemValuesStat === "pending"}
                    >
                      Kaydet
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </CustomPageContainer>
  );
}

export default MenuList;

function mapArrayAndChange(arr: any, id: any, field: any, newValue: any) {
  arr.some((item, index) => {
    if (item.id === id) {
      item[field] = newValue;
      return;
    } else {
      if (item.children) {
        mapArrayAndChange(item.children, id, field, newValue);
      }
    }
    return;
  });
}

function mapArrayAndDelete(arr: any, id: any) {
  arr = arr.filter((item, index) => {
    if (item.children) {
      item.children = mapArrayAndDelete(item.children, id);
    }
    return item.id !== id;
  });
  return arr;
}

const Item = ({ value, index, setItems, items, valIndex, ...props }) => {
  return (
    <Collapse>
      <Collapse.Panel
        header={value.title}
        key={`${value.id}`}
        extra={<Tag color="orange">{value.field}</Tag>}
      >
        <Form layout="vertical">
          <Form.Item label="Dolaşım Etiketi">
            <Input
              type="text"
              value={value.title}
              onChange={(e) => {
                let tmpItems = [...items];
                mapArrayAndChange(
                  tmpItems,
                  value.id,
                  "title",
                  e.currentTarget.value
                );
                setItems(tmpItems);
              }}
            />
          </Form.Item>
          <Form.Item label="Açılma Konumu">
            <Select
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              value={value.target}
              onSelect={(v) => {
                let tmpItems = [...items];
                mapArrayAndChange(tmpItems, value.id, "target", v);
                setItems(tmpItems);
              }}
            >
              <Select.Option value={"_self"}>Aynı Sekmede</Select.Option>
              <Select.Option value={"_blank"}>Yeni Sekmede</Select.Option>
              <Select.Option value={"_passive"}>Pasif Link</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Adres">
            <Input
              type="text"
              value={value.slug}
              onChange={(e) => {
                let tmpItems = [...items];
                mapArrayAndChange(
                  tmpItems,
                  value.id,
                  "slug",
                  slugify(e.currentTarget.value)
                );
                setItems(tmpItems);
              }}
            />
          </Form.Item>
          <Form.Item label="Element ID">
            <Input
              type="text"
              value={value.aID}
              onChange={(e) => {
                let tmpItems = [...items];
                mapArrayAndChange(
                  tmpItems,
                  value.id,
                  "aID",
                  slugify(e.currentTarget.value)
                );
                setItems(tmpItems);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              danger
              onClick={() => {
                let tmpItems = [...items];
                tmpItems = mapArrayAndDelete(tmpItems, value.id);
                setItems(tmpItems);
              }}
            >
              <DeleteFilled />
              Sil
            </Button>
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};

export function TreeList({ list, onChange, checkedKeys, searchKey }) {
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [cachedData, setCachedData] = useState<any[]>([]);
 

  // useLayoutEffect(() => {
  //   setCachedData([...data]);
  // }, [page]);

  const allChecked = ["all"];

  useLayoutEffect(() => {
    setCachedData(checkedKeys);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex',marginBottom:"1rem" }}>
        <Input
          type="text"
          placeholder="Search"
          value={query}
          onChange={({ currentTarget: { value } }) => {
            setQuery(value);
          }}
        />
        <Button type="primary">
          <SearchOutlined />
        </Button>
      </div>
      <Tree
        checkable
        checkedKeys={list.length === checkedKeys.length ? allChecked : []}
        selectable={false}
        treeData={[{ title: "Tümü", key: "all" }]}
        onCheck={(a) => {
          setQuery("")
          if (a.length === 0) {
            onChange([]);
            setCachedData([]);
            
          } else {
            onChange(list.map((item) => item.id));
          }
        }}
      />
      {list && (
        <Tree
          checkedKeys={checkedKeys}
          checkable
          selectable={false}
          defaultSelectedKeys={[]}
          defaultCheckedKeys={[]}
          onCheck={(a) => {
            let _cached = cachedData.filter((_item) => {
              let listIndex = list.findIndex(
                (_listItem) => _listItem.id === _item
              );
              return !(listIndex >= page * 10 && listIndex < page * 10 + 10);
            });
            setCachedData([...new Set([..._cached, ...a])]);
            onChange([...new Set([..._cached, ...a])]);
          }}
          treeData={(!!searchKey
            ? list
                .sort((a, b) => sorterTurkish(a, b, "name"))
                .filter((item) => item[searchKey].toLowerCase().includes(query))
            : list.sort((a, b) => sorterTurkish(a, b, "name"))
          )
            .filter((_, index) => index >= page * 10 && index < page * 10 + 10)
            .map((item) => ({
              title: item.name,
              key: item.id!,
              children: [],
            }))}
          style={{ padding: 0, marginTop: 10 }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div></div>
        <div>
          <Select
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={page}
            onChange={(newPage) => setPage(newPage)}
          >
            {Array.from(Array(Math.ceil(list.length / 10)), (e, i) => (
              <Select.Option value={i}>{i + 1}</Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
