export default function getRandomMinMax(min = 0, max = 100) {
  if (min >= max) throw new Error('min 값이 max 값보다 크거나 같으면 안됩니다.')
  return Math.round(Math.random() * (max - min) + min)
}
