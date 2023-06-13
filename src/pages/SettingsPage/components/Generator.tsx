import React, { ReactElement } from 'react';
import { ContainerSetting, Setting } from '../models';
import FileManager from '../../../components/FileManager';
import { Form, Input, Select } from 'antd';

interface Props {
  data: ContainerSetting;
}

function Generator({ data }: Props): ReactElement {
  function generateInput(inputType: Setting['tipi'], value: any, desc: any, items: any) {
    switch (inputType) {
      case 'textbox':
        return <Input value={value} placeholder={desc} />;
      case 'textarea':
      case 'json_form':
        return (
          <Input.TextArea style={{   }} rows={4} value={value} placeholder={desc} />
        );
      case 'image':
        return <FileManager onChange={() => {}} />;
      case 'multiselect_urunler':
        return <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 mode="multiple" value={value} placeholder={desc}></Select>;
      case 'singleselect_urunkategori_slug':
        return <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 placeholder={desc}></Select>;
      case 'selectbox':
        return (
          <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 value={value} placeholder={desc}>
            {items.map((data: any, key: number) => (
              <Select.Option value={data.value}>{data.name}</Select.Option>
            ))}
          </Select>
        );
      case 'numeric':
        return <Input type="number" value={value} placeholder={desc} />;
      case "multiselect_urunkategori":
        return <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 mode="multiple" value={value} placeholder={desc}></Select>;
      default:
        return <div>Yok</div>;
    }
  }

  return (
    <div>
      <Form layout="vertical">
        {data.ayarlar.map((item, key) => (
          <Form.Item label={item.adi}>
            {generateInput(item.tipi, item.tanim, item.aciklama, item.item)}
          </Form.Item>
        ))}
      </Form>
    </div>
  );
}

export default Generator;
