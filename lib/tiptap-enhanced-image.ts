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
        tag: "span[data-image-wrapper]",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const img = node.querySelector("img");
          if (!img) return false;
          const src = img.getAttribute("src");
          if (!src) return false;

          return {
            src: src,
            alt: img.getAttribute("alt") || "",
            title: img.getAttribute("title") || "",
            width: node.getAttribute("data-width") || "100%",
            align: node.getAttribute("data-align") || "center",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          // Skip if this img is inside a data-image-wrapper
          if (node.parentElement?.hasAttribute("data-image-wrapper")) {
            return false;
          }
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
          return "w-40"; // 160px
        case "small":
          return "w-64"; // 256px
        case "medium":
          return "w-96"; // 384px
        case "large":
          return "w-[512px]"; // 512px
        case "x-large":
          return "w-[700px]"; // 700px - almost full width
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
      wrapperClass += "float-left mr-6 mb-6";
      imgClass += getWidthClass();
    } else if (align === "right") {
      wrapperClass += "float-right ml-6 mb-6";
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
