import { Node, mergeAttributes } from "@tiptap/core";

export interface UnsplashImageOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    unsplashImage: {
      setUnsplashImage: (options: {
        src: string;
        photographer: string;
        photographerUrl: string;
        alt?: string;
        width?: string;
        align?: string;
      }) => ReturnType;
    };
  }
}

export const UnsplashImage = Node.create<UnsplashImageOptions>({
  name: "unsplashImage",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      photographer: {
        default: null,
      },
      photographerUrl: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: "100%",
      },
      align: {
        default: "center",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-unsplash-image]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || "100%";
    const align = HTMLAttributes.align || "center";

    let figureClass = "my-6 ";
    let imgClass = "rounded-lg ";

    if (width === "100%") {
      figureClass += "flex flex-col items-center";
      imgClass += "w-full";
    } else if (align === "left") {
      figureClass += "float-left mr-4 mb-4 max-w-sm";
      imgClass +=
        width === "small" ? "w-48" : width === "medium" ? "w-64" : "w-96";
    } else if (align === "right") {
      figureClass += "float-right ml-4 mb-4 max-w-sm";
      imgClass +=
        width === "small" ? "w-48" : width === "medium" ? "w-64" : "w-96";
    } else {
      figureClass += "flex flex-col items-center";
      imgClass +=
        width === "small"
          ? "w-48"
          : width === "medium"
            ? "w-64"
            : width === "large"
              ? "w-96"
              : "w-full";
    }

    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-unsplash-image": "",
        class: figureClass,
      }),
      [
        "img",
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt || "",
          class: imgClass,
        },
      ],
      [
        "figcaption",
        {
          class:
            "text-xs text-muted-foreground mt-2 text-right opacity-70 hover:opacity-100 transition-opacity",
        },
        ["span", {}, "Photo by "],
        [
          "a",
          {
            href: HTMLAttributes.photographerUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "underline hover:text-foreground transition-colors",
          },
          HTMLAttributes.photographer,
        ],
        ["span", {}, " on "],
        [
          "a",
          {
            href: "https://unsplash.com",
            target: "_blank",
            rel: "noopener noreferrer",
            class: "underline hover:text-foreground transition-colors",
          },
          "Unsplash",
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setUnsplashImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              ...options,
              width: options.width || "100%",
              align: options.align || "center",
            },
          });
        },
    };
  },
});
