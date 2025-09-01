// 업로드 상태 상수
export const UPLOAD_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}

// 업로드 레이블 상수
export const UPLOAD_LABEL = {
  [UPLOAD_STATUS.IDLE]: '업로드',
  [UPLOAD_STATUS.LOADING]: '업로드 중',
  [UPLOAD_STATUS.RESOLVED]: '완료',
  [UPLOAD_STATUS.REJECTED]: '실패',
}
