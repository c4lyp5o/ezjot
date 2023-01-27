import {
  auth,
  logger,
  withHelmet,
  withBruteForce,
} from '../../middleware/default';
import prisma from '../../lib/prisma';
import nextConnect from 'next-connect';

const getAPI = nextConnect();
getAPI
  .use(auth)
  .use(withHelmet)
  .use(withBruteForce)

async function responseType(req, res) {
  logger.warn(
    `${req.method} ${req.url} User entered wrong key / password`
  );
  return res.status(404).json({
    status: 'Failed',
    code: 404,
    error: 'No text found using the key provided!',
  });
}

getAPI.get(async (req, res) => {
  const { key, password, mode } = req.query;
  switch (mode) {
    case 'c':
      console.log('c mode');
      const getText = await prisma.uploads.findFirst({
        where: {
          key: key,
        },
      });
      try {
        res.status(200).json(getText);
      } catch (error) {
        responseType(req, res);
      }
      break;
    case 'r':
      console.log('r mode');
      const passCheck = await prisma.uploads.findFirst({
        where: {
          key: key,
          password: password,
        },
      });
      if (passCheck) {
        res.status(200).json({ status: 'Success', code: 200 });
      } else {
        responseType(req, res);
      }
      break;
    default:
      responseType(req, res);
      break;
  }
});

export default getAPI;
