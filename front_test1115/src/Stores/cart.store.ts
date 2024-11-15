import { create } from "zustand";

// 1. 사용할 데이터의 인터페이스 지정
// CartStoreType interface 에서 사용할꺼라 미리 정의해야함
// CartStoreType interface 에서 사용할꺼라 미리 정의해야함
interface CartItem {
  id: number; // 장바구니 아이템들의 고유값
  name: string; // 상품명
  price: number; // 상품 가격
  quantity: number;
}

interface CartStoreType {
  // 상태 필드 정의
  items: CartItem[];
  // 상태 업데이트 함수
  addItem : (item : CartItem) => void;
  removeItem : (id : number) => void; // 단건 아이템 삭제
  clearCart : () => void; // 전체 아이템 삭제
}

// 저장소 함수 생성

const useCartStore = create<CartStoreType>((set) => ({
  // 상태 필드 초기화
  items : [],

  // 상태 업데이트 함수 정의
  // 이전 상태를 가져와서 

  addItem : (item) => set((state) => ({
    items : [...state.items, item]
  })),

  // id를 가져오고 set 함수한테 아이디들고왔는데 변경시켜줘하면 이전 상태를 들고오고 소괄호안에 있는 객체한테 전달한다  현재 상태의 아이템즈를 들고와서 아이템즈는 배열이기때문에 filter를 사용해서 처음부터 끝까지 순회해서 걸러낸다 그리고 남은 데이터를 사용함
  removeItem : (id) => set((state) => ({
    items : state.items.filter((item) => item.id ! === id)
  })),

  clearCart: () => set({ items : []}),
}));


export default useCartStore;