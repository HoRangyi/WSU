//#region 사용중인 모듈
const express = require("express") // 웹홈페이지 모듈
const app = express() // 모듈 별칭화
const sprintf = require("sprintf-js").sprintf // sprintf 사용모듈
const bodyParser = require("body-parser") // 미들웨어 모듈
const maria = require("./DB/maria") //DB연결모듈
const port = 3123; // 포트번호
//#endregion

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
app.set("view engine", "ejs")
app.use(express.static("./view" + "/"))
app.use(express.json());

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
//#endregion

//기본 홈페이지 랜더링
app.get("/", (req, res) => {
  res.render("index", {title:'express'});
});

// DB 라인
//#region 회원가입
app.post("/sign_up", function (req, res) {
  const u_id = 0 //req.body.user_id;
  const u_pw = 0  //req.body.user_pw;
  const u_name = 0 //req.body.user_name;
  const u_phone = 0
  const u_addr = 0
  const u_aname = 0
  const u_aphone = 0

  var SQL = sprintf(
    'INSERT INTO basic VALUES("%s", "%s", "%s","%s","%s","%s","%s");',
    u_id,
    u_pw,
    u_name,
    u_phone,
    u_addr,
    u_aname,
    u_aphone
  );
  maria.query(SQL, function (err, rows, fields) {
    if (!err) {
      res.send("회원가입 성공!");
    } else {
      res.send("회원가입 실패..");
      console.log("[DB] INSERT ERROR!");
    }
  });
});
//#endregion
app.post("/sign_in", function (req, res) {
  const u_id = req.body.user_id;
  const u_pw = req.body.user_pw;

  var SQL = sprintf("Select id from emtest where id = %s", u_id);

  if (u_id == "admin" && u_pw == "admin") {
    res.send("어드민계정");
  } else {
    maria.query(SQL, function (err, rows, fields) {
      if (!err) {
        res.send("로그인 성공!");
      } else {
        res.send("로그인 실패..");
        console.log("[DB] INSERT ERROR!");
      }
    });
  }
});

app.listen(port, () => {
  console.log("3123 포트에 로컬로 서버가열렸어요!");
});
