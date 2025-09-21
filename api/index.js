const express = require('express');
const app = express();
const PORT = 3000;

// JSONを扱えるようにする
app.use(express.json());

// ルート
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
