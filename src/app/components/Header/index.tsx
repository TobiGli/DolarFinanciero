"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  function refresh() {
    setLoading(true);
    window.location.reload();
  }

  return <header className="site-head"><div className="wrap site-head__inner"><Link className="brand" href="/"><span className="brand__mark">US$</span><span className="brand__name">DolarFinanciero</span></Link><nav className="site-head__nav" aria-label="Navegación principal"><Link className={pathname === "/" ? "is-active" : ""} href="/">Cotizaciones</Link><Link className={pathname.startsWith("/uva") ? "is-active" : ""} href="/uva">UVA</Link></nav><div className="site-head__meta"><time dateTime={new Date().toISOString()}>{new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</time><button className={`refresh-btn${loading ? " is-loading" : ""}`} type="button" onClick={refresh} aria-label="Actualizar cotizaciones"><span aria-hidden="true">↻</span><span>Actualizar</span></button></div></div></header>;
}

export default Header;
