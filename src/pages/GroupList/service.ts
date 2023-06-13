import {request} from 'umi';
import {GroupListItem} from './data.d';

export async function queryGroup(params?: GroupListItem) {
  return request('/api/UserGroup/getlist', {
    params,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((a: any) => {
    return {
      current: (params?.PageNumber || 1),
      data: a.data,
      pageSize: params?.PageSize,
      success: true,
      total: a.paging.totalSize,
    };
  });
}

export async function queryOperationClaim() {
  return request('/api/OperationClaim/getall', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((a: any) => {
    return a;
  });
}

export async function queryAllGroup() {
  return request('/api/UserGroup/getall', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((a: any) => {
    return a;
  });
}

export async function removeGroup(params: any) {
  return request(`/api/UserGroup/delete?token=${params.token}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  }).then((a: any) => (a.data));
}

export async function addGroup(params: GroupListItem) {
  return request('/api/UserGroup/add', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a.data;
  });
}

export async function updateGroup(params: GroupListItem) {
  return request('/api/UserGroup/update', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a.data;
  });
}
