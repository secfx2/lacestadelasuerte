import Checkout from "@/components/shop/Checkout";

export const metadata = {
  title: "Checkout",
  description: "Finaliza tu compra en MUSKETEER.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
