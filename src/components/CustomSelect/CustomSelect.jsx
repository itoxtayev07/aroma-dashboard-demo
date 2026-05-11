import { useState, memo } from "react";

import pointer from '../../assets/user-pointer.svg'

export const CustomSelect = memo(function CustomSelect({ value, onChange, options, placeholder }) {
    const [open, setOpen] = useState(false)
    const selected = options.find(option => option.value === value)

    return (
        <div className="mt-[8px] relative" onBlur={() => setOpen(false)}>
            <button
                className={`w-full p-[10.5px_16px] pr-[17px] flex items-center justify-between gap-[8px] border rounded-[4px]  text-[#364A63] text-[14px] leading-[165%] tracking-normal duration-[.2s] ${open ? 'border-[#B79F7C] shadow-[0_0_0_3px_#b79f7c1a]' : 'border-[#DBDFEA]'}`}
                onClick={() => setOpen(!open)}>
                <span className={selected ? 'text-[#364A63]' : 'text-[#8091A7]'}>
                    {selected ? selected.label : placeholder}
                </span>
                <img src={pointer} alt="Pointer" className={`duration-[.2s] ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white border border-[#DBDFEA] rounded-[4px] shadow-[0_4px_16px_#00000014] overflow-hidden">
                    {options.map(option => (
                        <button
                            key={option.value}
                            className={`w-full text-left px-[14px] py-[10px]  text-[#364A63] text-[14px] leading-[165%] tracking-normal duration-[.2s] hover:bg-[#f8f6f2] ${value === option.value ? 'bg-[#f5f6fa] text-[#B79F7C] font-medium' : 'text-[#364A63]'}`}
                            onClick={() => {
                                onChange(option.value)
                                setOpen(false)
                            }}>
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
})