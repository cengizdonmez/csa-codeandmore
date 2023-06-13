import React, {
  ReactElement,
  useState,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Spin, Switch } from 'antd';
import FileManager from '../../../components/FileManager';
import TextEditor from '../../../components/TextEditor';
import {
  useCreate,
  useGetOne,
  useEdit,
  useListAll,
  useListByLang,
} from '../../CategoryPages/services';
import { WebPageUrl } from '../service';
import 'react-quill/dist/quill.snow.css';
import { WebPage, WebPageCreateFields, WebPageOne } from '../data';
import slugify from '../../../helper/slug';
import useLanguage from '../../../hoxmodels/language';
import AccordionContent from '@/components/AccordionContent';
import Content from '@/components/Content';

interface Props {}


interface CreateForm {
  name: string;
  slug: string;
  sort_Description: string;
  seo_Title: string;
  seo_Keyword: Array<string>;
  seo_Description: string;
  publish_Status: string | number;
  similar_Webpage: Array<any>;
}


export type PageEditRef = {
  submit: () => void;
};

interface Props {
  loading?: boolean;
  token: string | number;
  onClose: () => void;
}

const PageEdit = forwardRef<PageEditRef, Props>(
  ({ token, onClose }, ref): ReactElement => {
    const [form] = Form.useForm<CreateForm>();
    const { language } = useLanguage();
    const [galleryForm] = Form.useForm();
    const [onCreate] = useCreate<WebPageCreateFields, WebPage>(WebPageUrl.create);
    const [onGetOne, pageOne, pageStatus] = useGetOne<WebPageOne>(WebPageUrl.one);
    const [onEdit, , editStatus] = useEdit<WebPageCreateFields, WebPage>(WebPageUrl.edit);
    const [getPageList, pageList, pageAllStatus] = useListByLang<WebPage>(WebPageUrl.listByLang);
    const [getTemps, temps, tempsStatus] = useListAll<any[]>('/Template/getall');

    const [htmlContent, setHtmlContent] = useState<string>('');
    const [thumb, setThumb] = useState<string>('');
    const [smallImage, setSmallImage] = useState<string>('');
    const [contents, setContents] = useState({ images: [], videos: [], docs: [] });
    const [accords, setAccords] = useState([]);

  
 
    async function create(fields: WebPageCreateFields) {
      try {
        await onEdit(fields);
        onClose();
      } catch (error) {}
    }

    const onFinish = (values: CreateForm) => {
      create({
        name: values.name,
        description: values.description,
        slug: values.slug,
        seo_Description: values.seo_Description,
        seo_Title: values.seo_Title,
        seo_Keyword: values.seo_Keyword ? values.seo_Keyword.join(',') : '',
        publish_Status: !!values.publish_Status ? values.publish_Status.join(',') : '0',
        similar_Webpage: values.similar_Webpage ? values.similar_Webpage.join(',') : '',
        cover_Image: thumb,
        sort_Image: smallImage,
        template: values.template,
        document_Contents: contents,
        html_Content: htmlContent,
        accordion_Content: accords,
        appoinment: values.appoinment,
        parent_Page: values.parent_Page ? parseInt(values.parent_Page) : null,
        sub_id: pageOne?.sub_id,
        sub_type: pageOne?.sub_type,
        id: pageOne?.id,
        token: pageOne?.token,
        langCode: pageOne?.langCode,
        status: true,
      });
    };

    const onFinishFailed = (errorInfo: any) => {
    };

    async function getData() {
      const data = await onGetOne(token);
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        seo_Description: data.seo_Description,
        seo_Keyword: data.seo_Keyword?.split(','),
        seo_Title: data.seo_Title,
        publish_Status: data.publish_Status !== null ? String(data.publish_Status).split(',') : '',
        similar_Webpage:
          data.similar_Webpage && data.similar_Webpage.length > 0
            ? data.similar_Webpage?.split(',')
            : [],
        slug: data.slug,
        template: data.pageTemplate,
        appoinment: data.appoinment,
        parent_Page: `${data.parent_Page}`
      });
      setSmallImage(data.sort_Image);
      setContents(data.document_Contents);
      setHtmlContent(data.html_Content);
      setAccords(data.accordion_Content);
    }

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.submit();
      },
    }));

    useLayoutEffect(() => {
      getData();
      getTemps();
      if (language) {
        getPageList(language.abbreviationName);
      }
    }, [language, token]);

    if (pageStatus === 'pending' || pageAllStatus === 'pending') {
      return (
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}
        >
          <Spin size="large" spinning />
        </div>
      );
    }

    if (pageStatus === 'rejected') {
      return (
        <div>
          <h1>Hata Oluştu</h1>
        </div>
      );
    }

    return (
      <div style={{ paddingTop: '3em' }}>
        <Form layout="vertical" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Row gutter={12}>
            <Col xs={24} md={16} span="16">
              <Card title="Genel Bilgiler">
                <Form.Item
                  label="Sayfa Adı"
                  required
                  requiredMark="optional"
                  name="name"
                  rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
                >
                  <Input
                    placeholder="Sayfa Adı Giriniz..."
                    onChange={(e) => {
                      form.setFieldsValue({
                        slug: slugify(e.currentTarget.value),
                        seo_Title: e.currentTarget.value,
                        seo_Description: e.currentTarget.value,
                        seo_Keyword: e.currentTarget.value
                          .split(' ')
                          .filter((val) => !!val.replace(/[^\w-]+/g, '')),
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="URL"
                  required
                  extra="Web Adresi"
                  requiredMark="optional"
                  name="slug"
                  rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
                >
                  <Input
                    placeholder="Web Adresi Giriniz..."
                    onChange={({ currentTarget: { value } }) => {
                      form.setFieldsValue({ slug: slugify(value) });
                    }}
                  />
                </Form.Item>
                <Form.Item label="Açıklama" required requiredMark="optional" name="description">
                  <Input.TextArea
                    style={{   }}
                    rows={5}
                    placeholder="Açıklama Giriniz..."
                  />
                </Form.Item>
              </Card>
              <Card title="İçerik Bilgisi" style={{ marginTop: '1em' }}>
                <Form.Item
                  label="HTML İçerik"
                  required
                  requiredMark="optional"
                  rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
                >
                  <TextEditor
                    value={htmlContent}
                    onChange={(content) => {
                      setHtmlContent(content);
                    }}
                  />
                </Form.Item>
                <Form.Item label="Döküman İçerik">
                  <Content onChange={(_val) => setContents(_val)} defaultValue={contents} />
                </Form.Item>
                <Form.Item label="Akordiyon İçerik">
                  <AccordionContent
                    onChange={(_val) => {
                      setAccords(_val);
                    }}
                    defaultValue={accords}
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col xs={24} md={8} span="8">
              <Card>
                <Form.Item label="Template Tipi" name="template" rules={[{ required: true }]}>
                  <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 placeholder="Template Seç">
                    {temps &&
                      temps.map((temp) => (
                        <Select.Option value={temp.name}>
                          {temp.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Yayın Durumu"
                  required
                  requiredMark="optional"
                  name="publish_Status"
                >
                  <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch

                    placeholder="Yayın Durumu Seçiniz..."
                    mode="multiple"
                    optionFilterProp="children"
                    defaultValue="0"
                  >
                    <Select.Option value="0">Yayında</Select.Option>
                    <Select.Option value="3">Yayında(no-index) Google'da görünmez</Select.Option>
                    <Select.Option value="4">
                      Yayında (no-sitemap) Site Haritasında görünmez
                    </Select.Option>
                    <Select.Option value="5">Yayında (no-search) Aramalarda görünmez</Select.Option>
                    <Select.Option value="1">Beklemede</Select.Option>
                    <Select.Option value="2">Taslak</Select.Option>
                    <Select.Option value="6">Pop-Up</Select.Option>
                  </Select>
                </Form.Item>
                {/* <Form.Item
                  label="Hızlı Randevu Alanı"
                  extra="Hızlı Randevu Alanı Gösterilsin Mi?"
                  name="appoinment"
                >
                  <Switch />
                </Form.Item> */}
                <Form.Item label="Üst Sayfa" required requiredMark="optional" name="parent_Page">
                  <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch

                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Sayfa Seçiniz..."
                    onChange={() => {}}
                    loading={pageStatus !== 'fulfilled'}
                  >
                    {pageStatus === 'fulfilled' &&
                      pageList.map((page, key) => (
                        <Select.Option key={key} value={page.id!.toString()}>
                          {page.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                {/* <Form.Item
                  label="Sol Menü İçerikleri"
                  required
                  requiredMark="optional"
                  name="similar_Webpage"
                >
                  <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch

                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Sayfa Seçiniz..."
                    onChange={() => {}}
                    loading={pageStatus !== 'fulfilled'}
                  >
                    {pageStatus === 'fulfilled' &&
                      pageList.map((page, key) => (
                        <Select.Option value={page.id!}>{page.name}</Select.Option>
                      ))}
                  </Select>
                </Form.Item> */}
                <Form.Item label="Kapak Resmi" required requiredMark="optional">
                  <FileManager
                    onChange={(data) => {
                      setThumb(data.path || '');
                    }}
                  />
                </Form.Item>
                <Form.Item label="Küçük Resim" required requiredMark="optional">
                  <FileManager
                    onChange={(data) => {
                      setSmallImage(data.path || '');
                    }}
                  />
                </Form.Item>
              </Card>
              <Card title="Seo Bilgileri" style={{ marginTop: '1em' }}>
                <Form.Item
                  label="Seo Başlığı"
                  required
                  requiredMark="optional"
                  name="seo_Title"
                  rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
                >
                  <Input placeholder="Seo Başlığı Giriniz..." />
                </Form.Item>
                <Form.Item
                  label="Seo Etiketleri"
                  required
                  requiredMark="optional"
                  name="seo_Keyword"
                  rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
                >
                  <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Seo Etiketleri Giriniz..."
                    onChange={(data) => {
                      form.setFieldsValue({
                        seo_Keyword: data.filter((val) => !!val.replace(/[^\w-]+/g, '')),
                      });
                    }}
                  ></Select>
                </Form.Item>
                <Form.Item
                  label="Seo Açıklama"
                  required
                  requiredMark="optional"
                  name="seo_Description"
                  rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
                >
                  <Input.TextArea
                    style={{   }}
                    rows={5}
                    placeholder="Seo Açıklaması Girinizxcxx..."
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    );
  },
);

export default PageEdit;
