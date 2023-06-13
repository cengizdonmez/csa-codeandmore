export interface Moduls {
  id: number;
  name: string;
  token: string;
}
export interface UserGroups {
  id: number;
  name: string;
  token: string;
}
export interface CustomerGroupOne {
  id: number;
  name: string;
  token: string;
}
export interface CustomerGroupsOne {
  customerGroup: CustomerGroup;
  customerGroupModulList: CustomerGroupModulList[];
}
export interface CustomerGroup {
  id: number;
  name: string;
  token: string;
}
export interface CustomerGroupModulList {
  id: number;
  customerGroupId: number;
  customerModuleId: number;
  customerPlanId:number;
  view: true;
  download: true;
  token: string;
}
// createDate: null;
// createUserId: null;
// createdBy: "EMRE SAZAK";
//       customerGroupId: "267d0184-702a-450b-920c-165262dadde9";
//       customerModuleId: 1;
//       download: true;
//       id: 1;
//       token: "bdd80f3c-5b98-4a12-a476-c0b3f5d966f8";
// updateDate: null;
// updatedBy: "EMRE SAZAK";
//       view: true;
