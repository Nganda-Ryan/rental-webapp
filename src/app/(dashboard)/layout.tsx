// import "jsvectormap/dist/jsvectormap.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import { RoleProvider } from "@/store/RoleProvider";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
   <div>
    <RoleProvider>
        <div className={`dark:bg-boxdark-2 dark:text-bodydark min-h-screen bg-blue-sky`}>
            {children}
        </div>
    </RoleProvider>
   </div>
  );
}
