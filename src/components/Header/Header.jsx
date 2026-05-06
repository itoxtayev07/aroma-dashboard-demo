import { useState, useEffect, useRef } from 'react'
import { api } from '../../config/axios'
import { toast } from 'react-toastify'

import { createPortal } from 'react-dom'

import userImg from '../../assets/user.svg'
import userPointer from '../../assets/user-pointer.svg'
import eyeOn from '../../assets/eye-on.svg'
import eyeOff from '../../assets/eye-off.svg'


export function Header() {
    const [open, setOpen] = useState(false)
    const [userData, setUserDara] = useState()
    const [openModal, setOpenModal] = useState(false)

    const [oldPassword, setOldPassword] = useState('')
    const [oldPasswordError, setOldPasswordError] = useState('')
    const [oldPasswordEr, setOldPasswordEr] = useState(false)
    const [isOldPassword, setIsOldPassword] = useState(true)

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordEr, setPasswordEr] = useState(false)
    const [isPassword, setIsPassword] = useState(true)

    const [rePassword, setRePassword] = useState('')
    const [rePasswordError, setRePasswordError] = useState('')
    const [rePasswordEr, setRePasswordEr] = useState(false)
    const [isRePassword, setIsRePassword] = useState(true)
    let dropdownRef = useRef()

    const getUser = async () => {
        try {
            const user = await api.get('/admin/profile/info')
            setUserDara(user.data.data)
        } catch (err) {
            console.log("Error:", err.user?.data)
        }
    }
    const getChangePassword = async () => {
        try {
            const res = await api.post('/admin/profile/change/password', {
                old_password: oldPassword,
                password,
                confirm_password: rePassword
            })
            console.log(res.data)
            setOpenModal(false)
            toast.success("Tizimga muvaffaqiyatli kirdingiz!", {
                style: {
                    width: '425px',
                }
            })
        } catch (err) {
            console.log("Error data:", err.response?.data)
            toast.error("Ma'lumotlar noto'g'ri kiritildi!", {
                style: {
                    width: '425px',
                }
            })
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    if (userData) console.log(userData);

    let passwordErrorStyle = 'border-[#e85347]'

    return <header className="header w-full max-w-full">
        <section className="header-sect w-full max-w-full p-[16px_30px] flex justify-end border-b-[1px] border-[#DBDFEA] bg-[#FFF]">
            <div className="relative" ref={dropdownRef}>
                <button className="account-card min-w-[152px] flex items-center gap-[16px] cursor-pointer" onClick={() => setOpen(!open)}>
                    <div className="min-w-[32px] h-[32px] flex justify-center items-center rounded-[50%] bg-[#B79F7C]">
                        <img src={userImg} alt="User" />
                    </div>
                    <div>
                        <p className="text-[#B79F7C] text-[11px] font-medium leading-[11px] tracking-[-1%] text-start">{userData?.role || 'Role'}</p>
                        <div className="select mt-[3px]">
                            <div className="min-w-[116px] w-full flex justify-between items-center gap-[18px]">
                                <strong className='text-[#526484] text-[11px] font-bold leading-[16px] tracking-[-1%] text-start'>{userData?.full_name || 'Full name'}</strong>
                                <img className='mt-[2px] justify-self-end' src={userPointer} alt="Select" />
                            </div>
                        </div>
                    </div>
                </button>

                {open && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white rounded-[4px] shadow-[0px_0px_6px_0px_#00000021] border border-[#DBDFEA] z-40 overflow-hidden">

                        <div className="p-[13px_20px] flex items-center gap-[14px] bg-[#F5F6FA]">
                            <div className="min-w-[32px] h-[32px] rounded-full bg-[#B79F7C] flex justify-center items-center">
                                <img src={userImg} alt="User" />
                            </div>
                            <div>
                                <p className="text-[#B79F7C] text-[11px] font-medium leading-[11px] tracking-[-1%] text-start">{userData?.role || 'Role'}</p>
                                <strong className="text-[#526484] text-[11px] font-bold leading-[16px] tracking-[-1%] text-start mt-[3px]">{userData?.full_name || 'Full name'}</strong>
                            </div>
                        </div>

                        <div className='border-t border-b border-[#DBDFEA]'>
                            <button className="w-full max-w-full flex items-center gap-[12px] px-[20px] py-[16px] text-[#526484] text-[12px] font-medium leading-[165%] tracking-0 hover:bg-[#f5f6fa] duration-[.2s]">
                                Profil ma'lumot
                            </button>
                            <button className="w-full max-w-full flex items-center gap-[12px] px-[20px] py-[16px] text-[#526484] text-[12px] font-medium leading-[165%] tracking-0 hover:bg-[#f5f6fa] duration-[.2s]"
                                onClick={() => setOpenModal(true)}>
                                Parol o'zgartirish
                            </button>
                        </div>

                        <div>
                            <button className="w-full flex items-center gap-[12px] px-[20px] py-[26px] hover:bg-[#fff5f5] duration-[.2s]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5.50195 12.7617C5.50195 12.9609 5.42578 13.1367 5.27344 13.2891C5.13281 13.4297 4.95703 13.5 4.74609 13.5H2.0918C1.50586 13.5 1.00781 13.3008 0.597656 12.9023C0.199219 12.4922 0 12 0 11.4258V2.0918C0 1.51758 0.199219 1.02539 0.597656 0.615234C1.00781 0.205078 1.50586 0 2.0918 0H4.74609C4.95703 0 5.13281 0.0761719 5.27344 0.228516C5.42578 0.369141 5.50195 0.544922 5.50195 0.755859C5.50195 0.966797 5.42578 1.14844 5.27344 1.30078C5.13281 1.44141 4.95703 1.51172 4.74609 1.51172H2.0918C1.92773 1.51172 1.78711 1.57031 1.66992 1.6875C1.55273 1.79297 1.49414 1.92773 1.49414 2.0918V11.4258C1.49414 11.5898 1.55273 11.7305 1.66992 11.8477C1.78711 11.9531 1.92773 12.0059 2.0918 12.0059H4.74609C4.95703 12.0059 5.13281 12.082 5.27344 12.2344C5.42578 12.375 5.50195 12.5508 5.50195 12.7617ZM13.4473 7.04883C13.459 7.00195 13.4707 6.95508 13.4824 6.9082C13.4941 6.86133 13.5 6.80859 13.5 6.75C13.5 6.65625 13.4766 6.5625 13.4297 6.46875C13.3945 6.375 13.3418 6.29297 13.2715 6.22266L9.94922 2.90039C9.87891 2.83008 9.79688 2.77734 9.70312 2.74219C9.62109 2.69531 9.52734 2.67188 9.42188 2.67188C9.21094 2.67188 9.0293 2.74805 8.87695 2.90039C8.73633 3.04102 8.66602 3.2168 8.66602 3.42773C8.66602 3.5332 8.68359 3.63281 8.71875 3.72656C8.76562 3.80859 8.82422 3.88477 8.89453 3.95508L10.9336 6.01172H4.74609C4.54688 6.01172 4.37109 6.08789 4.21875 6.24023C4.07812 6.38086 4.00781 6.55078 4.00781 6.75C4.00781 6.96094 4.07812 7.14258 4.21875 7.29492C4.37109 7.43555 4.54688 7.50586 4.74609 7.50586H10.9336L8.89453 9.5625C8.82422 9.63281 8.76562 9.71484 8.71875 9.80859C8.68359 9.89062 8.66602 9.98438 8.66602 10.0898C8.66602 10.3008 8.73633 10.4824 8.87695 10.6348C9.0293 10.7754 9.20508 10.8457 9.4043 10.8457C9.50977 10.8457 9.60938 10.8281 9.70312 10.793C9.79688 10.7461 9.87891 10.6875 9.94922 10.6172L13.2715 7.29492C13.3066 7.25977 13.3359 7.22461 13.3594 7.18945C13.3945 7.14258 13.4238 7.0957 13.4473 7.04883Z" fill="#E85347" />
                                </svg>
                                <p className='text-[#526484] text-[12px] font-medium leading-[165%] tracking-0'>Chiqish</p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {createPortal(
            <div id='change-password-modal-wrap' className={`w-full max-w-full h-full fixed top-0 flex justify-center items-center z-60 bg-[#00000066] ${!openModal ? 'opacity-0 invisible' : 'opacity-100 visible'}`} onClick={(e) => {
                if (e.target.id === 'change-password-modal-wrap') setOpenModal(false)
            }}>
                <form className="w-full max-w-[1187px] p-[38px_24px] flex flex-col gap-[20px] rounded-[6px] bg-[#FFF]">

                    <h4 className="modal-title text-[#364A63] text-[20px] font-bold leading-[22px] tracking-[-0.16px]">Parolni o’zgartirish</h4>

                    <div className="change-password-card flex flex-col gap-[20px]">

                        <label className='w-full max-w-full'>
                            <div className="flex items-center justify-between gap-[14px]">
                                <span className='text-[14px] font-medium leading-[165%] tracking-normal text-[#364A63]'>Eski parol</span>
                                <span className="error-text text-[11px] italic text-[#e85347]">{oldPasswordError}</span>
                            </div>
                            <div className={`mt-[8px] p-[0_12px] flex items-center gap-[24px] rounded-[4px] border duration-[.3s] ${oldPasswordEr ? passwordErrorStyle : 'border-[#DBDFEA] focus-within:border-[#b79f7c] focus-within:shadow-[0_0_0_3px_#b79f7c1a]'}`}>
                                <input
                                    className='w-full max-w-full h-[44px] p-[12px_0] text-[17px] leading-[20px] tracking-normal text-[#3c4d62]'
                                    type={isOldPassword ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)} />
                                <button
                                    className='cursor-pointer w-[24px] h-[24px] flex items-center justify-center text-[0]'
                                    type='button'
                                    onClick={() => setIsOldPassword(!isOldPassword)}>
                                    <img src={isOldPassword ? eyeOn : eyeOff} alt="Eye" />
                                </button>
                            </div>
                        </label>

                        <div className="flex gap-[20px]">

                            <label className='w-full max-w-full'>
                                <div className="flex items-center justify-between gap-[14px]">
                                    <span className='text-[14px] font-medium leading-[165%] tracking-normal text-[#364A63]'>Yangi parol</span>
                                    <span className="error-text text-[11px] italic text-[#e85347]">{passwordError}</span>
                                </div>
                                <div className={`mt-[8px] p-[0_12px] flex items-center gap-[24px] rounded-[4px] border duration-[.3s] ${passwordEr ? passwordErrorStyle : 'border-[#DBDFEA] focus-within:border-[#b79f7c] focus-within:shadow-[0_0_0_3px_#b79f7c1a]'}`}>
                                    <input
                                        className='w-full max-w-full h-[44px] p-[12px_0] text-[17px] leading-[20px] tracking-normal text-[#3c4d62]'
                                        type={isPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                    <button
                                        className='cursor-pointer w-[24px] h-[24px] flex items-center justify-center text-[0]'
                                        type='button'
                                        onClick={() => setIsPassword(!isPassword)}>
                                        <img src={isPassword ? eyeOn : eyeOff} alt="Eye" />
                                    </button>
                                </div>
                            </label>


                            <label className='w-full max-w-full'>
                                <div className="flex items-center justify-between gap-[14px]">
                                    <span className='text-[14px] font-medium leading-[165%] tracking-normal text-[#364A63]'>Yangi parolni tasdiqlash</span>
                                    <span className="error-text text-[11px] italic text-[#e85347]">{rePasswordError}</span>
                                </div>
                                <div className={`mt-[8px] p-[0_12px] flex items-center gap-[24px] rounded-[4px] border duration-[.3s] ${rePasswordEr ? passwordErrorStyle : 'border-[#DBDFEA] focus-within:border-[#b79f7c] focus-within:shadow-[0_0_0_3px_#b79f7c1a]'}`}>
                                    <input
                                        className='w-full max-w-full h-[44px] p-[12px_0] text-[17px] leading-[20px] tracking-normal text-[#3c4d62]'
                                        type={isRePassword ? 'text' : 'password'}
                                        value={rePassword}
                                        onChange={(e) => setRePassword(e.target.value)} />
                                    <button
                                        className='cursor-pointer w-[24px] h-[24px] flex items-center justify-center text-[0]'
                                        type='button'
                                        onClick={() => setIsRePassword(!isRePassword)}>
                                        <img src={isRePassword ? eyeOn : eyeOff} alt="Eye" />
                                    </button>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="btns-card flex justify-end gap-[20px]">
                        <button
                            className='cancel-btn p-[8px_18px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF] text-[#526484] text-[13px] font-bold leading-[20px] tracking-[0.26px] cursor-pointer duration-[.4s] hover:bg-[#DBDFEA]'
                            type='button'
                            onClick={() => setOpenModal(false)}>Bekor qilish</button>

                        <button
                            className='submit-btn p-[8px_24px] rounded-[3px] bg-[#B79F7C] text-[#FFF] text-[13px] font-bold leading-[20px] tracking-[0.26px] cursor-pointer duration-[.4s] hover:bg-[#a8824a]'
                            type='button'
                            onClick={() => {
                                let hasError = false

                                if (!oldPassword) {
                                    setOldPasswordError("To'ldirish majburiy")
                                    setOldPasswordEr(true)
                                    hasError = true
                                } else {
                                    setOldPasswordError("")
                                    setOldPasswordEr(false)
                                }

                                if (!password) {
                                    setPasswordError("To'ldirish majburiy")
                                    setPasswordEr(true)
                                    hasError = true
                                } else {
                                    setPasswordError("")
                                    setPasswordEr(false)
                                }

                                if (!rePassword) {
                                    setRePasswordError("To'ldirish majburiy")
                                    setRePasswordEr(true)
                                    hasError = true
                                } else if (password !== rePassword) {
                                    setRePasswordError("Parollar mos emas")
                                    setRePasswordEr(true)
                                    hasError = true
                                } else {
                                    setRePasswordError("")
                                    setRePasswordEr(false)
                                }

                                if (!hasError) {
                                    getChangePassword()
                                    setOldPassword('')
                                    setPassword('')
                                    setRePassword('')
                                }
                            }}>Saqlash</button>
                    </div>
                </form>

            </div >,
            document.body
        )}
    </header >
}
