import { auth, logger } from '../../middleware/default';
import prisma from '../../lib/prisma';
import nextConnect from 'next-connect';

const getAPI = nextConnect();
getAPI.use(auth);

async function responseType(req, res) {
  logger.warn(`${req.method} ${req.url} User entered wrong key / password`);
  return res.status(404).json({
    status: 'Failed',
    code: 404,
    error: 'No text found using the key provided!',
  });
}

getAPI.get(async (req, res) => {
  const { key, password } = req.query;
  const Uploads = await prisma.uploads.findFirst({
    where: {
      key: key,
      password: password,
    },
  });
  try {    
    res.status(200).json(Uploads);
  } catch (error) {
    responseType(req, res);
  }
});

export default getAPI;