// count.store.ts
// :  카운트값 전역 상태 관리
// : 로그인, 로그아웃과 같은 맥락이라고 봐도된다. (증가, 감소)

import { create } from "zustand";


// zustand 의 형태 (typescript 기준)
// 1. create 함수를 사용하여 store 를 생성한다.
// : 해당 스토어를 통해 프로젝트 전역에서 데이터에 접근 가능함

// 2. create 함수에 제네릭 <> 을 사용하여 함수 구조를 정의한다.
// : 전역 상태값는 "필드"
// : 전역 상태 설정 함수는 "메서드"로 들어간다.

// 3. create 함수 내의 구조는
// : set 설정 함수를 통해 상태를 업데이트하고
// : (set) => ({해당 구조 내에서 제네릭 구조를 작성한다.})  //! 이헤 안됨

// 스토어(전역 저장소)의 interface 정의
interface CountStoreType {
  // 전역 상태 필드
  count : number;
  // 전역 상태 메서드
  increment : () => void;
  decrement : () => void;
}
// count countStore = create(여기서 zustand import 잘 받아오기)
// 저장소 생성 함수 : create<interface>();
const useCountStore = create<CountStoreType>((set) => ({
  // 상태 필드 초기화
  count : 0,

  increment : () => set((state) => (
    {count : state.count + 1}
  )),
  decrement : () => set((state) => (
    {count : state.count - 1}
  ))

}));
// interface 구조를 그대로 들고와서 set ()함수를 통해가지고 새로 세팅하는 느낌으로 사용하자
// 필드 값은 상관없이 그냥 바로 값 세팅하는듯?
// 그리고 지금의 상태를 가져올떄 원래 prev 를 사용했지만 여기서는 state 를 사용해서 세팅함
// 설정함수 set


export default useCountStore;
