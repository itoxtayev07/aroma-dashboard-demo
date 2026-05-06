import { useState, useRef } from 'react'
import { useNavigate } from "react-router"
import { toast } from 'react-toastify'

import { login } from '../../config/axios'
import logo from '../../assets/logo.svg'
import eyeOn from '../../assets/eye-on.svg'
import eyeOff from '../../assets/eye-off.svg'
import whiteRollingLoading from '../../assets/loading-white-rolling.svg'

export function Login() {

    const [isPassword, setIsPassword] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    let loginRef = useRef()
    let passwordRef = useRef()
    const navigate = useNavigate()

    async function handleLogin() {
        const username = loginRef.current.value
        const password = passwordRef.current.value

        if (!username || !password) {
            if (!username) setLoginError("To'ldirilishi shart")
            if (!password) setPasswordError("To'ldirilishi shart")
            return
        }

        try {
            setLoading(true)
            setLoginError('')
            setPasswordError('')
            const data = await login(username, password)

            localStorage.setItem('username', username)
            localStorage.setItem('token', data.data.token)

            navigate('/')

            toast.success("Parol muvaffaqiyatli o'zgartirildi!", {
                style: {
                    width: '425px',
                }
            })

        } catch (err) {
            setLoginError("Login yoki parol noto'g'ri")
            setPasswordError("Login yoki parol noto'g'ri")
            toast.error("Ma'lumotlar noto'g'ri kiritildi!", {
                style: {
                    width: '425px',
                }
            })
        } finally {
            setLoading(false)
        }
    }

    return <main className="login-main w-full max-w-full h-full flex flex-col items-center">
        <section className="login-sect w-full max-w-[480px] mt-auto mb-auto p-[20px_24px] flex flex-col items-center gap-[24px]">
            <div className="logo-card">
                <img src={logo} alt="Aroma" />
            </div>

            <form className='register-card w-full max-w-full p-[40px] flex flex-col gap-[20px] rounded-[4px] border-[1px] border-[#DBDFEA] bg-[#FFF]'>
                <div className="register-title">
                    <h4 className='font-bold text-[24px] leading-[26px] tracking-[-0.48px] text-[#364A63]'>Kirish</h4>
                    <p className='mt-[8px] text-[14px] leading-[165%] tracking-normal text-[#526484]'>Tizimga faqat Aroma xodimlari kirishi mumkin</p>
                </div>

                <label className='login-inp-label'>
                    <div className="flex items-center justify-between gap-[14px]">
                        <span className='font-medium text-[14px] leading-[165%] tracking-normal text-[#364A63]'>Login</span>
                        <span className="error-text text-[12px] italic text-[#e85347]">{loginError}</span>


                    </div>
                    <div className='mt-[8px] p-[0_12px] rounded-[4px] border-[1px] border-[#DBDFEA] transition-[15s] focus-within:border-[#b79f7c] focus-within:shadow-[0_0_0_3px_#b79f7c1a]'>
                        <input className='w-full max-w-full h-[44px] p-[12px_0] text-[17px] leading-[20px] tracking-normal text-[#3c4d62]' type="text" ref={loginRef} />
                    </div>
                </label>

                <label className='password-inp-label'>
                    <div className="flex items-center justify-between gap-[14px]">
                        <span className='font-medium text-[14px] leading-[165%] tracking-normal text-[#364A63]'>Parol</span>
                        <span className="error-text text-[11px] italic text-[#e85347]">{passwordError}</span>
                    </div>
                    <div className='mt-[8px] p-[0_12px] flex items-center gap-[24px] rounded-[4px] border-[1px] border-[#DBDFEA] transition-[15s] focus-within:border-[#b79f7c] focus-within:shadow-[0_0_0_3px_#b79f7c1a]'>
                        <input className='w-full max-w-full h-[44px] p-[12px_0] text-[17px] leading-[20px] tracking-normal text-[#3c4d62]'
                            type={isPassword ? 'text' : 'password'} ref={passwordRef} />

                        <button
                            className='cursor-pointer w-[24px] h-[24px] flex items-center justify-center text-[0]'
                            type='button'
                            onClick={() => setIsPassword(!isPassword)}>
                            <img src={isPassword ? eyeOn : eyeOff} alt="Eye" />
                        </button>
                    </div>
                </label>

                <button className={`signin-btn !h-[44px] p-[12px_24px] flex justify-center items-center text-[#FFF] font-bold text-[15px] leading-[20px] tracking-[0.3px] rounded-[3px] cursor-pointer bg-[#B79F7C] transition-[.15s] active:shadow-[0_0_0_3px_#b79f7c33]`}
                    disabled={loading}
                    onClick={(e) => {
                        e.preventDefault()
                        handleLogin()
                    }}>{loading ? (<img src={whiteRollingLoading} className='w-[30px]' />) : 'Sign in'}</button>
            </form>
        </section>

        <section className="copyright-sect w-full max-w-full p-[20px_24px] border-t-[1px] border-[#DBDFEA] bg-[#FFF]">
            <p className="login-copyright-text text-[14px] leading-[165%] tracking-normal text-[#8091A7] text-center">© 2024 Aroma. All Rights Reserved.</p>
        </section>
    </main>
}

// #8091A7

// https://documenter.getpostman.com/view/23417898/2sAXqtaMEP#7510b2f6-3ae5-4f60-8b62-c7c41c7bca25
