import { LearnSection } from '@/components'
import {
  ShoppingCartClass,
  ShoppingCartFuctional,
} from './components/shopping-cart'

// 시간 관계상 디자인 구현은 나중으로 미루고
// 컴포넌트의 상태 관리 로직만 구현해봅니다.

export default function App() {
  return (
    <LearnSection
      title="장바구니 구현"
      className="p-10 flex flex-col gap-5 max-w-160"
    >
      <h2 className="text-2xl font-black">함수형 컴포넌트 상태 관리</h2>
      <ShoppingCartFuctional />
      <h2 className="text-2xl font-black">클래스 컴포넌트 상태 관리</h2>
      <ShoppingCartClass />
    </LearnSection>
  )
}
