import { ReactNode, Suspense } from 'react';

export default function PageLoader({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[200px] flex flex-col animate-keyframes-fade-in animate-duration-1000 animate-delay-500 animate-fill-both animate-count-1 items-center justify-center">
          <div className="i-tabler-loader-2 animate-spin text-8xl text-primary-500" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
