import {request} from 'umi';
import {SliderListItem} from './data.d';

export async function querySlider(params?: SliderListItem) {
  return request('/api/MiniSlider/getlist', {
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

export async function removeSlider(params: { key: number }) {
  return request('/api/slider', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addSlider(params: SliderListItem) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });

  return request('/api/MiniSlider/add', {
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

export async function updateSlider(params: SliderListItem) {
  return request('/api/slider', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
