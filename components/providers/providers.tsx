"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Session } from "next-auth";

interface ProvidersProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function Providers(props: ProvidersProps) {
  const { children, session } = props;
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
