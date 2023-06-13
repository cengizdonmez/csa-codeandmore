import { useState } from 'react';
import { worker, Status } from '../../utils/http';
import { WebPageCreateFields } from './data';

export const WebPageUrl = {
  create: '/WebPage/add/',
  list: '/WebPage/getall/',
  delete: '/WebPage/delete?token=',
  one: '/WebPage/getbytoken?token=',
  edit: '/WebPage/update/',
  listByLang: '/WebPage/getbylangcode',
  clone: '/WebPage/clonebytoken',
  getWaitingPage : "/WebPage/getbylangcodestandby"
};

interface UseWebPageCreate {
  createWebPageStatus: Status;
  onCreateWebPageAsync: (fields: WebPageCreateFields) => Promise<any>;
}

export function useWebPageCreate(): UseWebPageCreate {
  const [status, setStatus] = useState<Status>(null);

  async function onCreateWebPageAsync(fields: WebPageCreateFields) {
    setStatus('pending');
    try {
      const data = await worker(WebPageUrl.create, 'POST', fields);
      setStatus('fulfilled');
      return data;
    } catch (error) {
      setStatus('rejected');
      return error;
    }
  }

  return {
    createWebPageStatus: status,
    onCreateWebPageAsync,
  };
}

type UseList<R> = [() => Promise<R[]>, R[], Status];

export function useListAll<R>(url: string): UseList<R> {
  const [status, setStatus] = useState<Status>(null);
  const [list, setList] = useState<R[]>([]);

  async function onGetAsync() {
    setStatus('pending');
    try {
      const data = await worker(url, 'GET');
      setStatus('fulfilled');
      setList(data);
      return data;
    } catch (error) {
      setStatus('rejected');
      return error;
    }
  }

  return [onGetAsync, list, status];
}
