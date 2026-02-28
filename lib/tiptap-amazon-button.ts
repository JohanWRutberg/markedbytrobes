import { Node, mergeAttributes } from "@tiptap/core";

export interface AmazonButtonOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    amazonButton: {
      setAmazonButton: (options: { url: string; text: string }) => ReturnType;
    };
  }
}

export const AmazonButton = Node.create<AmazonButtonOptions>({
  name: "amazonButton",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
      text: {
        default: "Buy on Amazon",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-amazon-button]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-amazon-button": "",
        class: "my-4 text-center",
      }),
      [
        "a",
        {
          href: HTMLAttributes.url,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
          class:
            "inline-block bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl",
        },
        [
          "span",
          {
            class: "flex items-center gap-2",
          },
          [
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              class: "inline",
            },
            [
              "path",
              {
                d: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777z",
              },
            ],
            ["path", { d: "M18.5 16 11 8.5" }],
            ["path", { d: "m8 16 6-6" }],
          ],
          ["span", {}, HTMLAttributes.text || "Buy on Amazon"],
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setAmazonButton:
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
