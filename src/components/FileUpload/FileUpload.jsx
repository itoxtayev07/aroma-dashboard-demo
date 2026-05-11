import { useState, useRef, useCallback, memo } from "react"
import { createPortal } from "react-dom"
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export const FileUpload = memo(function FileUpload({ value, onChange, fieldW = 16, fieldH = 6 }) {
    const [isDragging, setIsDragging] = useState(false)
    const [modalPreview, setModalPreview] = useState()
    const [modalFile, setModalFile] = useState()
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const inputRef = useRef()
    const imgRef = useRef()

    const handleFiles = (newFiles) => {
        const file = Array.from(newFiles)[0]
        if (!file || !file.type.startsWith("image/")) return
        const url = URL.createObjectURL(file)
        setModalFile(file)
        setModalPreview(url)
        setCrop(undefined)
        setCompletedCrop(undefined)
    }

    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget

        const initialCrop = centerCrop(
            makeAspectCrop({ unit: '%', width: 100 }, (fieldW || 16) / (fieldH || 6), width, height),
            width, height
        )
        setCrop(initialCrop)
    }, [])

    const getCroppedImg = useCallback(() => {
        return new Promise((resolve) => {
            const image = imgRef.current
            const canvas = document.createElement('canvas')
            const scaleX = image.naturalWidth / image.width
            const scaleY = image.naturalHeight / image.height

            const pixelCrop = completedCrop || crop
            if (!pixelCrop) {
                resolve(modalFile)
                return
            }

            canvas.width = pixelCrop.width * scaleX
            canvas.height = pixelCrop.height * scaleY
            const ctx = canvas.getContext('2d')

            ctx.drawImage(
                image,
                pixelCrop.x * scaleX,
                pixelCrop.y * scaleY,
                pixelCrop.width * scaleX,
                pixelCrop.height * scaleY,
                0, 0,
                canvas.width,
                canvas.height
            )

            canvas.toBlob((blob) => {
                const croppedFile = new File([blob], modalFile.name, { type: modalFile.type })
                resolve(croppedFile)
            }, modalFile.type, 0.95)
        })
    }, [completedCrop, crop, modalFile])

    const handleSave = async () => {
        const croppedFile = await getCroppedImg()
        const preview = URL.createObjectURL(croppedFile)
        onChange({ file: croppedFile, preview })
        setModalFile(null)
        setModalPreview(null)
    }

    const handleCancel = () => {
        setModalFile(null)
        setModalPreview(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
    const handleDragLeave = () => setIsDragging(false)
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }
    const handleChange = (e) => handleFiles(e.target.files)

    return (
        <div className="w-full">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

            {value ? (
                <div
                    className="w-full h-[400px] p-[35px_30px] flex justify-center items-center rounded-[6px] overflow-hidden cursor-pointer group border-[2px] border-dashed border-[#DBDFEA]"
                    onClick={() => inputRef.current.click()}>
                    <div className="w-full h-[307px] relative flex justify-center items-center">
                        <img src={value.preview || value} alt="Banner" className="w-[820px] object-cover" />
                        <div className="w-full h-full absolute bg-[#ffffff00] backdrop-blur-[7px] flex items-center justify-center opacity-0 group-hover:opacity-100 duration-[.2s]">
                            <span className="relative z-10 px-[20px] py-[10px] bg-[#B79F7C]/80 text-white text-[13px] font-medium rounded-[6px]">
                                Rasmni o'zgartirish
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-[59.3px_20px] flex flex-col items-center justify-center border-[2px] border-dashed rounded-[4px] cursor-pointer duration-[.2s] ${isDragging ? "border-[#B79F7C] bg-[#b79f7c0d]" : "border-[#DBDFEA] bg-white hover:border-[#B79F7C] hover:bg-[#b79f7c0d]"}`}>
                    <p className="text-[#8091A7] text-[13px] leading-[16px] tracking-normal">Olib kelib tashlang</p>
                    <p className="text-[#8091A7] text-[16px] leading-[165%] tracking-normal">yoki</p>
                    <button
                        className="mt-[4px] p-[8px_18px] text-[#FFF] text-[13px] font-bold leading-[20px] tracking-[0.26px] uppercase bg-[#B79F7C] rounded-[3px] hover:bg-[#a8824a] duration-[.2s]"
                        onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}>
                        Faylni tanlang
                    </button>
                </div>
            )}

            {modalPreview && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-[8px] w-full max-w-[520px] mx-[16px] overflow-hidden">
                        <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#DBDFEA]">
                            <h2 className="text-[#364A63] text-[15px] font-bold">Rasmni kesib oling</h2>
                            <button type="button" onClick={handleCancel} className="text-[#8091A7] hover:text-[#526484] duration-[.2s]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-[16px] bg-[#F5F6FA] flex items-center justify-center max-h-[360px] overflow-auto">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={(fieldW || 16) / (fieldH || 6)}
                                minWidth={474}>
                                <img
                                    ref={imgRef}
                                    src={modalPreview}
                                    alt="preview"
                                    onLoad={onImageLoad}
                                    className="max-w-full max-h-[320px] object-contain rounded-[4px]" />
                            </ReactCrop>
                        </div>

                        <div className="flex gap-[12px] px-[20px] py-[16px] border-t border-[#DBDFEA]">
                            <button type="button" onClick={handleCancel} className="flex-1 py-[8px] text-[13px] text-[#526484] border border-[#DBDFEA] rounded-[4px] hover:bg-[#f5f6fa] duration-[.2s]">
                                Bekor qilish
                            </button>
                            <button type="button" onClick={handleSave} className="flex-1 py-[8px] text-[13px] text-white bg-[#B79F7C] rounded-[4px] hover:bg-[#a8824a] duration-[.2s] font-medium">
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>, document.body
            )}
        </div>
    )
})
