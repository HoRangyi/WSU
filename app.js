//#region 사용중인 모듈
const express = require("express"); // 웹홈페이지 모듈
const app = express(); // 모듈 별칭화
const sprintf = require("sprintf-js").sprintf; // sprintf 사용모듈
const bodyParser = require("body-parser"); // 미들웨어 모듈
const maria = require("./DB/maria"); //DB연결모듈
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
app.set("view engine", "ejs");
app.use(express.static("./view" + "/"));
app.use(express.json());

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
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

  var SQL = sprintf("Select id from emtest where id = %s", u_id);

  app.post("/login", function (req, res) {
    var u_id = req.body.id;
    var u_pw = req.body.password;

    if (u_id == "admin" && u_pw == "admin") {
      res.send("어드민계정");
    } else {
      maria.query(SQL, function (err, rows, fields) {
        if (!err) {
          // 로그인 성공 시, HTML 파일을 클라이언트에게 보냅니다.
          res.sendFile(
            "C:/Users/user/Downloads/sv3/WSU/view/situation board.html"
          );
        } else {
          res.send("로그인 실패..");
          console.log("[DB] INSERT ERROR!");
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log("3123 포트에 로컬로 서버가열렸어요!");
});
