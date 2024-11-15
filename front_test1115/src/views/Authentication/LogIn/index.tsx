import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../../../layouts/Header";
import useAuthStore from "../../../Stores/user.store";

// interface 는 해당 변수명과 타입을 미리 정해놓고 사용하기 위함
// 사용자 입력 정보 ( Credentials : 자격 정보 )의 상태를 나타냄
// credential : 자격, 증명, 신원 정보, 사용자의 정보
interface Credentials {
  email: string;
  password: string;
}

// 로그인 후 전역 상태에 저장될 사용자 데이터를 나타냄
interface UserAuthData {
  id: number;
  email: string; // 백엔드에서 User entity를 보면 email로 돼잇는데 userSignINdto 를 ㅂ보면 user 객체안에 name이라는게 없어서 email로 그냥 받음
}

// 서버에서 반환하는 로그인 응답 데이터의 형태를 나타낸다.
interface LogInResponseDto {
  token: string;
  user: UserAuthData;
  exprTime: number;
}

function LogIn() {
  //% hook 정의
  const navigate = useNavigate();

  // state : useUserStore() 훅을 사용하여 사용자 정보를 전역 상태에 저장
  // const  { setUser } = useUserStore();
  //% state
  // credentials : 로그인 입력 상태
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  // user : 로그인 컴포넌트
  // 사용자 상태를 컴포넌트 내에서 관리하는 state
  // const [user, setUser] = useState<Credentials>({
  //   email: "",
  //   password: "",
  // });

  // error : 오류 메서지를 저장할 상태 - 이건 왜 해야할까?
  const [error, setError] = useState<string>("");

  // cookies : react cookie 훅을 사용하여 쿠키를 설정하는 함수
  const [cookies, setCookies] = useCookies(["token"]);
  // user 라는 토큰을 쿠키에 저장하고 싶으면 ["user"]라고 작성한다.

  const { login } = useAuthStore();

  //% 이벤트 핸들러
  // 로그인 입력 필드 입력 이벤트 처리 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  // 로그인 버튼 클릭 이벤트 처리 함수
  const handleLogIn = async () => {
    const { email, password } = credentials;

    // 이메일 o + 비밀번호 o => false
    // 이메일 x + 비밀번호 o => true
    // 이메일 o + 비밀번호 x => true
    // 이메일 x + 비밀번호 x => true
    if (!email || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/logIn`,
        credentials
      );
      if (response.data) {
        console.log(response);
        logInSuccessResponse(response.data.data);
      }
    } catch (error) {
      setError("로그인중 문제가 발생했습니다");
    }
  };
  // 로그인 성공시 실행하는 메서드
  // 서버 응답이 성공일 경우 토큰과 사용자 정보를 저장 & 페이지 발동
  // 성공시 실행되는 함수
  const logInSuccessResponse = (data: LogInResponseDto) => {
    if (data) {
      const { token, exprTime, user } = data;
      setToken(token, exprTime);
      login({
        id: user.id,
        name: user.email,
      });
      navigate("/board");
    } else {
      setError("로그인 실패 : 인증 정보를 확인해주세요");
    }
  };
  // 인증 토큰을 저장하는 함수
  const setToken = (token: string, exprTime: number) => {
    const expires = new Date(Date.now() + exprTime);
    setCookies("token", token, { path: "/", expires });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: 360,
        m: "auto",
        mt: 4,
      }}
    >
      <CardContent>
        <Typography variant="h5" mb={2}>
          로그인
        </Typography>
        {/* <Header >{user.email}</Header> */}
        {/* 입력 필드 */}
        <TextField
          label="이메일"
          type="email"
          name="email"
          variant="outlined"
          value={credentials.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          // !데이터값
          // : 값을 불리언 타입으로 변환하는 방식

          // !!값이 존재하면 true
          // !!값이 존재하지 않으면 false
        />
        <TextField
          label="비밀번호"
          type="password"
          name="password"
          variant="outlined"
          value={credentials.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          // !데이터값
          // : 값을 불리언 타입으로 변환하는 방식

          // !!값이 존재하면 true
          // !!값이 존재하지 않으면 false
        />
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          onClick={handleLogIn}
          fullWidth
          variant="contained"
          color="primary"
        >
          로그인
        </Button>
      </CardActions>
    </Card>
  );
}

export default LogIn;
