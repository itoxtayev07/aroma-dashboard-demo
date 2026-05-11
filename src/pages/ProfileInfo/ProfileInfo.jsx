import { Link, useNavigate } from "react-router"
import { useState, useEffect, memo } from "react"

import { api } from "@/config/axios"

import backPointer from '../../assets/back-pointer.svg'
import loadingRolling from '../../assets/loading-rolling.svg'

export const ProfileInfo = memo(function ProfileInfo() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState()

  const getUser = async () => {
    try {
      const user = await api.get('/admin/profile/info')
      setUserData(user.data.data)
    } catch (err) {
      console.log(err.user?.data)
      navigate('/login')
      toast.error("Tarmoq xatosi. Iltimos, internetga ulanishingizni tekshiring.", {
        style: {
          width: '425px',
        }
      })
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    const pad = (num) => String(num).padStart(2, '0')
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const tablesStyle = "p-[12px_20px] flex gap-[20px] border-b border-[#DBDFEA] last:border-b-0 odd:bg-[#F4F6FAB2]"
  const labelsStyle = "w-[220px] text-[#8091A7] text-[14px] leading-[23.1px] tracking-normal"
  const valuesStyle = "w-full max-w-full flex items-center gap-[8px] text-[#364A63] text-[14px] font-semibold leading-[23.1px] tracking-normal"

  return <main className="main-profil-info p-[32px] flex-1">
    <header className="flex items-start justify-between">
      <div>
        <h1 className="text-[#364A63] text-[28px] font-bold leading-[110%] tracking-[-0.84px]">Profil ma’lumot</h1>
        <div className="flex items-center gap-[8px] mt-[8px]">
          <Link to="/" className="text-[#526484] text-[11px] font-medium tracking-[0.8px] uppercase hover:text-[#B79F7C] duration-[.2s]">ASosiy</Link>
          <span className="text-[#526484] text-[11px] select-none">/</span>
          <span className="text-[#B7C2D0] text-[11px] font-medium tracking-[0.8px] uppercase select-none">{userData?.full_name || "Profil ma'lumot"}</span>
        </div>
      </div>
      <button
        className="flex items-center gap-[8px] py-[8px] px-[18px] border border-[#DBDFEA] rounded-[4px] duration-[.2s] bg-[#FFF] hover:bg-[#f5f6fa]"
        onClick={() => navigate('/')}>
        <img src={backPointer} alt="Back Pointer" />
        <span className="text-[#526484] text-[13px] font-bold leading-[20px] tracking-[0.26px]">Ortga</span>
      </button>
    </header>

    {!userData ? (
      <section className="profile-sect mt-[28px] p-[24px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF]">
        <h5 className="text-[#364A63] text-[20px] font-bold leading-[22px] tracking-[-0.2px]">{userData?.full_name || 'User full name'}</h5>

        <ul className="mt-[23.5px] border border-[#DBDFEA] rounded-[6px]">
          <li className={tablesStyle}>
            <div className={labelsStyle}>ID</div>
            <div className={valuesStyle}>
              <span>{userData?.id || '—'}</span>
            </div>
          </li>

          <li className={tablesStyle}>
            <div className={labelsStyle}>To’liq ismi</div>
            <div className={valuesStyle}>
              <span>{userData?.full_name || '—'}</span>
            </div>
          </li>

          <li className={tablesStyle}>
            <div className={labelsStyle}>Telefon raqami</div>
            <div className={valuesStyle}>
              <span>{userData?.phone_number || '—'}</span>
            </div>
          </li>

          <li className={tablesStyle}>
            <div className={labelsStyle}>Rol</div>
            <div className={valuesStyle}>
              <span>{userData?.role || '—'}</span>
            </div>
          </li>

          <li className={tablesStyle}>
            <div className={labelsStyle}>Login</div>
            <div className={valuesStyle}>
              <span>{userData?.username || '—'}</span>
            </div>
          </li>

          <li className={tablesStyle}>
            <div className={labelsStyle}>O’zgartirilgan vaqti</div>
            <div className={valuesStyle}>
              <span>{formatDate(userData?.created_at) || '—'}</span>
            </div>
          </li>

          <li className={tablesStyle}>
            <div className={labelsStyle}>Ro’yxatdan o’tgan vaqti</div>
            <div className={valuesStyle}>
              <span>{formatDate(userData?.updated_at) || '—'}</span>
            </div>
          </li>
        </ul>
      </section>
    ) : (
      <div className="p-[24px] flex justify-center items-center">
        <img className="w-[50px]" src={loadingRolling} alt="Loading" />
      </div>
    )}
  </main>
})
