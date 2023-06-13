import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Slider,
  Switch,
  Tabs,
  Upload,
} from 'antd';
import { SliderListItem } from '@/pages/SliderList/data';
import { UploadOutlined } from '@ant-design/icons/lib';
import { SketchPicker } from 'react-color';
import ImgCrop from 'antd-img-crop';
import ReactQuill from 'react-quill';
import capitalizePropNames from '@/utils/capitalizePropNames';
import { LanguageListItem } from '@/pages/LanguageList/data';

const { TabPane } = Tabs;

export interface FormValueType extends Partial<SliderListItem> {
  languageId?: number;
  icon?: any;
  iconPath?: string;
  status?: boolean;
  rowNumber?: number;
  title?: string;
  color?: string;
  opacity?: number;
}

interface CreateFormProps {
  createModalVisible: boolean;
  onSubmit: (values: FormValueType, languageId: number) => void;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  languageList: LanguageListItem[];
}

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
};
const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {
    createModalVisible,
    onCancel: handleCreateModalVisible,
    onSubmit: handleCreate,
    languageList,
  } = props;

  const fakeImageList = ['https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600884559813-780c7f75480c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1516220362602-dba5272034e7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
  ];

  const [formVals, setFormVals] = useState<FormValueType>({
    languageId: 0,
    icon: {},
    status: false,
    rowNumber: 0,
    title: 'false',
    color: '',
    opacity: 0,
  });
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [radioState, setRadioState] = useState<number>(1);
  const [slideState, setSlideState] = useState<boolean>(1);
  const [hasBackground, setHasBackground] = useState<boolean>(false);
  const [chooseUpload, setChooseUpload] = useState<boolean>(false);

  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [props.createModalVisible]);


  const handleSave = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...capitalizePropNames(formVals), ...capitalizePropNames(fieldsValue) });
    handleCreate({ ...capitalizePropNames(formVals), ...capitalizePropNames(fieldsValue) });
  };
  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleCreateModalVisible(false)}>İptal</Button>
        <Button type="primary" onClick={() => handleSave()}>
          Kaydet
        </Button>
      </>
    );

  };
  const handleLanguageChange = (changedValue: any) => {
    form.setFieldsValue({ languages: changedValue });
    let b = new Set(changedValue);
    let differenceLanguage = [...languageList].filter(x => !b.has(x));
  };

  const handleColorChange = (changedValue: any) => {
    form.setFieldsValue({ backgroundColor: changedValue.hex });
  };

  function beforeUpload(file: any) {
    const isLt2M = file.size / 1024 / 1024 < 4;
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

  const onChange = (current: any) => {
    setCurrentStep(current);
    handleLanguageChange(languageList[current]?.abbreviationName);
  };
  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onRadioChange = (e: any) => {
    setRadioState(e.target.value,
    );
  };
  const onSlideChange = (value: any) => {
    if (!value) {
      return;
    }
    setSlideState(value);
  };
  const onChangeHasBackground = (value: any) => {
    setHasBackground(value);
  };
  const onChangeChooseUpload = (value: any) => {
    setChooseUpload(value);
  };
  return (
    <Modal
      destroyOnClose
      width={1500}
      title="Yeni Slider"
      visible={createModalVisible}
      onCancel={() => handleCreateModalVisible(false)}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          icon: '',
          iconPath: '',
          color: '',
          title: '',
          opacity: 1,
          status: false,
          link: '',
        }}
      >

        <Tabs activeKey={currentStep.toString()} onChange={onChange}>
          {languageList.map((item: any, index: number) => (
            <TabPane
              tab={
                <span>
         <Avatar src={item.flag} style={{ padding: 3 }} />
                  {item.name}
        </span>
              }
              key={index}>
              <FormItem
                label=" Yeni Slider resmi yükle ">
                <Switch onChange={onChangeChooseUpload} checkedChildren={<UploadOutlined />}
                />
                <br />
              </FormItem>
              <FormItem
                name="iconPath"
                label="Slider Görseli"
                hidden={chooseUpload}
              >
                <Radio.Group onChange={onRadioChange} value={radioState}>
                  {fakeImageList.map((item: any, index: number) => (
                    <Radio value={index} style={{ width: 200, height: 70 }}>
                      <img width="100" src={item} alt="" />
                    </Radio>
                  ))}
                </Radio.Group>
              </FormItem>

              <FormItem
                name="icon"
                label="Slider Görseli"
                hidden={!chooseUpload}
              >
                <ImgCrop rotate grid aspect={1 / 1}>
                  <Upload listType="picture-card" onPreview={onPreview} multiple={false}
                          accept="image/*"
                          beforeUpload={beforeUpload} fileList={fileList}
                          onChange={onFileChange}>
                    {fileList.length < 1 && <Button>
                      <UploadOutlined /> Yükle
                    </Button>}
                  </Upload>
                </ImgCrop>
              </FormItem>
              <FormItem
                label="Arka Plan Rengi">
                <Switch checkedChildren="var" unCheckedChildren="yok" onChange={onChangeHasBackground} />
                <br />
              </FormItem>
              <FormItem
                name="color"
                label="Arka Plan Rengi Ekle"
                valuePropName="color"
                hidden={!hasBackground}
              >
                <SketchPicker
                  onChangeComplete={handleColorChange}
                  color={form.getFieldValue('color')} />
              </FormItem>
              <FormItem
                name="title"
                label="Başlık"
                rules={[{ required: true, message: 'Lütfen Başlık Giriniz！' }]}
              >
                <ReactQuill theme="snow" modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction

                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    [{ 'color': ['#000000', '#e60000', '#de4500', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': ['#000000', '#e60000', '#ff9900', '#de4500', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean'],                                         // remove formatting button
                  ],
                }} />
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
                      style={{ margin: '0 16px' }}
                      step={0.01}
                      value={slideState}
                      onChange={onSlideChange}
                    />
                  </Col>
                </Row>
              </FormItem>
              <FormItem name="link" label="Link">
                <Input />
              </FormItem>
              <FormItem name="rowNumber" label="Sıralama">
                <InputNumber />
              </FormItem>
              <FormItem
                name="languageId"
              >
                <Input value={item.id} />
              </FormItem>
              <FormItem>
                <Button type="primary"
                        onClick={() => handleSave()}
                        style={{ backgroundColor: 'white', borderColor: '#007bff', color: '#007bff' }}>
                  {item.name} için Kaydet
                </Button>
              </FormItem>
            </TabPane>

          ))}
        </Tabs>
      </Form>
    </Modal>
  );
};

export default CreateForm;
