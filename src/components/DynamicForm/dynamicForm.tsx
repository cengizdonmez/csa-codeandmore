import AccordionContent from "@/components/AccordionContent";
import Content from "@/components/Content";
import TextEditor from "@/components/TextEditor";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Button, Select, Row, Col, Collapse, Input } from "antd";
import { Option } from "antd/lib/mentions";
import React, { FC, useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import FileManager from "@/components/FileManager";
import NestableList from "../Nestable";

const { Panel } = Collapse;

type props = {
  formFields: any[];
  setFormFields: React.Dispatch<React.SetStateAction<any[]>>;
};

const DynamicForm: FC<props> = ({ formFields, setFormFields }) => {
  const [selectedFormOption, setSelectedFormOption] = useState<string | null>(
    null
  );

  const add = () => {
    if (!!selectedFormOption) {
      let newField;
      if (
        selectedFormOption === DynamicFormFields.youtubeLink ||
        selectedFormOption === DynamicFormFields.fileManagement
      ) {
        newField = {
          id: formFields.length + 1 || 0,
          name: selectedFormOption,
          value: { title: "", url: "" },
        };
      } else {
        newField = {
          id: formFields.length + 1 || 0,
          name: selectedFormOption,
          value: "",
        };
      }

      setFormFields([...formFields, newField]);
      setSelectedFormOption(null);
    }
  };

  const handleFormItemTypChange = (e: any) => {
    setSelectedFormOption(e);
  };

  useEffect(() => {
    console.log({ ...formFields });
  }, [formFields]);

  return (
    <>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Extra" key={1}>
          <NestableList
            maxDepth={1}
            items={formFields}
            renderItem={createFormField}
            onChange={(e) => {
              console.log("değişen form", e);
              setFormFields([...e]);
            }}
          />
        </Panel>
      </Collapse>

      <Row style={{ marginTop: "1rem" }}>
        <Col xs={24} md={4} span="8">
          <Form.Item>
            <Select
              placeholder="Seçiniz"
              onChange={(e) => handleFormItemTypChange(e)}
              value={selectedFormOption}
            >
              <Option value={DynamicFormFields.htmlContent.toString()}>
                Html Content
              </Option>
              <Option value={DynamicFormFields.accordionContent.toString()}>
                Accordion Content
              </Option>
              <Option value={DynamicFormFields.dokumanIcerik.toString()}>
                Doküman İçerik
              </Option>
              <Option value={DynamicFormFields.youtubeLink.toString()}>
                Youtube Link
              </Option>
              <Option value={DynamicFormFields.fileManagement.toString()}>
                Dosya Ekle(Resim,Excel vb.)
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={20} span="8">
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              disabled={!selectedFormOption}
            >
              Add
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  function createFormField({ item, index, ...props }) {
    const genExtra = (index: number) => (
      <DeleteOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          var prev = [...formFields];
          prev.splice(index, 1);
          setFormFields([...prev]);
        }}
      />
    );

    switch (item.name) {
      case DynamicFormFields.htmlContent:
        return (
          <Collapse>
            <Panel header="Html Content" key={index} extra={genExtra(index)}>
              <Form.Item rules={[{ required: true }]}>
                <TextEditor
                  onChange={(content: any) => {
                    console.log(content);
                    let data = [...formFields];
                    data[index].value = content;
                    setFormFields(data);
                  }}
                  value={formFields[index]?.value}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        );
      case DynamicFormFields.accordionContent:
        return (
          <Collapse>
            <Panel
              header="Accordion Content"
              key={index}
              extra={genExtra(index)}
            >
              <Form.Item rules={[{ required: true }]}>
                <AccordionContent
                  defaultValue={formFields[index]?.value}
                  onChange={(_val: any) => {
                    let data = [...formFields];
                    data[index].value = _val;
                    setFormFields(data);
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        );
      case DynamicFormFields.dokumanIcerik:
        return (
          <Collapse>
            <Panel header="Döküman İçerik" key={index} extra={genExtra(index)}>
              <Form.Item label="Döküman İçerik" rules={[{ required: true }]}>
                <Content
                  defaultValue={formFields[index]?.value}
                  onChange={(_val: any) => {
                    let data = [...formFields];
                    data[index].value = _val;
                    setFormFields(data);
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        );
      case DynamicFormFields.youtubeLink:
        return (
          <Collapse>
            <Panel header="Youtube Link" key={index} extra={genExtra(index)}>
              <Form.Item label="Başlık" rules={[{ required: true }]}>
                <Input
                  defaultValue={formFields[index]?.value.title}
                  type="text"
                  placeholder="Başlık Giriniz."
                  onChange={(e: any) => {
                    console.log(e.target.value);
                    let data = [...formFields];
                    data[index].value.title = e.target.value;
                    setFormFields(data);
                  }}
                />
              </Form.Item>
              <Form.Item label="Link" rules={[{ required: true }]}>
                <Input
                  defaultValue={formFields[index]?.value.url}
                  type="text"
                  placeholder="Link giriniz."
                  onChange={(e: any) => {
                    let data = [...formFields];
                    data[index].value.url = e.target.value;
                    setFormFields(data);
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        );
      case DynamicFormFields.fileManagement:
        return (
          <Collapse>
            <Panel
              header="Dosya Yönetimi"
              key={index + 7}
              extra={genExtra(index)}
            >
              <FileManager
                onChange={(_val) => {
                  console.log("filemanager değeri ", _val.path);
                  let data = [...formFields];
                  data[index].value.url = _val.path;
                  setFormFields(data);
                }}
                editorMode
                editorModeText="Dosya Yönetimi"
              />
              <Form.Item label="Başlık" rules={[{ required: true }]}>
                <Input
                  value={formFields[index]?.value?.title}
                  type="text"
                  placeholder="Başlık Giriniz."
                  onChange={(e: any) => {
                    console.log(e.target.value);
                    let data = [...formFields];
                    data[index].value.title = e.target.value;
                    setFormFields(data);
                  }}
                />
              </Form.Item>
              <Form.Item label="Link" rules={[{ required: true }]}>
                <Input
                  type="text"
                  readOnly
                  placeholder="Link..."
                  value={formFields[index]?.value?.url}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        );
      default:
        return null;
    }
  }
};

export default DynamicForm;

export enum DynamicFormFields {
  htmlContent = "HtmlContent",
  accordionContent = "AccordionContent",
  dokumanIcerik = "DokumanIcerik",
  youtubeLink = "YoutubeLink",
  fileManagement = "FileManagement",
}
