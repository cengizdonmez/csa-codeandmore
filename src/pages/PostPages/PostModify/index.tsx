import AccordionContent from "@/components/AccordionContent";
import CustomPageContainer from "@/components/CustomPageContainer";
import Content from "@/components/Content";
import FileManager from "@/components/FileManager";
import TextEditor from "@/components/TextEditor";
import slugify from "@/helper/slug";
import {
  Row,
  Col,
  Button,
  Card,
  Input,
  Select,
  Form,
  Switch,
  Collapse,
  Spin,
  message,
  DatePicker,
} from "antd";
import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { history } from "umi";
import {
  CategoryUrl,
  useCreate,
  useEdit,
  useGetOne,
  useListAll,
  useListByLang,
} from "@/pages/CategoryPages/services";
import useLanguage from "../../../hoxmodels/language";
import usePath from "../../../hoxmodels/path";

import { PostUrl } from "../services";
import Moment from "moment";
import FormItem from "antd/lib/form/FormItem";
import LangConstCollapse from "@/components/LangConstCollapse/LangConstCollapse";
import HtmlHistory from "@/components/HtmlHistory";
import usePerms from "../../../hoxmodels/perms";
import { PendingPageRequest, PendingPageResponse, Post } from "../data";
import perms from "../../../hoxmodels/perms";
import DynamicForm from "@/components/DynamicForm/dynamicForm";

interface Props {}

function PostModify(props: any): ReactElement {
  const { language } = useLanguage();
  const { path } = usePath();
  const [form] = Form.useForm();
  const { perms } = usePerms();
  const [getPost, postOne, postOneStatus] = useGetOne<any>(PostUrl.one);
  const [datas, setData] = useState<any>([]);
  const [onEdit, , editStatus] = useEdit(PostUrl.edit);

  const [getTemps, temps, tempsStatus] = useListAll<any[]>("/Template/getall");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [thumb, setThumb] = useState<string>("");
  const [smallImage, setSmallImage] = useState<string>("");
  const [contents, setContents] = useState(null);
  const [accords, setAccords] = useState(null);
  const [date, setDate] = useState(null);
  const [langConst, setLangConst] = useState([]);
  const [coverImageCheck, setCoverImageCheck] = useState<boolean>(false);
  const [isWaitPage, setIsWaitPage] = useState<boolean>(false);
  const [variables, setVariables] = useState<any[]>([]);
  const [dynamicFormFields, setDynamicFormFields] = useState<any[]>([]);
  const { Panel } = Collapse;

  const [getPostList, postList, postStatus] = useListByLang(PostUrl.listByLang);

  const [getCategoryList, categoryList, categoryStatus] = useListByLang(
    CategoryUrl.listByLang
  );
  const [getWaitingPage, waitingPageDatas, waitingPageStatus] = useCreate<
    PendingPageRequest,
    PendingPageResponse
  >("/WebPost/getpending");

  if (!perms) {
    return <Spin spinning />;
  }
  const isPermPublisher = perms["yazilar.Publisher"];

  async function postData(fields: any) {
    try {
      await onEdit(fields);
      history.push("/text");
    } catch (error) {
      message.error("Bir hata oluştu. Lütfen alanları tekrar kontrol ediniz!");
    }
  }

  function onFinish(values: any) {
    postData({
      name: values.name,
      description: values.description,
      slug: values.slug,
      seo_Description: values.seo_Description,
      seo_Title: values.seo_Title,
      seo_Keyword: values.seo_Keyword ? values.seo_Keyword.join(",") : "",
      publish_Status: !!values.publish_Status
        ? values.publish_Status.join(",")
        : "0",
      sideBarStatus: !!values.sideBarStatus
        ? values.sideBarStatus.join(",")
        : "",
      contentBarStatus: !!values.contentBarStatus
        ? values.contentBarStatus.join(",")
        : "",
      cover_Image: thumb,
      sort_Image: smallImage,
      template: values.template,
      Display_type:
        temps.find((item) => item.name === values.template)?.display_type ||
        null,
      document_Contents: contents,
      html_Content: htmlContent,
      accordion_Content: accords,
      appoinment: values.appoinment,
      parent_Page: values.parent_Page ? parseInt(values.parent_Page) : null,
      category: values.category ? parseInt(values.category) : null,
      date: date,
      author: values.author,
      display_type:
        temps.find((item) => item.name === values.template)?.display_type ||
        null,
      id: datas?.id,
      token: datas?.token,
      langCode: datas?.langCode,
      status: true,
      order: !!values.order ? parseInt(values.order) : null,
      videoId: values.videoId || "",
      langConstant: JSON.stringify(langConst) || "",
      coverImageStatus: values.coverImageStatus,
      standByStatus: isWaitPage,
      variables: JSON.stringify(variables),
      componentArea: JSON.stringify(dynamicFormFields),
    });
  }

  async function getData(token: string) {
    const data = await getPost(token);
    console.log("data111", data);
    if (!data.standByStatus) {
      await getWaitingPage({
        fullUrl: data.data.fullUrl,
        LangCode: data.data.langCode,
      });
    }
    setData(data.data);
  }
  function setFormFieldsValue() {
    form.setFieldsValue({
      name: datas.name,
      description: datas.description,
      seo_Description: datas.seo_Description,
      seo_Keyword: datas.seo_Keyword?.split(","),
      seo_Title: datas.seo_Title,
      publish_Status:
        datas.publish_Status !== null
          ? String(datas.publish_Status).split(",")
          : "",
      sideBarStatus: datas.sideBarStatus
        ? String(datas.sideBarStatus).split(",")
        : undefined,
      contentBarStatus: datas.contentBarStatus
        ? String(datas.contentBarStatus).split(",")
        : undefined,
      slug: datas.slug,
      order: !!datas.order ? datas.order.toString() : null,
      template: datas.template,
      Display_type: datas.Display_type,
      appoinment: datas.appoinment,
      parent_Page: datas.parent_Page ? datas.parent_Page.toString() : null,
      category: datas.category ? `${datas.category}` : null,
      author: datas.author,
      videoId: datas.videoId,
    });
    if (!!datas.document_Contents) {
      setContents(JSON.parse(datas.document_Contents));
    } else {
      setContents({ images: [], videos: [], docs: [] });
    }
    if (datas.date) {
      setDate(datas.date);
    }
    setThumb(datas.cover_Image);
    setSmallImage(datas.sort_Image);
    setHtmlContent(datas.html_Content);
    if (datas.accordion_Content) {
      const acc = JSON.parse(datas.accordion_Content);
      setAccords(acc);
    } else {
      setAccords([]);
    }
    if (!!datas.langConstant) {
      setLangConst(JSON.parse(datas.langConstant));
    } else {
      setLangConst([]);
    }
    setCoverImageCheck(datas.coverImageStatus);
    setIsWaitPage(datas.standByStatus);
    if (datas.variables) {
      const data = JSON.parse(datas.variables);
      setVariables(data);
      console.log("setfielddata", data);
    } else {
      setVariables([]);
    }
    if(datas.componentArea){
      setDynamicFormFields(JSON.parse(datas.componentArea))
    }
  }
  const handleSwitchesChange = (key: string, e: any) => {
    console.log(key, e);
    const newSwitches = variables.map((variable, i) => {
      return variable.key === key ? { ...variable, value: e } : variable;
    });
    setVariables(newSwitches);
  };
  useEffect(() => {
    setFormFieldsValue();
    setHtmlContent(datas.html_Content);
  }, [datas]);

  function handlePublish(e) {
    if (e.includes("0")) {
      const index = e.indexOf("2");
      index > -1 && e.splice(index, 1);
    }
    if (e.includes("2")) {
      const index = e.indexOf("0");
      index > -1 && e.splice(index, 1);
    }
  }

  useLayoutEffect(() => {
    if (!props?.match?.params?.id) {
      history.push("/text");
    } else {
      if (language) {
        getPostList(language.abbreviationName);
        getCategoryList(language.abbreviationName);
        getTemps();
      }
      getData(props!.match!.params!.id!);
    }
  }, []);

  if (postOneStatus !== "fulfilled") {
    return <Spin />;
  }

  return (
    <CustomPageContainer icon="new" breadcrumbShow>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row style={{ marginBottom: 5, justifyContent: "flex-end" }}>
          <Col>
            {postOne && (
              <HtmlHistory
                area="webpost"
                id={postOne.data.id}
                setData={setData}
              />
            )}
            <Button
              color="primary"
              htmlType="submit"
              loading={editStatus === "pending"}
            >
              Kaydet
            </Button>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} md={16} span="16">
            <Collapse defaultActiveKey={["1"]} collapsible="header">
              <Panel header="Genel Bilgiler" key={"1"}>
                <Card title="Genel Bilgiler">
                  <Form.Item
                    label="Yazı Başlığı"
                    required
                    requiredMark="optional"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen zorunlu alanı doldurunuz!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Sayfa Adı Giriniz..."
                      onChange={(e) => {
                        form.setFieldsValue({
                          slug: slugify(e.currentTarget.value),
                          seo_Title: e.currentTarget.value,
                          seo_Description: e.currentTarget.value,
                          seo_Keyword: e.currentTarget.value
                            .split(" ")
                            .filter((val) => !!val.replace(/[^\w-]+/g, "")),
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
                    rules={[
                      {
                        required: true,
                        message: "Lütfen zorunlu alanı doldurunuz!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Web Adresi Giriniz..."
                      onChange={({ currentTarget: { value } }) => {
                        form.setFieldsValue({ slug: slugify(value) });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Yazar"
                    requiredMark="optional"
                    name="author"
                  >
                    <Input placeholder="Yazar Giriniz..." />
                  </Form.Item>
                  <Form.Item label="Tarih" requiredMark="optional" name="date">
                    {date && (
                      <DatePicker
                        style={{ width: "100%" }}
                        onChange={(date) => {
                          setDate(date);
                        }}
                        defaultValue={Moment(date)}
                      />
                    )}
                  </Form.Item>

                  <Form.Item
                    label="Açıklama"
                    required
                    requiredMark="optional"
                    name="description"
                  >
                    <Input.TextArea
                      style={{}}
                      rows={5}
                      placeholder="Açıklama Giriniz..."
                    />
                  </Form.Item>
                </Card>
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="İçerik Bilgisi" key="2">
                <Card title="İçerik Bilgisi" style={{ marginTop: "1em" }}>
                  <Form.Item
                    label="HTML İçerik"
                    required
                    requiredMark="optional"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen zorunlu alanı doldurunuz!",
                      },
                    ]}
                  >
                    <TextEditor
                      value={htmlContent}
                      onChange={(content) => {
                        setHtmlContent(content);
                      }}
                    />
                  </Form.Item>
                </Card>
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Döküman İçerik" key="3">
                <Form.Item label="Döküman İçerik">
                  {!!contents && (
                    <Content
                      onChange={(_val) => setContents(_val)}
                      defaultValue={contents}
                    />
                  )}
                </Form.Item>
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Akordiyon İçerik" key="4">
                <Form.Item label="Akordiyon İçerik">
                  {!!accords && (
                    <AccordionContent
                      onChange={(_val) => {
                        setAccords(_val);
                      }}
                      defaultValue={accords}
                    />
                  )}
                </Form.Item>
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Language Consts" key="5">
                <Form.Item label="">
                  {!!langConst && (
                    <LangConstCollapse
                      setLangConst={setLangConst}
                      langConst={langConst}
                    />
                  )}
                </Form.Item>
              </Panel>
            </Collapse>
            <DynamicForm
              formFields={dynamicFormFields}
              setFormFields={setDynamicFormFields}
            />
          </Col>
          <Col xs={24} md={8} span="8">
            <Card>
              <Form.Item
                label="Template Tipi"
                name="template"
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children[2]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  placeholder="Template Seç"
                >
                  {temps &&
                    temps
                      .filter((item) => item.typeId === 2)
                      .map((temp) => (
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
                  disabled={isPermPublisher ? false : true}
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(e) => {
                    handlePublish(e);
                  }}
                  showSearch
                  placeholder="Yayın Durumu Seçiniz..."
                  mode="multiple"
                  optionFilterProp="children"
                  defaultValue="0"
                >
                  <Select.Option value="0">Yayında</Select.Option>
                  <Select.Option value="3">
                    Yayında(no-index) Google'da görünmez
                  </Select.Option>
                  <Select.Option value="4">
                    Yayında (no-sitemap) Site Haritasında görünmez
                  </Select.Option>
                  <Select.Option value="5">
                    Yayında (no-search) Aramalarda görünmez
                  </Select.Option>
                  {/* <Select.Option value="1">Beklemede</Select.Option> */}
                  <Select.Option value="2">Taslak</Select.Option>
                  {/* <Select.Option value="6">Pop-Up</Select.Option> */}
                </Select>
              </Form.Item>

              <Form.Item name="standByStatus" label="Beklemede">
                <Switch
                  disabled={isPermPublisher ? false : true}
                  defaultChecked={isWaitPage}
                  checked={isWaitPage}
                  onChange={
                    isPermPublisher
                      ? () => setIsWaitPage(!isWaitPage)
                      : undefined
                  }
                />
              </Form.Item>
              {waitingPageDatas &&
                !!waitingPageDatas.data &&
                !datas.standByStatus &&
                props!.match!.params!.id! !== waitingPageDatas.data.token && (
                  <Form.Item>
                    <Button
                      href={`/text/edit/${waitingPageDatas.data.token}`}
                      style={{ color: "#00A8A2" }}
                    >
                      Bekleyen İçeriğe Git
                    </Button>
                  </Form.Item>
                )}

              {/* <Form.Item label="Display Tipi" name="Display_type">
                <Select placeholder="Display Tip Seç">
                  {[...Array(20)].map((_, index) => (
                    <Select.Option value={`tip-${index + 1}`}>{`Tip ${index + 1}`}</Select.Option>
                  ))}
                </Select>
              </Form.Item> */}
              {/* <Form.Item
                label="Hızlı Randevu Alanı"
                extra="Hızlı Randevu Alanı Gösterilsin Mi?"
                name="appoinment"
              >
                <Switch defaultChecked={postOne.appoinment} />
              </Form.Item> */}
              {/* <Form.Item label="Üst Yazı" required requiredMark="optional" name="parent_Page">
                <Select allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch

                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Yazı Seçiniz..."
                  onChange={() => {}}
                  loading={postStatus !== 'fulfilled'}
                >
                  {postStatus === 'fulfilled' &&
                    postList.filter(item => item.id !== postOne.id).map((page, key) => (
                      <Select.Option key={key} value={`${page.id}`}>
                        {page.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item> */}
              <Form.Item
                label="Sidebar Görüntülenecek Alanlar"
                required
                requiredMark="optional"
                name="sideBarStatus"
              >
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  placeholder="Alan Seçiniz..."
                  mode="multiple"
                  optionFilterProp="children"
                >
                  <Select.Option value="0">
                    Leftsidebar Aktivasyon
                  </Select.Option>
                  <Select.Option value="1">
                    Postun Üst Kategorisinin Postları
                  </Select.Option>
                  {/* <Select.Option value="2">
                    Postun Bağlı Olduğu Kategorilerin Diğer Postları
                  </Select.Option> */}
                  <Select.Option value="4">
                    En Çok Okunan Haberler
                  </Select.Option>
                  <Select.Option value="5">
                    Leftsidebar-Sürdürülebilirlik
                  </Select.Option>
                  <Select.Option value="6">
                    Leftsidebar-İnsan-Kaynaklari
                  </Select.Option>
                  <Select.Option value="3">
                    Leftsidebar-Kalite-Yönetimi
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Sayfada Görüntülenecek Alanlar"
                required
                requiredMark="optional"
                name="contentBarStatus"
              >
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  placeholder="Alan Seçiniz..."
                  mode="multiple"
                  optionFilterProp="children"
                >
                  <Select.Option value="1">Postun Kategorileri</Select.Option>
                  <Select.Option value="2">
                    Postun Bağlı Olduğu Kategorilerin Diğer Postları
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Kategori"
                required
                requiredMark="optional"
                name="category"
              >
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Kategori Seçiniz..."
                  loading={categoryStatus !== "fulfilled"}
                >
                  {categoryStatus === "fulfilled" &&
                    categoryList.map((category, key) => (
                      <Select.Option key={key} value={`${category.id!}`}>
                        {category.name!}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="Kapak Resmi" required requiredMark="optional">
                <FileManager
                  onChange={(data) => {
                    setThumb(data.path || "");
                  }}
                  defaultValue={thumb}
                />
              </Form.Item>
              <Form.Item label="Küçük Resim" required requiredMark="optional">
                <FileManager
                  onChange={(data) => {
                    setSmallImage(data.path || "");
                  }}
                  defaultValue={smallImage}
                />
              </Form.Item>
              <Form.Item
                label="Video Url"
                requiredMark="optional"
                name="videoId"
              >
                <Input type="text" />
              </Form.Item>
              <FormItem name="order" label="Sıra">
                <Input type="number" placeholder="Sıra" />
              </FormItem>
            </Card>
            <Card title="Genel Ayarlar" style={{ marginTop: "1em" }}>
              <Row>
                <Col md={12}>
                  <Form.Item
                    label="Kendi Görseli / Üst Sayfa-Kategori Görseli"
                    required
                    requiredMark="optional"
                    name="coverImageStatus"
                  >
                    <Switch
                      checked={coverImageCheck}
                      onChange={() => setCoverImageCheck(!coverImageCheck)}
                    />
                  </Form.Item>
                  <hr />
                </Col>
                {variables.map((data, i) => (
                  <Col md={12}>
                    <Form.Item
                      key={i}
                      label={data.title}
                      required
                      requiredMark="optional"
                    >
                      <Switch
                        defaultChecked={data.value}
                        checked={data.value}
                        onChange={(e) => handleSwitchesChange(data.key, e)}
                      />
                    </Form.Item>
                    <hr />
                  </Col>
                ))}
              </Row>
            </Card>
            <Card title="Seo Bilgileri" style={{ marginTop: "1em" }}>
              <Form.Item
                label="Seo Başlığı"
                required
                requiredMark="optional"
                name="seo_Title"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Input placeholder="Seo Başlığı Giriniz..." />
              </Form.Item>
              <Form.Item
                label="Seo Etiketleri"
                required
                requiredMark="optional"
                name="seo_Keyword"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Seo Etiketleri Giriniz..."
                  onChange={(data) => {
                    form.setFieldsValue({
                      seo_Keyword: data.filter(
                        (val) => !!val.replace(/[^\w-]+/g, "")
                      ),
                    });
                  }}
                ></Select>
              </Form.Item>
              <Form.Item
                label="Seo Açıklama"
                required
                requiredMark="optional"
                name="seo_Description"
                rules={[
                  {
                    required: true,
                    message: "Lütfen zorunlu alanı doldurunuz!",
                  },
                ]}
              >
                <Input.TextArea
                  style={{}}
                  rows={5}
                  placeholder="Seo Açıklaması Giriniz..."
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </CustomPageContainer>
  );
}

export default PostModify;
