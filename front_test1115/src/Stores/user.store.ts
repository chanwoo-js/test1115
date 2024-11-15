// zustand 파이명 권장
// : 전역 상태 관리할 데이터명 .store.ts
// ex) user.store.ts

import {create} from "zustand";

// interface
// # 인증상태 interface 인터페이스 정의
interface User {
  id : number;
  name : string;
}
// # 인증상태의 interface 정의
interface AuthStoreType {
  // is ~ 되었니?
  isAuthenticated : boolean; // 인증 여부를 나타냄
  user : User| null; 
  // 사용자가 있거나 없거나 둘중 하나
  //  interface User {
  //     id : number;
  //    name : string;
  //  }

  login : (user : User) => void;
  // 로그인 : 상태 업데이트 함수
  logout : () => void;
  // 로그아웃 : 상태 입데이트 함수
}



const useAuthStore = create<AuthStoreType>((set) => ({
  // 상태 필드 초기화
  isAuthenticated : false,
  user : null,

  //상태 업데이트 함수 ( 로그인, 로그아웃 )
  login : (user) => set({isAuthenticated : true , user}),
  logout : () => set({isAuthenticated : false , user: null})
}));

export default useAuthStore;