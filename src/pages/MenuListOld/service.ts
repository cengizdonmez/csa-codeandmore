import {request} from 'umi';
import {Menu} from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';

export async function queryMenu() {
  return request(`/api/Menu/getall`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((a: any) => {
    return a;
  });
}

export async function queryMenuItem() {
  return request('/api/MenuItem/getall', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((a: any) => {
    return a;
  });
}

export async function querySetting() {
  return request('/api/Setting/getall', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((a: any) => {
    if (a.length > 0)
      return a.map((value: any) => {
        return {
          id: value.id,
          name: value.name,
          jsonContent: JSON.parse(value.jsonContent || '{}'),
        };
      });
    return [];
  });
}

export async function updateSetting(params: any) {
  return request('/api/Setting/update', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: {
      id: params.id,
      name: params.name,
      jsonContent: JSON.stringify(params.jsonContent)
    }
  }).then((a: any) => {

  });
}


export async function getByNameSetting(params: any) {
  return request(
    `/api/Setting/getbyname/${params.name}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  ).then((a: any) => {
    if (a) {
      return {
        id: a.id,
        name: a.name,
        jsonContent: JSON.parse(a.jsonContent || '{}'),
      };
    }
    return {};
  });
}

export async function getListByMenuId(params: any) {
  return fetch(
    `/api/MenuItem/getlistbymenuid?menuId=${params}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
    ,
  ).then((res)=>res.ok?res.json():null).then((a: any) => {
    return a
  }).catch(()=>null)
}

export async function getByIdMenu(params: any) {
  return request(`/api/Menu/getbyid?menuId=${params.menuId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    skipErrorHandler: true
  }).then((a: any) => {
    if (a) {
      return {
        id: a.id,
        name: a.name,
        token: a.token,
        jsonContent: JSON.parse(a.jsonContent || '{}'),
      };
    }
    return {};
  });
}

export async function addMenu(params: Menu) {
  return request('/api/Menu/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a;
  });
}

export async function addMenuItemList(params: MenuItem, menuId: number) {
  return request(`/api/MenuItem/addlist?menuId=${menuId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a;
  });
}

export async function addMenuItem(params: MenuItem) {
  return request('/api/Menu/add', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a;
  });
}


export async function removeMenu(params: any) {
  return request(`/api/Menu/delete?token=${params.token}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    params
    ,
  }).then((a: any) => a.data);
}

export async function updateMenu(params: Menu) {
  return request('/api/Menu/update', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a.data;
  });
}

export async function removeMenuItem(params: { key: number }) {
  return request('/api/MenuItem/delete', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: {
      ...params,
    },
  }).then((a: any) => a.data);
}

export async function updateMenuItem(params: MenuItem) {
  return request('/api/MenuItem/update', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a.data;
  });
}

export async function updateMenuItemList(params: MenuItem[], menuId: number) {
  return request(`/api/MenuItem/updatelist?menuId=${menuId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  }).then((a: any) => {
    return a.data;
  });
}
