import Image from "@tiptap/extension-image";

export interface EnhancedImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
}

export const EnhancedImage = Image.extend<EnhancedImageOptions>({
  name: "image", // Use same name for compatibility

  parseHTML() {
    return [
      {
        tag: "span[data-image-wrapper] img",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const wrapper = node.parentElement;
          const src = node.getAttribute("src");
          if (!src) return false;

          return {
            src: src,
            alt: node.getAttribute("alt") || "",
            title: node.getAttribute("title") || "",
            width: wrapper?.getAttribute("data-width") || "100%",
            align: wrapper?.getAttribute("data-align") || "center",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const src = node.getAttribute("src");
          if (!src) return false;

          return {
            src: src,
            alt: node.getAttribute("alt") || "",
            title: node.getAttribute("title") || "",
            width: "100%",
            align: "center",
          };
        },
      },
    ];
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("data-width"),
        renderHTML: (attributes) => {
          return {
            "data-width": attributes.width,
          };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes) => {
          return {
            "data-align": attributes.align,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes["data-width"] || "100%";
    const align = HTMLAttributes["data-align"] || "center";

    // Determine wrapper styles based on alignment and width
    let wrapperClass = "my-4 ";
    let imgClass = "rounded-lg ";

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
      wrapperClass += "flex justify-center";
      imgClass += "w-full";
    } else if (align === "left") {
      wrapperClass += "float-left mr-4 mb-4";
      imgClass += getWidthClass();
    } else if (align === "right") {
      wrapperClass += "float-right ml-4 mb-4";
      imgClass += getWidthClass();
    } else {
      wrapperClass += "flex justify-center";
      imgClass += getWidthClass();
    }

    // Extract img attributes (remove data- attributes) and ensure valid values
    const imgAttrs: Record<string, string> = {};
    Object.keys(HTMLAttributes).forEach((key) => {
      if (!key.startsWith("data-") && HTMLAttributes[key] != null) {
        imgAttrs[key] = String(HTMLAttributes[key]);
      }
    });

    // Ensure we have a src attribute
    if (!imgAttrs.src) {
      return ["span", { class: "my-4" }, "[Image - Missing Source]"];
    }

    return [
      "span",
      {
        class: wrapperClass,
        "data-image-wrapper": "",
        "data-width": width,
        "data-align": align,
      },
      [
        "img",
        {
          ...imgAttrs,
          class: imgClass,
        },
      ],
    ];
  },

  addCommands() {
    return {
      setImage:
        (options: {
          src: string;
          alt?: string;
          title?: string;
          width?: string;
          align?: string;
        }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt || "",
              title: options.title || "",
              width: options.width || "100%",
              align: options.align || "center",
            },
          });
        },
    };
  },
});
