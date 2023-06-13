import React, {
  ReactElement,
  useState,
  useLayoutEffect,
  useMemo,
  useEffect,
} from "react";
import {
  Card,
  Modal,
  Input,
  Upload,
  Button,
  message,
  Spin,
  Tree,
  Col,
  Row,
  Form,
} from "antd";
import {
  FileImageOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  FormOutlined,
  CopyFilled,
} from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { useFileList } from "./services";
import styles from "./index.less";
import { useCreate, useEdit, useListAll } from "@/pages/CategoryPages/services";
import { Folder } from "@/pages/FileManager/types";
import { wrapImageUrl } from "@/utils/utils";
import useLanguage from "../../hoxmodels/language";
import usePath from "../../hoxmodels/path";
import { useGetOne } from "@/pages/CategoryPages/services";
import { BASE_URL } from "@/utils/http";
import ImageCropper from "../ImageCropper/ImageCropper";

function getExtension(filename: string) {
  return filename.split(".").pop();
}
function isAcceptExtension(extension:string){
  const acceptedExtension = ["png","jpg","jpeg","csv","pdf","txt","xls","xlsx","zip","rar","doc","docx","mp4","mov","ai"];
  return acceptedExtension.includes(extension);
}
export interface FileManagerItem {
  id?: number;
  path?: string;
  type?: string;
  name?: string;
  token?: string;
}

interface FileManagerProps {
  defaultOpen?: boolean;
  onChange: (data: FileManagerItem) => void;
  defaultValue?: string | null;
  editorMode?: boolean;
  editorModeText?: string;
}

function FileManager({
  defaultOpen,
  onChange,
  defaultValue,
  editorMode,
  editorModeText,
}: FileManagerProps): ReactElement {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const { language } = useLanguage();
  const { path } = usePath();
  const { onGetFilesAsync, fileList, status } = useFileList();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen || false);
  const [value, setValue] = useState<FileManagerItem | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const { DirectoryTree } = Tree;
  const [isAddFolder, setAddFolder] = useState<boolean>(false);

  const [onGetFolders, folders, folderStatus] =
    useListAll<Folder>("/Folder/getall");
  const [addFolder, , addFolderStatus] = useCreate("/Folder/add");

  const [folderName, setFolderName] = useState(null);

  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [editFolder, , editFolderStat] = useEdit("/Folder/update");
  const [form] = Form.useForm();
  const [fileSearch, setFileSearch] = useState("");

  function beforeUpload(file: File) {
    const isLt2M = file.size / 1024 / 1024 < 501;
    if(!isAcceptExtension(getExtension(file.name)?.toLowerCase()))
    {
      message.error(`${getExtension(file.name)} geçerli bir uzantı değil.`);
      return false;
    }
    if (!isLt2M) {
      message.error("Dosya 500MB yada daha küçük olmalı!");
    }
    return isLt2M;
  }

  const props = {
    name: "file",
    beforeUpload: beforeUpload,
    multiple: true,
    action: BASE_URL + `/FileManagement/add/?folderId=${
      selectedFolder ?? 0
    }&folderName=${findFolderName(selectedFolder ?? -1)}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    onChange(info: any) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        getFiles();
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  function findFolderName(folderId: number) {
    const folder = folders.find((_folder) => _folder.id === folderId);
    if (folder) {
      return folder.name;
    } else {
      return "";
    }
  }
  
  const treeData = [
    {
      title: "Parent",
      key: "0-0",
      isExpand: true,
      children: [
        {
          title: "Child",
          key: "0-0-1",
          children: [],
        },
      ],
    },
  ];

  function getFiles() {
    onGetFilesAsync();
    onGetFolders();
  }

  function findAndGetInside(list: Folder[], id: any) {
    let items: {
      title: string | undefined;
      key: string;
      isExpand: boolean;
      children: any[];
    }[] = [];
    list.forEach((item) => {
      if (id === item.parentFolderId) {
        items.push({
          title: item.name,
          key: `${item.id}`,
          isExpand: true,
          children: findAndGetInside(list, item.id),
        });
      }
    });

    return items;
  }

  function renderFolders() {
    const _treeData: {
      title: string | undefined;
      key: string;
      isExpand: boolean;
      children: Folder[];
    }[] = [];
    const _list = folders.filter((folder) => folder.parentFolderId !== 0);
    if (folders) {
      folders.forEach((folder, index) => {
        if (folder.parentFolderId === 0) {
          _treeData.push({
            title: folder.name,
            key: `${folder.id}`,
            isExpand: true,
            children: findAndGetInside(_list, folder.id),
          });
        }
      });
    }

    return [
      {
        title: "Ana Dizin",
        key: "null",
        isExpand: true,
        children: _treeData,
      },
    ];
  }

  async function onValid(fields: any) {
    await addFolder({
      name: fields.name,
      parentFolderId: selectedFolder ? selectedFolder : 0,
    });
    onGetFolders();
    setAddFolder(false);
    form.resetFields();
  }

  // useLayoutEffect(() => {
  //   getFiles();
  // }, []);

  useEffect(() => {
    if (isOpen) {
      getFiles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (path) {
      setImgUrl(path);
    }
  }, [path]);

  function getFolder() {
    setFolderName(null);
    if (folderStatus !== "fulfilled") return null;

    if (!folders) return null;

    const _folder = folders.find((_f) => _f.id === selectedFolder);
    if (!_folder) return null;

    setFolderName(_folder?.name);
    return _folder;
  }

  async function onEdit(f: any) {
    try {
      await editFolder({
        ...f,
        name: folderName,
      });
      onGetFolders();
      getFiles();
    } catch (error) {
      alert("Error");
    }
  }

  const _folder = useMemo(() => getFolder(), [selectedFolder]);

  const treeItems = useMemo(() => renderFolders(), [folders]);

  return (
    <div>
      {!!editorMode ? (
        <Button
          style={{ marginBottom: 5 }}
          onClick={() => {
            setOpen(true);
          }}
        >
          {editorModeText}
        </Button>
      ) : (
        <Card
          className={styles.Container}
          onClick={() => {
            setOpen(true);
          }}
        >
          {value ? (
            <img
              className={styles.ImgFluid}
              src={wrapImageUrl(value.path!, imgUrl!)}
              alt={value.name}
            />
          ) : defaultValue ? (
            <img
              className={styles.ImgFluid}
              src={wrapImageUrl(defaultValue, imgUrl!)}
              alt={"Default"}
            />
          ) : (
            <FileImageOutlined style={{ fontSize: 50, color: "grey" }} />
          )}
        </Card>
      )}
      <Modal
        title="Dosya Seç"
        visible={isOpen}
        onOk={() => {
          if (selected !== null) {
            setValue(selected);
            onChange(selected);
          }
          setOpen(false);
        }}
        onCancel={() => {
          if (value) {
            const index = fileList.findIndex((item) => item.id === value.id);
            setSelected(index !== -1 ? index : null);
          }
          setOpen(false);
        }}
        width={1200}
      >
        {status === "pending" && (
          <div>
            <Spin size="large" />
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>
              {folderName !== null && (
                <input
                  type="text"
                  value={folderName}
                  style={{
                    all: "unset",
                    borderBottom: "1px solid lightgrey",
                    minWidth: 150,
                  }}
                  onChange={({ currentTarget: { value } }) => {
                    setFolderName(value);
                  }}
                />
              )}
              {_folder && (
                <>
                  <FormOutlined
                    style={{
                      marginLeft: 5,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      _folder.name === folderName ? null : onEdit(_folder);
                    }}
                  />
                </>
              )}
            </h3>
          </div>
          <div style={{ display: "flex" }}>
            <Button
              style={{ marginRight: "1em" }}
              onClick={() => {
                setAddFolder(true);
              }}
              danger
            >
              Klasör Ekle
            </Button>
            <Upload {...props}>
              <Button type="primary" icon={<UploadOutlined />}>
                Dosya Yükle
              </Button>
            </Upload>
          </div>
        </div>
        <Row style={{ marginTop: "1em" }}>
          <Col
            xs={6}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <DirectoryTree
              multiple={false}
              selectable={true}
              onSelect={(selectedKeys, info) => {
                const _key: string | undefined = selectedKeys[0];
                if (_key) {
                  if (_key === "null") {
                    setSelectedFolder(null);
                  } else {
                    setSelectedFolder(parseInt(_key));
                  }
                }
              }}
              onExpand={(expandedKeys, info) => {}}
              treeData={treeItems}
              height={300}
            />
            <Button
              style={{ marginRight: "10px" }}
              danger
              onClick={() => {
                setValue(null);
                onChange({ path: null });
                setOpen(false);
              }}
            >
              Seçileni Kaldır
            </Button>
          </Col>
          <Col xs={18}>
            {fileList && fileList.length > 0 && (
              <Input
                style={{ width: 250, margin: 0 }}
                placeholder="Ara"
                value={fileSearch}
                onChange={(e) => setFileSearch(e.currentTarget.value)}
              />
            )}
            <Card
              style={{ height: "calc(100vh - 400px)", overflowY: "scroll" }}
              loading={status === "pending"}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {fileList &&
                  fileList
                    .filter((item) => {
                      let _folderId =
                        item.folderId === 0 ? null : item.folderId;

                      return _folderId === selectedFolder;
                    })
                    .filter((item) =>
                      !!fileSearch
                        ? item.name
                            ?.toLowerCase()
                            .includes(fileSearch.toLowerCase())
                        : true
                    )
                    .map((item, key) => (
                      <Item
                        img={item.path}
                        title={item.name}
                        imgUrl={imgUrl!}
                        key={`${item.path}-${key}`}
                        selected={selected && selected.id === item.id}
                        onSelect={() => {
                          setSelected(item);
                        }}
                      />
                    ))}
              </div>
            </Card>
          </Col>
        </Row>
        <Modal
          visible={isAddFolder}
          title="Klasör Ekle"
          onCancel={() => {
            setAddFolder(false);
          }}
          okText="Ekle"
          onOk={() => {
            form.submit();
          }}
        >
          <Form form={form} onFinish={onValid}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Lütfen zorunlu alanı doldurunuz!" },
              ]}
            >
              <Input placeholder="Klasör Adı..." />
            </Form.Item>
          </Form>
        </Modal>
      </Modal>
    </div>
  );
}

export default FileManager;

interface ItemProps {
  img: string;
  title: string;
  selected: boolean;
  onSelect: () => void;
  imgUrl?: string;
}
function Item({ img, title, selected, onSelect, imgUrl }: ItemProps) {
  const selectedStyle = { boxShadow: "0px 0px 5px #de4500" };
  const { path } = usePath();
  function generateFile(filename: string, title: string) {
    const ext = getExtension(filename);

    switch (ext?.toLowerCase()) {
      case "png":
      case "jpg":
      case "jpeg":
        return (
          <img
            src={wrapImageUrl(filename, imgUrl)}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "csv":
        return (
          <img
            src={require("../../pages/FileManager/files/csv.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "pdf":
        return (
          <img
            src={require("../../pages/FileManager/files/pdf.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "txt":
        return (
          <img
            src={require("../../pages/FileManager/files/txt.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "xls":
      case "xlsx":
        return (
          <img
            src={require("../../pages/FileManager/files/xls.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "zip":
      case "rar":
        return (
          <img
            src={require("../../pages/FileManager/files/zip.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "doc":
      case "docx":
        return (
          <img
            src={require("../../pages/FileManager/files/doc.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "mp4":
      case "mov":
        return (
          <img
            src={require("../../pages/FileManager/files/mp4.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      default:
        return <h3 style={{ textAlign: "center" }}>{ext}</h3>;
    }
  }

  const generatedFile = useMemo(
    () => generateFile(img || "", title),
    [img, title]
  );
  return (
    <div
      className={styles.Item}
      style={selected ? selectedStyle : {}}
      onClick={() => {
        onSelect();
      }}
    >
      {generatedFile}
      <div>
        <span>{title}</span>
        <Button
          onClick={() => {
            copy(path + img);
          }}
          size="small"
          type="link"
        >
          <CopyFilled />
        </Button>
      </div>
    </div>
  );
}
