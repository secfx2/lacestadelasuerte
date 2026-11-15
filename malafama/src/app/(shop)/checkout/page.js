import Checkout from "@/components/shop/Checkout";
import brand from "@/config/brand";

export const metadata = {
  title: "Checkout",
  description: brand.seo.checkout,
  robots: { index: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
