import React, { ReactElement, useEffect, useState } from 'react';
import { Input, Button, Card, Col, Form, Row, Select, Popconfirm, Modal } from 'antd';
import { SortableElement, SortableContainer, arrayMove } from 'react-sortable-hoc';
import { DeleteOutlined, DoubleRightOutlined, EditOutlined } from '@ant-design/icons';
import TextEditor from '../TextEditor';

function AccordionContent({ onChange, defaultValue }: any): ReactElement {
  const [accordions, setAccords] = useState<any[]>(defaultValue ?? []);
  const [_isMounted, setMounted] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [form] = Form.useForm<any>();
  const [editForm] = Form.useForm<any>();

  function onValid(fields: any) {
    setAccords((_accords) => [..._accords, fields]);
    form.resetFields();
  }
  function onValidEdit(fields: any) {
    if (editIndex !== null) {
      const _list = [...accordions];
      _list[editIndex] = { ...fields };
      setAccords(_list);
      setEditIndex(null);
      editForm.resetFields();
    }
  }

  useEffect(() => {
    if (!_isMounted) {
      setMounted(true);
    } else {
      onChange(accordions);
    }
  }, [accordions]);

  return (
    <Card>
      <Row gutter={12}>
        <Col md={12}>
          <Form form={form} onFinish={onValid} layout="vertical">
            <Form.Item
              label="Başlık"
              name="title"
              rules={[{ required: true, message: 'Lütfen Başlık Girin!' }]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item label="İçerik" name="description">
              <TextEditor style={{}}  />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" htmlType="submit">
                  Ekle <DoubleRightOutlined />
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
        <Col md={12}>
          <h4>Akordiyon Listesi</h4>
          <Card style={{ height: 450, overflowY: 'scroll' }}>
            <SortableList
              items={accordions}
              onSortEnd={({ oldIndex, newIndex }) => {
                const cb = (_list: any) => arrayMove(_list, oldIndex, newIndex);
                setAccords(cb);
              }}
              onChangeItem={(oldIndex, newIndex) => {
                const cb = (_items) => arrayMove(_items, oldIndex, newIndex);
                setAccords(cb);
              }}
              onRemoveItem={(itemIndex) => {
                const cb = (_list) => _list.filter((_, _index) => _index !== itemIndex);
                setAccords(cb);
              }}
              onClickEdit={(_value, _index) => {
                setEditIndex(_index);
                editForm.setFieldsValue({ ..._value });
              }}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        visible={editIndex !== null}
        onCancel={() => {
          setEditIndex(null);
        }}
        onOk={() => {
          editForm.submit();
        }}
      >
        {editIndex !== null && (
          <div style={{ marginTop: '2em' }}>
            <Form form={editForm} onFinish={onValidEdit}>
              <Form.Item
                label="Başlık"
                name="title"
                rules={[{ required: true, message: 'Lütfen Başlık Girin!' }]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item label="İçerik" name="description">
              <TextEditor style={{}}  />
              </Form.Item>

            </Form>
          </div>
        )}
      </Modal>
    </Card>
  );
}

export default AccordionContent;

const SortableItem = SortableElement(
  ({ value, valIndex, onChangeItem, onClickDelete, onClickEdit }: any) => {
    const [data, setData] = useState(valIndex);

    return (
      <div
        style={{
          padding: 10,
          border: '1px solid lightgrey',
          borderRadius: 2,
          marginBottom: 2,
          cursor: 'grab',
          background: 'white',
          justifyContent: 'space-between',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div>{value.name || value.title}</div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '5px',
          }}
        >
          <div>
            <Input
              type="number"
              value={data}
              onChange={({ currentTarget: { value } }) => {
                setData(value);
              }}
              onBlur={(e) => {
                onChangeItem(valIndex, parseInt(e.currentTarget.value));
                setData(valIndex);
              }}
              style={{ width: 70, marginRight: 10 }}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <Button onClick={onClickEdit} style={{ marginRight: '5px' }}>
              <EditOutlined />
            </Button>
            <Popconfirm
              title={"Silmek istediğinizden emin misiniz?"}
              onConfirm={async () => {
                onClickDelete();
              }}
              okText="Evet"
              cancelText="Hayır"
            >
              <Button danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    );
  },
);

const SortableList = SortableContainer(
  ({ items, onChangeItem, onRemoveItem, onClickEdit }: any) => {
    return (
      <div>
        {items && items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            valIndex={index}
            value={value}
            onChangeItem={onChangeItem}
            onClickDelete={() => {
              onRemoveItem(index);
            }}
            onClickEdit={() => {
              onClickEdit(value, index);
            }}
          />
        ))}
      </div>
    );
  },
);