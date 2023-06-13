import * as React from 'react';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  List,
  Row,
  Select,
  Tree,
} from 'antd';
import { WebPage } from '@/pages/PagePages/data';
import { Category } from '@/pages/CategoryPages/data';
import { ArrowRightOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { SaveButton } from '@/components/SaveButton/SaveButton';
import { DeleteButton } from '@/components/DeleteButton/DeleteButton';
import { Dispatch } from '@@/plugin-dva/connect';
import { Post } from '@/pages/PostPages/data';
import { Center } from '@/pages/CenterPages/data';

const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;

type Props = {
  menuState: any;
  menuList: any;
  webPageList: WebPage[];
  categoryList: Category[];
  checkWebpages: any;
  dispatch: Dispatch;
  addOrRemoveToCheckWebPages: any;
  addMenuItemClick: any;
  menuForm: any;
  onMenuFinish: any;
  handleRemove: any;
  treeData: any;
  handleMenuClick: any;
  onDrop: any;
  menuItemForm: any;
  checkCategoryList: any;
  addOrRemoveToCheckCategoryList: any;
  checkPostList: any;
  addOrRemoveToCheckPostList: any;
  postList: Post[];
  centerList: Center[];
  addOrRemoveToCheckCenterList: any;
  checkCenterList: [];
  setMenuState: any;
};

export const Menus = (props: Props) => {
  const {
    menuList,
    webPageList,
    categoryList,
    centerList,
    postList,
    dispatch,
    addOrRemoveToCheckWebPages,
    checkWebpages,
    addMenuItemClick,
    menuForm,
    menuState,
    onMenuFinish,
    handleRemove,
    treeData,
    handleMenuClick,
    onDrop,
    menuItemForm,
    checkCategoryList,
    addOrRemoveToCheckCategoryList,
    checkPostList,
    addOrRemoveToCheckPostList,
    checkCenterList,
    addOrRemoveToCheckCenterList,
    setMenuState,
  } = props;

  const onDelete = (v: any) => {
    return new Promise((resolve, reject) => {
      const success = handleRemove(v);
      if (success) {
        menuForm.resetFields();
        setMenuState({ menuId: 0 });
      }
      return resolve(success);
    });
  };

  return (
    <div>
      <Row>
        <Col span={10}>
          <Collapse accordion>
            <Panel header="Sayfalar" key="1">
              <List
                size="large"
                header={
                  <Search
                    placeholder="Ara..."
                    onSearch={(value) => console.log(value)}
                    style={{ width: 200 }}
                  />
                }
                bordered
                dataSource={webPageList}
                renderItem={(item: WebPage) => (
                  <List.Item>
                    <Checkbox
                      onChange={addOrRemoveToCheckWebPages(item.id)}
                      checked={checkWebpages.includes(item.id)}
                      key={item.id}
                    >
                      {item.name}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Kategoriler" key="2">
              <List
                size="large"
                header={
                  <Search
                    placeholder="Ara..."
                    onSearch={(value) => console.log(value)}
                    style={{ width: 200 }}
                  />
                }
                bordered
                dataSource={categoryList}
                renderItem={(item: Category) => (
                  <List.Item>
                    <Checkbox
                      value={item.id}
                      onChange={addOrRemoveToCheckCategoryList(item.id)}
                      checked={checkCategoryList.includes(item.id)}
                    >
                      {item.name}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Yazılar" key="3">
              <List
                size="large"
                header={
                  <Search
                    placeholder="Ara..."
                    onSearch={(value) => console.log(value)}
                    style={{ width: 200 }}
                  />
                }
                bordered
                dataSource={postList}
                renderItem={(item: Post) => (
                  <List.Item>
                    <Checkbox
                      value={item.id}
                      onChange={addOrRemoveToCheckPostList(item.id)}
                      checked={checkPostList.includes(item.id)}
                    >
                      {item.name}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Merkezler" key="4">
              <List
                size="large"
                header={
                  <Search
                    placeholder="Ara..."
                    onSearch={(value) => console.log(value)}
                    style={{ width: 200 }}
                  />
                }
                bordered
                dataSource={centerList}
                renderItem={(item: Center) => (
                  <List.Item>
                    <Checkbox
                      value={item.id}
                      onChange={addOrRemoveToCheckCenterList(item.id)}
                      checked={checkCenterList.includes(item.id)}
                    >
                      {item.name}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Özel Bağlantılar" key="5">
              <Form form={menuItemForm}>
                <Form.Item name="name" label="Dolaşım Etiketi">
                  <Input />
                </Form.Item>
                <Form.Item name="target" label="Açılma Konumu">
                  <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 defaultValue="same" style={{ width: 200 }}>
                    <Option value="same">Aynı Sekmede</Option>
                    <Option value="new">Yeni Sekmede</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="slug" label="Bağlantı Adresi">
                  <Input placeholder="http:// yada https://" />
                </Form.Item>
                <Form.Item name="menuId" label="#id">
                  <Input type="number" />
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
          <Divider />
          <Button type="primary" onClick={addMenuItemClick}>
            <ArrowRightOutlined /> Ekle
          </Button>
        </Col>
        <Col
          span={12}
          style={{ marginLeft: 10, background: 'white', padding: 10, border: '1px solid #d9d9d9' }}
        >
          <Row>
            <Form
              layout="inline"
              form={menuForm}
              initialValues={{
                id: menuList.menu?.id,
                name: menuList.menu?.name,
              }}
              onFinish={onMenuFinish}
            >
              <Form.Item>
                <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch

                  defaultValue="Menü Seçiniz.. "
                  style={{ width: 180 }}
                  value={menuState.menuId}
                  onChange={handleMenuClick}
                >
                  <Option
                    key={0}
                    value={0}
                    icon={<PlusOutlined />}
                    style={{ borderBottom: '1px solid gray' }}
                  >
                    Yeni Menü Oluştur
                  </Option>
                  {menuList.menuList?.map((item: any) => (
                    <Option key={item.id} icon={<MenuUnfoldOutlined />} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Lütfen Menü ismi giriniz!' }]}
              >
                <Input placeholder="Menü İsmi" />
              </Form.Item>
              <SaveButton />
              <Form.Item>
                <DeleteButton
                  onConfirm={async () => {
                    await onDelete(menuList?.menu?.token);
                  }}
                />
              </Form.Item>
            </Form>
          </Row>

          <Row style={{ padding: 10 }}>
            <Tree
              className="draggable-tree"
              draggable
              blockNode
              defaultExpandAll
              onDrop={onDrop}
              treeData={treeData}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};
