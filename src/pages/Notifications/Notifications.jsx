import { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router";
import { createPortal } from 'react-dom';
import { toast } from "react-toastify";
import { api } from "../../config/axios";

import loadingRolling from '../../assets/loading-rolling.svg'
import pointer from '../../assets/user-pointer.svg'
import search from '../../assets/search.svg'
import add from '../../assets/add.svg'
import doublePointer from '../../assets/double-pointer.svg'
import triplePoint from '../../assets/triple-point.svg'
import exit from '../../assets/exit.svg'

export const Notifications = memo(function Notifications() {
  const navigate = useNavigate()
  const [notificationsData, setNotificationsData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState()
  const [open, setOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [sendModal, setSendModal] = useState(false)
  const [actionId, setActionId] = useState()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const selectRef = useRef()
  const itemsPerPage = 10

  const statusOptions = [
    {
      label: 'Barchasi',
      value: null
    },
    {
      label: 'Yangi',
      value: 0
    },
    {
      label: 'Yuborilgan',
      value: 1
    },
  ]

  const getNotifications = async (sValue = searchValue, sStatus = selectedStatus, page = currentPage) => {
    setLoading(true)
    try {
      const params = { page, per_page: itemsPerPage }
      if (sValue) params.search = sValue
      if (sStatus !== null && sStatus !== undefined) params.status = sStatus
      const res = await api.get('/admin/notifications', { params })
      const { records, pagination } = res.data.data
      setNotificationsData(records || [])
      setTotalPages(pagination?.total_pages || 1)
    } catch (err) {
      toast.error("Tarmoq xatosi. Iltimos, internetga ulanishingizni tekshiring.", { style: { width: '425px' } })
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async () => {
    try {
      await api.delete(`/admin/notifications/${actionId}`)
      toast.success("Bildirishnoma o'chirildi!")
      setDeleteModal(false)
      setActionId(null)
      getNotifications(searchValue, selectedStatus, currentPage)
    } catch (err) {
      toast.error("O'chirishda xatolik yuz berdi!")
    }
  }

  const sendNotification = async () => {
    try {
      await api.post(`/admin/notifications/${actionId}/send`)
      toast.success("Bildirishnoma yuborildi!")
      setSendModal(false)
      setActionId(null)
      getNotifications(searchValue, selectedStatus, currentPage)
    } catch (err) {
      toast.error("Yuborishda xatolik yuz berdi!")
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    getNotifications(searchValue, selectedStatus, 1)
  }, [selectedStatus])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      getNotifications(searchValue, selectedStatus, 1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchValue])

  const titleStyle = 'p-[10px_8px] text-[#8091A7] text-[11px] font-bold leading-[13.2px] tracking-[1.6px] uppercase'

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    const pad = (num) => String(num).padStart(2, '0')
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const notificationsType = {
    1: 'Chegirma',
    2: 'Yangiliklar',
    3: "E'lon",
    4: 'Bir martalik'
  }

  return (
    <main className="w-full max-w-full p-[32px]">
      <section className="flex items-center justify-between gap-[20px]">
        <h1 className="text-[#364A63] text-[28px] font-bold leading-[110%] tracking-[-0.84px]">Bildirishnomalar</h1>
        <div className="flex items-center gap-[16px]">
          <label className="w-full max-w-[214px] p-[8px_18px] flex items-center justify-between gap-[8px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF] cursor-text">
            <input
              className="w-full text-[#364A63] text-[13px] leading-[20px] tracking-[0.26px] placeholder:text-[#52648469]"
              type="text"
              placeholder="Nomi bo'yicha izlang"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)} />
            <img src={search} alt="Search" />
          </label>
          <div className="relative" ref={selectRef}>
            <button
              className="min-w-[120px] p-[8px_18px] flex items-center justify-between gap-[8px] rounded-[6px] bg-[#fff] border border-[#DBDFEA] cursor-pointer hover:bg-[#f8f6f2]"
              onClick={() => setOpen(!open)}>
              <span className="text-[#364A63] text-[13px] font-bold leading-[20px] tracking-[0.26px]">Holati</span>
              <img src={pointer} alt="Selector" />
            </button>
            {open && (
              <div className="absolute right-0 top-[calc(100%+4px)] w-[180px] bg-white rounded-[6px] shadow-[0px_4px_16px_0px_#00000014] border border-[#DBDFEA] z-50 overflow-hidden">
                {statusOptions.map(option => (
                  <button
                    key={option.label}
                    className={`w-full text-left p-[12px_16px] text-[#364A63] text-[13px] font-bold leading-[20px] hover:bg-[#f5f6fa] duration-[.2s] hover:text-[#B79F7C] ${selectedStatus === option.value ? 'bg-[#f5f6fa] text-[#B79F7C]' : ''}`}
                    onClick={() => {
                      setSelectedStatus(option.value)
                      setOpen(false)
                      setCurrentPage(1)
                      getNotifications(searchValue, option.value, 1)
                    }}>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="cursor-pointer p-[8px_18px] flex items-center gap-[12px] rounded-[3px] bg-[#B79F7C]"
            onClick={() => navigate('/notifications/add')}>
            <img src={add} alt="Add" />
            <span className="text-[#FFF] text-[13px] font-bold leading-[20px] tracking-[0.26px]">Bildirishnoma qo'shish</span>
          </button>
        </div>
      </section>

      <section className="mt-[28px] p-[24px_24px_95px] border border-[#DBDFEA] rounded-[6px] bg-[#FFF]">
        <div className="border border-[#DBDFEA] rounded-[4px]">
          <header className="px-[16px] flex items-center border-b border-[#DBDFEA] bg-[#F5F6FA]">
            <div className={`${titleStyle} w-[80px]`}>ID</div>
            <div className={`${titleStyle} flex-1`}>Sarlavha</div>
            <div className={`${titleStyle} w-[160px]`}>Target</div>
            <div className={`${titleStyle} w-[100px]`}>Turi</div>
            <div className={`${titleStyle} w-[180px]`}>Yaratilgan vaqti</div>
            <div className={`${titleStyle} w-[180px]`}>Yuborilgan vaqti</div>
            <div className={`${titleStyle} w-[140px]`}>Holati</div>
            <div className={`${titleStyle} w-[164px]`}></div>
          </header>

          {loading ? (
            <div className="py-[44px] flex justify-center items-center">
              <img className="w-[43px]" src={loadingRolling} alt="Loading" />
            </div>
          ) : (
            <>
              <ul>
                {notificationsData.map((item, ind) => (
                  <li key={item.id} className="flex items-center border-b border-[#DBDFEA] duration-[.3s] hover:bg-[#f8f9fc] hover:shadow-[0_2px_15px_-4px_#b79f7c66]">
                    <strong className="min-w-[102px] p-[20px_22.5px] text-[#6576FF] text-[13px] font-medium leading-[165%]">
                      {(currentPage - 1) * itemsPerPage + ind + 1}
                    </strong>
                    <div className="flex-1 p-[16px_8px]">
                      <p className="text-[#364A63] text-[13px] font-bold leading-[20px] line-clamp-2">
                        {item.title || item.translations?.uz?.title || '—'}
                      </p>
                      <p className="text-[#8091A7] text-[12px] leading-[18px] mt-[2px] line-clamp-1">
                        {item.push_title || item.translations?.uz?.push_title || ''}
                      </p>
                    </div>
                    <div className="w-[160px] p-[20px_8px] text-[#8091A7] text-[13px] leading-[20px]">
                      {item.target === 1 ? 'Faol foydalanuvchilar' : 'Barcha foydalanuvchilar'}
                    </div>
                    <div className="w-[100px] p-[20px_8px] text-[#8091A7] text-[13px] leading-[20px]">
                      {notificationsType[item.type]}
                    </div>
                    <div className="w-[180px] p-[20px_8px] text-[#8091A7] text-[13px] leading-[20px]">
                      {formatDate(item.created_at)}
                    </div>
                    <div className="w-[180px] p-[20px_8px] text-[#8091A7] text-[13px] leading-[20px]">
                      {formatDate(item.sent_at)}
                    </div>
                    <div className="w-[140px] p-[20px_8px] flex items-center gap-[7px]">
                      {item.status === 1 ? (
                        <>
                          <span className="min-w-[6px] min-h-[6px] rounded-full bg-[#B79F7C]" />
                          <span className="text-[#B79F7C] text-[13px] leading-[20px]">Yuborilgan</span>
                        </>
                      ) : (
                        <><span className="min-w-[6px] min-h-[6px] rounded-full bg-[#6576FF]" />
                          <span className="text-[#6576FF] text-[13px] leading-[20px]">Yangi</span></>
                      )}
                    </div>
                    <div className="w-[180px] p-[16px_12px] flex items-center justify-end gap-[4px]">
                      {item.status !== 1 && (
                        <button
                          className="w-[38px] h-[38px] flex items-center justify-center rounded-full duration-[.2s] text-[#8091A7] hover:bg-[#e9e7e7] hover:text-[#B79F7C]"
                          onClick={() => { setActionId(item.id); setSendModal(true) }}
                          title="Yuborish">
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </button>
                      )}
                      <button
                        className="w-[38px] h-[38px] flex items-center justify-center rounded-full duration-[.2s] text-[#8091A7] hover:bg-[#e9e7e7] hover:text-[#B79F7C]"
                        onClick={() => navigate(`/notifications/view/${item.id}`)}
                        title="Ko'rish">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      {item.status !== 1 && (
                        <>
                          <button
                            className="w-[38px] h-[38px] flex items-center justify-center rounded-full duration-[.2s] text-[#8091A7] hover:bg-[#e9e7e7] hover:text-[#B79F7C]"
                            onClick={() => navigate(`/notifications/edit/${item.id}`)}
                            title="Tahrirlash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415" />
                              <path d="M16 5l3 3" />
                            </svg>
                          </button>

                          <button
                            className="w-[38px] h-[38px] flex items-center justify-center rounded-full duration-[.2s] text-[#8091A7] hover:bg-[#e9e7e7] hover:text-[#B79F7C]"
                            onClick={() => { setActionId(item.id); setDeleteModal(true) }}
                            title="O'chirish">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-[22px_24px] flex">
                <div className="flex items-center border border-[#DBDFEA] rounded-[4px] overflow-hidden">
                  <button onClick={() => { setCurrentPage(1); getNotifications(searchValue, selectedStatus, 1) }} disabled={currentPage === 1} className="w-[36px] h-[36px] flex items-center justify-center bg-white text-[#8091A7] hover:bg-[#f5f6fa] disabled:opacity-40 disabled:cursor-not-allowed duration-[.2s]">
                    <img src={doublePointer} alt="Double Pointer" />
                  </button>
                  {(() => {
                    const pages = []
                    const delta = 1
                    let left = currentPage - delta
                    let right = currentPage + delta
                    if (left < 1) { right += 1 - left; left = 1 }
                    if (right > totalPages) { left -= right - totalPages; right = totalPages; if (left < 1) left = 1 }
                    if (left > 1) {
                      pages.push(<button key="first" onClick={() => { setCurrentPage(1); getNotifications(searchValue, selectedStatus, 1) }} className="w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] border-[#DBDFEA] bg-white text-[#364A63] text-[13px] hover:bg-[#F5F6FA] duration-[.2s]">1</button>)
                      if (left > 2) pages.push(<span key="l-dots" className="w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] text-[#8091A7] text-[13px]"><img src={triplePoint} alt="..." /></span>)
                    }
                    for (let i = left; i <= right; i++) {
                      pages.push(<button key={i} className={`w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] text-[13px] duration-[.2s] ${currentPage === i ? 'border-[#B79F7C] bg-[#B79F7C] text-white' : 'border-[#DBDFEA] bg-white text-[#364A63] hover:bg-[#F5F6FA]'}`} onClick={() => { setCurrentPage(i); getNotifications(searchValue, selectedStatus, i) }}>{i}</button>)
                    }
                    if (right < totalPages) {
                      if (right < totalPages - 1) pages.push(<span key="r-dots" className="w-[36px] h-[36px] flex items-center justify-center text-[#8091A7] text-[13px]"><img src={triplePoint} alt="..." /></span>)
                      pages.push(<button key="last" onClick={() => { setCurrentPage(totalPages); getNotifications(searchValue, selectedStatus, totalPages) }} className="w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] border-[#DBDFEA] bg-white text-[#364A63] text-[13px] hover:bg-[#F5F6FA] duration-[.2s]">{totalPages}</button>)
                    }
                    return pages
                  })()}
                  <button onClick={() => { setCurrentPage(totalPages); getNotifications(searchValue, selectedStatus, totalPages) }} disabled={currentPage === totalPages} className="w-[36px] h-[36px] flex items-center justify-center bg-white text-[#8091A7] hover:bg-[#F5F6FA] disabled:opacity-40 disabled:cursor-not-allowed duration-[.2s]">
                    <img className="rotate-180" src={doublePointer} alt="Double Pointer" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {deleteModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00000066]" onClick={(e) => { if (e.target === e.currentTarget) setDeleteModal(false) }}>
          <div className="w-full max-w-[440px] p-[24px] pt-[27px] flex flex-col items-center gap-[32px] bg-[#FFF] rounded-[6px]">
            <div className="w-full flex items-center justify-between mb-[16px]">
              <h4 className="text-[#364A63] text-[20px] font-bold leading-[22px] tracking-[-0.2px]">Tasdiqlash</h4>

              <button onClick={() => setDeleteModal(false)}><img src={exit} alt="Exit" /></button>
            </div>

            <p className="text-[#526484] text-[16px] leading-[23.1px] text-center">Siz rostan ham bildirishnomani o'chirmoqchimisiz?</p>

            <div className="flex items-center gap-[20px]">
              <button className="py-[8px] px-[26.5px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF] text-[#526484] text-[13px] font-bold hover:bg-[#f5f6fa] duration-[.2s]" onClick={() => setDeleteModal(false)}>Bekor qilish</button>

              <button className="py-[8px] px-[23.5px] rounded-[3px] bg-[#E85347] text-[#FFF] text-[13px] hover:bg-[#d04840] duration-[.2s]" onClick={deleteNotification}>Ha, o'chirilsin</button>
            </div>
          </div>
        </div>, document.body
      )}

      {sendModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00000066]" onClick={(e) => { if (e.target === e.currentTarget) setSendModal(false) }}>
          <div className="w-full max-w-[440px] p-[24px] pt-[27px] flex flex-col items-center gap-[32px] bg-[#FFF] rounded-[6px]">
            <div className="w-full flex items-center justify-between mb-[16px]">
              <h4 className="text-[#364A63] text-[20px] font-bold leading-[22px] tracking-[-0.2px]">Tasdiqlash</h4>

              <button onClick={() => setSendModal(false)}><img src={exit} alt="Exit" /></button>
            </div>

            <p className="text-[#526484] text-[16px] leading-[23.1px] text-center">Siz rostan ham bildirishnomani yubormoqchimisiz?</p>

            <div className="flex items-center gap-[20px]">
              <button className="py-[8px] px-[26.5px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF] text-[#526484] text-[13px] font-bold hover:bg-[#f5f6fa] duration-[.2s]" onClick={() => setSendModal(false)}>Bekor qilish</button>

              <button className="py-[8px] px-[23.5px] rounded-[3px] bg-[#B79F7C] text-[#FFF] text-[13px] hover:bg-[#a8824a] duration-[.2s]" onClick={sendNotification}>Ha, yuborilsin</button>
            </div>
          </div>
        </div>, document.body
      )}
    </main>
  )
})