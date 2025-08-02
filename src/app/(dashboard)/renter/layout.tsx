"use client"
import { PROFILE_RENTER_LIST } from "@/constant";
import "@/css/satoshi.css";
import "@/css/style.css";
import { roleStore } from "@/store/roleStore";
import { useRouter } from "@bprogress/next/app";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { isAuthorized } = roleStore();
    const router = useRouter();
    if (!isAuthorized(PROFILE_RENTER_LIST)) {
      router.push("/unauthorized");
    }
    return (
        <div>
            {children}
        </div>
    );
}
