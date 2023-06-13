import { useState } from "react";
import { worker, Status } from "../../utils/http";
import { CategoryCreateFields } from "./data";

export const CategoryUrl = {
  create: "/WebCategory/add/",
  list: "/WebCategory/getall/",
  delete: "/WebCategory/delete?id=",
  deletebyToken: "/WebCategory/deletebytoken?token=",
  // one: '/WebCategory/getbyid?id=',
  one: "/WebCategory/getbytoken?token=",
  edit: "/WebCategory/update",
  listByLang: "/WebCategory/getbylangcode",
  clone: "/WebCategory/clonebytoken",
  getWaitingPage : "/WebCategory/getbylangcodestandby"
};

interface UseCategoryCreate {
  createCategoryStatus: Status;
  onCreateCategoryAsync: (fields: CategoryCreateFields) => Promise<any>;
}
export function useCategoryCreate(): UseCategoryCreate {
  const [status, setStatus] = useState<Status>(null);

  async function onCreateCategoryAsync(fields: CategoryCreateFields) {
    setStatus("pending");
    try {
      const data = await worker(CategoryUrl.create, "POST", fields);
      setStatus("fulfilled");
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return {
    createCategoryStatus: status,
    onCreateCategoryAsync,
  };
}

type UseCreate<F, R> = [(fields: F) => Promise<any>, any, Status];
export function useCreate<F, R>(url: string): UseCreate<F, R> {
  const [status, setStatus] = useState<Status>(null);
  const [response, setResponse] = useState<R | null>(null);
  async function onCreateAsync(fields: F): Promise<any> {
    setStatus("pending");
    try {
      const data = await worker(url, "POST", fields);
      setStatus("fulfilled");
      setResponse(data);
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [onCreateAsync, response, status];
}

type UseClone<F, R> = [
  (token: string, langCode: string) => Promise<any>,
  any,
  Status
];
export function useClone<F, R>(url: string): UseClone<F, R> {
  const [status, setStatus] = useState<Status>(null);
  const [response, setResponse] = useState<R | null>(null);

  async function onCreateAsync(token: string, langCode: string): Promise<any> {
    setStatus("pending");
    try {
      const data = await worker(
        url + `?token=${token}&langCode=${langCode}`,
        "POST"
      );
      setStatus("fulfilled");
      setResponse(data);
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [onCreateAsync, response, status];
}

type UseEdit<F, R> = [(fields: F) => Promise<any>, any, Status];
export function useEdit<F, R>(url: string): UseEdit<F, R> {
  const [status, setStatus] = useState<Status>(null);
  const [response, setResponse] = useState<R | null>(null);

  async function onEditAsync(fields: F): Promise<any> {
    setStatus("pending");
    try {
      const data = await worker(url, "PUT", fields);
      setStatus("fulfilled");
      setResponse(data);
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [onEditAsync, response, status];
}

type UseList<R> = [() => Promise<R[]>, R[], Status];
export function useListAll<R>(url: string): UseList<R> {
  const [status, setStatus] = useState<Status>(null);
  const [list, setList] = useState<R[]>([]);

  async function onGetAsync() {
    setStatus("pending");
    try {
      const data = await worker(url, "GET");
      setList(data);
      setStatus("fulfilled");
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [onGetAsync, list, status];
}

type UseListByLang<R> = [(langCode: string) => Promise<R[]>, R[], Status];
export function useListByLang<R>(url: string): UseListByLang<R> {
  const [status, setStatus] = useState<Status>(null);
  const [list, setList] = useState<R[]>([]);

  async function onGetAsync(langCode: string) {
    setStatus("pending");
    try {
      const data = await worker(url + `?langCode=${langCode}`, "GET");
      setList(data);
      setStatus("fulfilled");
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [onGetAsync, list, status];
}

type UseByOrderCriteria<R> = [() => Promise<R>, R, Status];
export function useByOrderCriteria<R>(url: string): UseByOrderCriteria<R> {
  const [status, setStatus] = useState<Status>(null);
  const [list, setList] = useState<R>({} as R);

  async function onGetAsync() {
    setStatus("pending");
    try {
      const data = await worker(url, "GET");
      setList(data);
      setStatus("fulfilled");
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [onGetAsync, list, status];
}

type UseDelete = [
  (id: number | string) => Promise<boolean>,
  boolean | null,
  Status
];
export function useDelete(url: string): UseDelete {
  const [status, setStatus] = useState<Status>(null);
  const [response, setResponse] = useState<boolean | null>(null);

  async function onDeleteAsync(id: number | string): Promise<boolean> {
    setStatus("pending");
    try {
      const data = await worker(`${url}${id}`, "DELETE");
      setResponse(data);
      setStatus("fulfilled");
      return true;
    } catch (error) {
      setResponse(false);
      setStatus("rejected");
      return false;
    }
  }

  return [onDeleteAsync, response, status];
}

type UseGetOne<R> = [(query: string | number) => Promise<R>, R | null, Status];
export function useGetOne<R>(url: string): UseGetOne<R> {
  const [status, setStatus] = useState<Status>(null);
  const [data, setData] = useState<R | null>(null);

  async function getOne(query: string | number): Promise<R> {
    setStatus("pending");
    try {
      const resp = await worker(`${url}${query}`, "GET");
      setData(resp);
      setStatus("fulfilled");
      return resp;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [getOne, data, status];
}

type UseGetOneWithoutQuery<R> = [() => Promise<R>, R | null, Status];
export function UseGetOneWithoutQuery<R>(
  url: string
): UseGetOneWithoutQuery<R> {
  const [status, setStatus] = useState<Status>(null);
  const [data, setData] = useState<R | null>(null);

  async function getOne(): Promise<R> {
    setStatus("pending");
    try {
      const resp = await worker(url, "GET");
      setData(resp);
      setStatus("fulfilled");
      return resp;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [getOne, data, status];
}

type UseGetWithBody<F, R> = [(fields: F) => Promise<any>, any, Status];
export function useGetWithBody<F, R>(url: string): UseGetWithBody<F, R> {
  const [status, setStatus] = useState<Status>(null);
  const [response, setResponse] = useState<R | null>(null);
  async function onUseGetWithBodyAsync(fields: F): Promise<any> {
    setStatus("pending");
    try {
      const data = await worker(url, "POST", fields);
      setStatus("fulfilled");
      setResponse(data);
      return data;
    } catch (error) {
      setStatus("rejected");
      return error;
    }
  }

  return [onUseGetWithBodyAsync, response, status];
}