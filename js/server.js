const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
global.results;
// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'svc.sel5.cloudtype.app',
  user: 'root',
  password: '1234',
  database: 'info',
  port: 30553
});

connection.connect((error) => {
  if (error) {
    console.error('MySQL 연결에 실패했습니다.', error);
  } else {
    console.log('MySQL에 연결되었습니다.');
  }
});

// body-parser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 정적 파일(HTML, CSS, JS)이 위치한 디렉토리 설정
app.get('/css/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../css/style.css'));
});
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/html', express.static(path.join(__dirname, '../html')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/index.html'));
});

// 로그인 요청 처리
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // 사용자명과 비밀번호를 기준으로 사용자 조회
  const query = `SELECT id FROM info WHERE username = ? AND password = ?`;
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('로그인 중 오류가 발생했습니다.', error);
      res.status(500).send('로그인 중 오류가 발생했습니다.');
      return;
    } 
    if (results.length > 0) {
      console.log(results);
      global.results = results[0].id; // 여기에 코드 추가
      // 로그인 성공
      res.send('로그인 성공');
    } else {
      // 로그인 실패
      res.status(401).send('사용자명이나 비밀번호가 올바르지 않습니다.');
    }
    
  });
});

// 회원가입 요청 처리
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    res.status(400).send('사용자명을 입력해주세요.');
    return;
  }

  if (!password) {
    res.status(400).send('비밀번호를 입력해주세요.');
    return;
  }

  // INSERT 쿼리 실행
  const query = `INSERT INTO info (username, password) VALUES (?, ?)`;
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('회원가입 중 오류가 발생했습니다.', error);
      res.status(500).send('회원가입 중 오류가 발생했습니다.');
    } else {
      res.send('회원가입이 완료되었습니다.');
    }
  });
});

app.get('/username', (req, res) => {
  if (!global.results) {
    res.send(''); // 로그인이 되어있지 않을 때 빈 문자열 반환
    return;
  }
  
  const query = `SELECT username FROM info WHERE id = ${global.results}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('사용자 이름 조회 중 오류가 발생했습니다.', error);
      res.status(500).send('사용자 이름 조회 중 오류가 발생했습니다.');
      return;
    }
    if (results.length > 0) {
      const username = results[0].username;
      res.send(username);
    } else {
      res.send('사용자 이름을 찾을 수 없습니다.');
    }
  });
});


app.post('/logout', (req, res) => {
  // 로그아웃 처리
  global.results = undefined; // 사용자 정보 초기화

  res.send('로그아웃되었습니다.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
