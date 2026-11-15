import PageIntro from "@/components/shop/PageIntro";
import AccountForms from "@/components/shop/AccountForms";
import brand from "@/config/brand";

export const metadata = {
  title: "Cuenta",
  description: brand.seo.account,
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
