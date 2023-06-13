// eslint-disable-next-line import/no-extraneous-dependencies
import {Request, Response} from 'express';
import {parse} from 'url';
import {BannerListItem} from '@/pages/BannerList/data';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: BannerListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      banner: [{
        id:index,
        color: getRandomColor(),
        image: `https://www.codeandmore.com.tr//assets/images/logo.jpg`,
        imagePath: `https://www.codeandmore.com.tr//assets/images/logo.jpg`,
        diffractionIds:[1,2]
      }],
      status: i % 6 === 0,
      rowNumber: index + 1,
      title: [{
        id:index,
        title: `banner title ${index}`,
        languageId: 1,
        diffractionIds: [1, 2]
      }],
      description: [{
        id:index,
        description: `banner description ${index}`,
        languageId: 1,
        diffractionIds: [1, 2]
      }],
      link: [{
        id: index,
        link: `banner link ${index}`,
        languageId: 1,
        diffractionIds: [1, 2]
      }],
      createdAt: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
      createdBy: 'Süha Uzun',
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


let tableListDataSource = genList(1, 10);

function getBanner(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const {current = 1, pageSize = 10} = req.query;
  const params = (parse(realUrl, true).query as unknown) as BannerListParams;

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

function postBanner(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const body = (b && b.body) || req.body;
  const {
    method,
    disabled,
    backgroundColor,
    image,
    order,
    languages,
    views,
    title,
    description,
    link
    , key
  } = body;

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
          image,
          order,
          backgroundColor,
          languages,
          views,
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
              disabled,
              image,
              order,
              backgroundColor,
              languages,
              views,
              title,
              description,
              link
            };
            return {
              ...item,
              disabled,
              image,
              order,
              backgroundColor,
              languages,
              views,
              title,
              description,
              link,
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
  'GET /api/banner': getBanner,
  'POST /api/banner': postBanner,
};
