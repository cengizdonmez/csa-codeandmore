export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
  phoneNumber: string;
  customerPlanId: string;
  customerGroupId: string;
  customerTypeId: string;
  filePath: string;
};

type CustomerGroup = {
  id: string;
  name: string;
  token: string;
  createDate: Date;
  updateDate: Date;
  createdBy: string;
  updatedBy: string;
  status: boolean;
};

type CustomerCreateForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  customerGroupId: string;
  customerPlanId: string;
  customerTypeId: string;
  filePath: string;
};

type CustomerRoleByPlanId = {
  id: string;
  name: string;
  token: string;
  createDate: string;
  updateDate: Date;
  createdBy: string;
  updatedBy: string;
  status: boolean;
};
