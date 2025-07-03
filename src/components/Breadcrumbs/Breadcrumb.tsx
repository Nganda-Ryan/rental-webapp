"use client"
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from '@bprogress/next/app'
import { useEffect, useState, ReactElement } from "react";

interface BreadcrumbProps {
  pageName: string;
  previousPage?: boolean;
}

const Breadcrumb = ({ pageName, previousPage }: BreadcrumbProps) => {
  const [pathElements, setPathElements] = useState<ReactElement<any>[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Cette fonction sera exécutée chaque fois que l'URL change
    const generatePaths = () => {
      const paths = pathname.split('/').filter(Boolean);
      const currentPath = paths[paths.length - 1];
      
      // Créons un tableau temporaire pour stocker les éléments non-null
      const elements: ReactElement<any>[] = [];
      
      paths.forEach((path, index) => {
        if (index === 0) {
          elements.push(
            <li key={`path-${index}`} className={clsx("hover:text-indigo-500 hover:font-black",
              path === currentPath ? 'text-indigo-500' : ''
            )}>
              <Link className="font-medium" href={`/${path}`}>
                {path[0].toUpperCase() + path.slice(1)}
              </Link>
            </li>
          );
        } 
        else if (index > 0) {
          let strPath = '';
          for (let i = 0; i <= index; i++) {
            strPath += paths[i] + '/';
          }
          strPath = strPath.slice(0, -1);
          
          elements.push(
            <li key={`path-${index}`} className={clsx("hover:text-indigo-500 hover:font-black",
              path === currentPath ? 'text-indigo-500' : ''
            )}>
              <Link className="font-medium" href={`/${strPath}`}>
                / {path[0].toUpperCase() + path.slice(1)}
              </Link>
            </li>
          );
        }
      });
      
      // Maintenant nous pouvons mettre à jour l'état avec un tableau qui ne contient que des ReactElement
      setPathElements(elements);
    };
    
    generatePaths();
  }, [pathname]); // Dépendance au chemin d'URL
  
  return (
    <div className="mb-5 md:mb-7 flex gap-3 sm:flex-row items-end justify-between flex-wrap">
      <div className="flex flex-nowrap gap-3 justify-center items-center">
        { previousPage && <span className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowLeft size={24} onClick={() => router.back()} className=""/></span>}
        <h1 className="text-xl md:text-2xl font-bold">{pageName}</h1>
      </div>
      {/* <nav className="hidden md:inline">
        <ol className="flex items-center gap-2 max-w-[95vw]">
          {pathElements}
        </ol>
      </nav> */}
    </div>
  );
};

export default Breadcrumb;