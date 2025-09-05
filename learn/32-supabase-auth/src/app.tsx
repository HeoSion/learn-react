import { useEffect, useState } from 'react'
import type { JSX } from 'react/jsx-runtime'
import { toast } from 'sonner'
import { usePageQuery } from '@/hooks'
import Navigation, { type Page } from '@/pages/common/navigation'
import supabase, { type Profile } from './libs/supabase'
import ProfilePage from './pages/profile'
import SignInPage from './pages/sign-in'
import SignUpPage from './pages/sign-up'

export default function AppPage() {
  const page = usePageQuery<Page>('signup')
  const [user, setUser] = useState<Partial<Profile> | null>(null)

  // 부수효과 처리: 외부 시스템과 리액트 앱 동기화
  useEffect(() => {
    // [실습] 최초 마운트 시, Supabase에서 현재 사용자 정보 가져오기
    supabase.auth.getUser().then(async ({ error, data }) => {
      if (error) {
        toast.error(`사용자 검색 오류 발생! ${error.message}`)
      } else {
        // 인증된 사용자 정보 가져오기에 성공! (auth: 회원가입/로그인할 때 사용자 정보 사용)
        // 프로필 테이블에서 데이터 필터링해 가져오기 시도 (profiles: 사용자 정보 관리(추가/수정/삭제) 테이블)
        const { error: userProfileError, data: userProfile } = await supabase
          .from('profiles')
          .select('username,email,bio')
          .eq('id', data.user.id)
          .single()

        if (userProfileError) {
          toast.error(
            `프로필 데이터 가져오기 오류 발생! ${userProfileError.message}`
          )
        } else {
          setUser(userProfile)
        }
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // [실습] Supabase 인증 상태 변경 구독
      switch (event) {
        case 'SIGNED_IN':
          console.log('로그인')
          break
        case 'SIGNED_OUT':
          console.log('로그아웃')
          setUser(null)
          break
      }
    })
    // [실습] Supabase 인증 구독 해제
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  let renderPage: JSX.Element | null = null

  switch (page) {
    case 'signin':
      renderPage = <SignInPage />
      break
    case 'signup':
      renderPage = <SignUpPage />
      break
    case 'profile':
      renderPage = <ProfilePage user={user} />
      break
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-center">Supabase 인증</h1>
      </header>
      <Navigation user={user} />
      <main>{renderPage}</main>
    </div>
  )
}
