import { useState } from 'react';
import { createModel } from 'hox';


function useFileFolder() {
  const [files, setFiles] = useState<any>(null);
  const [folders, setFolders] = useState<any>(null);

  function onSetFiles(_files: any) {
    setFiles(_files);
  }

  function onSetFolders(_folders: any) {
    setFolders(_folders);
  }

  return {
    files,
    folders,
    onSetFiles,
    onSetFolders
  };
}

export default createModel(useFileFolder)
