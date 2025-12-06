import React from 'react';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const PageBackground = ({ children, className }: Props) => {
  return (
    <main
      className={`flex w-[100%] min-h-screen font-btn items-center flex-col px-4 bg-[#171725] max-md:bg-contain py-[120px] relative ${className}`} style={{overflow:'hidden'}}>
      <div className=' h-fill-available w-[100%] absolute top-0 left-0 z-0 block md:hidden bg-[url(/images/Vector.svg)] bg-contain' />
      <div className='blur-3xl brightness-75 hidden md:block w-[600px] h-[600px] absolute top-0 left-0 '>
        <img src="/images/ellipse.svg" alt="MKC" className="h-[100%] w-[100%]" />
      </div>
      <img src="/images/top_union.png" alt="MKC" className="absolute top-0 right-0 z-10 md:hidden" />
      <img src="/images/bottom_union.png" alt="MKC" className="absolute top-[50%] left-0 z-10  md:hidden" />
      <img src="/images/top_union.svg" alt="MKC" className="absolute top-0 right-0 z-10 md:h-fill-available hidden md:block" />
      <img src="/images/bottom_union.svg" alt="MKC" className="absolute top-[50%] left-0 z-10  md:h-fill-available hidden md:block" />
      {children}
    </main>
  );
};

export default PageBackground;
