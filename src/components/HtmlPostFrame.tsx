"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  source: string;
  title: string;
  className?: string;
};

function ensureDocument(source: string) {
  const trimmed = source.trim();
  if (!trimmed) {
    return "<!doctype html><html><head></head><body></body></html>";
  }
  if (/<!doctype\s+html|<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html { color-scheme: dark; }
      html, body { margin: 0; padding: 0; background: transparent; color: #fff; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; }
      body { padding: 24px; }
      img, svg, video, canvas { max-width: 100%; height: auto; }
      pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      pre { overflow-x: auto; }
      table { border-collapse: collapse; }
    </style>
  </head>
  <body>
${trimmed}
  </body>
</html>`;
}

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
    () => withAutoHeight(ensureDocument(source || "")),
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
      sandbox="allow-scripts allow-same-origin allow-popups"
      className={className}
      style={{ height, width: "100%", border: 0, display: "block", backgroundColor: "transparent" }}
    />
  );
}
