import nextConnect from 'next-connect';
import sslRedirect from 'express-sslify';
import helmet from 'helmet';
import expressBrute from 'express-brute';
import log4js from 'log4js';

const bruteStore = new expressBrute.MemoryStore();
const bruteForce = new expressBrute(bruteStore);

log4js.configure({
  appenders: {
    everything: {
      type: 'file',
      filename: 'logs/everything.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c - %m',
      },
    },
  },
  categories: {
    default: { appenders: ['everything'], level: 'info' },
  },
});

const logger = log4js.getLogger();
logger.level = 'info';

const auth = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ error: `Method "${req.method}" Not Allowed` });
  },
  onBadRequest(req, res) {
    res.status(400).json({ error: `Bad Request` });
  },
});
// .post((req, res, next) => {
//     // extract x-api-key from request header
//     const API_KEY = req.headers['x-api-key'];
//     // if no x-api-key is present, return 401
//     if (!API_KEY) {
//       logger.warn(
//         `${req.method} ${req.url} User accessed API route without API key`
//       );
//       return res.status(401).json({ error: `Unauthorized` });
//     }
//     next();
//   })
//   .get((req, res, next) => {
//     const API_KEY = req.headers['x-api-key'];
//     if (!API_KEY) {
//       logger.warn(
//         `${req.method} ${req.url} User accessed API route without API key`
//       );
//       return res.status(401).json({ error: `Unauthorized` });
//     }
//     next();
//   });

const withHelmet = nextConnect();
withHelmet.use(helmet());

const withBruteForce = nextConnect();
withBruteForce.use(bruteForce.prevent);

const withSslRedirect = nextConnect();
withSslRedirect.use(sslRedirect.HTTPS({ trustProtoHeader: true }));

export {
  auth,
  logger,
  withHelmet,
  withBruteForce,
  withSslRedirect,
};
