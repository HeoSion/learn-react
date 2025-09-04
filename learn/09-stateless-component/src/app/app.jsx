import { Demo, Spinner, SvgIcon, UploadButton } from '@/components'
import { UPLOAD_STATUS } from '@/components/upload-button'
import { ICON_TYPES } from '@/components/svg-icon'
import './app.css'
import Logo from '@/components/logo'

export default function App() {
  return (
    <section className="app">
      <h1>상태가 없는(Stateless) 컴포넌트</h1>
      <article>
        <h2>SvgIcon 컴포넌트</h2>
        <IconsDemo />
      </article>
      <article>
        <h2>UploadButton 컴포넌트</h2>
        <ButtonDemo />
      </article>
      <article>
        <h2>Logo 컴포넌트</h2>
        <LogoDemo />
      </article>
    </section>
  )
}

function LogoDemo() {
  return (
    <Demo col>
      {/* <Logo /> */}
      <Logo.Primary className={'yamoo9'} />
      {/* <Logo outline /> */}
      <Logo.PrimaryOutline style={{ marginBlockStart: 100 }} />
      {/* <Logo type="secondary" /> */}
      <Logo.Secondary />
      {/* <Logo type="secondary" outline /> */}
      <Logo.SecondaryOutline />
    </Demo>
  )
}

function IconsDemo() {
  return (
    <Demo>
      {/* 기본 스피너 컴포넌트 */}
      <Spinner label="로딩 중..." />
      {/* 문자열로 아이콘 타입 지정 */}
      <SvgIcon type="up-arrow" />
      {/* ICON_TYPES 상수를 사용하여 아이콘 타입 지정 */}
      <SvgIcon type={ICON_TYPES.CHECK_MARK} />
      {/* 아이콘 크기 지정 (기본값: 16px) */}
      <SvgIcon type={ICON_TYPES.CROSS} size={18} />
      {/* 아이콘 색상 지정 (기본값: '#525577') */}
      <SvgIcon type={ICON_TYPES.NOT_ALLOWED} color="#f72b73" />
    </Demo>
  )
}

function ButtonDemo() {
  return (
    <Demo>
      {/* 기본 상태의 업로드 버튼 */}
      <UploadButton />
      {/* 로딩 상태의 업로드 버튼 */}
      <UploadButton status="loading" />
      {/* 업로드 성공 상태의 버튼 (UPLOAD_STATUS 상수 사용) */}
      <UploadButton status={UPLOAD_STATUS.RESOLVED} />
      {/* 업로드 실패 상태의 버튼 (UPLOAD_STATUS 상수 사용) */}
      <UploadButton status={UPLOAD_STATUS.REJECTED} />
      {/* 비활성화된 업로드 버튼 */}
      <UploadButton disabled />
    </Demo>
  )
}
