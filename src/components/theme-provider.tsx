"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  // Efeito para lidar com a hidratação
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Renderiza um div vazio até que o componente seja montado no cliente
  // Isso evita problemas de hidratação
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
