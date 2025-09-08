"use client";
import { useEffect, useMemo, useState } from "react";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";

// Import resources statically for production bundling
import en from "../public/locales/en/common.json" assert { type: "json" };
import hi from "../public/locales/hi/common.json" assert { type: "json" };
import ta from "../public/locales/ta/common.json" assert { type: "json" };
import te from "../public/locales/te/common.json" assert { type: "json" };
import bn from "../public/locales/bn/common.json" assert { type: "json" };
import mr from "../public/locales/mr/common.json" assert { type: "json" };
import gu from "../public/locales/gu/common.json" assert { type: "json" };
import pa from "../public/locales/pa/common.json" assert { type: "json" };
import kn from "../public/locales/kn/common.json" assert { type: "json" };
import ml from "../public/locales/ml/common.json" assert { type: "json" };
import or from "../public/locales/or/common.json" assert { type: "json" };
import { initReactI18next } from "react-i18next";

const resources = {
  en: { common: en },
  hi: { common: hi },
  ta: { common: ta },
  te: { common: te },
  bn: { common: bn },
  mr: { common: mr },
  gu: { common: gu },
  pa: { common: pa },
  kn: { common: kn },
  ml: { common: ml },
  or: { common: or },
};

export default function I18nProvider({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!i18next.isInitialized) {
      const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
      i18next
        .use(initReactI18next)
        .init({
          resources,
          lng: saved || "en",
          fallbackLng: "en",
          interpolation: { escapeValue: false },
          defaultNS: "common",
          ns: ["common"],
        })
        .then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  return ready ? <I18nextProvider i18n={i18next}>{children}</I18nextProvider> : null;
}
