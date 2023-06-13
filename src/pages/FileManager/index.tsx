import React, {
  ReactElement,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  DeleteOutlined,
  FormOutlined,
  InboxOutlined,
  UploadOutlined,
  CopyFilled,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Card,
  Button,
  Tooltip,
  message,
  Upload,
  Tree,
  Modal,
  Form,
  Input,
  Spin,
} from "antd";
import CustomPageContainer from "../../components/CustomPageContainer";
import { useFileList } from "../../components/FileManager/services";
import {
  useCreate,
  useDelete,
  useEdit,
  useListAll,
} from "../CategoryPages/services";
import styles from "../../components/FileManager/index.less";
import { Folder } from "./types";
import { wrapImageUrl } from "@/utils/utils";
import useLanguage from "../../hoxmodels/language";
import usePath from "../../hoxmodels/path";
import { useGetOne } from "@/pages/CategoryPages/services";
import usePerms from "../../hoxmodels/perms";
import { Redirect } from "umi";
import copy from "copy-to-clipboard";
import { BASE_URL } from "@/utils/http";
import ImageCropper from "@/components/ImageCropper/ImageCropper";
import { useIntl } from "umi";

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

interface Props {}

function FileManager({}: Props): ReactElement {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const { onGetFilesAsync, fileList, status } = useFileList();
  const [onDelete, , onDeleteStatus] = useDelete(
    "/FileManagement/delete?token="
  );
  const [onGetFolders, folders, folderStatus] =
    useListAll<Folder>("/Folder/getall");
  const [addFolder, , addFolderStatus] = useCreate("/Folder/add");
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [isAddFolder, setAddFolder] = useState<boolean>(false);
  const [editAndSaveModal, setEditAndSaveModal] = useState<boolean>(false);
  const [folderName, setFolderName] = useState(null);
  const editInput = useRef();
  const [editFolder, , editFolderStat] = useEdit("/Folder/update");
  const [deleteFolder, , deleteFolderStat] = useDelete("/Folder/delete?token=");
  const { language } = useLanguage();
  const { path } = usePath();
  const { perms } = usePerms();
  const [fileSearch, setFileSearch] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);


  // component.please-select-folder-first
  const { formatMessage } = useIntl();

  const [getSystemValue, systemValue, systemValueStatus] = useGetOne<any>(
    "/SystemValue/getbylangcode?langCode="
  );
  const { Dragger } = Upload;

  const [form] = Form.useForm();

  if (!perms) {
    return <Spin spinning />;
  }

  const isPermCreate = perms["dosya-yoneticisi.NewRecord"];
  const isPermDelete = perms["dosya-yoneticisi.DeleteRecord"];
  const isPermUpdate = perms["dosya-yoneticisi.UpdateRecord"];
  const isPermList = perms["dosya-yoneticisi.List"];

  if (!isPermList) {
    return <Redirect to="/not-perm" />;
  }

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

  function findFolderName(folderId: number) {
    const folder = folders.find((_folder) => _folder.id === folderId);
    if (folder) {
      return folder.name;
    } else {
      return "";
    }
  }

  const props = {
    multiple: true,
    beforeUpload: beforeUpload,
    name: "file",
    action:
      BASE_URL +
      `/FileManagement/add/?folderId=${
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

  async function uploadCroppedImage() {
    const formData = new FormData();
    const fileField = croppedImage;

    formData.append("file", fileField);

    fetch(
      BASE_URL +
        `/FileManagement/add/?folderId=${
          selectedFolder ?? 0
        }&folderName=${findFolderName(selectedFolder ?? -1)}`,
      {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((result) => {
        setCroppedImage(null);
        setEditAndSaveModal(false);
        message.success(`File uploaded successfully`);
        getFiles();
      })
      .catch((error) => {
        message.error(`File upload failed.`);
      });
  }

  async function deleteItem(token: string) {
    await onDelete(token);
    getFiles();
  }

  function getFiles() {
    onGetFilesAsync();
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

  async function onDeleteFolder(folder: any) {
    try {
      await deleteFolder(folder.token);
      setSelectedFolder(null);
      onGetFolders();
    } catch (error) {
      alert("Hata");
    }
  }

  useLayoutEffect(() => {
    onGetFolders();
    getFiles();
  }, []);

  useEffect(() => {
    if (path) {
      setImgUrl(path);
    }
  }, [path]);

  const { DirectoryTree } = Tree;

  const treeItems = useMemo(() => renderFolders(), [folders]);

  async function onValid(fields: any) {
    await addFolder({
      name: fields.name,
      parentFolderId: selectedFolder ? selectedFolder : 0,
    });
    onGetFolders();
    setAddFolder(false);
    form.resetFields();
  }

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
  return (
    <CustomPageContainer icon={<UploadOutlined />}>
      <Row>
        <Col xs={24}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>
                  {folderName !== null ? (
                    <input
                      ref={editInput}
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
                  ) : (
                    <span>
                      {formatMessage({ id: "general.main-directory" })}
                    </span>
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
                      />{" "}
                      <DeleteOutlined
                        onClick={() => {
                          onDeleteFolder(_folder);
                        }}
                        style={{ marginLeft: 5, cursor: "pointer" }}
                      />
                    </>
                  )}
                </h3>
              </div>
              {isPermCreate && (
                <div style={{ display: "flex" }}>
                  <Button
                    style={{ marginRight: "1em" }}
                    onClick={() => {
                      setAddFolder(true);
                    }}
                    danger
                  >
                    {formatMessage({ id: "general.add-folder" })}
                  </Button>
                  <Tooltip
                    title={
                      !folderName
                        ? formatMessage({
                            id: "general.please-select-folder-first",
                          })
                        : ""
                    }
                    >
                    <Button
                      onClick={() => setEditAndSaveModal(true)}
                      style={{ marginRight: "1em" }}
                      danger
                      disabled={folderName === null}
                    >
                      {formatMessage({ id: "general.edit-and-upload" })}
                    </Button>
                  </Tooltip>
                  <Upload disabled={folderName === null} {...props}>
                    <Tooltip
                      title={
                        !folderName
                          ? formatMessage({
                              id: "general.please-select-folder-first",
                            })
                          : ""
                        }
                      >
                      
                        <Button 
                          type="primary" 
                          icon={<UploadOutlined />}
                          disabled={folderName === null}
                        >
                          {formatMessage({ id: "general.upload-file" })}
                        </Button>
                    </Tooltip>
                  </Upload>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
      {isPermCreate && (
        <Row style={{ marginTop: "1em" }}>
          <Col xs={24}>
            <Card>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {formatMessage({ id: "general.upload-text" })}
                </p>
                <p className="ant-upload-hint">
                  {formatMessage({ id: "general.upload-hint" })}
                </p>
              </Dragger>
            </Card>
          </Col>
        </Row>
      )}

      <Row style={{ marginTop: "1em" }} gutter={12}>
        <Col xs={6}>
          <Card style={{ padding: 0, margin: 0 }}>
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
          </Card>
        </Col>
        <Col xs={18}>
          {fileList && fileList.length > 0 && (
            <Card
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: 5,
              }}
            >
              <Input
                style={{ width: 250, margin: 0 }}
                placeholder={formatMessage({ id: "general.search" })}
                value={fileSearch}
                onChange={(e) => setFileSearch(e.currentTarget.value)}
              />
            </Card>
          )}
          <Card
            style={{ height: "calc(100vh - 300px)", overflowY: "scroll" }}
            loading={onDeleteStatus === "pending" || status === "pending"}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {fileList &&
                fileList
                  .filter((item) => {
                    let _folderId = item.folderId === 0 ? null : item.folderId;

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
                    <div
                      style={{
                        width: 200,
                        overflow: "hidden",
                        minHeight: 50,
                      }}
                    >
                      <Item
                        img={item.path}
                        title={item.name}
                        key={`${item.path}-${key}`}
                        imgUrl={imgUrl!}
                        selected={false}
                        onSelect={() => {}}
                        onDelete={() => {
                          deleteItem(item.token);
                        }}
                      />
                    </div>
                  ))}
            </div>
          </Card>
        </Col>
        <Modal
          open={isAddFolder}
          title={formatMessage({ id: "general.add-folder" })}
          onCancel={() => {
            setAddFolder(false);
          }}
          okText={formatMessage({ id: "general.add" })}
          onOk={() => {
            form.submit();
          }}
        >
          <Form form={form} onFinish={onValid}>
            <Form.Item
              name="name"
              rules={[
                { 
                  required: true,
                  message: formatMessage({ id: "general.please-fill-in-the-required-field" })
                },
              ]} 
            >
              <Input placeholder={formatMessage({ id: "general.folder-name" }) + '...'}/>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          destroyOnClose
          open={editAndSaveModal}
          title={formatMessage({ id: "general.edit-and-upload" })}
          onCancel={() => {
            setCroppedImage(null);
            setEditAndSaveModal(false);
          }}
          okText="Ekle"
          onOk={() => {
            uploadCroppedImage();
          }}
        >
          <ImageCropper onChange={(val) => setCroppedImage(val)} />
        </Modal>
      </Row>
    </CustomPageContainer>
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
function Item({ img, title, selected, onSelect, onDelete, imgUrl }: ItemProps) {
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
            src={require("./files/csv.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "pdf":
        return (
          <img
            src={require("./files/pdf.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "txt":
        return (
          <img
            src={require("./files/txt.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "xls":
      case "xlsx":
        return (
          <img
            src={require("./files/xls.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "zip":
      case "rar":
        return (
          <img
            src={require("./files/zip.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "doc":
      case "docx":
        return (
          <img
            src={require("./files/doc.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      case "mp4":
      case "mov":
        return (
          <img
            src={require("./files/mp4.svg")}
            alt={title}
            style={{ maxHeight: 250 }}
          />
        );
      default:
        return <h3 style={{ textAlign: "center" }}>{ext}</h3>;
    }
  }
  return (
    <div
      className={styles.Item}
      style={selected ? { ...selectedStyle } : {}}
      onClick={() => {
        onSelect();
      }}
    >
      {generateFile(img || "", title)}
      <div>
        <span style={{ wordWrap: "break-word" }}>{title}</span>
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
      <div>
        <Button danger size="small" block onClick={onDelete}>
          Sil
        </Button>
      </div>
    </div>
  );
}
