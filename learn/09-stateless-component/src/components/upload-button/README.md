# UploadButton 컴포넌트 가이드

`UploadButton` 컴포넌트는 파일 업로드 기능 표시를 위한 버튼입니다.  
전달된 속성에 따라 다른 아이콘과 텍스트를 표시하여 사용자에게 직관적인 피드백을 제공합니다.

## 특징

- 전달된 속성(props)에 따른 시각적 피드백
- 다양한 상태 표시 (대기, 로딩, 성공, 실패)
- 비활성화(disabled) 상태 표시
- SvgIcon 컴포넌트 통합

## 사용법

### 기본 사용법

```jsx
import UploadButton, { UPLOAD_STATUS } from '@/components/upload-button'

// 기본 상태 (대기)
<UploadButton />

// 로딩 상태
<UploadButton status={UPLOAD_STATUS.LOADING} />

// 성공 상태
<UploadButton status={UPLOAD_STATUS.RESOLVED} />

// 실패 상태
<UploadButton status={UPLOAD_STATUS.REJECTED} />

// 비활성화 상태
<UploadButton disabled={true} />
```

## 속성(props)

| 속성명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| status | string | 'idle' | 버튼의 현재 상태 |
| disabled | boolean | false | 버튼 비활성화 여부 |

## 지원되는 상태

`UPLOAD_STATUS` 상수를 통해 다음 상태를 지원합니다.

- `IDLE`: 초기 상태, 업로드 준비 완료
- `LOADING`: 업로드 진행 중
- `RESOLVED`: 업로드 성공
- `REJECTED`: 업로드 실패

각 상태는 다음과 같은 시각적 표현을 갖습니다.

| 상태 | 아이콘 | 텍스트 |
|------|--------|--------|
| IDLE | 위쪽 화살표 | "업로드" |
| LOADING | 로딩 스피너 | "업로드 중" |
| RESOLVED | 체크 마크 | "완료" |
| REJECTED | X 표시 | "실패" |
| 비활성화 | 금지 표시 | "업로드" |

## 접근성 고려사항

- 버튼은 적절한 `aria-label`을 포함하여 스크린 리더 사용자에게 현재 상태를 알립니다.
- 비활성화된 상태에서는 `disabled` 속성이 적용되어 상호작용이 불가능함을 명시합니다.
- 상태 변화는 시각적으로만 아니라 텍스트로도 전달되어 다양한 사용자가 이해할 수 있습니다.

## 의존성

- `SvgIcon` 컴포넌트: 다양한 상태 아이콘 표시
- `UPLOAD_STATUS`, `UPLOAD_LABEL` 상수: 상태 및 레이블 정의