//#region 사용중인 모듈
const express = require("express"); // 웹홈페이지 모듈
const app = express(); // 모듈 별칭화
const sprintf = require("sprintf-js").sprintf; // sprintf 사용모듈
const bodyParser = require("body-parser"); // 미들웨어 모듈
const maria = require("./DB/maria"); //DB연결모듈
const port = 3123; // 포트번호
const fs = require("fs")

const server = app.listen(port, () => {
  console.log("3123 포트에 로컬로 서버가열렸어요!");
});

const io = require("socket.io")(server)

//#endregion

// bodyParser 미들웨어를 사용하여 JSON 요청 본문을 파싱합니다.
app.use(bodyParser.json());

//#region 파이썬 함수 호출
const { spawn } = require("node:child_process");
const { title } = require("node:process");

var lock = true;
function Disaster_s(data){
  if(lock == true){
  if(data == "1"){
    const ls = spawn("python", ["test2.py"]);
      ls.stdout.on("data", (data) => {
        console.log("stdout: ${data}");
    });
  }
  lock = false;
 }
}

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


io.on('connection', (socket) => {
  
  updateValues();
  
  const intervalId = setInterval(() => {
    updateValues();
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(intervalId);
    console.log('연결종료');
  });
});

var imagePaths = [];
var serials = [];

function updateValues() {
  image_path((err, data) => {
    if (err) {
      console.error(err);
    } else {
        imagePaths.push(data);
        io.emit('image_path_1', imagePaths[0]);
        io.emit('image_path_2', imagePaths[1]);
        imagePaths = [data]; // 배열안에 data.length 이상 속성이있으면 초기화
    }
  });
  serial_path((err, data) => {
    if (err) {
      console.error(err);
    } else {
      serials = data;
      io.emit('serial_path_1', serials[0]);
      io.emit('serial_path_2', serials[1]);
      serials = [data]    // 배열안에 data.length 이상 속성이있으면 초기화
    }
  });
}

function image_path(callback) {
  var SQL = sprintf("Select * from ai");

  maria.query(SQL, function (err, rows, fields) {
    if (!err && rows.length > 0) {
      var disasters = [];
      var num = 0;
      for (const row of rows) {
        disasters[num] = row.Disaster;
       
        var newImageSrc = "";

        if (disasters[num] == 0) {
          newImageSrc = "0.png";
        } else if (disasters[num] == 1) {
          newImageSrc = "1.png";
          Disaster_s(disasters[num])
        } else if (disasters[num] == 2) {
          newImageSrc = "2.png";
        } else if (disasters[num] == 3) {
          newImageSrc = "3.png";
        } else if (disasters[num] == 4) {
          newImageSrc = "4.png";
        } else if (disasters[num] == 5) {
          newImageSrc = "5.png";
        } else if (disasters[num] == 6) {
          newImageSrc = "6.png";
        } else if (disasters[num] == 7) {
          newImageSrc = "7.png";
        }
        // 이미지 파일 경로를 콜백으로 전달
        callback(null, newImageSrc); 
      }
      num++;
    }
  });
}


function serial_path(callback) {
  var SQL = sprintf("Select * from ai");

  maria.query(SQL, function (err, rows, fields) {
    if (!err && rows.length > 0) {
      var serials = [];
      for (const row of rows) {
        serials.push(row.Sirial);
      }
      // 시리얼 값을 배열 전체로 콜백으로 전달
      callback(null, serials);
    }
  });
}
//#endregion

//기본 홈페이지 랜더링
app.get("/", (req, res) => {
  res.render("index", { title: "express" });
});

// DB 라인
//#region 사용자 등록
app.post("/sign_up", function (req, res) {
  const u_id = req.body.user_id; // 유저 ID
  const u_pw = req.body.user_pw; // 유저 PW
  const u_name = req.body.user_name; // 유저 이름
  const u_addr = req.body.user_adr; // 유저 주소
  const u_phone = req.body.user_phone; //유저 전화번호

  var SQL = sprintf(
    'INSERT INTO member VALUES("","%s", "%s", "%s","%s","%s");',
    u_id,
    u_pw,
    u_name,
    u_addr,
    u_phone
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

  var SQL = sprintf("Select id, pw from member where id = '%s' and pw = '%s'", u_id, u_pw);

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



