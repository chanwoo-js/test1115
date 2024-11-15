import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import axios from "axios";
import { useCookies } from "react-cookie";
import useAuthStore from "../Stores/user.store";
import Container from "../layouts/Container";
import {
  AUTH_PATH,
  BOARD_DETAIL_PATH,
  BOARD_LIST_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  REACT_STUDY_PATH,
  TODO_PATH,
  USER_PATH,
} from "../constants";
import Main from "./Main";
import Authentication from "./Authentication";
import Board from "./Board";
import User from "./Index";
import Todo from "./Todo";

function Index() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const { login, logout } = useAuthStore();

  // fetchUserData 함수 : 사용자 데이터를 가져오는 비동기 함수
  const fetchUserData = async () => {
    const token = cookies.token;
    // 쿠키에서 :token" 을 찾아서 token 변수에 넣어라

    if (token) {
      try {
        //   public GetUserResponseDto(User user) {
        // this.id = user.getId();
        // this.email = user.getEmail();
        // response 에는 위에 애들이 담긴다.

        const response = await axios.get("/api/v1/users", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        // const responsePost = await axios.post(`qweqwe`, null,
        //   headers : {
        //     authorization : `Bearer ${token}`,
        //   }
        // )
        // get("/api/v1/users", {
        //  headers : {
        //    authorization : `Bearer ${token}`,
        //  }
        // },)
        if (response.status === 200) {
          setCookie("token", token, { path: "/" });
          const userData = response.data.data;
          return userData;
        }
      } catch (e) {
        console.error("에러~", e);
        removeCookie("token", { path: "/" });
      }
    }
  };

  // checkToken 함수는 토큰의 유효성을 확인하는 비동기 함수
  const checkToken = async () => {
    const token = cookies.token;

    if (token) {
      try {
        const userData = await fetchUserData();
        login(userData);

        const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3일 후
        setCookie("token", token, { path: "/", expires: expiryDate });
      } catch (e) {
        console.error("토큰 유효성 확인 중 오류 발생", e);
        removeCookie("token", { path: "/" });
        logout();
      }
    }
  };
  // 컴포넌트가 처음 랜더링될 때 'checkToken' 함수를 호출하여 토큰 유효성을 확인한다.
  useEffect(() => {
    checkToken();
  }, []);
  return (
    <>
      {/* 빈 Fragment: 최상위 단일 노드를 위한 틀 */}
      <Routes>
        <Route element={<Container />}>
          {/* 
          Route 컴포넌트의 index 속성 
          : 상위 컴포넌트의 경로로 출력 (기본 자식 라우트)
          */}
          <Route path={MAIN_PATH} element={<Main />} />

          {/* 로그인 + 회원가입 화면 */}
          <Route path={AUTH_PATH} element={<Authentication />} />

          {/* 게시물 상세 보기 화면 */}
          <Route path={BOARD_DETAIL_PATH(":boardNumber")} element={<Board />} />

          {/* 게시글 작성 화면 */}
          <Route path={BOARD_WRITE_PATH} element={<Board />} />

          {/* 게시물 리스트 화면 */}
          <Route path={BOARD_LIST_PATH} element={<Board />} />

          {/* 게시글 수정 화면 */}
          <Route path={BOARD_UPDATE_PATH(":boardNumber")} element={<Board />} />

          {/* 마이페이지 */}
          <Route path={USER_PATH} element={<User />} />

          {/* 할 일 목록 화면 */}
          <Route path={TODO_PATH} element={<Todo />} />
        </Route>
      </Routes>
    </>
  );
}

export default Index;
