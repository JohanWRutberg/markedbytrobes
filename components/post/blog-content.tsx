"use client";

import { useEffect, useState } from "react";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const [cleanedContent, setCleanedContent] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Remove inline color styles from content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const elementsWithStyle = doc.querySelectorAll("[style]");
    elementsWithStyle.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const currentStyle = htmlElement.getAttribute("style") || "";
      const newStyle = currentStyle
        .split(";")
        .filter((style) => {
          const trimmed = style.trim().toLowerCase();
          return (
            !trimmed.startsWith("color:") &&
            !trimmed.startsWith("background-color:")
          );
        })
        .join(";");

      if (newStyle) {
        htmlElement.setAttribute("style", newStyle);
      } else {
        htmlElement.removeAttribute("style");
      }
    });

    // Remove color attributes
    const elementsWithColor = doc.querySelectorAll("[color]");
    elementsWithColor.forEach((element) => {
      element.removeAttribute("color");
    });

    setCleanedContent(doc.body.innerHTML);
  }, [content]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div style={{ minHeight: "200px" }} />
      </div>
    );
  }

  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none mb-12"
      dangerouslySetInnerHTML={{ __html: cleanedContent }}
    />
  );
}
