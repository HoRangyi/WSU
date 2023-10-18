const express = require("express");
const tokenService = require("C:/Users/user/Downloads/sv3/jwt");
const router = express.Router();

//나중에 DB붙일예정 현재 입력된 데이터로 확인중.
const users = [
  {
    id: "test",
    name: "tester",
    password: "test",
  },
];

router.post("/login", (req, res) => {
  const { id, password } = req.body;

  // id, password가 있는지 체크한다.
  if (!id || !password) {
    res.status(400).send({ message: "id, password는 필수입력 사항입니다." });
    return;
  }

  // 입력받은 id의 사용자를 찾는다.
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(400).send({ message: "존재하지 않는 사용자입니다." });
    return;
  }

  // 입력받은 password와 찾은 사용자의 password가 일치하는지 체크한다.
  if (user.password !== password) {
    res.status(400).send({ message: "비밀번호가 일치하지 않습니다." });
    return;
  }

  // 토큰을 발급한다.
  res.status(200).send({ token: "token" });

  res.status(200).send({ token: tokenService.getToken(id) });
});

router.post("/register", (req, res) => {
  const { id, password, name } = req.body;

  // id, password, name이 있는지 체크한다.
  if (!id || !password || !name) {
    res
      .status(400)
      .send({ message: "id, password, name은 필수입력 사항입니다." });
    return;
  }

  // id는 중복되지 않도록한다.
  const user = users.find((user) => user.id === id);
  if (user) {
    res.status(400).send({ message: "이미 존재하는 아이디입니다." });
    return;
  }

  // 사용자를 추가한다(아직 DB 붙이지 않아서 push로 배열에넣음)
  users.push(req.body);
  res.send({ message: "사용자를 등록했습니다." });
});

module.exports = router;
