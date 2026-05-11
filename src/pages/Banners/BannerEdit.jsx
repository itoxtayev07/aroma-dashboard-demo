import { useState, useEffect, memo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../config/axios";
import { FileUpload, CustomSelect } from "../../components";

import backPointer from '../../assets/back-pointer.svg'
import loadingRolling from '../../assets/loading-white-rolling.svg'

export const BannerEdit = memo(function BannerEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [lang, setLang] = useState('uz')
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [allBranches, setAllBranches] = useState([])
    const [branchSearch, setBranchSearch] = useState('')
    const [branchDropdown, setBranchDropdown] = useState(false)

    const [form, setForm] = useState({
        name_uz: '',
        name_ru: '',
        name_en: '',
        description_uz: '',
        description_ru: '',
        description_en: '',
        type: 'NONE',
        status: '1',
        path: '',
        duration: 0,
        branches: []
    })

    const getBanner = async () => {
        setPageLoading(true)
        try {
            const res = await api.get(`/admin/banners/${id}`)
            const banner = res.data.data

            setForm({
                name_uz: banner.translations?.uz?.name || '',
                name_ru: banner.translations?.ru?.name || '',
                name_en: banner.translations?.en?.name || '',
                description_uz: banner.translations?.uz?.description || '',
                description_ru: banner.translations?.ru?.description || '',
                description_en: banner.translations?.en?.description || '',
                type: String(banner.type || '0'),
                status: String(banner.status ?? '1'),
                path: banner.path || '',
                duration: banner.duration || 0,
                branches: banner.branches || []
            })
        } catch (err) {
            toast.error("Ma'lumotlarni yuklashda xatolik!")
            navigate('/banners')
        } finally {
            setPageLoading(false)
        }
    }

    const getAllBranches = async () => {
        try {
            const res = await api.get('/admin/branches')
            setAllBranches(res.data.data?.records || res.data.data || [])
        } catch (err) {
            console.log(err)

        }
    }

    useEffect(() => {
        getAllBranches()
        getBanner()
    }, [id])

    const removeBranch = (branchId) => setForm(prev => ({ ...prev, branches: prev.branches.filter(branch => branch.id !== branchId) }))
    const addBranch = (branch) => {
        if (form.branches.find(brnch => brnch.id === branch.id)) return
        setForm(prev => ({ ...prev, branches: [...prev.branches, branch] }))
        setBranchDropdown(false)
        setBranchSearch('')
    }
    const filteredBranches = allBranches.filter(branch =>
        branch.name?.toLowerCase().includes(branchSearch.toLowerCase()) &&
        !form.branches.find(fornBranch => fornBranch.id === branch.id)
    )

    const handleSubmit = async () => {
        if (!form.name_uz) { toast.error("Banner nomini kiriting!"); return }

        setLoading(true)
        try {
            let imageUrl = image?.preview
            if (image?.file) {
                const imgFormData = new FormData()
                imgFormData.append('file', image.file)
                const imgRes = await api.post('/admin/upload', imgFormData)
                imageUrl = imgRes.data.data.file
            }

            await api.put(`/admin/banners/${id}`, {
                status: Number(form.status),
                type: Number(form.type),
                path: form.path || '',
                duration: Number(form.duration) || 0,
                branches: form.branches.map(branch => branch.id),
                translations: {
                    uz: { name: form.name_uz, description: form.description_uz || '', image: imageUrl },
                    ru: { name: form.name_ru || form.name_uz, description: form.description_ru || '', image: imageUrl },
                    en: { name: form.name_en || form.name_uz, description: form.description_en || '', image: imageUrl },
                    tr: { name: form.name_uz, description: form.description_uz || '', image: imageUrl },
                }
            })
            toast.success("Banner muvaffaqiyatli yangilandi!")
            navigate('/banners')
        } catch (err) {
            console.log('DATA:', err.response?.data)
            const msg = err.response?.data?.error?.message || err.message || "Xatolik yuz berdi!"
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = "w-full mt-[8px] p-[10.5px_16px] border border-[#DBDFEA] rounded-[4px] text-[#364A63] text-[14px] leading-[165%] tracking-normal placeholder:text-[#8091A7] focus:outline-none focus:border-[#B79F7C] focus:shadow-[0_0_0_3px_#b79f7c1a] duration-[.2s]"
    const labelStyle = "block text-[#364A63] text-[14px] font-medium leading-[165%] tracking-normal"

    let typeSelectors = [
        {
            label: 'NONE',
            value: '0'
        },
        {
            label: 'INFO',
            value: '1'
        },
        {
            label: 'PRODUCT',
            value: '2'
        },
        {
            label: 'WEB',
            value: '3'
        },
        {
            label: 'KIOSK',
            value: '4'
        },
    ]

    let formSelectors = [
        {
            label: 'Faol',
            value: '1'
        },
        {
            label: 'Faol emas',
            value: '0'
        },
    ]

    if (pageLoading) return (
        <main className="w-full max-w-full p-[32px] flex-1 flex items-center justify-center">
            <div className="w-[40px] h-[40px] border-[3px] border-[#B79F7C] border-t-transparent rounded-full animate-spin" />
        </main>
    )

    return (
        <main className="w-full max-w-full p-[32px] flex-1">
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-[#364A63] text-[28px] font-bold leading-[110%] tracking-[-0.84px]">Banner o’zgartirish</h1>
                    <div className="flex items-center gap-[8px] mt-[8px]">
                        <Link to="/banners" className="text-[#526484] text-[11px] font-medium tracking-[0.8px] uppercase hover:text-[#B79F7C] duration-[.2s]">Bannerlar menyusi</Link>
                        <span className="text-[#526484] text-[11px] select-none">/</span>
                        <span className="text-[#B7C2D0] text-[11px] font-medium tracking-[0.8px] uppercase select-none">O’zgartirish</span>
                    </div>
                </div>
                <button
                    className="flex items-center gap-[8px] py-[8px] px-[18px] border border-[#DBDFEA] rounded-[4px] duration-[.2s] bg-[#FFF] hover:bg-[#f5f6fa]"
                    onClick={() => navigate('/banners')}>
                    <img src={backPointer} alt="Back Pointer" />
                    <span className="text-[#526484] text-[13px] font-bold leading-[20px] tracking-[0.26px]">Ortga</span>
                </button>
            </header>

            <div className="mt-[28px] p-[24px] flex flex-col border border-[#DBDFEA] rounded-[6px] bg-[#FFF]">
                <div className="flex items-center justify-between">
                    <h5 className="text-[#364A63] text-[20px] font-bold leading-[22px] tracking-[-0.2px]">Banner rasmi</h5>

                    <div className="flex items-center gap-[24px]">
                        {['uz', 'ru', 'en'].map(language => (
                            <button key={language} className={`text-[11px] font-bold leading-[100%] tracking-[1.6px] uppercase pb-[8px] border-b-[2px] duration-[.2s] ${lang === language ? 'border-[#B79F7C] text-[#B79F7C]' : 'border-transparent text-[#8091A7]'}`} onClick={() => setLang(language)}>
                                {language === 'uz' ? "O'zbekcha" : language === 'ru' ? 'Русский' : 'English'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-[16px] flex flex-col gap-[32px]">
                    <div>
                        <FileUpload value={image} onChange={setImage} />
                    </div>

                    <div>
                        <h5 className="text-[#364A63] text-[20px] font-bold leading-[22px] tracking-[-0.2px]">Asosiy ma'lumot</h5>

                        <div className="mt-[16px] flex flex-col gap-[16px]">
                            <div>
                                <label className={labelStyle}>Banner nomi</label>
                                <input className={inputStyle} placeholder="Masalan: Aksiya 15%" value={form[`name_${lang}`]} onChange={(e) => setForm(prev => ({ ...prev, [`name_${lang}`]: e.target.value }))} />
                            </div>
                            <div>
                                <label className={labelStyle}>Ma'lumot</label>
                                <textarea className={`${inputStyle} resize-none h-[100px]`} placeholder="Masalan: Ajoyib kuzgi aksiya" value={form[`description_${lang}`]} onChange={(e) => setForm(prev => ({ ...prev, [`description_${lang}`]: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[#364A63] text-[16px] font-bold mb-[16px]">Qo'shimcha</h3>
                        <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
                            <div>
                                <label className={labelStyle}>Turi</label>
                                <CustomSelect
                                    value={form.type}
                                    onChange={(val) => setForm(prev => ({ ...prev, type: val }))}
                                    options={typeSelectors.map(typeSelector => typeSelector)} />
                            </div>

                            <div>
                                <label className={labelStyle}>Holati</label>
                                <CustomSelect
                                    value={form.status}
                                    onChange={(val) => setForm(prev => ({ ...prev, status: val }))}
                                    options={formSelectors.map(formSelector => formSelector)} />
                            </div>

                            <div
                                className="relative"
                                onBlur={(e) => {
                                    if (!e.currentTarget.contains(e.relatedTarget)) setBranchDropdown(false)
                                }}
                                tabIndex={-1}>
                                <label className={labelStyle}>Filial</label>

                                <div
                                    className="min-h-[44px] mt-[8px] p-[10.5px_16px] border border-[#DBDFEA] rounded-[4px] flex flex-wrap gap-[6px] items-center cursor-text duration-[.2s] focus-within:border-[#B79F7C]  focus-within:shadow-[0_0_0_3px_#b79f7c1a]"
                                    onClick={() => setBranchDropdown(true)}>
                                    {form.branches.map(branch => (
                                        <div
                                            key={branch.id}
                                            className="flex items-center gap-[8px] p-[7px_8px] bg-[#E5E9F2] rounded-[4px]">
                                            <button
                                                className="text-[#8091A7]"
                                                onClick={(e) => { e.stopPropagation(); removeBranch(branch.id) }}>
                                                <svg height="14" width="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-8mmkcg">
                                                    <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" />
                                                </svg>
                                            </button>
                                            <span className="text-[#526484] text-[12px] leading-[100%] tracking-normal">{branch.name}</span>
                                        </div>
                                    ))}

                                    <input
                                        className="flex-1 min-w-[100px] text-[13px] text-[#364A63] placeholder:text-[#8091A7] outline-none"
                                        placeholder={form.branches.length === 0 ? "Barcha filiallar" : ""}
                                        value={branchSearch}
                                        onChange={(e) => setBranchSearch(e.target.value)}
                                        onFocus={() => setBranchDropdown(true)} />
                                </div>

                                {branchDropdown && filteredBranches.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 z-50 mt-[4px] bg-white border border-[#DBDFEA] rounded-[4px] shadow-[0_4px_16px_#00000014] max-h-[200px] overflow-y-auto">
                                        {filteredBranches.map(branch => (
                                            <button
                                                key={branch.id}
                                                className="w-full text-left px-[14px] py-[10px] text-[13px] text-[#364A63] hover:bg-[#f5f6fa] duration-[.2s]"
                                                onClick={() => addBranch(branch)}>{branch.name}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {(form.type === '2' || form.type === '3') && (
                                <div>
                                    <label className={labelStyle}>Path (Havola yoki mahsulot ID)</label>
                                    <input
                                        className={inputStyle}
                                        value={form.path}
                                        onChange={(e) => setForm(prev => ({ ...prev, path: e.target.value }))}
                                    />
                                </div>
                            )}

                            {form.type === '4' && (
                                <div>
                                    <label className={labelStyle}>Davomiyligi (sekundda)</label>
                                    <input
                                        className={`${inputStyle} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        type="number"
                                        min="0"
                                        placeholder="Masalan: 5"
                                        value={form.duration || ''}
                                        onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            className="px-[24px] py-[8px] flex items-center justify-between gap-[8px] rounded-[3px] bg-[#B79F7C] text-[#FFF] text-[13px] leading-[20px] tracking-[0.26px] hover:bg-[#a8824a] duration-[.2s] disabled:opacity-60"
                            onClick={handleSubmit}
                            disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="text-[#FFF] text-[13px] leading-[20px] tracking-[0.26px]">Saqlash</span>
                                    <img className="w-[10px]" src={loadingRolling} alt="Loading" />
                                </>
                            ) : 'Saqlash'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
})
