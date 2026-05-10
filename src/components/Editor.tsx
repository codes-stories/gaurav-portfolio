"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Save,
  Underline,
} from "lucide-react";

type BlogEditorProps = {
  onSave: (data: any) => void;
  initialData?: string;
};

const toolbarButtons = [
  { label: "Bold", command: "bold", icon: Bold },
  { label: "Italic", command: "italic", icon: Italic },
  { label: "Underline", command: "underline", icon: Underline },
  { label: "Heading", command: "formatBlock", value: "h2", icon: Heading2 },
  { label: "Quote", command: "formatBlock", value: "blockquote", icon: Quote },
  { label: "Bullet list", command: "insertUnorderedList", icon: List },
  { label: "Numbered list", command: "insertOrderedList", icon: ListOrdered },
];

const BlogEditor = ({ onSave, initialData }: BlogEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState(initialData || "");

  // Set initial content ONLY when initialData changes
  useEffect(() => {
    if (editorRef.current && initialData !== undefined) {
      editorRef.current.innerHTML = initialData;
      setHtml(initialData);
    }
  }, [initialData]);

  const exec = (command: string, value?: string) => {
    if (typeof window === "undefined") return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const addLink = () => {
    const url = window.prompt("Paste the URL");
    if (!url) return;
    exec("createLink", url);
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    setHtml(editorRef.current.innerHTML);
  };

  const handleSave = () => {
    onSave(html);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/20">
      <div className="border-b border-white/10 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {toolbarButtons.map(({ label, command, value, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => exec(command, value)}
              title={label}
              aria-label={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
            >
              <Icon size={17} />
            </button>
          ))}
          <button
            type="button"
            onClick={addLink}
            title="Add link"
            aria-label="Add link"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
          >
            <Link size={17} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          suppressContentEditableWarning
          data-placeholder="Write the article body here..."
          className="prose prose-invert prose-lg min-h-[360px] max-w-none rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-cyan-300/40 empty:before:pointer-events-none empty:before:text-white/30 empty:before:content-[attr(data-placeholder)]"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            Supports headings, quotes, links, and lists. Content is saved as HTML.
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white"
          >
            <Save size={16} />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
