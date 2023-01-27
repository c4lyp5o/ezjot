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
saveAPI
  .use(auth)
  .use(withHelmet)
  .use(withBruteForce)

saveAPI.post(async (req, res) => {
  let { id, pastedText, dad, mode } = req.body;
  if (!dad) {
    dad = false;
  }
  switch (mode) {
    case 'c':
      console.log('c mode');
      const newKey = crypto.randomBytes(3).toString('hex');
      const newPassword = crypto.randomBytes(3).toString('hex');
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
      break;
    case 'u':
      console.log('u mode');
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
