import { useState, memo } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../config/axios";
import { FileUpload, CustomSelect } from "../../components";

import backPointer from '../../assets/back-pointer.svg'
import loadingRolling from '../../assets/loading-white-rolling.svg'

export const NotificationAdd = memo(function NotificationAdd() {
    const navigate = useNavigate()
    const [lang, setLang] = useState('uz')
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)

    const [titleErr, setTitleErr] = useState('')
    const [imgErr, setImgErr] = useState('')
    const [pushTitleErr, setPushTitleErr] = useState('')
    const [bodyErr, setBodyErr] = useState('')

    const [form, setForm] = useState({
        title_uz: '',
        title_ru: '',
        title_en: '',
        title_tr: '',
        push_title_uz: '',
        push_title_ru: '',
        push_title_en: '',
        push_title_tr: '',
        body_uz: '',
        body_ru: '',
        body_en: '',
        body_tr: '',
        target: '1',
        type: '1',
    })

    const handleSubmit = async () => {
        console.log(form);

        if (!form.title_uz || !image || !form.push_title_uz || !form.body_uz) {

            if (!form.title_uz) {
                setTitleErr("Maydon toʻldirilishi shart!")
            } else setTitleErr('')

            if (!image) {
                setImgErr("Iltimos, rasm yuklang!")
            } else setImgErr('')

            if (!form.push_title_uz) {
                setPushTitleErr("Maydon toʻldirilishi shart!")
            } else setPushTitleErr('')

            if (!form.body_uz) {
                setBodyErr("To'ldirish majburiy")
            } else setBodyErr('')
            return
        }

        setLoading(true)
        try {
            let imageUrl = null
            if (image?.file) {
                const imgFormData = new FormData()
                imgFormData.append('file', image.file)
                const imgRes = await api.post('/admin/upload', imgFormData)
                imageUrl = imgRes.data.data.file
            }

            const payload = {
                target: Number(form.target),
                type: Number(form.type),
                push_title: form.push_title_uz,
                translations: {
                    uz: {
                        title: form.title_uz,
                        body: form.body_uz || '',
                        description: form.body_uz || '',
                        image: imageUrl,
                    },
                    ru: {
                        title: form.title_ru || form.title_uz,
                        body: form.body_ru || '',
                        description: form.body_ru || '',
                        image: imageUrl,
                    },
                    en: {
                        title: form.title_en || form.title_uz,
                        body: form.body_en || '',
                        description: form.body_en || '',
                        image: imageUrl,
                    },
                    tr: {
                        title: form.title_tr || form.title_uz,
                        body: form.body_tr || '',
                        description: form.body_tr || '',
                        image: imageUrl,
                    },
                }
            }

            await api.post('/admin/notifications', payload)
            toast.success("Bildirishnoma muvaffaqiyatli qo'shildi!")
            navigate('/notifications')
        } catch (err) {
            const msg = err.response?.data?.error?.message || err.message || "Xatolik yuz berdi!"
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const notificationsTarget = [
        {
            label: 'active',
            value: '1'
        },
        {
            label: 'inactive',
            value: '2'
        },
    ]

    const notificationsType = [
        {
            label: 'Chegirma',
            value: '1'
        },
        {
            label: 'Yangiliklar',
            value: '2'
        },
        {
            label: "E'lon",
            value: '3'
        },
        {
            label: "Bir martalik",
            value: '4'
        }
    ]

    let languages = ['uz', 'ru', 'en', 'tr']

    let errorStyle = 'absolute block text-[#e85347] text-[11px] italic leading-[1.65]'
    const inputStyle = "w-full mt-[8px] p-[10.5px_16px] border border-[#DBDFEA] rounded-[4px] text-[#364A63] text-[14px] leading-[165%] placeholder:text-[#8091A7] focus:outline-none focus:border-[#B79F7C] focus:shadow-[0_0_0_3px_#b79f7c1a] duration-[.2s]"
    const labelStyle = "block text-[#364A63] text-[14px] font-medium leading-[165%]"

    return (
        <main className="w-full max-w-full p-[32px] flex-1">
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-[#364A63] text-[28px] font-bold leading-[110%] tracking-[-0.84px]">Bildirishnoma qo'shish</h1>
                    <div className="flex items-center gap-[8px] mt-[8px]">
                        <Link to="/notifications" className="text-[#526484] text-[11px] font-medium tracking-[0.8px] uppercase hover:text-[#B79F7C] duration-[.2s]">Bildirishnomalar</Link>
                        <span className="text-[#526484] text-[11px] select-none">/</span>
                        <span className="text-[#B7C2D0] text-[11px] font-medium tracking-[0.8px] uppercase select-none">Bildirishnoma qo'shish</span>
                    </div>
                </div>
                <button
                    className="flex items-center gap-[8px] py-[8px] px-[18px] border border-[#DBDFEA] rounded-[4px] duration-[.2s] bg-[#FFF] hover:bg-[#f5f6fa]"
                    onClick={() => navigate('/notifications')}>
                    <img src={backPointer} alt="Back Pointer" />
                    <span className="text-[#526484] text-[13px] font-bold leading-[20px] tracking-[0.26px]">Ortga</span>
                </button>
            </header>

            <div className="mt-[28px] p-[24px] flex flex-col gap-[24px] border border-[#DBDFEA] rounded-[6px] bg-[#FFF]">

                <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
                    <div>
                        <label className={labelStyle}>Target</label>
                        <CustomSelect
                            value={form.target}
                            onChange={(val) => setForm(prev => ({ ...prev, target: val }))}
                            options={notificationsTarget} />
                    </div>
                    <div>
                        <label className={labelStyle}>Turi</label>
                        <CustomSelect
                            value={form.type}
                            onChange={(val) => setForm(prev => ({ ...prev, type: val }))}
                            options={notificationsType} />
                    </div>
                </div>

                <div className="relative">
                    <div className="flex items-center justify-between mb-[12px]">
                        <label className={labelStyle}>Sarlavha</label>
                        <div className="flex items-center gap-[24px]">
                            {languages.map(language => (
                                <button
                                    key={language}
                                    className={`text-[11px] font-bold leading-[100%] tracking-[1.6px] uppercase pb-[8px] border-b-[2px] duration-[.2s] ${lang === language ? 'border-[#B79F7C] text-[#B79F7C]' : 'border-transparent text-[#8091A7]'}`}
                                    onClick={() => setLang(language)}>
                                    {language === 'uz' ? "O'zbekcha" : language === 'ru' ? 'Русский' : language === 'en' ? 'English' : 'Turkcha'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <input
                        className={`${inputStyle} ${titleErr ? 'border-[#e85347] shadow-[0_0_0_3px_#e853471a] focus:border-[#e85347] focus:shadow-[0_0_0_3px_#e853471a]' : ''}`}
                        placeholder="Masalan: Ajoyib aksiyani kutib oling"
                        value={form[`title_${lang}`]}
                        onChange={
                            (e) => {
                                setForm(prev => ({
                                    ...prev,
                                    [`title_${lang}`]: e.target.value
                                }))
                            }} />
                    <span className={errorStyle}>{titleErr}</span>
                </div>

                <div>
                    <label className={labelStyle}>Rasm yuklash</label>
                    <div className="mt-[8px] relative">
                        <FileUpload value={image} onChange={setImage} fieldW={16} fieldH={9} />
                        <span className={errorStyle}>{imgErr}</span>
                    </div>
                </div>

                <div className="relative">
                    <label className={labelStyle}>Push xabar uchun matn</label>
                    <input
                        className={`${inputStyle} ${pushTitleErr ? 'border-[#e85347] shadow-[0_0_0_3px_#e853471a] focus:border-[#e85347] focus:shadow-[0_0_0_3px_#e853471a]' : ''}`}
                        placeholder="Masalan: Ajoyib aksiyani kutib oling"
                        value={form[`push_title_${lang}`]}
                        onChange={(e) => setForm(prev => ({ ...prev, [`push_title_${lang}`]: e.target.value }))} />
                    <span className={errorStyle}>{pushTitleErr}</span>
                </div>

                <div className="relative">
                    <label className={labelStyle}>Matn</label>
                    <textarea
                        className={`${inputStyle} resize-none h-[160px] ${bodyErr ? 'border-[#e85347] shadow-[0_0_0_3px_#e853471a] focus:border-[#e85347] focus:shadow-[0_0_0_3px_#e853471a]' : ''}`}
                        placeholder="Bildirishnoma matni..."
                        value={form[`body_${lang}`]}
                        onChange={(e) => setForm(prev => ({ ...prev, [`body_${lang}`]: e.target.value }))} />
                    <span className={errorStyle}>{bodyErr}</span>
                </div>

                <div className="flex items-center justify-end gap-[12px]">
                    <button
                        className="p-[8px_18px] border border-[#DBDFEA] rounded-[4px] text-[#526484] text-[13px] font-bold leading-[20px] bg-[#FFF] hover:bg-[#f5f6fa] duration-[.2s]"
                        onClick={() => navigate('/notifications')}>
                        Bekor qilish
                    </button>
                    <button
                        className="px-[24px] py-[8px] flex items-center justify-between gap-[8px] rounded-[3px] bg-[#B79F7C] text-[#FFF] text-[13px] leading-[20px] hover:bg-[#a8824a] duration-[.2s] disabled:opacity-60"
                        onClick={handleSubmit}
                        disabled={loading}>
                        {loading ? (
                            <><span className="text-[#FFF] text-[13px]">Saqlash</span><img className="w-[10px]" src={loadingRolling} alt="Loading" /></>
                        ) : 'Saqlash'}
                    </button>
                </div>
            </div>
        </main>
    )
})