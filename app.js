const express = require("express");
const ejs = require("ejs");
const app = express();
const sprintf = require("sprintf-js").sprintf;
//ㅁㅁ
const bodyParser = require("body-parser");

const maria = require("./DB/maria");
const port = 3123;
const userRouter = require("./user");

//#region 파이썬 함수 호출
const { spawn } = require("node:child_process");
//#endregion

app.set("view engine", "ejs");

app.use(express.static("./view" + "/"));
app.use(express.json());
app.use("/user", userRouter);

app.use(bodyParser.text());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("");
});

app.post("/go_sign_up", function (req, res) {});

//메세지전송
app.post("/message", function (req, res) {
  const ls = spawn("python", ["test2.py"]);

  ls.stdout.on("data", (data) => {
    console.log("stdout: ${data}");
  });
});

// DB 라인
//#region 회원가입
app.post("/sign_up", function (req, res) {
  const u_id = req.body.user_id;
  const u_pw = req.body.user_pw;
  const u_name = req.body.user_name;

  var SQL = sprintf(
    'INSERT INTO emtest VALUES("%s", "%s", "%s");',
    u_id,
    u_pw,
    u_name
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
  console.log("3001 포트에 로컬로 서버가열렸어요!");
});
