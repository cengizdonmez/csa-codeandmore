import React, { ReactElement, useLayoutEffect, useState } from 'react';
import CustomPageContainer from '../../../components/CustomPageContainer';
import TextEditor from '../../../components/TextEditor';
import { popupUrls } from '../services';
import { CategoryUrl, useCreate, useListAll, useListByLang } from '../../CategoryPages/services';
import { PopupCreateFields } from '../data';
import { history } from 'umi';
import ReactQuill from 'react-quill';
import { Row, Col, Card, Form, Input, Button, DatePicker, Tree, Tabs, Switch } from 'antd';
import { WebPage } from '../../PagePages/data';
import { WebPageUrl } from '../../PagePages/service';
import { modules } from '../../../../config/quillConfigs';
import { TreeList } from '../../../pages/MenuList/';
import Moment from 'moment';
import useLanguage from '../../../hoxmodels/language';

import 'react-quill/dist/quill.snow.css';
import 'antd/lib/date-picker/style/index.css';
import { Category } from '@/pages/CategoryPages/data';
import { PostUrl } from '@/pages/PostPages/services';
import { Post } from '@/pages/PostPages/data';

interface Props {}
interface CreateForm {
  title: string;
  content: string;
  pages: string;
  startDate: string;
  endDate: string;
}
function PopupCreatePage({}: Props): ReactElement {
  const { language } = useLanguage();
  const [getPages, pages, pageStatus] = useListByLang<WebPage>(WebPageUrl.listByLang);
  const [getCategories, categories, categoryStatus] = useListByLang<Category>(
    CategoryUrl.listByLang,
  );
  const [getPosts, posts, postStatus] = useListByLang<Post>(PostUrl.listByLang);
  const [form] = Form.useForm<CreateForm>();
  const [onCreatePopup, createStatus] = useCreate<PopupCreateFields, {}>(popupUrls.create);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cheksPages, setCheksPages] = useState<any>([]);
  const [checksPosts, setCheksPosts] = useState<any>([]);
  const [cheksCategories, setCheksCategories] = useState<any>([]);

  const onFinish = (values: CreateForm) => {
    create({
      title: values.title,
      content: htmlContent,
      pages: JSON.stringify(cheksPages),
      categories: JSON.stringify(cheksCategories),
      posts: JSON.stringify(checksPosts),
      startDate: Moment(values.startDate).toDate(),
      endDate: Moment(values.endDate).toDate(),
      isIndexPage: !!values.isIndexPage
    });
  };
  async function create(fields: PopupCreateFields) {
    const data = await onCreatePopup(fields);
    if (data) {
      history.push('/main/popupList');
    }
  }
  useLayoutEffect(() => {
    if (language) {
      getPages(language.abbreviationName);
      getPosts(language.abbreviationName);
      getCategories(language.abbreviationName);
    }
  }, [language]);
  return (
    <CustomPageContainer icon={null}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row style={{ marginBottom: 5, justifyContent: 'flex-end' }}>
          <Col>
            <Button color="primary" htmlType="submit">
              Kaydet
            </Button>
          </Col>
        </Row>
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
                <Switch />
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
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Sayfalar" key="1">
                <Card>
                  <Form.Item label="Gösterilecek Sayfalar">
                    <TreeList
                      onChange={(checks) => {
                        setCheksPages(checks);
                      }}
                      checkedKeys={cheksPages}
                      list={pages}
                    />
                  </Form.Item>
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Yazılar"  key="2">
                <Card>
                  <Form.Item label="Gösterilecek Yazılar">
                    <TreeList
                      onChange={(checks) => {
                        setCheksPosts(checks);
                      }}
                      checkedKeys={checksPosts}
                      list={posts}
                    />
                  </Form.Item>
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Kategoriler"  key="3">
                <Card>
                  <Form.Item label="Gösterilecek Kategoriler">
                    <TreeList
                      onChange={(checks) => {
                        setCheksCategories(checks);
                      }}
                      checkedKeys={cheksCategories}
                      list={categories}
                    />
                  </Form.Item>
                </Card>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Form>
    </CustomPageContainer>
  );
}
export default PopupCreatePage;
