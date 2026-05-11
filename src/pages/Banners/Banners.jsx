import { useEffect, useState, useRef, memo } from "react";
import { Link, useNavigate } from "react-router";
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

export const Banners = memo(function Banners() {
    const navigate = useNavigate()
    const [bannersData, setBannersData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [selectedStatus, setSelectedStatus] = useState()
    const [open, setOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deletingId, setDeletingId] = useState()
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
            label: 'Faol',
            value: 1
        },
        {
            label: 'Faol emas',
            value: 0
        },
    ]

    const getBanners = async (sValue = searchValue, sStatus = selectedStatus, page = currentPage) => {
        setLoading(true)
        try {
            const params = { page, per_page: itemsPerPage }
            if (sValue) params.search = sValue
            if (sStatus !== null && sStatus !== undefined) params.status = sStatus

            const res = await api.get('/admin/banners', { params })
            const { records, pagination } = res.data.data

            setBannersData(records || [])
            setTotalPages(pagination?.total_pages || 1)
        } catch (err) {
            toast.error("Tarmoq xatosi. Iltimos, internetga ulanishingizni tekshiring.", {
                style: { width: '425px' }
            })
        } finally {
            setLoading(false)
        }
    }

    const deleteBanner = async () => {
        try {
            await api.delete(`/admin/banners/${deletingId}`)
            toast.success("Banner o'chirildi!")
            setDeleteModal(false)
            setDeletingId(null)
            getBanners(searchValue, selectedStatus, currentPage)
        } catch (err) {
            toast.error("O'chirishda xatolik yuz berdi!")
        }
    }

    useEffect(() => {
        setCurrentPage(1)
        getBanners(searchValue, selectedStatus, 1)
    }, [selectedStatus])

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1)
            getBanners(searchValue, selectedStatus, 1)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchValue])

    const titleStyle = 'p-[10px_8px] text-[#8091A7] text-[11px] font-bold leading-[13.2px] tracking-[1.6px] uppercase'

    const typeLabels = {
        0: 'NONE',
        1: 'INFO',
        2: 'WEB',
        3: 'PRODUCT',
        4: 'KIOSK'
    }

    return (
        <main className="w-full max-w-full p-[32px]">

            <section className="flex items-center justify-between gap-[20px]">
                <h1 className="text-[#364A63] text-[28px] font-bold leading-[110%] tracking-[-0.84px]">Bannerlar menyusi</h1>

                <div className="flex items-center gap-[16px]">
                    <label className="w-full max-w-[214px] p-[8px_18px] flex items-center justify-between gap-[8px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF] cursor-text">
                        <input
                            className="w-full text-[#364A63] text-[13px] leading-[20px] tracking-[0.26px] placeholder:text-[#52648469]"
                            type="text"
                            placeholder="Nomi bo’yicha izlang"
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
                                            getBanners(searchValue, option.value, 1)
                                        }}>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to='/banners/add'>
                        <button className="cursor-pointer w-[168px] p-[8px_18px] flex items-center gap-[12px] rounded-[3px] bg-[#B79F7C]">
                            <img src={add} alt="Add" />
                            <span className="text-[#FFF] text-[13px] font-bold leading-[20px] tracking-[0.26px]">Banner qo'shish</span>
                        </button>
                    </Link>
                </div>
            </section>

            <section className="mt-[28px] p-[24px_24px_95px] border border-[#DBDFEA] rounded-[6px] bg-[#FFF]">
                <div className="border border-[#DBDFEA] rounded-[4px]">


                    <header className="px-[16px] flex items-center border-b border-[#DBDFEA] bg-[#F5F6FA]">
                        <div className={`${titleStyle} w-[65px]`}>#</div>
                        <div className={`${titleStyle} flex-1`}>Banner nomi</div>
                        <div className={`${titleStyle} w-[100px]`}>Turi</div >
                        <div className={`${titleStyle} w-[220px]`}> Filiali</div >
                        <div className={`${titleStyle} w-[180px]`}> Holati</div >
                        <div className={`${titleStyle} w-[155px]`}></div >
                    </header>

                    {
                        loading ? (
                            <div className="py-[44px] flex justify-center items-center" >
                                <img className="w-[43px]" src={loadingRolling} alt="Loading" />
                            </div>
                        ) : (
                            <>
                                <ul>
                                    {bannersData.map((banner, ind) => (
                                        <li key={banner.id} className="flex items-center border-b border-[#DBDFEA] duration-[.3s] hover:bg-[#f8f9fc] hover:shadow-[0_2px_15px_-4px_#b79f7c66]">

                                            <strong className="min-w-[80px] p-[28.5px_22.5px] text-[#6576FF] text-[13px] font-medium leading-[165%] tracking-normal">
                                                {(currentPage - 1) * itemsPerPage + ind + 1}
                                            </strong>

                                            <div className="p-[16px_8px] flex-1 flex items-center gap-[16px]">
                                                <img
                                                    src={banner.image}
                                                    alt={banner.name}
                                                    className="w-[142px] h-[44px] object-cover"
                                                    onError={(e) => { e.target.style.display = 'none' }} />
                                                <span className="text-[#364A63] text-[13px] font-bold leading-[23.1px] tracking-normal">
                                                    {banner.name}
                                                </span>
                                            </div>

                                            <div className="w-[100px] p-[29.5px_8px] text-[#8091A7] text-[13px] leading-[20.7px] tracking-normal">
                                                {typeLabels[banner.type] || banner.type}
                                            </div>

                                            <div className="w-[220px] p-[29.5px_8px] text-[#8091A7] text-[13px] leading-[20.7px] tracking-normal">
                                                {banner.branch_names?.join(', ') || '—'}
                                            </div>

                                            <div className="w-[180px] p-[29.5px_8px] flex items-center gap-[7px]">
                                                {banner.status === 1 ? (
                                                    <>
                                                        <span className="min-w-[6px] min-h-[6px] rounded-full bg-[#1EE0AC]" />
                                                        <span className="text-[#1EE0AC] text-[13px] leading-[20.7px] tracking-medium">Faol</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="min-w-[6px] min-h-[6px] rounded-full bg-[#E85347]" />
                                                        <span className="text-[#E85347] text-[13px] leading-[20.7px] tracking-medium">Faollashtirilmagan</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="w-[171px] p-[24px_20px] flex items-center justify-between gap-[4px]">
                                                <button
                                                    className="w-[38px] h-[38px] flex items-center justify-center rounded-full duration-[.2s] text-[#8091A7] hover:bg-[#e9e7e7] hover:text-[#B79F7C]"
                                                    onClick={() => navigate(`/banners/view/${banner.id}`)}
                                                    title="Ko'rish">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                </button>

                                                <button
                                                    className="w-[38px] h-[38px] flex items-center justify-center rounded-full duration-[.2s] text-[#8091A7] hover:bg-[#e9e7e7] hover:text-[#B79F7C]"
                                                    onClick={() => navigate(`/banners/edit/${banner.id}`)}
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
                                                    onClick={() => { setDeletingId(banner.id); setDeleteModal(true) }}
                                                    title="O'chirish">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M4 7l16 0" />
                                                        <path d="M10 11l0 6" />
                                                        <path d="M14 11l0 6" />
                                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                    </svg>
                                                </button>
                                            </div>

                                        </li>
                                    ))}
                                </ul>

                                <div className="p-[22px_24px] flex">
                                    <div className="flex items-center border border-[#DBDFEA] rounded-[4px] overflow-hidden">
                                        <button
                                            onClick={() => { setCurrentPage(1); getBanners(searchValue, selectedStatus, 1) }}
                                            disabled={currentPage === 1}
                                            className="w-[36px] h-[36px] flex items-center justify-center bg-white text-[#8091A7] text-[13px] hover:bg-[#f5f6fa] disabled:opacity-40 disabled:cursor-not-allowed duration-[.2s]">
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
                                                pages.push(
                                                    <button
                                                        onClick={() => { setCurrentPage(1); getBanners(searchValue, selectedStatus, 1) }}
                                                        className="w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] border-[#DBDFEA] bg-white text-[#364A63] text-[13px] leading-[16px] tracking-normal hover:bg-[#F5F6FA] duration-[.2s]">
                                                        1
                                                    </button>
                                                )
                                                if (left > 2) pages.push(
                                                    <span className="w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] text-[#8091A7] text-[13px]">
                                                        <img src={triplePoint} alt="Triple Point" />
                                                    </span>
                                                )
                                            }

                                            for (let i = left; i <= right; i++) {
                                                pages.push(
                                                    <button
                                                        key={i}
                                                        className={`w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] text-[13px] leading-[16px] tracking-normal duration-[.2s] ${currentPage === i ? 'border-[#B79F7C] bg-[#B79F7C] text-white' : 'border-[#DBDFEA] bg-white text-[#364A63] hover:bg-[#F5F6FA]'}`}
                                                        onClick={() => { setCurrentPage(i); getBanners(searchValue, selectedStatus, i) }}>
                                                        {i}
                                                    </button>
                                                )
                                            }

                                            if (right < totalPages) {
                                                if (right < totalPages - 1) pages.push(
                                                    <span className="w-[36px] h-[36px] flex items-center justify-center text-[#8091A7] text-[13px]">
                                                        <img src={triplePoint} alt="Triple Point" />
                                                    </span>
                                                )
                                                pages.push(
                                                    <button
                                                        onClick={() => { setCurrentPage(totalPages); getBanners(searchValue, selectedStatus, totalPages) }}
                                                        className="w-[36px] h-[36px] flex items-center justify-center border-x-[.5px] border-[#DBDFEA] bg-white text-[#364A63] text-[13px] leading-[16px] tracking-normal hover:bg-[#F5F6FA] duration-[.2s]">
                                                        {totalPages}
                                                    </button>
                                                )
                                            }

                                            return pages
                                        })()}

                                        <button
                                            onClick={() => { setCurrentPage(totalPages); getBanners(searchValue, selectedStatus, totalPages) }}
                                            disabled={currentPage === totalPages}
                                            className="w-[36px] h-[36px] flex items-center justify-center bg-white text-[#8091A7] text-[13px] hover:bg-[#F5F6FA] disabled:opacity-40 disabled:cursor-not-allowed duration-[.2s]">
                                            <img className="rotate-180" src={doublePointer} alt="Double Pointer" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                </div>
            </section>

            {deleteModal && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00000066]"
                    onClick={(e) => { if (e.target === e.currentTarget) setDeleteModal(false) }}>
                    <div className="w-full max-w-[440px] p-[24px] pt-[27px] flex flex-col items-center gap-[32px] bg-[#FFF] rounded-[6px]">
                        <div className="w-full max-w-full flex items-center justify-between mb-[16px]">
                            <h4 className="text-[#364A63] text-[20px] font-bold leading-[22px] tracking-[-0.2px]">Tasdiqlash</h4>
                            <button onClick={() => setDeleteModal(false)}>
                                <img src={exit} alt="Exit" />
                            </button>
                        </div>

                        <p className="text-[#526484] text-[16px] leading-[23.1px] tracking-normal text-center">Siz rostan ham bannerni o’chirmoqchimisiz?</p>

                        <div className="flex items-center justify-between gap-[20px]">
                            <button
                                className="py-[8px] px-[26.5px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF] text-[#526484] text-[13px] font-bold leading-[20px] tracking-[0.26px] hover:bg-[#f5f6fa] duration-[.2s]"
                                onClick={() => setDeleteModal(false)}
                            >Bekor qilish</button>
                            <button
                                className="py-[8px] px-[23.5px] rounded-[3px] bg-[#E85347] text-[#FFF] text-[13px] leading-[20px] tracking-[0.26px] hover:bg-[#d04840] duration-[.2s]"
                                onClick={deleteBanner}>
                                Ha, o’chirilsin
                            </button>
                        </div>
                    </div>
                </div>, document.body
            )}
        </main >
    )
})