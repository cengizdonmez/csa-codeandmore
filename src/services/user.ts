import {request} from 'umi';
import jwt from 'jsonwebtoken'
import { BASE_URL } from '@/utils/http';

export async function queryCurrent() {
  const perms = localStorage.getItem("perms");
  if(!perms) {
    return null;
  } else {
    if(!jwt.verify(perms!, "codeandmore-secret-01")){
      return null;
    }
  }
  if (localStorage.getItem('userId'))
    return request(BASE_URL+'/User/getbyid', {
      params: {
        id: localStorage.getItem('userId')
      },
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((a: any) => {
      const current = {id:a.id,firstName:a.firstName, filePath:a.filePath, permissions: perms}
      localStorage.setItem("user", JSON.stringify(current))
      return a;
    });
  return null;
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
