import { BASE_URL } from '@/utils/http';
import {request} from 'umi';
import {LogListItem} from './data.d';

export async function queryLog(params?: LogListItem) {
  return request(BASE_URL + '/Log/getlist', {
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



