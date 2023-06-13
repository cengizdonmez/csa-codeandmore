import {request} from 'umi';
import {LanguageListItem} from './data.d';
import {notification} from "antd";
import {BASE_URL} from '../../utils/http'

export async function queryLanguage(params?: LanguageListItem) {
  return request(BASE_URL + '/Language/getlist', {
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

export async function queryAllLanguage() {
  return request(BASE_URL + '/Language/getall', {
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

export async function removeLanguage(params: any) {
  return request(BASE_URL + `/Language/deletebytoken?token=${params.token}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    data: {
      ...params,
    },
  }).then((a: any) => (a.data));
}

export async function addLanguage(params: LanguageListItem) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });
  return request(BASE_URL + '/Language/add', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'enctype': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    data: formData,
  }).then((a: any) => {
    return a.data;
  });
}

export async function updateLanguage(params: LanguageListItem) {
  return request(BASE_URL + '/Language/update', {
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
