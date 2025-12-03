"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { setAccessToken } from "@/lib/auth-token";

interface ProvidersProps {
  session: Session | null;
  children: React.ReactNode;
}

function AuthTokenSync() {
  const { data } = useSession();

  useEffect(() => {
    setAccessToken(data?.access_token ?? null);
  }, [data?.access_token]);

  return null;
}

export default function Providers(props: ProvidersProps) {
  const { children, session } = props;
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <AuthTokenSync />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
