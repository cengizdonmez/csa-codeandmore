import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { history, Redirect } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import {
  Row,
  Col,
  Card,
  Form,
  Collapse,
  Input,
  Button,
  Select,
  Switch,
} from "antd";
import FileManager from "../../../components/FileManager";
import { CategoryCreateFields, Category, OrderCriteria } from "../data";
import {
  useCategoryCreate,
  useListAll,
  CategoryUrl,
  useListByLang,
useByOrderCriteria,
} from "../services";
import slugify from "../../../helper/slug";
import "react-quill/dist/quill.snow.css";
import CustomPageContainer from "../../../components/CustomPageContainer";
import useLanguage from "../../../hoxmodels/language";
import usePath from "../../../hoxmodels/path";
import AccordionContent from "@/components/AccordionContent";
import Content from "@/components/Content";
import TextEditor from "@/components/TextEditor";
import { WebPageUrl } from "@/pages/PagePages/service";
import { WebPage } from "@/pages/PagePages/data";
import LangConstCollapse from "@/components/LangConstCollapse/LangConstCollapse";
import usePerms from "../../../hoxmodels/perms";
import DynamicForm from "@/components/DynamicForm/dynamicForm";

interface CreateForm {
  name: string;
  slug: string;
  description: string;
  seo_Title: string;
  seo_Keyword: Array<string>;
  seo_Description: string;
  publish_Status: string;
  parent: number | string;
  orderPostCriterion: Array<string>;
  orderPostArea: Array<string>;
  numberOfDataToList: number;
}

function CategoryNew(): ReactElement {
  const { language } = useLanguage();
  const { path } = usePath();
  const { perms } = usePerms();
  const [form] = Form.useForm<CreateForm>();

  if (!perms) return <Redirect to="/not-perm" />;

  const isPermCreate = perms["kategoriler.NewRecord"];
  const isPublisher = perms["kategoriler.Publisher"];

  if (!isPermCreate) {
    return <Redirect to="/not-perm" />;
  }

  const { createCategoryStatus, onCreateCategoryAsync } = useCategoryCreate();
  const [getTemps, temps, tempsStatus] = useListAll<any[]>("/Template/getall");
  const [
    getCategoryList,
    categoryList,
    categoryStatus,
  ] = useListByLang<Category>(CategoryUrl.listByLang);
  const [getPages, pages, pagesStat] = useListByLang<WebPage>(
    WebPageUrl.listByLang
  );
  const [getByOrderCriteria, getByOrderCriteriaData, byOrderCriteriaStatus] = useByOrderCriteria<OrderCriteria>(
    "/WebCategory/getbyordercriteria"
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
  const [catPage, setCatPage] = useState<"cat" | "page">();
  const [langConst, setLangConst] = useState([]);
  const { Panel } = Collapse;
  const [isWaitPage, setIsWaitPage] = useState<boolean>(
    isPublisher ? false : true
  );
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
      key: "searchSection",
      title: "Arama Alanı Aktif / Pasif",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
    {
    key: "filterclose",
    title: "Filtre Alanı Aktif / Pasif ",
    value: false,
    description: "",
    status: true,
    item: null,
    itemType: "checkbox"
     },
    {
      key: "orderByYear",
      title: "Yıla Göre Filtre Aktif / Pasif",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox",
    },
    {
      key: "orderSection",
      title: "Sıralama Alanı Aktif / Pasif",
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
      title: "Yazıyı Paylaş Kısmı Aktif / Pasif",
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
    {
      key: "postdate",
      title: "Post Date Aktif / Pasif ",
      value: false,
      description: "",
      status: true,
      item: null,
      itemType: "checkbox"
    },
  ]);
  const [coverImgCheck, setCoverImgCheck] = useState<boolean>(false);
  const [dynamicFormFields, setDynamicFormFields] = useState<any[]>([]);

  async function createCategory(fields: any) {
    const data = await onCreateCategoryAsync({
      ...fields,
    });
    if (data) {
      history.push("/categories");
    }
  }

  const onFinish = (values: CreateForm) => {
    createCategory({
      name: values.name,
      description: values.description,
      slug: values.slug,
      langCode: language!.abbreviationName,
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
      parent: values.parent ? parseInt(values.parent) : null,
      page: values.page ? parseInt(values.page) : null,
      parentPageId: values.page ? parseInt(values.page) : null,
      cover_Image: thumb,
      sort_Image: smallImage,
      template: values.template,
      appoinment: values.appoinment,
      Display_type:
        temps.find((item) => item.name === values.template)?.display_type ||
        null,
      document_Contents: contents,
      html_Content: htmlContent,
      accordion_Content: accords,
      videoId: values.videoId || "",
      LangConstant: JSON.stringify(langConst) || "",
      CoverImageStatus: values.coverImageStatus,
      standByStatus: isWaitPage,
      variables: JSON.stringify(variables),
      componentArea: JSON.stringify(dynamicFormFields),
      orderPostCriterion: values.orderPostCriterion,
      orderPostArea: values.orderPostArea,
      numberOfDataToList: values.numberOfDataToList,
    });
  };
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

  const onFinishFailed = (errorInfo: any) => {};

  function beforeRender() {
    if (language) {
      getCategoryList(language.abbreviationName);
      getPages(language.abbreviationName);
    }
  }

  useLayoutEffect(() => {
    beforeRender();
    getTemps();
    getByOrderCriteria();
  }, [language]);

  useEffect(() => {
    !!catPage ? setCoverImgCheck(false) : setCoverImgCheck(false);
  }, [catPage]);
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
              loading={createCategoryStatus === "pending"}
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
                    label="Kategori Adı"
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
                      placeholder="Kategori Adı Giriniz..."
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
                >
                  {temps &&
                    temps
                      .filter((item) => item.typeId === 3)
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
              {/* <Form.Item label="Display Tipi" name="Display_type">
                <Select placeholder="Display Tip Seç">
                  {[...Array(20)].map((_, index) => (
                    <Select.Option value={`tip-${index + 1}`}>{`Tip ${index + 1}`}</Select.Option>
                  ))}
                </Select>
              </Form.Item> */}
              <Form.Item label="Üst Kategori" name="parent">
                <Select
                  allowClear
                  optionFilterProp="children"
                  disabled={catPage === "page"}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  onChange={(val) => {
                    if (!!val) {
                      setCatPage("cat");
                    } else {
                      if (catPage === "cat") {
                        setCatPage(undefined);
                      }
                    }
                  }}
                >
                  {categoryList &&
                    categoryList.map((category) => (
                      <Select.Option value={`${category.id}`} key={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="Web Sayfası" name="page">
                <Select
                  allowClear
                  disabled={catPage === "cat"}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  onChange={(val) => {
                    if (!!val) {
                      setCatPage("page");
                    } else {
                      if (catPage === "page") {
                        setCatPage(undefined);
                      }
                    }
                  }}
                >
                  {pages &&
                    pages.map((item) => (
                      <Select.Option value={`${item.id}`} key={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
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
                    Kategorilerin Alt Kategoriler
                  </Select.Option>
                  <Select.Option value="2">
                    Kategorinin Üst Kategorileri
                  </Select.Option>
                  <Select.Option value="3">
                    Kategorilerin Yazıları
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
                  <Select.Option value="7">
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
                    Kategorilerin Alt Kategoriler
                  </Select.Option>
                  <Select.Option value="2">
                    Kategorinin Üst Kategorileri
                  </Select.Option>
                  <Select.Option value="3">
                    Kategorilerin Yazıları
                  </Select.Option>
                </Select>
              </Form.Item>
              {/* <Form.Item
                label="Hızlı Randevu Alanı"
                extra="Hızlı Randevu Alanı Gösterilsin Mi?"
                name="appoinment"
              >
                <Switch />
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
              <Form.Item label="Artan/Azalan" name="orderPostCriterion">
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                >
                 {getByOrderCriteriaData &&
                  getByOrderCriteriaData.orderPostCriterion &&
                  getByOrderCriteriaData.orderPostCriterion.map((item: {} | null | undefined, index) => (
                    <Select.Option value={`${item}`} key={index}>
                      {
                        item == "Asc" ? "Artan" : "Azalan"
                      }
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Postların Sıralama Kriteri" name="orderPostArea">
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                >
                  {getByOrderCriteriaData &&
                  getByOrderCriteriaData.orderPostArea &&
                  getByOrderCriteriaData.orderPostArea.map((item: {} | null | undefined, index) => (
                    <Select.Option value={`${item}`} key={index}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Listelenecek Post Sayısı"
                name="numberOfDataToList"
              >
                <Input type="number" />
            </Form.Item> 
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
                      defaultChecked
                      checked={coverImgCheck}
                      onChange={!!catPage ? (e)=>{setCoverImgCheck(e)} : undefined  }
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

export default CategoryNew;
