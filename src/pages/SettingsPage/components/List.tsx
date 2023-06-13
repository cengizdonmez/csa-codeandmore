import React, {
  ReactElement,
  useState,
  useEffect,
  useLayoutEffect,
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Table,
  Spin,
  Slider,
  Modal,
  Card,
  Switch,
} from 'antd';
import FileManager from '../../../components/FileManager';
import { Setting, itemType, ThemeSetting, ThemeSettingData, Item } from '../models';
import { useListAll, CategoryUrl, useListByLang } from '../../CategoryPages/services';

import { WebPageUrl } from '../../PagePages/service';

import { Multiselect, Selectbox } from './FormGenerator';
import { SketchPicker, CirclePicker } from 'react-color';
import useLanguage from '../../../hoxmodels/language';
import { Editor } from '@tinymce/tinymce-react';
import TextEditor from '../../../components/TextEditor';
import { LanguageListItem } from '@/components/RightContent';
import { useHistory } from 'umi';
import usePath from '@/hoxmodels/path';
interface Props {
  itemList: Item[];
  datavalue: any;
  onChange: any;
}

function List({ itemList, onChange, datavalue, save, perms }: Props): ReactElement {
  const [data, setData] = useState<{ key: string; value: string }[]>(datavalue);
  const [isAdd, setAdd] = useState(false);
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);
  const [isMounted, setMounted] = useState(false);
  const [form] = Form.useForm<any>();
  const { language } = useLanguage();
  const [getLanguages, languages, languagesStat] = useListAll<LanguageListItem>('/Language/getall');
  const [getPages, pages, pagesStatus] = useListByLang<any>(WebPageUrl.listByLang);
  const updateFormRef = useRef();
  const history = useHistory();
  const { path, onSetPath } = usePath();

  function generateInput(itemType: itemType, key: string) {
    switch (itemType) {
      case 'textbox':
        return (
          <Input
            type="text"
            onChange={({ currentTarget: { value } }) => {
              form.setFieldsValue({
                [key]: value ? value : '',
              });
            }}
          />
        );
      case 'language_abbr_select':
        return (
          <Select
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            loading={languagesStat !== 'fulfilled'}
            onChange={(val) => {
              form.setFieldsValue({
                [key]: val ? val : null,
              });
            }}
          >
            {languages &&
              languages.map((language) => (
                <Select.Option value={language.abbreviationName}>
                  {language.abbreviationName}
                </Select.Option>
              ))}
          </Select>
        );
      case 'text_editor':
        return <TextEditor />;
      case 'textarea':
        return (
          <Input.TextArea
            style={{}}
            onChange={({ currentTarget: { value } }) => {
              form.setFieldsValue({
                [key]: value ? value : '',
              });
            }}
          />
        );
      case 'numeric':
        return (
          <Input
            type="number"
            onChange={({ currentTarget: { value } }) => {
              form.setFieldsValue({
                [key]: value ? value : null,
              });
            }}
          />
        );
      case 'image':
        return <SpecialFileManager />;
      case 'multiselect_kategoriler':
        return (
          <Multiselect
            onChange={(_v) => {
              form.setFieldsValue({
                [key]: _v,
              });
            }}
            url={CategoryUrl.listByLang}
          />
        );
      case 'checkbox':
        return <CustomSwitch onChange={(_v) => {
          form.setFieldsValue({
            [key]: _v,
          });
        }} />;
      case 'selectbox_pages':
        return (
          <Select
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            box
            onChange={(_v) => {
              form.setFieldsValue({
                [key]: _v,
              });
            }}
            url={WebPageUrl.listByLang}
          />
        );
      case 'color':
        return (
          <Input
            type="text"
            onChange={({ currentTarget: { value } }) => {
              form.setFieldsValue({
                [key]: value ? value : '',
              });
            }}
          />
        );
      case 'range-slider':
        return (
          <Slider
            min={0}
            max={1}
            onChange={(_value) => {
              form.setFieldsValue({
                [key]: _value,
              });
            }}
            step={0.01}
          />
        );
      default:
        return <small>...</small>;
    }
  }
  function onValid(fields: any) {
    setData((_data) => [..._data, { ...fields }]);
    setAdd(false);
    updateFormRef.current.reset();
    form.resetFields();
  }
  function onDelete(index: number) {
    setData((_data) => _data.filter((_, _index) => _index !== index));
  }

  useLayoutEffect(() => {
    if (!isMounted) {
      getLanguages();
      if (language) {
        getPages(language.abbreviationName);
      }
      setMounted(true);
    } else {
      onChange(data);
      save();
    }
  }, [data]);

  function generateCell(cellType, value) {
    switch (cellType) {
      case 'image':
        return <img src={path + value} alt="Image" style={{ width: 75, height: 50 }} />;
      case 'selectbox_pages':
        return (
          <Select
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            Cell
            list={pages}
            value={value}
            status={pagesStatus}
          />
        );
      case 'checkbox':
        return <small>{!!value ? "Aktif" : "Pasif"}</small>
      default:
        return (
          <small>
            {typeof value === 'string'
              ? value.length > 50
                ? value.substring(0, 30) + '...'
                : value
              : value}
          </small>
        );
    }
  }

  function updateFormValid(fields: any) {
    let tmpData = [...data];
    tmpData[updateIndex] = { ...fields };
    console.log({ fields, tmpData });
    setData(tmpData);
    setUpdateIndex(null);
  }

  const _perms = perms || { list: true, create: true, update: true, delete: true };

  if (!_perms.list) {
    history.push('/');
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {_perms.create && (
          <Button
            danger
            onClick={() => {
              setAdd(true);
            }}
          >
            Ekle
          </Button>
        )}
      </div>
      <Table
        bordered={true}
        style={{ width: '100%', marginBottom: '3em', marginTop: '1em' }}
        columns={[
          ...itemList.map((item) => ({
            key: item.key,
            dataIndex: item.key,
            title: item.name,
            render: (_, record) => {
              const __item = itemList.find((_item) => _item.key === item.key);
              return generateCell(__item.type, record[item.key]);
            },
          })),
          {
            title: 'İşlemler',
            render: (_, record, index) => {
              return (
                <Fragment>
                  {_perms.update && (
                    <Button
                      onClick={() => {
                        setUpdateIndex(index);
                      }}
                    >
                      Güncelle
                    </Button>
                  )}
                  {_perms.delete && (
                    <Button
                      danger
                      onClick={() => {
                        onDelete(index);
                      }}
                    >
                      Sil
                    </Button>
                  )}
                </Fragment>
              );
            },
          },
        ]}
        dataSource={data}
        tableLayout={'fixed'}
        indentSize={1}
      />
      <Modal
        visible={isAdd}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setAdd(false);
          form.resetFields();
        }}
      >
        <div style={{ marginTop: '2em' }}>
          <Form form={form} onFinish={onValid} layout="vertical">
            {itemList.map((item) => (
              <Form.Item label={item.name} name={item.key}>
                {generateInput(item.type, item.key)}
              </Form.Item>
            ))}
          </Form>
        </div>
      </Modal>
      <Modal
        visible={updateIndex !== null}
        onOk={() => {
          updateFormRef.current.submit();
        }}
        onCancel={() => {
          setUpdateIndex(null);
        }}
      >
        {updateIndex !== null && (
          <UpdateForm
            ref={updateFormRef}
            {...{ generateInput, itemList }}
            defaultValue={data[updateIndex]}
            onValid={updateFormValid}
          />
        )}
      </Modal>
    </div>
  );
}

export default List;

const UpdateForm = forwardRef(({ onValid, itemList, defaultValue, generateInput }, ref) => {
  const [fform] = Form.useForm<any>();
  useLayoutEffect(() => {
    fform.setFieldsValue(defaultValue);
  }, [defaultValue]);
  useImperativeHandle(ref, () => ({
    submit: () => {
      fform.submit();
    },
    reset: () => {
      return fform.resetFields();
    },
  }));
  return (
    <div style={{ marginTop: '2em' }}>
      <Form form={fform} onFinish={onValid} layout="vertical">
        {itemList.map((item) => {
          console.log(item);
          return (
            <Form.Item label={item.name} name={item.key}>
              {generateInput(item.type, item.key)}
            </Form.Item>
          );
        })}
      </Form>
    </div>
  );
});

function MultiselectCell({ value, list, status }) {
  if (status !== 'fulfilled') {
    return '...';
  }

  const rows = [];
  value.forEach((id) => {
    const item = list.find((_item) => _item.id === id);
    if (item) {
      rows.push(<div>{item.name || item.title}</div>);
    }
  });

  return <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>{rows}</div>;
}

function SelectCell({ value, list, status }) {
  if (status !== 'fulfilled') {
    return '...';
  }
  const item = list.find((_item) => _item.id === value);

  return <div>{item && (item.name || item.title)}</div>;
}

function SpecialFileManager({ value, onChange }) {
  return (
    <FileManager
      defaultValue={value}
      onChange={(v) => {
        onChange(v.path);
      }}
    />
  );
}


function CustomSwitch({value, onChange}: any) {
  return (
<Switch checked={value} onChange={onChange} />

  )
}