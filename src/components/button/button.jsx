function Button({ children, className = '', onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full px-4 py-2 
                text-[#f9faff] 
                bg-[rgb(104,66,255)] 
                hover:bg-[#8668ff] 
                text-[16px] font-bold 
                rounded-[30px] 
                cursor-pointer
                flex
                items-center
                justify-center
                gap-2
                max-sm:text-[14px]
            ${className}
        `}
        >
            {children}
        </button>
    );
}

export default Button;
