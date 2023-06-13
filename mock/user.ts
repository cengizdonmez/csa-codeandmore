import {Request, Response} from 'express';

function getFakeCaptcha(req: Request, res: Response) {
  return res.json('captcha-xxx');
}

const {ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION} = process.env;


let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

export default {
  'GET /api/currentUser': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: 'lütfen önce giriş yapın！',
        success: true,
      });
      return;
    }
    res.send({
      name: 'Suha Uzun',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'info@suhauzun.com',
      access: getAccess(),
    });
  },
  'POST /api/login/account': (req: Request, res: Response) => {
    const {password, email} = req.body;
    if (password === 'test@test.com' && email === 'test') {
      res.send({
        status: 'ok',
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'GET /api/login/outLogin': (req: Request, res: Response) => {
    access = '';
    res.send({data: {}, success: true});
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({status: 'ok', currentAuthority: 'user', success: true});
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
