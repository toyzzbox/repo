import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-full min-w-[320px] px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1260px] mx-auto overflow-x-hidden">
      {children}
    </div>
  );
};

export default PageContainer;