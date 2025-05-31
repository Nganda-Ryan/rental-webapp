import React from "react";
interface AuthLayoutProps {
  children: React.ReactNode;
}
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="min-h-screen w-full flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-blue-950/30" />
        </div>
      </div>
      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 pt-10 bg-gray-50">
        {children}
      </div>
    </main>
  );
};
