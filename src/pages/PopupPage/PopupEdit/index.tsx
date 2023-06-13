import React, { useImperativeHandle, forwardRef, useLayoutEffect, useState } from 'react';
import CustomPageContainer from '../../../components/CustomPageContainer';
import TextEditor from '../../../components/TextEditor';
import { popupUrls } from '../services';
import {
  useListAll,
  useEdit,
  useGetOne,
  CategoryUrl,
  useListByLang,
} from '../../CategoryPages/services';
import { PopupListItem } from '../data';
import ReactQuill from 'react-quill';
import { Row, Col, Card, Form, Input, DatePicker, Tree, Tabs, Switch, Spin } from 'antd';
import { WebPage } from '../../PagePages/data';
import { WebPageUrl } from '../../PagePages/service';
import { modules } from '../../../../config/quillConfigs';
import Moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import 'antd/lib/date-picker/style/index.css';
import { Category } from '@/pages/CategoryPages/data';
import { Post } from '@/pages/PostPages/data';
import { PostUrl } from '@/pages/PostPages/services';
import useLanguage from '../../../hoxmodels/language';

interface CreateForm {
  title: string;
  content: string;
  pages: string;
  startDate: string;
  endDate: string;
}

export type PopupEditRef = {
  submit: () => void;
};

interface Props {
  token: number | string;
  onClose: () => void;
}

const PopupEditPage = forwardRef<PopupEditRef, Props>(({ onClose, token }, ref) => {
  const { language } = useLanguage();

  const [getPages, pages, pageStatus] = useListByLang<WebPage>(WebPageUrl.list);
  const [getCategories, categories, categoryStatus] = useListByLang<Category>(
    CategoryUrl.listByLang,
  );
  const [getPosts, posts, postStatus] = useListByLang<Post>(PostUrl.listByLang);
  const [getPopup, popupone, popupStatus] = useGetOne<PopupListItem>(popupUrls.one);
  const [onEdit, , editStatus] = useEdit<PopupListItem, PopupListItem>(popupUrls.update);
  const [form] = Form.useForm<CreateForm>();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cheksPages, setCheksPages] = useState<any>([]);
  const [checksPosts, setCheksPosts] = useState<any>([]);
  const [cheksCategories, setCheksCategories] = useState<any>([]);
  const [_isIndexPage, setIndexPage] = useState(false)

  async function getPopupOne() {
    const data = await getPopup(token);
    if (data) {
      form.setFieldsValue({
        title: data.title,
        startDate: Moment(data.startDate),
        endDate: Moment(data.endDate),
      });
      setHtmlContent(data.content || '');
      setCheksPages(JSON.parse(data.pages));
      setCheksPosts(JSON.parse(data.posts));
      setCheksCategories(JSON.parse(data.categories));
      setIndexPage(!!data.isIndexPage)
    }
  }

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));
  const onFinish = (values: CreateForm) => {
    edit({
      id: popupone?.id,
      token: popupone.token,
      title: values.title,
      content: htmlContent,
      pages: JSON.stringify(cheksPages),
      categories: JSON.stringify(cheksCategories),
      posts: JSON.stringify(checksPosts),
      startDate: Moment(values.startDate).toDate(),
      endDate: Moment(values.endDate).toDate(),
      isIndexPage: !!_isIndexPage
    });
  };
  async function edit(fields: any) {
    try {
      const data = await onEdit(fields);
      if (onClose) {
        onClose();
      }
    } catch (error) {}
  }

  useLayoutEffect(() => {
    getPopupOne();
    if (language) {
      getPages(language.abbreviationName);
      getPosts(language.abbreviationName);
      getCategories(language.abbreviationName);
    }
  }, [language]);

  if(popupStatus !== "fulfilled") {
    return <Spin/>
  }

  return (
    <CustomPageContainer icon={null}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={12}>
          <Col xs={24} md={14}>
            <Card>
              <Form.Item
                label="Başlık"
                required
                requiredMark="optional"
                name="title"
                rules={[{ required: true, message: 'Lütfen zorunlu alanı doldurunuz!' }]}
              >
                <Input placeholder="Başlık Giriniz..." type="text" />
              </Form.Item>
              <Form.Item label="İçerik">
                <TextEditor value={htmlContent} onChange={(content) => setHtmlContent(content)} />
              </Form.Item>
              <Form.Item label="Ana Sayfada Göster" name="isIndexPage">
                <Switch checked={_isIndexPage} onChange={() => { setIndexPage(!_isIndexPage) }} />
              </Form.Item>
              <Row gutter={12}>
                <Col xs={12}>
                  <Form.Item label="Başlama Tarihi" name="startDate">
                    <DatePicker
                      onChange={() => {}}
                      showTime={{ minuteStep: 15, showSecond: false }}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={12}>
                  <Form.Item label="Bitiş Tarihi" name="endDate">
                    <DatePicker
                      onChange={() => {}}
                      showTime={{ minuteStep: 15, showSecond: false }}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane key="1" tab="Sayfalar">
                  <Form.Item label="Gösterilecek Sayfalar">
                    <Card style={{ maxHeight: 500, overflowY: 'scroll' }}>
                      <Tree
                        checkable
                        selectable={false}
                        onCheck={(checks) => {
                          setCheksPages(checks);
                        }}
                        treeData={
                          pages ? pages.map((page) => ({ title: page.name!, key: page.id! })) : []
                        }
                        checkedKeys={cheksPages}
                      />
                    </Card>
                  </Form.Item>
                </Tabs.TabPane>
                <Tabs.TabPane key="2" tab="Yazılar">
                  <Form.Item label="Gösterilecek Yazılar">
                    <Card style={{ maxHeight: 500, overflowY: 'scroll' }}>
                      <Tree
                        checkable
                        selectable={false}
                        onCheck={(checks) => {
                          setCheksPosts(checks);
                        }}
                        treeData={
                          posts ? posts.map((item) => ({ title: item.name!, key: item.id! })) : []
                        }
                        checkedKeys={checksPosts}
                      />
                    </Card>
                  </Form.Item>
                </Tabs.TabPane>
                <Tabs.TabPane key="3" tab="Kategoriler">
                  <Form.Item label="Gösterilecek Kategoriler">
                    <Card style={{ maxHeight: 500, overflowY: 'scroll' }}>
                      <Tree
                        checkable
                        selectable={false}
                        onCheck={(checks) => {
                          setCheksCategories(checks);
                        }}
                        treeData={
                          categories
                            ? categories.map((item) => ({ title: item.name!, key: item.id! }))
                            : []
                        }
                        checkedKeys={cheksCategories}
                      />
                    </Card>
                  </Form.Item>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Form>
    </CustomPageContainer>
  );
});

export default PopupEditPage;
