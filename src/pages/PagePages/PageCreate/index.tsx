import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { history, Redirect } from "umi";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Switch,
  Collapse,
  Spin,
} from "antd";
import FileManager from "../../../components/FileManager";
import TextEditor from "../../../components/TextEditor";
import {
  useCreate,
  useGetOne,
  useListAll,
  useListByLang,
} from "../../CategoryPages/services";
import { WebPageUrl } from "../service";
import slugify from "../../../helper/slug";
import CustomPageContainer from "../../../components/CustomPageContainer";
import { WebPage, WebPageCreateFields } from "../data";
import useLanguage from "../../../hoxmodels/language";
import usePath from "../../../hoxmodels/path";
import Content from "@/components/Content";
import AccordionContent from "@/components/AccordionContent";
import usePerms from "../../../hoxmodels/perms";
import "react-quill/dist/quill.snow.css";
import LangConstCollapse from "@/components/LangConstCollapse/LangConstCollapse";
import DynamicForm from "@/components/DynamicForm/dynamicForm";

interface CreateForm {
  name: string;
  slug: string;
  description: string;
  seo_Title: string;
  seo_Keyword: Array<string>;
  seo_Description: string;
  publish_Status: string;
  similar_Webpage: Array<any>;
  coverImageStatus: boolean;
}

function PageNew(props: any): ReactElement {
  const { language } = useLanguage();
  const { path } = usePath();
  const { perms } = usePerms();
  const [form] = Form.useForm<CreateForm>();

  useEffect(() => {
    form.setFieldsValue({
      coverImageStatus: true,
    });
  }, []);

  if (!perms) return <Redirect to="/not-perm" />;

  const isPermCreate = perms["sayfa-islemleri.NewRecord"];
  const isPublisher = perms["sayfa-islemleri.Publisher"];

  if (!isPermCreate) {
    return <Redirect to="/not-perm" />;
  }
  const [variables, setVariables] = useState<any[]>([
    {
      key: "isShowBanner",
      title: "Kapak Resmi Aktif / Pasif",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
    {
      key: "backgroundColor",
      title: "HTML İçerik Gri Arka Plan Aktif / Pasif",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
    {
      key: "sharePost",
      title: "Yazıyı Paylaş Aktif / Pasif",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
    {
      key: "isShowBrands",
      title: "Alt Kısım Markalarımız Aktif / Pasif",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
    {
      key: "isScrollUp",
      title: "Yukarı Kaydır Aktif / Pasif",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
    {
      key: "smallPicture",
      title: "Küçük Resim Aktif / Pasif ",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
  ]);

  const [onCreate, , createStatus] = useCreate<WebPageCreateFields, WebPage>(
    WebPageUrl.create
  );
  const [getTemps, temps, tempsStatus] = useListAll<any[]>("/Template/getall");
  const [getPageList, pageList, pageStatus] = useListByLang<WebPage>(
    WebPageUrl.listByLang
  );
  const [getRoutes, routes, routeStat] = useListByLang<WebPage>(
    "/Route/getall"
  );
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [thumb, setThumb] = useState<string>("");
  const [smallImage, setSmallImage] = useState<string>("");
  const [contents, setContents] = useState({
    images: [],
    videos: [],
    docs: [],
    medias: []
  });
  const [accords, setAccords] = useState([]);
  const [subPages, setSubPages] = useState<any[]>([]);
  const [langConst, setLangConst] = useState([]);
  const [isWaitPage, setIsWaitPage] = useState<boolean>(
    isPublisher ? false : true
  );
  const [parentPage, setParentPage] = useState<any>(undefined);
  const [coverImgCheck, setCoverImgCheck] = useState<boolean>(false);
  const [dynamicFormFields, setDynamicFormFields] = useState<any[]>([]);
  const { Panel } = Collapse;

  async function create(fields: WebPageCreateFields) {
    console.log(fields);
    try {
      const data = await onCreate({
        ...fields,
      });
      if (data) {
      }
    } catch (error) {}
  }

  const onFinish = async (values: CreateForm) => {
    console.log(values);
    create({
      name: values.name,
      description: values.description,
      slug: values.slug,
      seo_Description: values.seo_Description,
      seo_Title: values.seo_Title,
      seo_Keyword: values.seo_Keyword ? values.seo_Keyword.join(",") : "",
      publish_Status: isPublisher
        ? !!values.publish_Status
          ? values.publish_Status.join(",")
          : "0"
        : "2,3,4,5",
      sideBarStatus: !!values.sideBarStatus
        ? values.sideBarStatus.join(",")
        : "",
        contentBarStatus: !!values.contentBarStatus
        ? values.contentBarStatus.join(",")
        : "",
      similar_Webpage: values.similar_Webpage
        ? values.similar_Webpage.join(",")
        : "",
      cover_Image: thumb,
      sort_Image: smallImage,
      template: values.template,
      Display_type:
        temps.find((item) => item.name === values.template)?.display_type ||
        null,
      document_Contents: contents,
      html_Content: htmlContent,
      redirectRouteId: values.redirectRouteId
        ? parseInt(values.redirectRouteId)
        : null,
      accordion_Content: accords,
      appoinment: values.appoinment,
      parent_Page: values.parent_Page ? parseInt(values.parent_Page) : null,
      sub_id: props?.match?.params?.id
        ? parseInt(props?.match?.params?.id)
        : null,
      sub_type: props?.match?.params?.pageType ?? null,
      formId: values.formId ? parseInt(values.formId) : null,
      videoId: values.videoId ? values.videoId : "",
      LangConstant: JSON.stringify(langConst) || "",
      CoverImageStatus: values.coverImageStatus,
      langCode: language!.abbreviationName,
      standByStatus: isWaitPage,
      variables: JSON.stringify(variables),
      componentArea: JSON.stringify(dynamicFormFields),
    });
  };

  const onFinishFailed = (errorInfo: any) => {};

  async function getSub(_token: string | number) {}

  const handleSwitchesChange = (key: string, e: any) => {
    console.log(key, e);
    const newSwitches = variables.map((variable, i) => {
      return variable.key === key ? { ...variable, value: e } : variable;
    });
    setVariables(newSwitches);
  };

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
    if (props!.match!.params!.sub_id!) {
      getSub(props!.match!.params!.sub_id!);
    }
    if (language) {
      getPageList(language.abbreviationName);
      getRoutes(language.abbreviationName);
      getTemps();
    }
  }, [language, props!.match!]);

  useEffect(() => {
    if (createStatus === "fulfilled") {
      return history.push({ pathname: "/pages" });
    }
  }, [createStatus]);
  useEffect(() => {
    !!parentPage ? setCoverImgCheck(false) : setCoverImgCheck(false);
  }, [parentPage]);

  return (
    <CustomPageContainer icon="new" breadcrumbShow>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row style={{ marginBottom: 5, justifyContent: "flex-end" }}>
          <Col>
            <Button
              color="primary"
              htmlType="submit"
              loading={createStatus === "pending"}
            >
              {isPublisher ? "Kaydet" : "Beklemede Olarak Kaydet"}
            </Button>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} md={16} span="16">
            <Collapse collapsible="header" defaultActiveKey={["1"]}>
              <Panel header="Genel Bilgiler" key="1">
                <Card title="Genel Bilgiler">
                  <Form.Item
                    label="Sayfa Adı"
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
              <Panel header="HTML İçerik" key="2">
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
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Döküman İçerik" key="3">
                <Form.Item label="Döküman İçerik">
                  <Content
                    onChange={(_val) => setContents(_val)}
                    defaultValue={contents}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Akordiyon İçerik" key="4">
                <Form.Item label="Akordiyon İçerik">
                  <AccordionContent
                    onChange={(_val) => {
                      setAccords(_val);
                    }}
                    defaultValue={accords}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
            <Collapse>
              <Panel header="Dil Sabitleri" key="5">
                <LangConstCollapse
                  langConst={langConst}
                  setLangConst={setLangConst}
                />
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
                  onChange={(value) => {
                    const _item = temps.find((item) => item.name === value);
                    if (_item) {
                      form.setFieldsValue({ Display_type: _item.display_type });
                    }
                  }}
                >
                  {temps &&
                    temps
                      .filter((item) => item.typeId === 1)
                      .map((temp) => (
                        <Select.Option value={temp.name}>
                          {temp.name} {temp.display_type}
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
                  defaultValue={isPublisher ? "0" : ["2", "3", "4", "5"]}
                  disabled={!isPublisher}
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
                  disabled={isPublisher ? false : true}
                  checked={isWaitPage}
                  onChange={
                    isPublisher ? () => setIsWaitPage(!isWaitPage) : undefined
                  }
                />
              </Form.Item>
              {/* <Form.Item label="Display Tipi" name="Display_type">
                <Select placeholder="Display Tip Seç" disabled>
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
                <Switch />
              </Form.Item> */}
              <Form.Item
                label="Üst Sayfa"
                required
                requiredMark="optional"
                name="parent_Page"
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
                  placeholder="Sayfa Seçiniz..."
                  onChange={(e) => {
                    setParentPage(e);
                  }}
                  loading={pageStatus !== "fulfilled"}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                >
                  {!props?.match?.params?.sub_id &&
                    pageStatus === "fulfilled" &&
                    pageList.map((page, key) => (
                      <Select.Option key={key} value={`${page.id}`}>
                        {page.name}
                      </Select.Option>
                    ))}
                  {props!.match!.params!.sub_id! &&
                    subPages.map((page, key) => (
                      <Select.Option key={key} value={`${page.id}`}>
                        {page.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
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
                    Sayfanın Alt Kategorileri
                  </Select.Option>
                  <Select.Option value="2">
                    Sayfanın Alt Sayfaları
                  </Select.Option>
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
                  <Select.Option value="1">
                    Sayfanın Alt Kategorileri
                  </Select.Option>
                  <Select.Option value="2">
                    Sayfanın Alt Sayfaları
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Yönlenecek Sayfa"
                required
                requiredMark="optional"
                name="redirectRouteId"
              >
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.indexOf(input) >= 0
                  }
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Sayfa Seçiniz..."
                  onChange={() => {}}
                  loading={pageStatus !== "fulfilled"}
                  allowClear
                >
                  {routeStat === "fulfilled" &&
                    routes
                      .sort((a, b) => {
                        if (a.pageName < b.pageName) {
                          return -1;
                        }
                        if (a.pageName > b.pageName) {
                          return 1;
                        }
                        return 0;
                      })
                      .map((route, key) => (
                        <Select.Option key={key} value={`${route.id}`}>
                          {route.pageName}
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
                <Select
                  allowClear
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
                  {!props?.match?.params?.sub_id &&
                    pageStatus === 'fulfilled' &&
                    pageList.map((page, key) => (
                      <Select.Option key={key} value={`${page.id}`}>
                        {page.name}
                      </Select.Option>
                    ))}
                  {props!.match!.params!.sub_id! &&
                    (doctorStat === 'fulfilled' ||
                      centerStat === 'fulfilled' ||
                      utilStat === 'fulfilled') &&
                    subPages.map((page, key) => (
                      <Select.Option key={key} value={`${page.id}`}>
                        {page.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item> */}
              <Form.Item label="Kapak Resmi" required requiredMark="optional">
                <FileManager
                  onChange={(data) => {
                    setThumb(data.path || "");
                  }}
                />
              </Form.Item>
              <Form.Item label="Küçük Resim" required requiredMark="optional">
                <FileManager
                  onChange={(data) => {
                    setSmallImage(data.path || "");
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Video Url"
                requiredMark="optional"
                name="videoId"
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item label="Form Id" requiredMark="optional" name="formId">
                <Input type="number" />
              </Form.Item>
            </Card>
            <Card title="Genel Ayarlar" style={{ marginTop: "1em" }}>
              <Row>
                <Col md={12}>
                  <Form.Item
                    label=" Kendi Görseli / Üst Sayfa-Kategori Görseli"
                    required
                    requiredMark="optional"
                    name="coverImageStatus"
                  >
                    <Switch
                      defaultChecked
                      checked={coverImgCheck}
                      onChange={
                        !!parentPage ? (e) => setCoverImgCheck(e) : undefined
                      }
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

export default PageNew;
