const localAuth = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;

  const normalizedIp = ip.replace('::ffff:', '');

  if (normalizedIp === '127.0.0.1' || normalizedIp === '::1') {
    return next();
  }

  res.status(403).json({ message: 'Forbidden' });
};

export default localAuth;
