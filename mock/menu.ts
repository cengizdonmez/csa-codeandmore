// eslint-disable-next-line import/no-extraneous-dependencies
import {Request, Response} from 'express';

function getMenu(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  return res.json( {
    menuPosition: {
      description: "Tasarımda var olan menüler ve konumları",
      maxDepth: 2,
      menuPositionId: {
        headerMenu: 0,
        footer1: 0,
        footer2: 0,
        topMenu: 0,
        uyelikEkrani: 0
      },
      name: "Menü Konumları",
      relatives: [
        {
          "name": "Üst Menü",
          "value": "headermenu"
        },
        {
          "name": "Footer 1",
          "value": "footer1"
        },
        {
          "name": "Footer 2",
          "value": "footer2"
        }
      ]
    }
  });
}

export default {
  'GET /api/menu': getMenu
};
