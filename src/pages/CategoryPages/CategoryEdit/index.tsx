import React, { forwardRef, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { Card, Col, Form, Input, Row, Select, Spin } from 'antd';
import FileManager from '../../../components/FileManager';
import { Category, CategoryCreateFields, CategoryOne } from '../data';
import { CategoryUrl, useEdit, useGetOne, useListAll } from '../services';
import AccordionContent from '@/components/AccordionContent';
import Content from '@/components/Content';
import TextEditor from '@/components/TextEditor';
import slugify from '../../../helper/slug';

interface CreateForm {
  name: string;
  slug: string;
  description: string;
  seo_Title: string;
  seo_Keyword: Array<string>;
  seo_Description: string;
  publish_Status: string;
  parent: number | string;
}

export type CategoryEditRef = {
  submit: () => void;
};

interface Props {
  token: number | string;
  onClose: () => void;
}

const CategoryEdit = forwardRef<CategoryEditRef, Props>(({ onClose, token }, ref) => {
  const [form] = Form.useForm<CreateForm>();
  const [getCategoryList, categoryList, categoryStatus] = useListAll<Category>(CategoryUrl.list);
  const [getCategory, categoryOne, categoryOneStatus] = useGetOne<CategoryOne>(CategoryUrl.one);
  const [onEdit, , editStatus] = useEdit<CategoryCreateFields, Category>(CategoryUrl.edit);
  const [getTemps, temps, tempsStatus] = useListAll<any[]>('/Template/getall');

  const [cover, setCover] = useState<string | null>(null);

  const [thumbnail, setTumbnail] = useState<string | null>(null);
  const [currentToken, setCurrentToken] = useState<string>('');

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [thumb, setThumb] = useState<string>('');
  const [smallImage, setSmallImage] = useState<string>('');
  const [contents, setContents] = useState({ images: [], videos: [], docs: [] });
  const [accords, setAccords] = useState([]);

  async function createCategory(fields: any) {
    try {
      const data = await onEdit(fields);
      if (onClose) {
        onClose();
      }
    } catch (error) {}
  }

  const onFinish = (values: CreateForm) => {
    createCategory({
      name: values.name,
      description: values.description,
      slug: values.slug,
      seo_Description: values.seo_Description,
      seo_Title: values.seo_Title,
      seo_Keyword: values.seo_Keyword ? values.seo_Keyword.join(',') : '',
      publish_Status: values.publish_Status ? values.publish_Status.join(',') : '0',
      similar_Webpage: values.similar_Webpage ? values.similar_Webpage.join(',') : '',
      parent_Category: values.parent_Category ? parseInt(values.parent_Category) : null,
      cover_Image: thumb,
      sort_Image: smallImage,
      template: values.template,
      document_Contents: contents,
      html_Content: htmlContent,
      accordion_Content: accords,
      langCode: categoryOne?.langCode,
      id: categoryOne?.id,
      token: currentToken,
      status: true,
    });
  };

  const onFinishFailed = (errorInfo: any) => {};

  async function getCategoryOne() {
    const data = await getCategory(token);
    if (data) {
      form.setFieldsValue({
        description: data.description,
        name: data.name,
        seo_Description: data.seo_Description,
        seo_Keyword:
          (!!data.seo_Keyword && data.seo_Keyword.length) > 0 ? data.seo_Keyword?.split(',') : [],
        seo_Title: data.seo_Title,
        slug: data.slug,
        publish_Status: data.publish_Status !== null ? String(data.publish_Status).split(',') : '',
        parent: data.parent!,
      });
      setCurrentToken(data.token || '');
      setCover(data.cover_Image || '');
      setTumbnail(data.thumbnail || '');
    }
  }

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));

  useLayoutEffect(() => {
    getTemps();
    getCategoryList();
    getCategoryOne();
  }, [token]);

  if (categoryOneStatus === 'pending' || editStatus === 'pending') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
        <Spin size="large" spinning />
      </div>
    );
  }

  if (categoryOneStatus === 'rejected') {
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
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  placeholder="Template Seç"
                >
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
                <Select
                  allowClear
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
              <Form.Item label="Üst Kategori" name="parent_Category">
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                >
                  {categoryList &&
                    categoryList.map((category) => (
                      <Select.Option value={`${category.id}`} key={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
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
                <Select
                  allowClear
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
                  placeholder="Seo Açıklaması Giriniz..."
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default CategoryEdit;
