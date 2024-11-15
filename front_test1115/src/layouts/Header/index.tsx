import React, { useState } from "react";
import useAuthStore from "../../Stores/user.store";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import useThemeStore from "../../Stores/theme.store";

function Header() {
  const [isLogged, setIsLogged] = useState<boolean>(true);

  // 사용자의 인증 상태를 전역 상태 관리
  const { user, isAuthenticated, logout } = useAuthStore();

  // 사용자의 토큰을 관리하는 쿠키
  const [, setCookies] = useCookies(["token"]);

  // 전체 테마의 상태를 전역 상태 관리
  const {theme, toggleTheme} = useThemeStore();

  // 이벤트 핸들러 로그아웃 버튼 클릭 시 이벤트 핸들러
  const handelLogoutClick = () => {
    setCookies("token", "", { expires: new Date() });
    logout();
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" p={2}
           >
        <Box flex={1} display="flex" justifyContent="center">
        </Box>
        <Button variant="contained" onClick={toggleTheme}>테마 변경
        </Button>
        <Box flex={1} alignItems="center" textAlign="center">
          <Link
            to={""}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Typography variant="h3">코리아 IT</Typography>
          </Link>
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end">
          {isAuthenticated ? (
            <Typography variant="subtitle1" m={2} onClick={handelLogoutClick} style={{
              textAlign : 'right'
            }}> 
              로그아웃
              {user && <p>{user.name}님 안녕하세요</p>}
            </Typography>
          ) : (
            <Link
              to={"/auth"}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Typography variant="subtitle1" m={2}>
                로그인
              </Typography>
            </Link>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Header;
