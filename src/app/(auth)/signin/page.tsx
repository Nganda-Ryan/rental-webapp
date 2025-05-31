import React from "react";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { LoginForm } from "@/components/Auth/LoginForm";
const Page = () => {
  return (
    <>
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    </>
  );
}

export default Page;
export const runtime = "edge";