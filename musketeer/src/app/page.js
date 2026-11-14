import Logo from "@/components/brand/Logo";
export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Logo variant="wordmark" style={{ width: "min(60vw, 520px)" }} />
    </main>
  );
}
