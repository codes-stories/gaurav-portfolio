"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  source: string;
  title: string;
  className?: string;
};

function withAutoHeight(source: string) {
  const resizeScript = `<script>
    (() => {
      const reportHeight = () => {
        const height = Math.max(document.body?.scrollHeight || 0, document.documentElement.scrollHeight);
        window.parent.postMessage({ type: "blog-frame-height", height }, "*");
      };
      new ResizeObserver(reportHeight).observe(document.documentElement);
      window.addEventListener("load", reportHeight);
      setTimeout(reportHeight, 0);
    })();
  <\/script>`;

  return /<\/body\s*>/i.test(source)
    ? source.replace(/<\/body\s*>/i, `${resizeScript}</body>`)
    : `${source}${resizeScript}`;
}

export default function HtmlPostFrame({ source, title, className }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);
  const srcDoc = useMemo(
    () => withAutoHeight(source || "<!doctype html><html><body></body></html>"),
    [source]
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type !== "blog-frame-height" || !Number.isFinite(event.data.height)) return;
      setHeight(Math.max(640, Math.ceil(event.data.height)));
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={frameRef}
      title={title}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className={className}
      style={{ height }}
    />
  );
}
