"use client";

import { useEffect, useRef } from "react";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Remove inline color styles from all elements
      const elementsWithColor = contentRef.current.querySelectorAll("[style]");
      elementsWithColor.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (
          htmlElement.style.color ||
          htmlElement.getAttribute("color") ||
          htmlElement.style.backgroundColor
        ) {
          // Remove color-related inline styles but keep other styles
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
        }

        // Remove color attribute if present
        if (htmlElement.hasAttribute("color")) {
          htmlElement.removeAttribute("color");
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg dark:prose-invert max-w-none mb-12"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
