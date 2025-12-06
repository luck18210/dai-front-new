import React from 'react'

interface Props {
    children: React.ReactNode;
    className?: string
    outerClassName?: string
}

const GradientBox = ({ children, className, outerClassName }: Props) => {
    return (
        <section className={`${outerClassName} w-[100%] sm:w-[528px] md:w-[100%] z-20 backdrop-blur-md flex items-center justify-center rounded-2xl relative bg-[#171725] font-btn max-w-[905px]`}>
            <div className={`${className} p-4 w-[100%] font-btn flex rounded-2xl items-center flex-col gap-2 border border-gray-600 backdrop-blur-3xl z-20`}>
                {children}
            </div>
            <img src="/images/gradient_box/bottom_ellipse.png" alt="MKC" className="absolute z-0 bottom-0" />
            <img src="/images/gradient_box/top_ellipse.png" alt="MKC" className="absolute z-0 top-0" />
            <img src="/images/gradient_box/left_ellipse.png" alt="MKC" className="absolute z-0 left-0" />
            <img src="/images/gradient_box/right_ellipse.png" alt="MKC" className="absolute z-0 right-0" />
            <img src="/images/gradient_box/bottom_line.png" alt="MKC" className="absolute z-0 bottom-0" />
            <img src="/images/gradient_box/top_line.png" alt="MKC" className="absolute z-0 top-0" />
            <img src="/images/gradient_box/left_line.png" alt="MKC" className="absolute z-0 left-0" />
            <img src="/images/gradient_box/right_line.png" alt="MKC" className="absolute z-0 right-0" />
        </section>
    )
}

export default GradientBox