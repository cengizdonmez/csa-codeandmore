import React, {useEffect, useMemo, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {connect} from 'umi';
import {Dispatch, MenuStateType} from '@@/plugin-dva/connect';
import {Form, Menu, message, Tabs} from "antd";
import {Menus} from "@/pages/MenuList/components/Menus";
import {CategoryUrl, useListAll} from "@/pages/CategoryPages/services";
import {Category} from "@/pages/CategoryPages/data";
import {WebPage} from "@/pages/PagePages/data";
import {WebPageUrl} from "@/pages/PagePages/service";
import {messages} from "@/constants/appConst";
import {FormValueType} from "@/pages/GroupList/components/UpdateForm";
import {DraggableTreeItem} from "@/components/DraggableTreeItem/DraggableTreeItem";
import {MenuPosition} from "@/pages/MenuList/components/MenuPosition";
import {PostUrl} from "@/pages/PostPages/services";
import {Post} from "@/pages/PostPages/data";
import {Center} from "@/pages/CenterPages/data";
import {CenterUrls} from "@/pages/CenterPages/services";

const {TabPane} = Tabs;

interface MenuListProps {
  menuList: MenuStateType,
  dispatch: Dispatch,
}

const loop = (data, key, callback) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === key) {
      return callback(data[i], i, data);
    }
    if (data[i].children) {
      loop(data[i].children, key, callback);
    }
  }
};
const MenuList: React.FC<MenuListProps> = (props) => {
  const {
    menuList,
    dispatch
  }
    = props;

  useEffect(() => {
    dispatch({type: 'menuList/fetchSettingByName', payload: {name: "menuposition"}});
    dispatch({type: 'menuList/fetchMenu'});
  }, []);

  const [getCategoryList, categoryList, categoryStatus] = useListAll<Category>(CategoryUrl.list);
  const [getWebPageList, webPageList, webPageStatus] = useListAll<WebPage>(WebPageUrl.list);
  const [getPostList, postList, postStatus] = useListAll<Post>(PostUrl.list);
  const [getCenterList, centerList, centerStatus] = useListAll<Center>(CenterUrls.list);

  const [checkWebpages, setCheckWebPages] = useState([]);
  const [checkCategoryList, setCheckCategoryList] = useState([]);
  const [checkPostList, setCheckPostList] = useState([]);
  const [checkCenterList, setCheckCenterList] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [menuState, setMenuState] = useState({menuId: 0});
  const [deleteItemIds, setDeleteItemIds] = useState([]);

  const [menuForm] = Form.useForm();
  const [menuItemForm] = Form.useForm();

  async function getCategories() {
  await getCategoryList();
  }

  async function getWebPages() {
    await getWebPageList();
  }
  async function getPosts() {
    await getPostList();

  }
  async function getCenters() {
   await getCenterList();
  }

  const getMenuListData = async () => {
    if (menuState.menuId) {
      dispatch({
        type: 'menuList/fetchMenuItemByMenuId',
        payload: menuState.menuId,
        onSuccess: (response: any) => (setMenuData(response || [])),
      })
    } else {
      setMenuData([])
    }

  }
  const getMenuData = async () => {
    dispatch({
      type: 'menuList/fetchMenuById',
      payload: {
        menuId: menuState.menuId,
        onSuccess: () => (menuForm.resetFields())
      }
    });

  }
  useEffect(() => {
    getCategories().then(()=>{
      getWebPages().then(()=>{
        getPosts().then(()=>{
          getCenters()
        })
      })
    })

  }, []);

  useEffect(
    () => {
      getMenuData().then(() => (getMenuListData()))
    }, [menuState]
  )

  const handleAdd = async (fields: Menu) => {
    const hide = message.loading(messages.createLoading);
    try {
      dispatch({
        type: 'menuList/submitMenu',
        payload: {
          ...fields, onSuccess: (menuId) => {
            setMenuState({menuId})
          }
        },
      });
      hide();
      message.success(messages.createSuccess);
      return true;
    } catch (error) {
      hide();
      message.error(messages.createError);
      return false;
    }
  };

  const handleRemove = async (menuToken?: string) => {
    const hide = message.loading(messages.deleteLoading);
    try {
      dispatch({
        type: 'menuList/submitMenu',
        payload: {
          token: menuToken,
          onSuccess: () => {
            setMenuData([]);
            menuForm.resetFields();
          }
        },
      });
      hide();
      message.success(messages.deleteSuccess);
      return true;
    } catch (error) {
      hide();
      message.error(messages.deleteError);
      return false;
    }
  };
  const handleAddMenuItem = async (fields: FormValueType) => {
    const hide = message.loading(messages.updateLoading);
    try {
      dispatch({
        type: 'menuList/addMenuItemList',
        payload: {menuItemList: menuData, menuId: menuList.menu?.id, deletedItems: deleteItemIds},
        onSuccess: () => (menuForm.resetFields())
      });
      hide();
      message.success(messages.updateSuccess);
      return true;
    } catch (error) {
      hide();
      message.error(messages.updateError);
      return false;
    }
  };
  const addOrRemoveToCheckWebPages = (id: number) => () => {
    if (checkWebpages.includes(id)) {
      setCheckWebPages(
        checkWebpages.filter(item => id !== item)
      )
    } else {
      setCheckWebPages([...checkWebpages, id])
    }
  }
  const addOrRemoveToCheckCategoryList = (id: number) => () => {
    if (checkCategoryList.includes(id)) {
      setCheckCategoryList(
        checkCategoryList.filter(item => id !== item)
      )
    } else {
      setCheckCategoryList([...checkCategoryList, id])
    }
  }
  const addOrRemoveToCheckPostList = (id: number) => () => {
    if (checkPostList.includes(id)) {
      setCheckPostList(
        checkPostList.filter(item => id !== item)
      )
    } else {
      setCheckPostList([...checkPostList, id])
    }
  }
  const addOrRemoveToCheckCenterList = (id: number) => () => {
    if (checkCenterList.includes(id)) {
      setCheckCenterList(
        checkCenterList.filter(item => id !== item)
      )
    } else {
      setCheckCenterList([...checkCenterList, id])
    }
  }
  function addMenuItemClick() {
    let newData: any[] = [...menuData];
    if (menuItemForm.isFieldsTouched(["name", "target", "slug","menuId"])) {
      let newId = newData.reduce((accumulator: any, currentValue: any) => {
        if (currentValue.id < accumulator)
          return currentValue.id
        return accumulator
      }, 1)
      newId -= 1;
      newData.push({
        children: [],
        color: null,
        icon: null,
        id: newId,
        itemtype: "link",
        name: menuItemForm.getFieldValue("name"),
        parentId: 0,
        slug: menuItemForm.getFieldValue("slug"),
        target: menuItemForm.getFieldValue("target") ?? "same",
        webcategories: 0,
        webmenu: 0,
        webpage: 0,
        menuId : menuItemForm.getFieldValue("menuId")??0
      })
      menuItemForm.resetFields()
    } else {
      newData = [...menuData];
      let newId = newData.reduce((accumulator: any, currentValue: any) => {
        if (currentValue.id < accumulator)
          return currentValue.id
        return accumulator
      }, 1)
      newId -= 1;
      checkWebpages.forEach((item) => {
        newId -= 1
        const {name,target, slug,menuId} = webPageList.find(value => value.id === item);
        newData.push({
          children: [],
          color: null,
          icon: null,
          id: newId,
          itemtype: "page",
          name,
          parentId: 0,
          slug,
          target: target ?? "same",
          webcategories: 0,
          webmenu: 2,
          webpage: item,
          menuId
        })
      })
      checkCategoryList.forEach((item) => {
        newId -= 1
        const {name,slug,target,menuId} = categoryList.find(value => value.id === item);
        newData.push({
          children: [],
          color: null,
          icon: null,
          id: newId,
          itemtype: "category",
          name,
          parentId: 0,
          slug,
          target: target ?? "same",
          webcategories: item,
          webmenu: 2,
          webpage: 0,
          menuId
        })
      })
      checkPostList.forEach((item) => {
        newId -= 1
        const {name,slug,target,menuId} = postList.find(value => value.id === item);
        newData.push({
          children: [],
          color: null,
          icon: null,
          id: newId,
          itemtype: "post",
          name,
          parentId: 0,
          slug,
          target: target ?? "same",
          webcategories: item,
          webmenu: 2,
          webpage: 0,
          menuId
        })
      })
      checkCenterList.forEach((item) => {
        newId -= 1
        const {name,slug,target,menuId} = centerList.find(value => value.id === item);
        newData.push({
          children: [],
          color: null,
          icon: null,
          id: newId,
          itemtype: "center",
          name,
          parentId: 0,
          slug,
          target: target ?? "same",
          webcategories: 0,
          webmenu: 0,
          webpage: 0,
          center: item,
          menuId
        })
      })
    }

    setMenuData(newData)
    setCheckWebPages([]);
    setCheckCategoryList([]);
    setCheckPostList([]);
    setCheckCenterList([]);
  }

  const onMenuFinish = async (values: any) => {
    if (menuList?.menu?.id)
      await handleAddMenuItem({id: menuList.menu.id, ...values});
    else
     await handleAdd(values);
  };

  const treeData = useMemo(() => {
    return menuData ? menuData.map((item: any) => {
      return {
        title: <DraggableTreeItem item={item}
                                  onValuesChange={(values: any) => {
                                    const newData = [...menuData]
                                    // Find dragObject
                                    loop(newData, item.id, (item, index, arr) => {
                                      arr[index] = {...arr[index], ...values};
                                    });
                                    setMenuData(newData);
                                  }
                                  }
                                  onDelete={() => {
                                    const newData = [...menuData]
                                    loop(newData, item.id, (item, index, arr) => {
                                      if (item.id > 0) {
                                        setDeleteItemIds([...deleteItemIds, item.id]);
                                      }
                                      arr.push(...arr[index].children)

                                      arr.splice(index, 1);

                                    });
                                    setMenuData(newData);
                                  }}
        />,
        key: item.id,
        children: item.children?.map((child) => {
          return {
            title: <DraggableTreeItem item={item}
                                      onValuesChange={(values: any) => {
                                        const newData = [...menuData]
                                        loop(newData, child.id, (item, index, arr) => {
                                          arr[index] = {...arr[index], ...values};
                                        });
                                        setMenuData(newData);
                                      }
                                      }
                                      onDelete={() => {
                                        const newData = [...menuData]
                                        loop(newData, child.id, (item, index, arr) => {
                                          if (item.id > 0) {
                                            setDeleteItemIds([...deleteItemIds, child.id]);
                                          }
                                          arr.push(...arr[index].children)

                                          arr.splice(index, 1);
                                        });
                                        setMenuData(newData);

                                      }}/>,
            key: child.id,
            children: child.children?.map((childChild) => {
              return {
                title: <DraggableTreeItem item={item}
                                          onValuesChange={(values: any) => {
                                            const newData = [...menuData]
                                            // Find dragObject
                                            loop(newData, childChild.id, (item, index, arr) => {
                                              arr[index] = {...arr[index], ...values};
                                            });
                                            setMenuData(newData);
                                          }
                                          }
                                          onDelete={() => {
                                            const newData = [...menuData]
                                            loop(newData, childChild.id, (item, index, arr) => {
                                              if (item.id > 0) {
                                                setDeleteItemIds([...deleteItemIds, childChild.id]);
                                              }
                                              arr.push(...arr[index].children)

                                              arr.splice(index, 1);
                                            });
                                            setMenuData(newData);

                                          }}/>,
                key: childChild.id,
                children: childChild.children?.map((childChild3) => {
                  return {
                    title: <DraggableTreeItem item={item}
                                              onValuesChange={(values: any) => {
                                                const newData = [...menuData]
                                                // Find dragObject
                                                loop(newData, childChild3.id, (item, index, arr) => {
                                                  arr[index] = {...arr[index], ...values};
                                                });
                                                setMenuData(newData);
                                              }
                                              }
                                              onDelete={() => {
                                                const newData = [...menuData]
                                                loop(newData, childChild3.id, (item, index, arr) => {
                                                  if (item.id > 0) {
                                                    setDeleteItemIds([...deleteItemIds, childChild3.id]);
                                                  }
                                                  arr.push(...arr[index].children)
                                                  arr.splice(index, 1);
                                                });
                                                setMenuData(newData);

                                              }}/>,
                    key: childChild3.id,
                    children: []
                  }
                })
              }
            })
          }
        })
      }
    }) : []
  }, [menuData]);


  const onDrop = (info: any) => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);


    const newData = [...menuData]
    // Find dragObject
    let dragObj;
    loop(newData, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(newData, dropKey, item => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(newData, dropKey, item => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(newData, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setMenuData(newData);
  };

  const handleMenuClick = (e: any) => {
    if (e === 0) {
      setMenuState({menuId: 0});
    } else {
      setMenuState({menuId: e});
    }

  }
  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <TabPane tab="MENULER" key="1">
          <Menus
            menuState={menuState}
            webPageList={webPageList} categoryList={categoryList} centerList={centerList}
            addMenuItemClick={addMenuItemClick}
             handleMenuClick={handleMenuClick}
            menuList={menuList} onMenuFinish={onMenuFinish} menuForm={menuForm}
            handleRemove={handleRemove} dispatch={dispatch} treeData={treeData} onDrop={onDrop}
            menuItemForm={menuItemForm}
            checkWebpages={checkWebpages} addOrRemoveToCheckWebPages={addOrRemoveToCheckWebPages}
            checkCategoryList={checkCategoryList} addOrRemoveToCheckCategoryList={addOrRemoveToCheckCategoryList}
            checkPostList={checkPostList} addOrRemoveToCheckPostList={addOrRemoveToCheckPostList} postList={postList}
            checkCenterList={checkCenterList} addOrRemoveToCheckCenterList={addOrRemoveToCheckCenterList} centerList={centerList}  setMenuState={setMenuState}

          />
        </TabPane>
        <TabPane tab="MENU KONUMLARI" key="2">
          <MenuPosition menuList={menuList} dispatch={dispatch}/>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default connect(
  ({
     menuList,
   }: {
    menuList: MenuStateType;
  }) => ({
    menuList,
  }),
)(MenuList);
