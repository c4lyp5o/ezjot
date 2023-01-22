import { auth, logger } from '../../middleware/default';
import nextConnect from 'next-connect';
import prisma from '../../lib/prisma';
import crypto from 'crypto';

const saveAPI = nextConnect();
saveAPI.use(auth);

saveAPI.post(async (req, res) => {
    let { pastedText, dad } = req.body;
    if (!dad) {
        dad = false;
    }
  const key = crypto.randomBytes(3).toString('hex');
  const password = crypto.randomBytes(3).toString('hex');
  const Uploads = await prisma.uploads.create({
    data: {
        pastedText: pastedText,
      key: key,
      password: password,
      dad: dad,
    },
  });
  res.status(200).json({
    message: 'Text Uploaded',
    key: Uploads.key,
    password: Uploads.password,
    dad: Uploads.dad,
  });
});

export default saveAPI;