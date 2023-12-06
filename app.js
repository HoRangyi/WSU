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
var member = [];

async function getImageData() {
  return new Promise((resolve, reject) => {
    var SQL = sprintf("Select * from ai");

    maria.query(SQL, function (err, rows, fields) {
      if (err) {
        reject(err);
      } else if (rows.length > 0) {
        var disasters = [];
        var imagePaths = [];

        for (const row of rows) {
          disasters.push(row.Disaster);

          var newImageSrc = "";

          switch (disasters[disasters.length - 1]) {
            // 이미지 파일 경로를 생성
            case 0:
              newImageSrc = "0.png";
              break;
            case 1:
              newImageSrc = "1.png";
              Disaster_s(disasters[disasters.length - 1]);
              break;
            case 2:
              newImageSrc = "2.png";
              break;
            case 3:
              newImageSrc = "3.png";
              break;
            case 4:
              newImageSrc = "4.png";
              break;
            case 5:
              newImageSrc = "5.png";
              break;
            case 6:
              newImageSrc = "6.png";
              break;
            case 7:
              newImageSrc = "7.png";
              break;
            default:
              // 다른 경우에 대한 처리를 추가할 수 있습니다.
              break;
          }

          imagePaths.push(newImageSrc);
        }

        resolve(imagePaths);
      } else {
        resolve([]); // 데이터가 없을 경우 빈 배열 반환
      }
    });
  });
}

async function updateValues() {
  try {
    const imageData = await getImageData();
    const serialData = await getSerialData();
    const MemberData = await getMemberData();

    
    // 이미지 데이터 처리
    imagePaths = imageData.slice(-8);
    for (let i = 0; i < imagePaths.length; i++) {
      io.emit(`image_path_${i + 1}`, imagePaths[i]);
    }

    // 시리얼 데이터 처리
    serials = serialData.slice(-8);
    for (let i = 0; i < serials.length; i++) {
      io.emit(`serial_path_${i + 1}`, serials[i]);
    }

    // Member 데이터 처리
    for (let i = 0; i < MemberData.length; i++) {
      const currentMember = MemberData[i];
      const name = currentMember.name;
      const addr = currentMember.addr;
      const phone = currentMember.phone;

      io.emit(`name_path_${i + 1}`, name);
      io.emit(`addr_path_${i + 1}`, addr);
      io.emit(`phone_path_${i + 1}`, phone);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getSerialData() {
  return new Promise((resolve, reject) => {
    var SQL = sprintf("Select * from ai");

    maria.query(SQL, function (err, rows, fields) {
      if (err) {
        reject(err);
      } else if (rows.length > 0) {
        var serials = [];
        for (const row of rows) {
          serials.push(row.Sirial);
        }
        resolve(serials);
      } else {
        resolve([]); // 데이터가 없을 경우 빈 배열 반환
      }
    });
  });
}

async function getMemberData() {
  return new Promise((resolve, reject) => {
    var SQL = sprintf("Select * from member");

    maria.query(SQL, function (err, rows, fields) {
      if (err) {
        reject(err);
      } else if (rows.length > 0) {
        var members = [];
        
        for (const row of rows) {
          members.push({
            name: row.NAME,
            addr: row.ADDR,
            phone: row.Phone
          });
        //  console.log(row.NAME)
        //  console.log(row.ADDR)
        //  console.log(row.Phone)
        }
        resolve(members); // 데이터를 resolve 함수로 전달
      } else {
        resolve([]); // 데이터가 없을 경우 빈 배열 반환
      }
    });
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

