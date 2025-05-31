import React from "react";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { RegisterForm } from "@/components/Auth/RegisterForm";
const Page = () => {
  return (
    <>
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    </>
  );
}

export default Page;
export const runtime = "edge";
