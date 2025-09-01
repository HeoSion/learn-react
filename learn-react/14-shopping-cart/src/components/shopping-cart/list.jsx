import CartItem from './item'

export default function CartList({ products, onUpdateProduct }) {
  return (
    <ul>
      {products.map((product) => (
        <CartItem
          key={product.id}
          product={product}
          onUpdateProduct={onUpdateProduct}
        />
      ))}
    </ul>
  )
}
