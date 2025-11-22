"use client"; 
import { useEffect } from "react";

export default function HideNextDevIndicator() {
  useEffect(() => {
    const interval = setInterval(() => {
      const shadowHosts = document.querySelectorAll("body > div");
      shadowHosts.forEach((host) => {
        if (host.shadowRoot) {
          const devIndicator = host.shadowRoot.querySelector("div[data-next-dev-indicator]");
          if (devIndicator) {
            (devIndicator as HTMLElement).style.display = "none";
          }
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}
