const localAuth = (req, res, next) => {
  const allowedIps = ['127.0.0.1', '::1', '172.18.0.8'];

  const rawIp = req.connection.remoteAddress?.replace('::ffff:', '');
  if (allowedIps.includes(rawIp)) {
    return next();
  }

  res.status(403).json({ message: 'Forbidden' });
};

export default localAuth;
