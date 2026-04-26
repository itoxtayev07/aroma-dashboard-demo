import { useState } from 'react'
import logo from '../../assets/logo.svg'
import eyeOn from '../../assets/eye-on.svg'
import eyeOff from '../../assets/eye-off.svg'

export function Login() {

    const [isPassword, setIsPassword] = useState(true)

    return <main className="login-main h-full flex flex-col items-center">
        <section className="login-sect w-full max-w-[480px] mt-auto mb-auto p-[20px_24px] flex flex-col items-center gap-[24px]">
            <div className="logo-card">
                <img src={logo} alt="Aroma" />
            </div>

            <form className='register-card w-full max-w-full p-[40px] flex flex-col gap-[20px] rounded-[4px] border-[1px] border-solid border-[#DBDFEA] bg-[#FFF]'>
                <div className="register-title">
                    <h4 className='font-bold text-[24px] leading-[26px] tracking-[-0.48px] text-[#364A63]'>Kirish</h4>
                    <p className='mt-[8px] text-[14px] leading-[165%] tracking-normal text-[#526484]'>Tizimga faqat Aroma xodimlari kirishi mumkin</p>
                </div>

                <label className='login-inp-label'>
                    <span className='font-medium text-[14px] leading-[165%] tracking-normal text-[#364A63]'>Login</span>
                    <div className='h-[44px] mt-[8px] p-[12px_12px] rounded-[4px] border-[1px] border-solid border-[#DBDFEA] transition-[15s] focus-within:border-[#b79f7c] focus-within:shadow-[0_0_0_3px_#b79f7c1a]'>
                        <input className='w-full max-w-full text-[17px] leading-[20px] tracking-normal text-[#3c4d62]' type="text" />
                    </div>
                </label>

                <label className='password-inp-label'>
                    <span className='font-medium text-[14px] leading-[165%] tracking-normal text-[#364A63]'>Parol</span>
                    <div className='h-[44px] mt-[8px] p-[12px_12px] flex items-center gap-[24px] rounded-[4px] border-[1px] border-solid border-[#DBDFEA] transition-[15s] focus-within:border-[#b79f7c] focus-within:shadow-[0_0_0_3px_#b79f7c1a]'>
                        <input className='w-full max-w-full text-[17px] leading-[20px] tracking-normal text-[#3c4d62]' 
                        type={isPassword ? 'text' : 'password'} />

                        <button
                            className='w-[20px] h-[20px] cursor-pointer'
                            type='button'
                            onClick={() => setIsPassword(!isPassword)}>
                            <img className='w-[20px] h-[20px]' src={isPassword ? eyeOn : eyeOff} alt="Eye" />
                        </button>
                    </div>
                </label>

                <button className="signin-btn p-[12px_24px] text-[#FFF] font-bold text-[15px] leading-[20px] tracking-[0.3px] rounded-[3px] cursor-pointer bg-[#B79F7C]" type='button'>Sign in</button>
            </form>
        </section>

        <section className="copyright-sect w-full max-w-full p-[20px_24px] border-t-[1px] border-solid border-[#DBDFEA] bg-[#FFF]">
            <p className="login-copyright-text text-[14px] leading-[165%] tracking-normal text-[#8091A7] text-center">© 2024 Aroma. All Rights Reserved.</p>
        </section>
    </main>
}

// #8091A7
