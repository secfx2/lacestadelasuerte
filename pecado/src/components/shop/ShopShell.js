import { slimCatalog } from "@/lib/shop-server";
import { CartProvider } from "./CartProvider";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

/** Shop chrome: announcement bar, header, cart drawer, footer — wrapped in the cart context. */
export default function ShopShell({ children }) {
  return (
    <CartProvider catalog={slimCatalog()}>
      <a href="#main" className="mk-skip">
        Saltar al contenido
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
