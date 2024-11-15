import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import axios from "axios";


interface UserInfo {
  email: string; // 사용자 이메일
  password: string; // 사용자 비밀번호
  confirmPassword: string; // 비밀번호 확인 필드 (비밀번호와 일치해야함)
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string; // 전체 폼 오류 메세지 (ex 서버 오류 등)
}

function SignUp() {
  // userInfo : 사용자가 입력한 회원가입 정보를 관리
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // errors : 유효성 검사 오류 메세지를 관리 (저장)
  const [errors, setErrors] = useState<Errors>({});

  // useNaviage() 훅 :  페이지 전환 기능을 사용
  const navigate = useNavigate();

  //! 사용자 입력 필드 변경 이벤트 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUserInfo((prev) => (
      {
        ...prev, 
        [name] : value
      }
    ))
  };

  //! === 폼 유효성 검사 함수
  const validateForm = () => {

    let tempErrors : Errors = {};

    tempErrors.email = userInfo.email ? '' : '이메일을 입력하세요.';    // 이메일이 비어있으면 이메일을 입력하세요를 출력하겠다
    tempErrors.password = userInfo.password.length >= 8 ? '' : '비밀번호는 8자 이상이어야 합니다.';
    tempErrors.confirmPassword = (userInfo.confirmPassword === userInfo.password) ? "" : '비밀번호가 일치하지 않습니다.' ;

    // 오류 상태를 업데이트 시켜줌
    setErrors(tempErrors);
    // 모든 입력이 유효한지 확인해서 true 또는 false 를 반환
    return Object.values(tempErrors).every(x => x === ' ');
  }
  const handleSignUp = async () => {
    let isvalidateForm = validateForm();
    try {
      if (isvalidateForm) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/auth/signUp`,userInfo
        );
        if (response.data) {
          navigate("/");
        } else {
          setErrors (prev => (
            {...prev, form : "회원가입에 실패했습니다."}
          ));
        }
      }
    } catch (error) {
      setErrors (prev => (
        {...prev, form : "서버 에러가 발생했습니다."}
      ));
    }
  }

  
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: 360,
          m: "auto",
          mt: 4,
        }}
      >
        <CardContent>
          {/* 회원가입 제목 표시 */}
          <Typography variant="h5" mb={2}>
            회원가입
          </Typography>

          {/* 입력 필드 */}
          <TextField
            label="이메일"
            type="email"
            name="email"
            variant="outlined"
            value={userInfo.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            // !데이터값
            // : 값을 불리언 타입으로 변환하는 방식

            // !!값이 존재하면 true
            // !!값이 존재하지 않으면 false

            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="비밀번호"
            type="password"
            name="password"
            variant="outlined"
            value={userInfo.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            // !데이터값
            // : 값을 불리언 타입으로 변환하는 방식

            // !!값이 존재하면 true
            // !!값이 존재하지 않으면 false

            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="비밀번호 확인"
            type="password"
            name="confirmPassword"
            variant="outlined"
            value={userInfo.confirmPassword}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            // !데이터값
            // : 값을 불리언 타입으로 변환하는 방식

            // !!값이 존재하면 true
            // !!값이 존재하지 않으면 false

            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </CardContent>
        {/* errors.from 있으면  */}
        {errors.form && (
          <Typography color="error" mt={2}>
            {errors.form}
          </Typography>
        )}

        {/* 회원가입 버튼 */}
        <CardActions>
          <Button 
            onClick={handleSignUp}
            fullWidth
            variant="contained"
            color="primary"
          >
            가입하기
          </Button>
        </CardActions>

      </Card>
    </>
  );
}

export default SignUp;
