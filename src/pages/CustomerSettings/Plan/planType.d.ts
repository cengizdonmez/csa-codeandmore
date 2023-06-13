export type Plan = {
  id: string;
  planType: string;
  createDate: Date;
  updateDate: Date;
  createdBy: string;
  updatedBy: string;
  status: boolean;
  subPlans: any;
  order:number;
};
