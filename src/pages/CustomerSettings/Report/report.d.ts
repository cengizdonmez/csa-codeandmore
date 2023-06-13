export type ReportAdd = {
  reportName: string;
  status: boolean;
  createDate: Date;
  updateDate: Date;
  createdBy: string;
  updatedBy: string;
};

export type Report = {
  id: string;
  reportName: string;
  createDate: Date;
  updateDate: Date;
  createdBy: string;
  updatedBy: string;
  status: boolean;
};

export type ReportUpdate = {
  id: string;
  reportName: string;
  status: boolean;
  createDate: Date;
  updateDate: Date;
  createdBy: string;
  updatedBy: string;
};
