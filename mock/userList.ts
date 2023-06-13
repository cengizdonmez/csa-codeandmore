// eslint-disable-next-line import/no-extraneous-dependencies
import {Request, Response} from 'express';
import {parse} from 'url';
import {UserListItem} from '@/pages/UserList/data';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: UserListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      disabled: i % 6 === 0,
      firstName: 'Code And More',
      lastName: `${index}`,
      photo: 'https://www.codeandmore.com.tr//assets/images/logo.jpg',
      email: 'info@codeandmore.com.tr',
      passwordSalt: 'passwordshouldhide123',
      phoneNumber: Math.floor(100000 + Math.random() * 900000).toString(),
      userGroupId: 1,
      createdAt: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
      createdBy: 'Süha Uzun',
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 10);

function getUser(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const {current = 1, pageSize = 10} = req.query;
  const params = (parse(realUrl, true).query as unknown) as UserListItem;

  let dataSource = [...tableListDataSource];
  const sorter = JSON.parse(params.sorter as any);
  if (sorter) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((key) => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
          return;
        }
        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }
  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return Object.keys(filter).every((key) => {
          if (!filter[key]) {
            return true;
          }
          return filter[key] === item[key];
        });
      });
    }
  }
  const count = dataSource.length;
  dataSource = dataSource.slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  const result = {
    data: dataSource,
    total: count,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };

  return res.json(result);
}

function postUser(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const body = (b && b.body) || req.body;
  const {method, firstName, lastName, photo,email,passwordSalt,phoneNumber,userGroupId, disabled, key} = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => item.key === -1);
      break;
    case 'post':
      (() => {
        const newRule = {
          key: tableListDataSource.length,
          disabled,
          firstName,
          lastName,
          photo,
          email,
          passwordSalt,
          phoneNumber,
          userGroupId,
          createdAt: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          createdBy: 'Süha Uzun',
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.key === key) {
            newRule = {
              ...item,
              firstName,
              lastName,
              photo,
              email,
              passwordSalt,
              phoneNumber,
              userGroupId,
              disabled,
            };
            return {
              ...item,
              firstName,
              lastName,
              photo,
              email,
              passwordSalt,
              phoneNumber,
              userGroupId,
              disabled,
              updatedAt: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
              updatedBy: "Süha Uzun"
            };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

function formatDate(date: Date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2)
    month = `0${month}`;
  if (day.length < 2)
    day = `0${day}`;

  return [year, month, day].join('-');
}

export default {
  'GET /api/user': getUser,
  'POST /api/user': postUser,
};
