'use client';
 
import { ProgressProvider } from '@bprogress/next/app';
 
const BarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="3px"
      color="#5188ff"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
 
export default BarProvider;