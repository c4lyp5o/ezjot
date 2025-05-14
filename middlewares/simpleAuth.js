import { configDotenv } from 'dotenv';

configDotenv();

const simpleAuth = (req, res, next) => {
  if (req.headers['x-api-key'] === process.env.API_KEY) {
    return next();
  }

  res.status(401).json({ message: 'Unauthorized' });
};

export default simpleAuth;
