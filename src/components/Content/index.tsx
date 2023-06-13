import React, { ReactElement, useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Popconfirm } from 'antd';
import FileManager from '../FileManager';
import TextEditor from '../TextEditor';
import { DeleteOutlined, DoubleRightOutlined, EditOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

function Content({ onChange, defaultValue }: any): ReactElement {
  const [_type, setType] = useState('0');
  const [_isMounted, setMounted] = useState(false);
  const [images, setImages] = useState<any[]>(defaultValue?.images || []);
  const [videos, setVideos] = useState<any[]>(defaultValue?.videos || []);
  const [medias, setMedias] = useState<any[]>(defaultValue?.medias || []);
  const [docs, setDocs] = useState<any[]>(defaultValue?.docs || []);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form] = Form.useForm<any>();
  const [editForm] = Form.useForm<any>();

  function onValid(fields: any) {
    switch (_type) {
      case '0':
        setImages((_items) => [..._items, fields]);
        break;
      case '1':
        setVideos((_items) => [..._items, fields]);
        break;
      case '2':
        setDocs((_items) => [..._items, fields]);
        break;
        case '3':
          setMedias((_items) => [..._items, fields])
      default:
        break;
    }
    form.resetFields();
  }

  function onValidEdit(fields: any) {
    if (editIndex !== null) {
      let _list = [...(_type === '0' ? images : _type === '1' ? videos : _type === "2"  ?  docs : medias)];
      _list[editIndex] = { ...fields };
      _type === '0'
        ? setImages([..._list])
        : _type === '1'
        ? setVideos([..._list])
        : _type === '2'
        ? setDocs([..._list])
        : setMedias([..._list]);
      setEditIndex(null);
      editForm.resetFields();
    }
  }

  useEffect(() => {
    if (!_isMounted) {
      setMounted(true);
    } else {
      onChange({ images, videos, docs, medias });
    }
  }, [images, videos, docs,medias]);

  return (
    <Card>
      <Row>
        <Col md={12}>
          <Form.Item label="İçerik Türü" >
            <Select
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              value={_type}
              onChange={(value) => {
                setType(value);
              }}
            >
              <Select.Option value="0">Alan-1</Select.Option>
              <Select.Option value="1">Alan-2</Select.Option>
              <Select.Option value="2">Alan-3</Select.Option>
              <Select.Option value="3">Alan-4</Select.Option>
              
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col md={12}>
          <Form form={form} onFinish={onValid} layout="vertical">
            <Form.Item
              label="Fotoğraf"
              name="url"
              //rules={[{ required: true, message: 'Lütfen Dosya Seçin!' }]}
            >
              <FileManager
                onChange={(_v) => {
                  form.setFieldsValue({ url: _v.path });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Başlık"
              name="title"
              //rules={[{ required: true, message: 'Lütfen Başlık Girin!' }]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Alt Başlık" name="document_link">
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Link" name="link">
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Açıklama / İçerik" name="description">
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
          <h4>
            {_type === '0'
              ? 'Alan 1 Listesi'
              : _type === '1'
              ? 'Alan 2 Listesi'
              : _type === '2'  ?
               'Alan 3 Listesi'
              :"Alan 4 Listesi"
              }
          </h4>
          <Card style={{ height: 450, overflowY: 'scroll' }}>
            <SortableList
              items={_type === '0' ? images : _type === '1' ? videos : _type==='2'? docs : medias}
              onClickEdit={(_value, _index) => {
                setEditIndex(_index);
                editForm.setFieldsValue({ ..._value });
              }}
              onSortEnd={({ oldIndex, newIndex }) => {
                const cb = (_list: any) => arrayMove(_list, oldIndex, newIndex);
                _type === '0' ? setImages(cb) : _type === '1' ? setVideos(cb) : _type === '2' ? setDocs(cb) : setMedias(cb);
              }}
              onChangeItem={(oldIndex, newIndex) => {
                const cb = (_items) => arrayMove(_items, oldIndex, newIndex);
                _type === '0' ? setImages(cb) : _type === '1' ? setVideos(cb) : _type === '2' ? setDocs(cb) : setMedias(cb);
              }}
              onRemoveItem={(itemIndex) => {
                const cb = (_list) => _list.filter((_, _index) => _index !== itemIndex);
                _type === '0' ? setImages(cb) : _type === '1' ? setVideos(cb) : _type === '2' ? setDocs(cb) : setMedias(cb);
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
                label="Fotoğraf"
                name="url"
                //rules={[{ required: true, message: 'Lütfen Dosya Seçin!' }]}
              >
                <FileManager
                  onChange={(_v) => {
                    editForm.setFieldsValue({ url: _v.path });
                  }}
                  defaultValue={editForm.getFieldValue('url')}
                />
              </Form.Item>
              <Form.Item
                label="Başlık"
                name="title"
                //rules={[{ required: false, message: 'Lütfen Başlık Girin!' }]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item label="Alt Başlık" name="document_link">
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="Link"
                name="link"
                //rules={[{ required: false, message: 'Lütfen Link Girin!' }]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item label="Açıklama / İçerik" name="description">
                <TextEditor style={{}}  />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </Card>
  );
}

export default Content;

const SortableItem = SortableElement(
  ({ value, valIndex, onChangeItem, onClickDelete, onClickEdit }) => {
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
              title={'Silmek istediğinizden emin misiniz?'}
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
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            valIndex={index}
            value={value}
            onChangeItem={onChangeItem}
            onClickEdit={() => {
              onClickEdit(value, index);
            }}
            onClickDelete={() => {
              onRemoveItem(index);
            }}
          />
        ))}
      </div>
    );
  },
);
