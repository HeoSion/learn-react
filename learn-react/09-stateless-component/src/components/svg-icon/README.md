# SvgIcon 컴포넌트 가이드

`SvgIcon` 컴포넌트는 다양한 아이콘을 일관된 방식으로 렌더링하는 재사용 가능한 컴포넌트입니다.

## 특징
- 다양한 아이콘 타입 지원 (화살표, 체크마크, 스피너 등)
- 크기, 색상 커스터마이징 가능
- 접근성(A11Y) 지원
- 간결한 API

## 사용법

### 기본 사용법

```jsx
import SvgIcon, { ICON_TYPES } from '@/components/svg-icon'

// 기본 아이콘 (위쪽 화살표)
<SvgIcon />

// 특정 타입의 아이콘
<SvgIcon type={ICON_TYPES.CHECK_MARK} />

// 크기와 색상 지정
<SvgIcon type={ICON_TYPES.CROSS} size={32} color="#FF0000" />

// 접근성 레이블 추가
<SvgIcon type={ICON_TYPES.SPINNER} label="로딩 중" />
```

### 지원되는 아이콘 타입

- `ICON_TYPES.SPINNER`: 로딩 스피너
- `ICON_TYPES.UP_ARROW`: 위쪽 화살표
- `ICON_TYPES.CHECK_MARK`: 체크 마크
- `ICON_TYPES.CROSS`: X 표시
- `ICON_TYPES.NOT_ALLOWED`: 금지 표시

### 속성(props)

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| type | string | 'up-arrow' | 아이콘 타입 |
| label | string | '' | 접근성 레이블 (비어있으면 장식용으로 처리) |
| size | number | 24 | 아이콘 크기 (픽셀) |
| color | string | '#525577' | 아이콘 색상 |

## 접근성 고려사항

- 의미 있는 아이콘에는 항상 `label` 속성을 제공해야 합니다.
- 표현 목적의 장식 아이콘인 경우, `label` 속성을 제공하지 않습니다.