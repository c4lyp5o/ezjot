import {
  auth,
  logger,
  withHelmet,
  withBruteForce,
} from '../../middleware/default';
import prisma from '../../lib/prisma';
import nextConnect from 'next-connect';

const getAPI = nextConnect();

getAPI.use(auth).use(withHelmet).use(withBruteForce);

getAPI.get(async (req, res) => {
  const { key, password, mode } = req.query;

  if (!key || !mode) {
    logger.warn(`${req.method} ${req.url} No password / mode provided.`);
    return res.status(400).json({
      status: 'Failed',
      code: 400,
      error: 'Missing required parameters.',
    });
  }

  switch (mode) {
    case 'c': {
      const getText = await prisma.uploads.findFirst({
        where: {
          key,
        },
      });
      return getText
        ? res.status(200).json(getText)
        : res.status(404).json({
            status: 'Failed',
            code: 404,
            error: 'No text found using the key provided!',
          });
    }
    case 'r': {
      if (!password) {
        logger.warn(`${req.method} ${req.url} User entered wrong password`);
        return res.status(400).json({
          status: 'Failed',
          code: 400,
          error: 'Missing required parameter.',
        });
      }

      const passCheck = await prisma.uploads.findFirst({
        where: {
          key,
          password,
        },
      });

      return passCheck
        ? res.status(200).json({ status: 'Success', code: 200 })
        : res.status(404).json({
            status: 'Failed',
            code: 404,
            error: 'No text found using the key / password provided!',
          });
    }
    default:
      logger.warn(`${req.method} ${req.url} No mode provided`);
      return res.status(400).json({
        status: 'Failed',
        code: 400,
        error: 'Invalid mode parameter.',
      });
  }
});

export default getAPI;
