import PageIntro from "@/components/shop/PageIntro";
import AccountForms from "@/components/shop/AccountForms";

export const metadata = {
  title: "Cuenta",
  description: "Inicia sesión o crea tu cuenta MUSKETEER.",
  robots: { index: false },
};

export default function CuentaPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: "Cuenta" }]} title="Cuenta" compact />
      <AccountForms />
    </>
  );
}
