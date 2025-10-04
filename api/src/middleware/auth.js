const { admin } = require('../services/firebase');

// Firebase IDトークンを検証するミドルウェア
const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '認証トークンが提供されていません'
      });
    }

    const token = authHeader.split(' ')[1];

    // Firebase IDトークンを検証
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // リクエストオブジェクトにユーザー情報を追加
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      email_verified: decodedToken.email_verified
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: '認証トークンの有効期限が切れています'
      });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({
        success: false,
        message: '無効な認証トークンです'
      });
    }

    return res.status(401).json({
      success: false,
      message: '認証に失敗しました'
    });
  }
};

// オプショナル認証（認証されていなくてもアクセス可能）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
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
    // 認証エラーがあっても続行（オプショナル）
    console.log('Optional auth failed:', error.message);
    next();
  }
};

module.exports = {
  verifyFirebaseToken,
  optionalAuth
};

