//#region 사용중인 모듈
const express = require("express"); // 웹홈페이지 모듈
const app = express(); // 모듈 별칭화
const sprintf = require("sprintf-js").sprintf; // sprintf 사용모듈
const bodyParser = require("body-parser"); // 미들웨어 모듈
const maria = require("./DB/maria"); //DB연결모듈
const port = 3123; // 포트번호
//#endregion
// 데이터베이스 대신 메모리에 임시로 저장할 객체
let profile = {
  username: "초기 사용자 이름",
  address: "초기 주소",
};

// bodyParser 미들웨어를 사용하여 JSON 요청 본문을 파싱합니다.
app.use(bodyParser.json());

// 프로필 데이터를 가져오는 라우트
app.get("/profile", (req, res) => {
  res.json(profile);
});

// 프로필 데이터를 업데이트하는 라우트
app.post("/update-profile", (req, res) => {
  const { username, address } = req.body;
  profile.username = username;
  profile.address = address;
  res.send({ message: "프로필이 성공적으로 업데이트되었습니다." });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${3123}`);
});

//#region 파이썬 함수 호출
const { spawn } = require("node:child_process");
const { title } = require("node:process");

//메세지전송
app.post("/message", function (req, res) {
  const ls = spawn("python", ["test2.py"]);

  ls.stdout.on("data", (data) => {
    console.log("stdout: ${data}");
  });
});
//#endregion

//#region 미들웨어 적용(static)
app.set("view engine", "ejs");
app.use(express.static("./view" + "/"));
app.use(express.json());

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/situation_board", (req, res) => {
  res.sendFile(__dirname + "/view/situation_board.html");
});

//#endregion

//기본 홈페이지 랜더링
app.get("/", (req, res) => {
  res.render("index", { title: "express" });
});

//#region 상황판
// //while
//     setInterval(function() {
//       var SQL = sprintf(
//         'Select * from '
//         )
//         maria.query(SQL, function (err, rows, fields){
//           if(!err){
//             // 여기에 html에 값 보내야됨
//           }else{
//             res.send("")
//           }
//         })
//     }, 100)

//#endregion

// DB 라인
//#region 사용자 등록
app.post("/sign_up", function (req, res) {
  const u_id = req.body.user_id; // 유저 ID
  const u_pw = req.body.user_pw; // 유저 PW
  const u_name = req.body.user_name; // 유저 이름
  const u_phone = req.body.user_phone; //유저 전화번호
  const u_addr = req.body.user_adr; // 유저 주소
  const u_gardian_name = ""; // 보호자 이름
  const u_gardian_phone = ""; // 보호자 번호
  const u_offices = ""; // 관공서
  const u_chief = ""; // 이장님

  var SQL = sprintf(
    'INSERT INTO basic VALUES("%s", "%s", "%s","%s","%s","%s","%s","%s","%s");',
    u_id,
    u_pw,
    u_name,
    u_phone,
    u_addr,
    u_gardian_name,
    u_gardian_phone,
    u_offices,
    u_chief
  );
  maria.query(SQL, function (err, rows, fields) {
    if (!err) {
      res.send("사용자 등록 성공!");
    } else {
      res.send("사용자 등록 실패..");
      console.log("사용자 등록 실패 [ Insert ERROR ]");
    }
  });
});
//#endregion
app.post("/sign_in", function (req, res) {
  const u_id = req.body.user_id;
  const u_pw = req.body.user_pw;

  var SQL = sprintf("Select id from member where id = '%s'", u_id);

  maria.query(SQL, function (err, rows, fields) {
    if (!err && rows.length > 0) {
      // 로그인이 성공하면 situation_board.html 페이지로 리다이렉션
      res.redirect("/situation_board");
    } else {
      // 로그인 실패시 실패 메시지 전송
      res.send("로그인 실패..");
      console.log("[DB] INSERT ERROR!");
    }
  });
});

app.listen(port, () => {
  console.log("3123 포트에 로컬로 서버가열렸어요!");
});
