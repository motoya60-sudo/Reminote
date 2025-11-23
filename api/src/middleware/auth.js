const { admin } = require('../services/firebase');

// 認証必須
const verifyFirebaseToken = async (req, res, next) => {

  console.log('[AUTH] enter', req.method, req.originalUrl);
  
  try {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) {
      console.warn('[AUTH] missing token');
      return res.status(401).json({ message:'Missing token' });
    }
    const decoded = await admin.auth().verifyIdToken(h.split(' ')[1]);
    console.log('[AUTH] ok uid=', decoded.uid);
    req.user = { uid: decoded.uid };
    next();
  } catch (e) {
    console.error('[AUTH] fail', e.code, e.message);
    return res.status(401).json({ message:'Invalid token' });
  }
};

// 任意認証（無くても通す）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified
      };
    }
    next();
  } catch (error) {
    console.log('[auth] Optional auth failed:', error.message);
    next();
  }
};


