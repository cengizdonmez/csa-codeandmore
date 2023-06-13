import React, {useEffect, useState} from 'react';
import {Avatar, Button, Col, Form, Input, InputNumber, message, Modal, Radio, Row, Slider, Tabs, Upload} from 'antd';
import {UploadOutlined} from "@ant-design/icons/lib";
import ReactQuill from 'react-quill';
import {SliderListItem} from '../data.d';
import 'react-quill/dist/quill.snow.css';
import {LanguageListItem} from "@/pages/LanguageList/data";
import ImgCrop from "antd-img-crop";
import {SketchPicker} from 'react-color';

const {TabPane} = Tabs;

export interface FormValueType extends Partial<SliderListItem> {
  id?: number;
  languageId?: number;
  iconPath?: string;
  status?: boolean;
  rowNumber?: number;
  title?: string;
  color?: string;
  opacity?:number;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<SliderListItem>
  languageList: Array<LanguageListItem>;
}

const FormItem = Form.Item;

export interface UpdateFormState {
  formVals: FormValueType;

}

const formLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 17},
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const fakeImageList = ["https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1600884559813-780c7f75480c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    "https://images.unsplash.com/photo-1516220362602-dba5272034e7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
  ]
  const [radioState, setRadioState] = useState<number>(1);
  const [slideState, setSlideState] = useState<boolean>(1);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields()
  }, [props.values]);

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    languageList
  } = props;

  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({...props.values, ...fieldsValue});
  };
  const handleLanguageChange = (changedValue: any) => {
    form.setFieldsValue({languages: changedValue});
  }

  function beforeUpload(file:any) {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Resim boyutu 4MB\'tan küçük olmalı!');
    }
    return isLt2M;
  }

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow!.document.write(image.outerHTML);
  };
  const handleColorChange = (changedValue: any) => {
    form.setFieldsValue({backgroundColor: changedValue.hex});
  }

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>İptal</Button>
        <Button type="primary" onClick={() => handleNext()}>
          Güncelle
        </Button>
      </>
    );
  };
  const onChange = (current: any) => {
    setCurrentStep(current);
    handleLanguageChange(languageList[current]?.abbreviationName)
  };
  const onFileChange = ({fileList: newFileList}:any) => {
    setFileList(newFileList);
  };
  const onRadioChange = (e: any) => {
    setRadioState(e.target.value
    );
  };
  const onSlideChange = (value: any) => {
    if (!value) {
      return;
    }
    setSlideState(value);
  };
  return (
    <Modal
      width={1500}
      bodyStyle={{padding: '32px 40px 48px'}}
      destroyOnClose
      title="Slider Güncelleme"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}>
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          languageId: values.languageId,
          icon: values.iconPath,
          status: values.status,
          rowNumber: values.rowNumber,
          title: values.title,
          color: values.color,
          opacity: values.opacity
        }}>
        <Tabs activeKey={currentStep.toString()} onChange={onChange}>
          {languageList.map((item: any, index: number) => (
            <TabPane
              tab={<span><Avatar src={item.flag} style={{padding: 3}}/>{item.name}</span>}
              key={index}>
              <FormItem
                name="image"
                label="Slider Görseli"
              >
                <Radio.Group onChange={onRadioChange} value={radioState}>
                  {fakeImageList.map((image: any, i: number) => (
                    <Radio value={i} style={{width: 200, height: 70}}>
                      <img width="100" src={image} alt=""/>
                    </Radio>
                  ))}
                  <Radio value={4} style={{width: 200, height: 70}}>
                    Yeni Slider İkonu Ekle...
                    {radioState === 4 ?
                      <>
                        <ImgCrop rotate grid aspect={1 / 1}>
                          <Upload listType="picture-card" onPreview={onPreview} multiple={false}
                                  accept="image/*"
                                  beforeUpload={beforeUpload} fileList={fileList}
                                  onChange={onFileChange}>
                            {fileList.length < 1 && <Button>
                              <UploadOutlined/> Yükle
                            </Button>}
                          </Upload>
                        </ImgCrop> </> : null}
                  </Radio>
                </Radio.Group>
              </FormItem>
              <FormItem
                name="backgroundColor"
                label="Arka Plan Rengi"
                valuePropName="color">
                <SketchPicker onChangeComplete={handleColorChange}
                              color={form.getFieldValue("backgroundColor")}/>
              </FormItem>
              <FormItem
                name="title"
                label="Başlık"
                rules={[{required: true, message: 'Lütfen Başlık Giriniz！'}]}
              >
                <ReactQuill theme="snow" modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{'header': 1}, {'header': 2}],               // custom button values
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                    [{'direction': 'rtl'}],                         // text direction

                    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],

                    [{'color': ["#000000", "#e60000", "#de4500", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']}, {'background': ["#000000", "#e60000", "#ff9900", "#de4500", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']}],          // dropdown with defaults from theme
                    [{'font': []}],
                    [{'align': []}],

                    ['clean']                                         // remove formatting button
                  ]
                }}/>
              </FormItem>
              <FormItem
                name="opacity"
                label="Saydamlık">
                <Row>
                  <Col span={12}>
                    <Slider
                      min={0}
                      max={1}
                      onChange={onSlideChange}
                      value={typeof slideState === 'number' ? slideState : 0}
                      step={0.01}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={0}
                      max={1}
                      style={{margin: '0 16px'}}
                      step={0.01}
                      value={slideState}
                      onChange={onSlideChange}
                    />
                  </Col>
                </Row>
              </FormItem>
              <FormItem name="link" label="Link">
                <Input/>
              </FormItem>
            </TabPane>
          ))}
        </Tabs>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
