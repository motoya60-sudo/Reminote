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


};


