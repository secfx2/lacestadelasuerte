"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import SmartImage from "./SmartImage";
import Modal from "./Modal";
import { useCart } from "./CartProvider";
import { IconChevron } from "./Icons";
import { DISCOUNT_CODES, SHIPPING_METHODS, formatPrice, roundMoney } from "@/lib/shop";
import styles from "./Checkout.module.css";

const PROVINCES = [
  "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos", "Cáceres",
  "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva",
  "Huesca", "Jaén", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
  "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia",
  "Valladolid", "Bizkaia", "Zamora", "Zaragoza", "Ceuta", "Melilla",
];
const COUNTRIES = [
  { code: "ES", name: "España" },
  { code: "PT", name: "Portugal" },
  { code: "AD", name: "Andorra" },
];
const PAYMENTS = [
  { id: "tarjeta", name: "Tarjeta de crédito o débito", tags: ["Visa", "Mastercard", "Amex"] },
  { id: "applepay", name: "Apple Pay", tags: [] },
  { id: "paypal", name: "PayPal", tags: [] },
  { id: "bizum", name: "Bizum", tags: [] },
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const digits = (s) => s.replace(/\D/g, "");
function luhn(num) {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}
function cardBrand(num) {
  if (/^4/.test(num)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(num)) return "Mastercard";
  if (/^3[47]/.test(num)) return "Amex";
  return "";
}
function formatCard(v) {
  const d = digits(v).slice(0, 19);
  if (/^3[47]/.test(d)) return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(v) {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

const INITIAL = {
  email: "",
  news: false,
  country: "ES",
  firstName: "",
  lastName: "",
  address: "",
  apt: "",
  postal: "",
  city: "",
  province: "",
  phone: "",
  shipping: "estandar",
  payment: "tarjeta",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
  billingSame: true,
};

function validate(v) {
  const e = {};
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Introduce un correo electrónico válido.";
  if (!v.firstName.trim()) e.firstName = "Introduce tu nombre.";
  if (!v.lastName.trim()) e.lastName = "Introduce tus apellidos.";
  if (v.address.trim().length < 4) e.address = "Introduce una dirección.";
  if (!v.city.trim()) e.city = "Introduce una ciudad.";
  const cp = v.postal.trim();
  if (v.country === "ES" && !/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(cp)) e.postal = "Código postal de 5 cifras.";
  if (v.country === "PT" && !/^\d{4}-?\d{3}$/.test(cp)) e.postal = "Formato 0000-000.";
  if (v.country === "AD" && !/^AD\d{3}$/i.test(cp)) e.postal = "Formato AD000.";
  if (v.country === "ES" && !v.province) e.province = "Selecciona una provincia.";
  if (digits(v.phone).length < 9) e.phone = "Introduce un teléfono de contacto.";
  if (v.payment === "tarjeta") {
    const n = digits(v.cardNumber);
    if (n.length < 15 || !luhn(n)) e.cardNumber = "Número de tarjeta no válido.";
    const m = v.cardExpiry.match(/^(\d{2})\/(\d{2})$/);
    if (!m) e.cardExpiry = "Formato MM/AA.";
    else {
      const mm = Number(m[1]);
      const yy = 2000 + Number(m[2]);
      const now = new Date();
      if (mm < 1 || mm > 12 || yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) e.cardExpiry = "Fecha de caducidad no válida.";
    }
    if (!/^\d{3,4}$/.test(v.cardCvc)) e.cardCvc = "3 o 4 cifras.";
    if (!v.cardName.trim()) e.cardName = "Nombre como aparece en la tarjeta.";
  }
  return e;
}

const ORDER = ["email", "firstName", "lastName", "address", "postal", "city", "province", "phone", "cardNumber", "cardExpiry", "cardCvc", "cardName"];

export default function Checkout() {
  const { ready, lines, subtotal, count } = useCart();
  const [v, setV] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [codeError, setCodeError] = useState("");
  const [demo, setDemo] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const formRef = useRef(null);

  const errors = useMemo(() => validate(v), [v]);
  const show = (k) => (submitted || touched[k]) && errors[k];

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((s) => ({ ...s, [k]: val }));
  };
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const method = SHIPPING_METHODS.find((m) => m.id === v.shipping);
  const discount = applied ? roundMoney(subtotal * DISCOUNT_CODES[applied].rate) : 0;
  const shippingCost = (m) => (m.freeFrom != null && subtotal >= m.freeFrom ? 0 : m.price);
  const shipping = shippingCost(method);
  const total = roundMoney(subtotal - discount + shipping);
  const vat = roundMoney(total - total / 1.21);

  function applyCode(e) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    if (DISCOUNT_CODES[c]) {
      setApplied(c);
      setCodeError("");
      setCode("");
    } else {
      setCodeError("Este código no es válido.");
    }
  }

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const first = ORDER.find((k) => errors[k]);
    if (first) {
      const el = formRef.current?.querySelector(`[name="${first}"]`);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setDemo(true);
  }

  if (!ready) return <div className={styles.loading} aria-busy="true" />;

  if (!lines.length) {
    return (
      <div className={styles.emptyWrap}>
        <p className={styles.emptyTitle}>Tu cesta está vacía.</p>
        <p className={styles.emptyText}>Añade alguna pieza para finalizar la compra.</p>
        <Link href="/tienda" className="mk-btn">
          Ver catálogo
        </Link>
      </div>
    );
  }

  const field = (name, label, props = {}) => (
    <div className={styles.field} data-span={props.span}>
      <label htmlFor={`co-${name}`} className="mk-label">
        {label}
        {props.optional && <span className={styles.optional}> (opcional)</span>}
      </label>
      <input
        id={`co-${name}`}
        name={name}
        className="mk-input"
        value={v[name]}
        onChange={props.onChange || set(name)}
        onBlur={blur(name)}
        aria-invalid={show(name) ? true : undefined}
        aria-describedby={show(name) ? `co-${name}-err` : undefined}
        type={props.type || "text"}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      />
      {props.adornment && <span className={styles.adornment}>{props.adornment}</span>}
      {show(name) && (
        <p id={`co-${name}-err`} className="mk-error">
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderSummary = (p) => (
    <div className={styles.summaryInner}>
      <ul className={styles.items}>
        {lines.map((l) => (
          <li key={l.key} className={styles.item}>
            <span className={styles.thumb}>
              <SmartImage src={l.image} alt="" sizes="72px" className={styles.thumbImg} blend />
              <span className={styles.qtyBadge}>{l.qty}</span>
            </span>
            <span className={styles.itemMeta}>
              <span className={styles.itemName}>{l.product.name}</span>
              <span className={styles.itemVariant}>
                {l.colorObj.name} · {l.size}
              </span>
            </span>
            <span className={styles.itemPrice}>{formatPrice(l.total)}</span>
          </li>
        ))}
      </ul>

      <form className={styles.code} onSubmit={applyCode} noValidate>
        <label htmlFor={`${p}-code`} className="sr-only">
          Código de descuento
        </label>
        <input
          id={`${p}-code`}
          className="mk-input"
          placeholder="Código de descuento"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setCodeError("");
          }}
          aria-invalid={codeError ? true : undefined}
          aria-describedby={codeError ? `${p}-code-err` : undefined}
          autoCapitalize="characters"
        />
        <button type="submit" className="mk-btn mk-btn--ghost" disabled={!code.trim()}>
          Aplicar
        </button>
      </form>
      {codeError && (
        <p id={`${p}-code-err`} className="mk-error" role="alert">
          {codeError}
        </p>
      )}
      {applied && (
        <p className={styles.applied}>
          <span>{DISCOUNT_CODES[applied].label}</span>
          <button type="button" onClick={() => setApplied(null)} className="mk-link mk-link--on">
            Quitar
          </button>
        </p>
      )}

      <dl className={styles.totals}>
        <div>
          <dt>Subtotal · {count} {count === 1 ? "artículo" : "artículos"}</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {applied && (
          <div>
            <dt>Descuento</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div>
          <dt>Envío · {method.name}</dt>
          <dd>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</dd>
        </div>
        <div className={styles.grand}>
          <dt>Total</dt>
          <dd>
            <small>EUR</small> {formatPrice(total)}
          </dd>
        </div>
      </dl>
      <p className={styles.vat}>Incluye {formatPrice(vat)} de IVA</p>
    </div>
  );

  return (
    <>
      <div className={styles.checkout}>
        {/* Mobile summary toggle */}
        <div className={styles.mobileSummary}>
          <button type="button" className={styles.summaryToggle} aria-expanded={summaryOpen} aria-controls="co-summary-m" onClick={() => setSummaryOpen((o) => !o)}>
            <span>
              {summaryOpen ? "Ocultar" : "Mostrar"} resumen del pedido <IconChevron dir={summaryOpen ? "up" : "down"} />
            </span>
            <strong>{formatPrice(total)}</strong>
          </button>
          <div id="co-summary-m" className={styles.mobileSummaryBody} data-open={summaryOpen || undefined} inert={!summaryOpen ? true : undefined}>
            <div>{renderSummary("m")}</div>
          </div>
        </div>

        <div className={styles.main}>
          <section className={styles.express} aria-label="Pago exprés">
            <p className={styles.expressTitle}>Pago exprés</p>
            <div className={styles.expressBtns}>
              <button type="button" className={styles.expressBtn} data-kind="apple" onClick={() => setDemo(true)}>
                Apple Pay
              </button>
              <button type="button" className={styles.expressBtn} data-kind="paypal" onClick={() => setDemo(true)}>
                PayPal
              </button>
              <button type="button" className={styles.expressBtn} data-kind="bizum" onClick={() => setDemo(true)}>
                Bizum
              </button>
            </div>
            <p className={styles.or}>
              <span>o</span>
            </p>
          </section>

          <form ref={formRef} onSubmit={submit} noValidate className={styles.form}>
            {submitted && Object.keys(errors).length > 0 && (
              <div className={styles.alert} role="alert">
                Revisa los campos marcados para continuar.
              </div>
            )}

            <fieldset className={styles.section}>
              <div className={styles.sectionHead}>
                <legend className={styles.legend}>Contacto</legend>
                <Link href="/cuenta" className="mk-link mk-link--on">
                  Iniciar sesión
                </Link>
              </div>
              <div className={styles.grid}>
                {field("email", "Correo electrónico", { type: "email", autoComplete: "email", inputMode: "email", span: 2, placeholder: "tu@correo.com" })}
              </div>
              <label className={`mk-check ${styles.check}`}>
                <input type="checkbox" checked={v.news} onChange={set("news")} />
                <span>Quiero recibir la carta del regimiento (novedades y reposiciones).</span>
              </label>
            </fieldset>

            <fieldset className={styles.section}>
              <legend className={styles.legend}>Entrega</legend>
              <div className={styles.grid}>
                <div className={styles.field} data-span="2">
                  <label htmlFor="co-country" className="mk-label">
                    País / región
                  </label>
                  <select id="co-country" name="country" className="mk-select" value={v.country} onChange={set("country")} autoComplete="country">
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {field("firstName", "Nombre", { autoComplete: "given-name" })}
                {field("lastName", "Apellidos", { autoComplete: "family-name" })}
                {field("address", "Dirección", { autoComplete: "address-line1", span: 2, placeholder: "Calle y número" })}
                {field("apt", "Piso, puerta, escalera", { autoComplete: "address-line2", span: 2, optional: true })}
                <div className={styles.row3} data-span="2">
                  {field("postal", "Código postal", { autoComplete: "postal-code", inputMode: v.country === "AD" ? "text" : "numeric", maxLength: 8 })}
                  {field("city", "Ciudad", { autoComplete: "address-level2" })}
                  {v.country === "ES" && (
                    <div className={styles.field}>
                      <label htmlFor="co-province" className="mk-label">
                        Provincia
                      </label>
                      <select
                        id="co-province"
                        name="province"
                        className="mk-select"
                        value={v.province}
                        onChange={set("province")}
                        onBlur={blur("province")}
                        aria-invalid={show("province") ? true : undefined}
                        aria-describedby={show("province") ? "co-province-err" : undefined}
                        autoComplete="address-level1"
                      >
                        <option value="">Selecciona</option>
                        {PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {show("province") && (
                        <p id="co-province-err" className="mk-error">
                          {errors.province}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {field("phone", "Teléfono", { type: "tel", autoComplete: "tel", inputMode: "tel", span: 2, placeholder: "+34 600 000 000" })}
              </div>
            </fieldset>

            <fieldset className={styles.section}>
              <legend className={styles.legend}>Método de envío</legend>
              <div className={styles.options}>
                {SHIPPING_METHODS.map((m) => {
                  const cost = shippingCost(m);
                  return (
                    <label key={m.id} className={styles.option} data-checked={v.shipping === m.id || undefined}>
                      <span className="mk-check">
                        <input type="radio" name="shipping" value={m.id} checked={v.shipping === m.id} onChange={set("shipping")} />
                      </span>
                      <span className={styles.optionText}>
                        <span className={styles.optionName}>{m.name}</span>
                        <span className={styles.optionSub}>
                          {m.eta}
                          {m.freeFrom != null && cost > 0 ? ` · gratis desde ${formatPrice(m.freeFrom)}` : ""}
                        </span>
                      </span>
                      <span className={styles.optionPrice}>{cost === 0 ? "Gratis" : formatPrice(cost)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className={styles.section}>
              <legend className={styles.legend}>Pago</legend>
              <p className={styles.sectionNote}>Todas las transacciones son seguras y están cifradas.</p>
              <div className={styles.options} data-stack>
                {PAYMENTS.map((p) => (
                  <div key={p.id} className={styles.payment} data-checked={v.payment === p.id || undefined}>
                    <label className={styles.option}>
                      <span className="mk-check">
                        <input type="radio" name="payment" value={p.id} checked={v.payment === p.id} onChange={set("payment")} />
                      </span>
                      <span className={styles.optionText}>
                        <span className={styles.optionName}>{p.name}</span>
                      </span>
                      <span className={styles.tags}>
                        {(p.tags.length ? p.tags : [p.name]).map((t) => (
                          <span key={t} className={styles.tag}>
                            {t}
                          </span>
                        ))}
                      </span>
                    </label>
                    {v.payment === p.id && (
                      <div className={styles.paymentBody}>
                        {p.id === "tarjeta" ? (
                          <div className={styles.grid}>
                            {field("cardNumber", "Número de tarjeta", {
                              span: 2,
                              inputMode: "numeric",
                              autoComplete: "cc-number",
                              placeholder: "1234 5678 9012 3456",
                              onChange: (e) => setV((s) => ({ ...s, cardNumber: formatCard(e.target.value) })),
                              adornment: cardBrand(digits(v.cardNumber)),
                            })}
                            {field("cardExpiry", "Caducidad (MM/AA)", {
                              inputMode: "numeric",
                              autoComplete: "cc-exp",
                              placeholder: "MM/AA",
                              onChange: (e) => setV((s) => ({ ...s, cardExpiry: formatExpiry(e.target.value) })),
                            })}
                            {field("cardCvc", "CVC", {
                              inputMode: "numeric",
                              autoComplete: "cc-csc",
                              placeholder: "CVC",
                              maxLength: 4,
                              onChange: (e) => setV((s) => ({ ...s, cardCvc: digits(e.target.value).slice(0, 4) })),
                            })}
                            {field("cardName", "Nombre del titular", { span: 2, autoComplete: "cc-name" })}
                          </div>
                        ) : (
                          <p className={styles.redirect}>
                            {p.id === "bizum"
                              ? "Tras pulsar «Pagar» confirmarás el pago en la app de tu banco con el teléfono indicado."
                              : `Tras pulsar «Pagar» se abrirá ${p.name} para completar la compra de forma segura.`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <label className={`mk-check ${styles.check}`}>
                <input type="checkbox" checked={v.billingSame} onChange={set("billingSame")} />
                <span>Usar la dirección de entrega como dirección de facturación</span>
              </label>
            </fieldset>

            <button type="submit" className={`mk-btn mk-btn--block ${styles.pay}`}>
              Pagar {formatPrice(total)}
            </button>
            <p className={styles.legal}>
              Al realizar el pedido aceptas las <Link href="/legal" className="mk-link mk-link--on">condiciones de venta</Link> y la{" "}
              <Link href="/legal#privacidad" className="mk-link mk-link--on">política de privacidad</Link>. Devoluciones gratuitas en 30 días.
            </p>
          </form>
        </div>

        <aside className={styles.summary} aria-label="Resumen del pedido">
          {renderSummary("d")}
        </aside>
      </div>

      <Modal
        open={demo}
        onClose={() => setDemo(false)}
        eyebrow="MUSKETEER"
        title="Modo demostración"
        size="sm"
        footer={
          <>
            <button type="button" className="mk-btn" onClick={() => setDemo(false)} data-autofocus>
              Volver al pedido
            </button>
            <Link href="/tienda" className="mk-btn mk-btn--ghost">
              Seguir comprando
            </Link>
          </>
        }
      >
        <p className={styles.demoText}>Los pagos están desactivados. Ningún cargo ha sido realizado.</p>
        <p className={styles.demoSub}>
          Esta tienda es una demostración del catálogo MUSKETEER. Tu cesta se conserva intacta. <em>Tous pour un.</em>
        </p>
      </Modal>
    </>
  );
}
