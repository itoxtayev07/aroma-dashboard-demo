import { useEffect, useState, memo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../config/axios";

import backPointer from '../../assets/back-pointer.svg'

export const BannerView = memo(function BannerView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [banner, setBanner] = useState()
    const [loading, setLoading] = useState(true)
    const [lang, setLang] = useState('uz')

    const getBanner = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/admin/banners/${id}`)
            const data = res.data.data
            const translation = data?.translations?.[lang] || {}
            setBanner({
                ...data,
                name: translation.name || '—',
                description: translation.description || '—',
                image: translation.image || null,
            })
        } catch (err) {
            toast.error("Ma'lumotlarni yuklashda xatolik!")
            navigate('/banners')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getBanner()
    }, [id, lang])

    const typeLabels = {
        0: 'None',
        1: 'Info',
        2: 'Product',
        3: 'Web',
        4: 'Kiosk'
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—'
        const date = new Date(dateStr)
        const pad = (num) => String(num).padStart(2, '0')
        return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    const tablesStyle = "p-[12px_20px] flex gap-[20px] border-b border-[#DBDFEA] last:border-b-0 odd:bg-[#F4F6FAB2]"
    const labelsStyle = "w-[220px] text-[#8091A7] text-[14px] leading-[23.1px] tracking-normal"
    const valuesStyle = "w-full max-w-full text-[#364A63] text-[14px] font-semibold leading-[23.1px] tracking-normal"

    if (loading) return (
        <main className="w-full max-w-full p-[32px] flex-1 flex items-center justify-center">
            <div className="w-[40px] h-[40px] border-[3px] border-[#B79F7C] border-t-transparent rounded-full animate-spin" />
        </main>
    )

    return (
        <main className="w-full max-w-full p-[32px] flex-1">
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-[#364A63] text-[28px] font-bold leading-[110%] tracking-[-0.84px]">
                        Banner haqida ma'lumot
                    </h1>
                    <div className="flex items-center gap-[8px] mt-[8px]">
                        <Link to="/banners" className="text-[#526484] text-[11px] font-medium tracking-[0.8px] uppercase hover:text-[#B79F7C] duration-[.2s]">Bannerlar menyusi</Link>
                        <span className="text-[#526484] text-[11px] select-none">/</span>
                        <span className="text-[#B7C2D0] text-[11px] font-medium tracking-[0.8px] uppercase select-none">Banner ma’lumoti</span>
                    </div>
                </div>
                <button
                    className="flex items-center gap-[8px] py-[8px] px-[18px] border border-[#DBDFEA] rounded-[4px] duration-[.2s] bg-[#FFF] hover:bg-[#f5f6fa]"
                    onClick={() => navigate('/banners')}>
                    <img src={backPointer} alt="Back Pointer" />
                    <span className="text-[#526484] text-[13px] font-bold leading-[20px] tracking-[0.26px]">Ortga</span>
                </button>
            </header>

            <section className="mt-[28px] p-[24px] flex gap-[32px] border border-[#DBDFEA] rounded-[4px] bg-[#FFF]">
                <div>
                    {banner?.image ? (
                        <img src={banner.image} alt={banner.name} className="min-w-[370px] h-[120px] object-cover" />
                    ) : (
                        <div className="min-w-[370px] h-[120px] bg-[#F5F6FA] rounded-[6px]" />
                    )}
                </div>

                <div className="w-full max-w-full">
                    <div className="flex items-center justify-between">
                        <h5 className="text-[#526484] text-[20px] font-bold leading-[22px] tracking-[-0.2px]">{banner?.name || '—'}</h5>

                        <div className="flex items-center gap-[24px]">
                            {['uz', 'ru', 'en'].map(language => (
                                <button key={language} className={`text-[11px] font-bold leading-[100%] tracking-[1.6px] uppercase pb-[8px] border-b-[2px] duration-[.2s] ${lang === language ? 'border-[#B79F7C] text-[#B79F7C]' : 'border-transparent text-[#8091A7]'}`} onClick={() => setLang(language)}>
                                    {language === 'uz' ? "O'zbekcha" : language === 'ru' ? 'Русский' : 'English'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ul className="mt-[20px] border border-[#DBDFEA] rounded-[4px]">
                        <li className={tablesStyle}>
                            <div className={labelsStyle}>ID</div>
                            <div className={`${valuesStyle} flex items-center gap-[8px]`}>
                                <span>{banner?.id || '—'}</span>
                            </div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Nomi</div>
                            <div className={valuesStyle}>{banner?.name || '—'}</div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Ma'lumoti</div>
                            <div className={valuesStyle}>{banner?.description || '—'}</div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Turi</div>
                            <div className={valuesStyle}>{typeLabels[banner?.type] || banner?.type || '—'}</div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Davomiyligi</div>
                            <div className={valuesStyle}>{banner?.duration ? `${banner.duration} soniya` : '—'}</div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Banner holati</div>
                            <div className={`${valuesStyle} flex items-center gap-[7px]`}>
                                {banner?.status === 1 ? (
                                    <>
                                        <div className="w-[6px] h-[6px] rounded-full bg-[#1EE0AC]" />
                                        <span className="text-[#1EE0AC] text-[14px] font-semibold leading-[23.1px] tracking-normal">
                                            Faol
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-[6px] h-[6px] rounded-full bg-[#E85347]" />
                                        <span className="text-[#E85347] text-[14px] font-semibold leading-[23.1px] tracking-normal">
                                            Faol emas
                                        </span>
                                    </>
                                )}
                            </div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Path</div>
                            <div className={valuesStyle}>{banner?.path || '—'}</div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Filial</div>
                            <div className={`${valuesStyle} flex flex-wrap gap-[6px]`}>
                                {banner?.branches?.length > 0
                                    ? banner.branches.map(branch => (
                                        <span key={branch.id} className="p-[7px_8px] bg-[#F5F6FA] rounded-[4px] text-[#526484] text-[12px] leading-[100%] tracking-normal">
                                            {branch.name}
                                        </span>
                                    ))
                                    : '—'
                                }
                            </div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>Yaratilgan vaqti</div>
                            <div className={valuesStyle}>{formatDate(banner?.created_at)}</div>
                        </li>

                        <li className={tablesStyle}>
                            <div className={labelsStyle}>O'zgartirish kiritilgan vaqti</div>
                            <div className={valuesStyle}>{formatDate(banner?.updated_at)}</div>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    )
})
