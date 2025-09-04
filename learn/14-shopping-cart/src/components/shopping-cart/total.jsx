export default function Total({ totalPrice }) {
  return (
    <output className="text-right text-xl font-semibold">
      구매 총액 : {totalPrice.toLocaleString()}원
    </output>
  )
}
