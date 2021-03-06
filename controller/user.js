import {} from "express-async-errors";
import jwt from "jsonwebtoken";
import * as userModel from "../model/user.js";
import bcrypt from "bcrypt";
import { config } from "../configuration/config.js";

// loginId dup check
export async function checkLoginId(req, res) {
  const loginId = req.body;
  const checkId = await userModel.findDup(loginId);
  if (checkId) {
    res.status(400).send({
      result: "false",
    });
  } else {
    res.status(200).send({
      result: "true",
    });
  }
}

// nickname dup check
export async function checkNickname(req, res) {
  const nickname = req.body;
  const checkNick = await userModel.findDup(nickname);
  if (checkNick) {
    res.status(400).send({
      result: "false",
    });
  } else {
    res.status(200).send({
      result: "true",
    });
  }
}

// signup
export async function signup(req, res) {
  const { loginId, password, nickname } = req.body;
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt.saltRounds)
  );
  const user = await userModel.createUser(loginId, hashPassword, nickname);
  res.status(201).send({
    message: "회원가입 성공",
  });
}

//login
export async function login(req, res) {
  const { loginId, password } = req.body;
  const userCheck = await userModel.findDup({ loginId });
  if (!userCheck || !password) {
    res.status(400).send({ message: "아이디 또는 패스워드를 확인해주세요" });
    return;
  }
  const validPassword = await bcrypt.compare(password, userCheck.password); //bcrypt는 단방향 암호화라서 복화하가 불가능
  if (!validPassword) {
    res.status(400).send({ message: "아이디 또는 패스워드를 확인해주세요" });
    return;
  }
  const nickname = userCheck.nickname;
  const token = jwt.sign({ id: userCheck.id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expriersDays,
  });
  res.status(201).send({ token, nickname });
}
