import * as React from 'react';
import {MenuOutlined} from "@ant-design/icons";
import {Button, Collapse, Divider, Form, Input, Select, Tag} from "antd";
import style from "./DraggableTreeItem.less";
import {MenuItem} from "@/pages/MenuList/data";

const {Panel} = Collapse;
const {Option} = Select;

type Props = {
  item: MenuItem,
  onValuesChange: any,
  onDelete: any
};
const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};
export const DraggableTreeItem = (props: Props) => {
  const [itemForm] = Form.useForm();
  return (
    <Collapse expandIcon={() => <Tag className={style.Tag} color="#de4500">{props.item.itemtype}</Tag>}
              expandIconPosition="right">
      <Panel header={
        <div className={style.Item}><MenuOutlined/> {props.item.name}</div>}
             key="1">
        <Form {...layout} form={itemForm} name="control-hooks"
              onValuesChange={(changedValues, allValues) => {
                props.onValuesChange(allValues)
              }}
              initialValues={{name: props.item.name, target: props.item.target, slug: props.item.slug, menuId: props.item.menuId}}
        >
          <Form.Item name="name" label="Dolaşım Etiketi">
            <Input/>
          </Form.Item>
          <Form.Item name="target" label="Açılma Konumu">
            <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 style={{width: 200}}>
              <Option value="same">Aynı Sekmede</Option>
              <Option value="new">Yeni Sekmede</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Bağlantı Adresi" name="slug">
            <Input/>
          </Form.Item>
          <Form.Item name="menuId" label="#id">
            <Input type="number"/>
          </Form.Item>
          <Divider/>
          <Form.Item>
            <Button type="primary" onClick={props.onDelete} danger>
              Sil
            </Button>
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  );
};

