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
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-unsplash-image": "",
        class: "my-6",
      }),
      [
        "img",
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt || "",
          class: "w-full rounded-lg",
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
            attrs: options,
          });
        },
    };
  },
});
