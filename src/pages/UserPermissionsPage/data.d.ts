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
  export interface UserGroupOne {
    id: number;
    name: string;
    token: string;
  }
  export interface UserGroupOne {
    userGroup:          UserGroup;
    userGroupModulList: UserGroupModulList[];
}
export interface UserGroup {
    id:         number;
    name:       string;
    token:      string;
}
export interface UserGroupModulList {
    id:           number;
    userGroupId:  number;
    modulId:      number;
    newRecord:    boolean;
    updateRecord: boolean;
    deleteRecord: boolean;
    publisher:    boolean;
    list:         boolean;
    token:        string;
}