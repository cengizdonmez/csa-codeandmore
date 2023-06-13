import React, { useState } from 'react';
import { worker, Status } from '../../utils/http';
import { FileItem } from './data.d';

const LIST = '/FileManagement/getall';

export function useFileList(): {
  onGetFilesAsync: () => Promise<FileItem[]>;
  fileList: FileItem[];
  status: Status;
} {
  const [list, setList] = useState<FileItem[]>([]);
  const [status, setStatus] = useState<Status>(null);

  async function onGetFilesAsync() {
    setStatus('pending');
    try {
      const data: FileItem[] = await worker(LIST, 'GET');
      data.reverse();
      setList(data);
      setStatus('fulfilled');
      return data;
    } catch (error) {
      setStatus('rejected');
      return error;
    }
  }

  return {
    onGetFilesAsync,
    fileList: list,
    status,
  };
}
