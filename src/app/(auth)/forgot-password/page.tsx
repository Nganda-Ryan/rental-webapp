import React from "react";
import { AuthLayout } from "@/components/Layouts/AuthLayout";
import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";

const Page = () => {
  return (
    <>
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}

export default Page;
