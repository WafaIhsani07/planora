import type { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

export default function PageWrapper({ children }: PageWrapperProps) {
  return <main className="mx-auto w-full max-w-[1600px] px-6 lg:px-10">{children}</main>;
}