import {
  auth,
  logger,
  withHelmet,
  withBruteForce,
} from '../../middleware/default';
import nextConnect from 'next-connect';
import prisma from '../../lib/prisma';
import crypto from 'crypto';

const saveAPI = nextConnect();
saveAPI.use(auth).use(withHelmet).use(withBruteForce);

saveAPI.post(async ({ body: { id, pastedText, dad, mode } }, res) => {
  if (!dad) {
    dad = false;
  }

  switch (mode) {
    case 'c':
      try {
        const Uploads = await prisma.uploads.create({
          data: {
            pastedText: pastedText,
            key: newKey,
            password: newPassword,
            dad: dad,
          },
        });
        logger.info(
          `New text uploaded with key: ${Uploads.key} and password: ${Uploads.password}`
        );
        res.status(200).json({
          message: 'Text Uploaded',
          key: Uploads.key,
          password: Uploads.password,
          dad: Uploads.dad,
        });
      } catch (error) {
        logger.error(error);
        res.status(500).json({
          status: 'Failed',
          code: 500,
          error: 'Internal server error!',
        });
      }
      break;
    case 'u':
      const updateText = await prisma.uploads.update({
        where: {
          id: id,
        },
        data: {
          pastedText: pastedText,
        },
      });
      res.status(200).json({
        message: 'Text Updated',
        key: updateText.key,
        password: updateText.password,
        dad: updateText.dad,
      });
      break;
    default:
      res.status(404).json({
        status: 'Failed',
        code: 404,
        error: 'No text found using the key provided!',
      });
      break;
  }
});

export default saveAPI;
