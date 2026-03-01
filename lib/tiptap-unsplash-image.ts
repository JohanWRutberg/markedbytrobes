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
    let captionClass =
      "text-xs text-muted-foreground mt-2 opacity-70 hover:opacity-100 transition-opacity ";

    // Determine image width class
    const getWidthClass = () => {
      switch (width) {
        case "x-small":
          return "w-32";
        case "small":
          return "w-48";
        case "medium":
          return "w-64";
        case "large":
          return "w-96";
        case "x-large":
          return "w-[512px]";
        case "100%":
          return "w-full";
        default:
          return "w-full";
      }
    };

    if (width === "100%") {
      figureClass += "flex flex-col items-center";
      imgClass += "w-full";
      captionClass += "text-center";
    } else if (align === "left") {
      figureClass += "float-left mr-4 mb-4 inline-block";
      imgClass += getWidthClass();
      captionClass += "text-left";
    } else if (align === "right") {
      figureClass += "float-right ml-4 mb-4 inline-block";
      imgClass += getWidthClass();
      captionClass += "text-right";
    } else {
      // Center alignment
      figureClass += "flex flex-col items-center";
      imgClass += getWidthClass();
      captionClass += "text-center";
    }

    const src = String(HTMLAttributes.src || "");
    const photographer = String(HTMLAttributes.photographer || "Unknown");
    const photographerUrl = String(
      HTMLAttributes.photographerUrl || "https://unsplash.com",
    );

    // Don't render if we don't have a source
    if (!src) {
      return ["div", { class: "my-6" }, "[Image - Missing Source]"];
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
          src: src,
          alt: String(HTMLAttributes.alt || ""),
          class: imgClass,
        },
      ],
      [
        "figcaption",
        {
          class: captionClass,
        },
        "Photo by ",
        [
          "a",
          {
            href: photographerUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "underline hover:text-foreground transition-colors",
          },
          photographer,
        ],
        " on ",
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
