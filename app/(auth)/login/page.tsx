import type { Metadata } from 'next'
import LoginContainer from './login.container'

export const metadata: Metadata = {
    icons: "/images/logo.png",
    title: 'Đăng nhập',
    description: 'Đăng nhập vào nào',
}

type LoginContext = {
    params: { search: any }
    searchParams: { invition: string }
}

export default function Login(ctx: LoginContext) {
    return <div className="page">
        <LoginContainer invition={ctx.searchParams.invition}/>
    </div>
}