import React, { forwardRef, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { Row, Col, Card, Form, Input, Select, Button, Spin } from 'antd';
import ReactQuill from 'react-quill';
import FileManager from '../../../components/FileManager';
import TextEditor from '../../../components/TextEditor';
import { modules } from '../../../../config/quillConfigs';
import {
  useCreate,
  useListAll,
  CategoryUrl,
  useGetOne,
  useEdit,
  useListByLang,
} from '../../CategoryPages/services';
import { Category } from '../../CategoryPages/data';
import { PostUrl } from '../services';
import useLanguage from '../../../hoxmodels/language';
import { PostCreateFields, Post } from '../data';
import slugify from '../../../helper/slug';
import 'react-quill/dist/quill.snow.css';
import { values } from 'lodash';

interface CreateForm {
  name: string;
  slug: string;
  description: string;
  sort_Description: string;
  html_content: string;
  seo_Title: string;
  seo_Keyword: Array<string>;
  seo_Description: string;
  publish_Status: string;
  similar_Webpost: Array<any>;
  category: string;
  author: string;
}

export type PostEditRef = {
  submit: () => void;
};

interface Props {
  token: number | string;
  onClose: () => void;
}

const PostEditPage = forwardRef<PostEditRef, Props>(({ onClose, token }, ref) => {
  const [form] = Form.useForm<CreateForm>();
  const { language } = useLanguage();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [onCreate, , createStatus] = useCreate<PostCreateFields, Post>(PostUrl.create);
  const [getPostList, postList, postStatus] = useListByLang<Post>(PostUrl.listByLang);
  const [getCategoryList, categoryList, categoryStatus] = useListByLang<Category>(
    CategoryUrl.listByLang,
  );
  const [thumb, setThumb] = useState<string>('');
  const [getPost, postOne, postOneStatus] = useGetOne<Post>(PostUrl.one);
  const [onEdit, , editStatus] = useEdit<PostCreateFields, Post>(PostUrl.edit);

  async function getPostOne() {
    if (language) {
      await getPostList(language.abbreviationName);
      await getCategoryList(language.abbreviationName);
    }
    const data = await getPost(token);
    if (data) {
      form.setFieldsValue({
        description: data.description,
        sort_Description: data.sort_Description,
        name: data.name,
        seo_Description: data.seo_Description,
        seo_Keyword:
          (!!data.seo_Keyword && data.seo_Keyword.length) > 0 ? data.seo_Keyword?.split(',') : [],
        seo_Title: data.seo_Title,
        slug: data.slug,
        publish_Status: data.publish_Status !== null ? String(data.publish_Status) : '',
        similar_Webpost: !!data.similar_Webpost ? data.similar_Webpost?.split(',') : [],
        category: !!data.category ? parseInt(data.category) : null,
        author: data.author ? data.author : '',
      });
      setThumb(data.thumbnail || '');
      setHtmlContent(data.html_Content || '');
    }
  }

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));

  useLayoutEffect(() => {
    getPostOne();
  }, []);

  async function edit(fields: any) {
    try {
      const data = await onEdit(fields);
      if (onClose) {
        onClose();
      }
    } catch (error) {}
  }

  const onFinish = (values: CreateForm) => {
    edit({
      description: values.description,
      sort_Description: values.sort_Description,
      name: values.name,
      seo_Description: values.seo_Description,
      seo_Title: values.seo_Title,
      seo_Keyword: values.seo_Keyword ? values.seo_Keyword.join(',') : '',
      publish_Status: !!values.publish_Status ? parseInt(values.publish_Status) : 5,
      slug: values.slug,
      thumbnail: thumb,
      html_Content: htmlContent,
      similar_Webpost: values.similar_Webpost ? values.similar_Webpost.join(',') : '',
      id: postOne?.id,
      token: postOne?.token,
      langCode: postOne?.langCode,
      status: true,
      author: values.author ? values.author : '',
      category: values.categories ? values.categories.join(',') : '',
    });
  };

  const onFinishFailed = (errorInfo: any) => {
  };

  if (
    postOneStatus === 'pending' ||
    postStatus === 'pending' ||
    categoryStatus === 'pending' ||
    editStatus === 'pending'
  ) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 500 }}>
        <Spin size="large" spinning />
      </div>
    );
  }

  if (postOneStatus === 'rejected') {
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
                label="Başlık"
                required
                requiredMark="optional"
                name="name"
                rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
              >
                <Input placeholder="Başlık Giriniz..." />
              </Form.Item>
              <Form.Item
                label="Adres"
                required
                requiredMark="optional"
                name="slug"
                rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
              >
                <Input
                  placeholder="Adres Giriniz..."
                  onChange={({ currentTarget: { value } }) => {
                    form.setFieldsValue({ slug: slugify(value) });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Kısa Açıklama"
                required
                requiredMark="optional"
                name="sort_Description"
              >
                <Input placeholder="Kısa Açıklama Giriniz..." />
              </Form.Item>
              <Form.Item label="Açıklama" required requiredMark="optional" name="description">
                <Input.TextArea
                  style={{   }}
                  rows={5}
                  placeholder="Açıklama Giriniz..."
                />
              </Form.Item>

              <Form.Item label="İçerik" required requiredMark="optional">
                <TextEditor
                  theme="snow"
                  modules={modules}
                  value={htmlContent}
                  onChange={(content) => setHtmlContent(content)}
                />
              </Form.Item>
            </Card>
            <Card style={{ marginTop: '1em' }} title="Seo Bilgileri">
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
                  placeholder="Seo Açıklaması Giriniz..."
                />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} md={8} span="8">
            <Card>
              <Form.Item
                label="Yayın Durumu"
                required
                requiredMark="optional"
                name="publish_Status"
                rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
              >
                <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
 placeholder="Yayın Durumu Seçiniz..." optionFilterProp="children">
                  <Select.Option value="0">Yayında</Select.Option>
                  <Select.Option value="3">Yayında(no-index)</Select.Option>
                  <Select.Option value="4">Yayında (no-sitemap)</Select.Option>
                  <Select.Option value="5">Yayında (no-search)</Select.Option>
                  <Select.Option value="1">Beklemede</Select.Option>
                  <Select.Option value="2">Taslak</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Kategori" required requiredMark="optional" name="category">
                <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch

                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Kategori Seçiniz..."
                  loading={categoryStatus !== 'fulfilled'}
                >
                  {categoryStatus === 'fulfilled' &&
                    categoryList.map((category, key) => (
                      <Select.Option key={key} value={`${category.id!}`}>
                        {category.name!}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Benzer Yazılar"
                required
                requiredMark="optional"
                name="similar_Webpost"
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
                  loading={postStatus !== 'fulfilled'}
                >
                  {postStatus === 'fulfilled' &&
                    postList.map((post, key) => (
                      <Select.Option key={key} value={`${post.id!}`}>
                        {post.name!}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="Kapak Resmi" required requiredMark="optional">
                <FileManager
                  onChange={(data) => {
                    setThumb(data.path || '');
                  }}
                  defaultValue={thumb}
                />
              </Form.Item>
              <Form.Item label="Yazar" required requiredMark="optional" name="author">
                <Input placeholder="Yazar Giriniz..." />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default PostEditPage;
