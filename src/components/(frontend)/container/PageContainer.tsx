import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="mx-auto px-4 sm:w-[368px] md:w-[768px] lg:w-[1024px] xl:w-[1200px] 2xl:w-[1400px]">
      {children}
    </div>
  );
};

export default PageContainer;
