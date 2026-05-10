"use client";

import {
  Link as LinkIcon,
  Linkedin,
  Twitter,
  Instagram,
  Send,
} from "lucide-react";

type Props = {
  url: string;
  title: string;
};

export default function BlogShare({ url, title }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs text-white/50 mr-2">Share:</span>

      {/* Copy link */}
      <button
        onClick={() => navigator.clipboard.writeText(url)}
        className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 transition"
      >
        <LinkIcon size={14} />
        Copy
      </button>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        className="rounded-md border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
      >
        <Linkedin size={16} />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        className="rounded-md border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
      >
        <Twitter size={16} />
      </a>

      <a
        href="https://www.instagram.com/"
        target="_blank"
        className="rounded-md border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
      >
        <Instagram size={16} />
      </a>

      <a
        href={`https://substack.com/share?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        className="rounded-md border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
      >
        <Send size={16} />
      </a>
    </div>
  );
}
