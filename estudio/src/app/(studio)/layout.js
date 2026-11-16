import { StudioProvider } from "@/components/Studio";
import AppShell from "@/components/AppShell";

export default function StudioLayout({ children }) {
  return (
    <StudioProvider>
      <AppShell>{children}</AppShell>
    </StudioProvider>
  );
}
