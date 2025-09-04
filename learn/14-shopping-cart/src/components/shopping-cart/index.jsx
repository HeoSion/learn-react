import { Component } from 'react'
import { useImmer } from 'use-immer'
import INITIAL_PRODUCTS from '@/data/cart.json'
import CartList from './list'
import Total from './total'

// --------------------------------------------------------------------------
// 클래스 컴포넌트
// --------------------------------------------------------------------------
export class ShoppingCartClass extends Component {
  // 상태 선언
  state = {
    products: INITIAL_PRODUCTS,
  }

  // 렌더
  render() {
    // 상태 구조 분해 할당
    const { products } = this.state

    // 구매 총액 계산
    const totalPrice = products.reduce(
      (total, { price, quantity }) => total + price * quantity,
      0
    )

    return (
      <section className="border-4 border-sky-900 bg-white shadow-xl p-5 rounded-[8px] flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">장바구니</h2>
        <CartList
          products={products}
          onUpdateProduct={this.handleUpdateProductQuantity}
        />
        <Total totalPrice={totalPrice} />
      </section>
    )
  }

  // 인스턴스 메서드(핸들러)
  handleUpdateProductQuantity = (productId, amount) => {
    // 클래스 컴포넌트의 상태 업데이트
    this.setState(({ products: currentProducts }) => ({
      products: currentProducts.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + amount }
        }
        return product
      }),
    }))
  }
}

// --------------------------------------------------------------------------
// 함수형 컴포넌트
// --------------------------------------------------------------------------
export function ShoppingCartFuctional() {
  const [products, setProducts] = useImmer(INITIAL_PRODUCTS)

  const totalPrice = products.reduce(
    (total, { price, quantity }) => total + price * quantity,
    0
  )

  const handleUpdateProductQuantity = (productId, amount) => {
    setProducts((draft) => {
      const updateProduct = draft.find((p) => p.id === productId)
      updateProduct.quantity += amount
    })
  }

  return (
    <section className="border-4 border-sky-900 bg-white shadow-xl p-5 rounded-[8px] flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">장바구니</h2>
      <CartList
        products={products}
        onUpdateProduct={handleUpdateProductQuantity}
      />
      <Total totalPrice={totalPrice} />
    </section>
  )
}
