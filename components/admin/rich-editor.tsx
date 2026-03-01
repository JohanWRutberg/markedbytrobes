"use client";
import { useState, useRef } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HardBreak from "@tiptap/extension-hard-break";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { AmazonButton } from "@/lib/tiptap-amazon-button";
import { UnsplashImage } from "@/lib/tiptap-unsplash-image";
import { EnhancedImage } from "@/lib/tiptap-enhanced-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Quote,
  Code,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RemoveFormatting,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Upload,
  Link2,
  Search,
  Loader2,
  ShoppingCart,
  CornerDownLeft,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
}
export function RichEditor({ content, onChange }: RichEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [amazonDialogOpen, setAmazonDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [amazonUrl, setAmazonUrl] = useState("");
  const [amazonText, setAmazonText] = useState("Buy on Amazon");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [unsplashPage, setUnsplashPage] = useState(1);
  const [hasMoreImages, setHasMoreImages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [imageWidth, setImageWidth] = useState("100%");
  const [imageAlign, setImageAlign] = useState("center");
  const [errorAlert, setErrorAlert] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const [unsplashImages, setUnsplashImages] = useState<
    Array<{
      id: string;
      url: string;
      thumb: string;
      description: string;
      photographer: string;
      photographerUrl: string;
      downloadUrl: string;
    }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false, // We'll use our custom HardBreak
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            "Shift-Enter": () => this.editor.commands.setHardBreak(),
          };
        },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      EnhancedImage,
      UnsplashImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300",
        },
      }),
      AmazonButton,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      FontFamily,
      Youtube.configure({ width: 640, height: 360 }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none min-h-[400px] focus:outline-none p-4 border rounded-lg bg-background text-foreground",
      },
    },
  });
  if (!editor) {
    return null;
  }
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }
      const data = await response.json();
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: data.url,
          width: imageWidth,
          align: imageAlign,
        },
      });
      setImageDialogOpen(false);
      setImageWidth("100%");
      setImageAlign("center");
    } catch (error) {
      console.error("Upload error:", error);
      setErrorAlert({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to upload image",
      });
    } finally {
      setUploading(false);
    }
  };
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src: urlInput.trim(),
          width: imageWidth,
          align: imageAlign,
        },
      });
      setImageDialogOpen(false);
      setUrlInput("");
      setImageWidth("100%");
      setImageAlign("center");
    }
  };
  const searchUnsplash = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setUnsplashPage(1);
    try {
      const response = await fetch(
        `/api/unsplash?q=${encodeURIComponent(searchQuery)}&per_page=12&page=1`,
      );
      if (!response.ok) {
        throw new Error("Failed to search images");
      }
      const data = await response.json();
      setUnsplashImages(data.images);
      setHasMoreImages(data.images.length === 12);
    } catch (error) {
      console.error("Search error:", error);
      setErrorAlert({
        open: true,
        message: "Failed to search images",
      });
    } finally {
      setSearching(false);
    }
  };

  const loadMoreImages = async () => {
    if (!searchQuery.trim() || loadingMore || !hasMoreImages) return;
    setLoadingMore(true);
    const nextPage = unsplashPage + 1;
    try {
      const response = await fetch(
        `/api/unsplash?q=${encodeURIComponent(searchQuery)}&per_page=12&page=${nextPage}`,
      );
      if (!response.ok) {
        throw new Error("Failed to load more images");
      }
      const data = await response.json();
      setUnsplashImages((prev) => [...prev, ...data.images]);
      setUnsplashPage(nextPage);
      setHasMoreImages(data.images.length === 12);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoadingMore(false);
    }
  };
  const selectUnsplashImage = (image: {
    url: string;
    photographer: string;
    photographerUrl: string;
    description: string;
  }) => {
    editor
      .chain()
      .focus()
      .setUnsplashImage({
        src: image.url,
        photographer: image.photographer,
        photographerUrl: image.photographerUrl,
        alt: image.description || "Unsplash image",
        width: imageWidth,
        align: imageAlign,
      })
      .run();
    setImageDialogOpen(false);
    setSearchQuery("");
    setUnsplashImages([]);
    setUnsplashPage(1);
    setHasMoreImages(false);
    setImageWidth("100%");
    setImageAlign("center");
  };
  const addImage = () => {
    setImageDialogOpen(true);
  };
  const addYoutube = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };
  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkDialogOpen(false);
      setLinkUrl("");
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const setAmazonButton = () => {
    if (amazonUrl) {
      editor.commands.setAmazonButton({
        url: amazonUrl,
        text: amazonText || "Buy on Amazon",
      });
      setAmazonDialogOpen(false);
      setAmazonUrl("");
      setAmazonText("Buy on Amazon");
    }
  };

  const updateImageSize = (size: string) => {
    if (!editor) return;
    if (editor.isActive("image")) {
      editor.commands.updateAttributes("image", { width: size });
    } else if (editor.isActive("unsplashImage")) {
      editor.commands.updateAttributes("unsplashImage", { width: size });
    }
  };

  const updateImageAlign = (align: string) => {
    if (!editor) return;
    if (editor.isActive("image")) {
      editor.commands.updateAttributes("image", { align: align });
    } else if (editor.isActive("unsplashImage")) {
      editor.commands.updateAttributes("unsplashImage", { align: align });
    }
  };

  return (
    <div className="border rounded-lg">
      {" "}
      {/* Toolbar */}{" "}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {" "}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          {" "}
          <Bold className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          {" "}
          <Italic className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          {" "}
          <UnderlineIcon className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          {" "}
          <Strikethrough className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("highlight") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
        >
          {" "}
          <Highlighter className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          {" "}
          <Heading1 className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          {" "}
          <Heading2 className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          {" "}
          <Heading3 className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          {" "}
          <List className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          {" "}
          <ListOrdered className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          {" "}
          <Quote className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("codeBlock") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          {" "}
          <Code className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          {" "}
          <AlignLeft className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "center" }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          {" "}
          <AlignCenter className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "right" }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          {" "}
          <AlignRight className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "justify" }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          title="Align Justify"
        >
          {" "}
          <AlignJustify className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button
          type="button"
          variant={editor.isActive("link") ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            if (editor.isActive("link")) {
              removeLink();
            } else {
              setLinkDialogOpen(true);
            }
          }}
          title="Link"
        >
          {" "}
          <Link2 className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          title="Add Image"
        >
          {" "}
          <ImageIcon className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addYoutube}
          title="Add YouTube Video"
        >
          {" "}
          <YoutubeIcon className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addTable}
          title="Add Table"
        >
          {" "}
          <TableIcon className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setAmazonDialogOpen(true)}
          title="Add Amazon Button"
        >
          {" "}
          <ShoppingCart className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          {" "}
          <Undo className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          {" "}
          <Redo className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          {" "}
          <Minus className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          title="Line Break (or press Shift+Enter)"
        >
          {" "}
          <CornerDownLeft className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Clear Formatting"
        >
          {" "}
          <RemoveFormatting className="w-4 h-4" />{" "}
        </Button>{" "}
      </div>{" "}
      {/* Editor */}{" "}
      <div className="relative">
        <EditorContent editor={editor} />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Tip: Press Shift+Enter for line breaks
        </div>
      </div>{" "}
      {/* Image Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor }) => {
            return editor.isActive("image") || editor.isActive("unsplashImage");
          }}
        >
          <div className="flex items-center gap-2 bg-background border rounded-lg shadow-lg p-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium px-2">Size:</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageSize("100%")}
                  title="Full Width"
                  className="h-8 px-2"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageSize("x-large")}
                  title="X-Large (512px)"
                  className="h-8 px-2"
                >
                  XL
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageSize("large")}
                  title="Large (384px)"
                  className="h-8 px-2"
                >
                  L
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageSize("medium")}
                  title="Medium (256px)"
                  className="h-8 px-2"
                >
                  M
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageSize("small")}
                  title="Small (192px)"
                  className="h-8 px-2"
                >
                  S
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageSize("x-small")}
                  title="X-Small (128px)"
                  className="h-8 px-2"
                >
                  XS
                </Button>
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium px-2">Position:</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageAlign("left")}
                  title="Left"
                  className="h-8 px-2"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageAlign("center")}
                  title="Center"
                  className="h-8 px-2"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => updateImageAlign("right")}
                  title="Right"
                  className="h-8 px-2"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </BubbleMenu>
      )}
      {/* Image Upload Dialog */}{" "}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        {" "}
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {" "}
          <DialogHeader>
            {" "}
            <DialogTitle>Insert Image</DialogTitle>{" "}
            <DialogDescription>
              {" "}
              Upload from your computer, paste a URL, or search free images{" "}
            </DialogDescription>{" "}
          </DialogHeader>{" "}
          {/* Image Size and Position Controls */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>Image Size</Label>
              <select
                value={imageWidth}
                onChange={(e) => setImageWidth(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="100%">Full Width</option>
                <option value="x-large">X-Large (512px)</option>
                <option value="large">Large (384px)</option>
                <option value="medium">Medium (256px)</option>
                <option value="small">Small (192px)</option>
                <option value="x-small">X-Small (128px)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <select
                value={imageAlign}
                onChange={(e) => setImageAlign(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="center">Center</option>
                <option value="left">Left (text wraps right)</option>
                <option value="right">Right (text wraps left)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Left/Right allows text to flow around the image
              </p>
            </div>
          </div>
          <Tabs defaultValue="upload" className="w-full">
            {" "}
            <TabsList className="grid w-full grid-cols-3">
              {" "}
              <TabsTrigger value="upload">
                {" "}
                <Upload className="h-4 w-4 mr-2" /> Upload{" "}
              </TabsTrigger>{" "}
              <TabsTrigger value="url">
                {" "}
                <Link2 className="h-4 w-4 mr-2" /> URL{" "}
              </TabsTrigger>{" "}
              <TabsTrigger value="unsplash">
                {" "}
                <Search className="h-4 w-4 mr-2" /> Search{" "}
              </TabsTrigger>{" "}
            </TabsList>{" "}
            <TabsContent value="upload" className="space-y-4">
              {" "}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {" "}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />{" "}
                {uploading ? (
                  <div className="flex items-center justify-center">
                    {" "}
                    <Loader2 className="h-8 w-8 animate-spin" />{" "}
                    <span className="ml-2">Uploading...</span>{" "}
                  </div>
                ) : (
                  <>
                    {" "}
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />{" "}
                    <p className="mb-2">Click to upload or drag and drop</p>{" "}
                    <p className="text-sm text-muted-foreground mb-4">
                      {" "}
                      PNG, JPG, GIF or WebP (max 5MB){" "}
                    </p>{" "}
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {" "}
                      Select File{" "}
                    </Button>{" "}
                  </>
                )}{" "}
              </div>{" "}
            </TabsContent>{" "}
            <TabsContent value="url" className="space-y-4">
              {" "}
              <div className="space-y-2">
                {" "}
                <Label>Image URL</Label>{" "}
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                />{" "}
              </div>{" "}
              <Button type="button" onClick={handleUrlSubmit}>
                {" "}
                Insert Image{" "}
              </Button>{" "}
            </TabsContent>{" "}
            <TabsContent value="unsplash" className="space-y-4">
              {" "}
              <div className="flex gap-2">
                {" "}
                <Input
                  type="text"
                  placeholder="Search free images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchUnsplash()}
                />{" "}
                <Button
                  type="button"
                  onClick={searchUnsplash}
                  disabled={searching}
                >
                  {" "}
                  {searching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}{" "}
                </Button>{" "}
              </div>{" "}
              <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                {" "}
                {unsplashImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-video cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors"
                    onClick={() => selectUnsplashImage(img)}
                  >
                    {" "}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.thumb}
                      alt={img.description || "Unsplash image"}
                      className="w-full h-full object-cover"
                    />{" "}
                  </div>
                ))}
              </div>
              {hasMoreImages && (
                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    onClick={loadMoreImages}
                    disabled={loadingMore}
                    variant="outline"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Laddar fler bilder...
                      </>
                    ) : (
                      "Ladda fler bilder"
                    )}
                  </Button>
                </div>
              )}
              {unsplashImages.length === 0 && !searching && (
                <p className="text-center text-muted-foreground py-8">
                  Search for free high-quality images from Unsplash
                </p>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setLink()}
              />
            </div>
            <Button type="button" onClick={setLink}>
              Set Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Amazon Button Dialog */}
      <Dialog open={amazonDialogOpen} onOpenChange={setAmazonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Amazon Buy Button</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amazon Affiliate URL</Label>
              <Input
                type="url"
                placeholder="https://amazon.com/..."
                value={amazonUrl}
                onChange={(e) => setAmazonUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                type="text"
                placeholder="Buy on Amazon"
                value={amazonText}
                onChange={(e) => setAmazonText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setAmazonButton()}
              />
            </div>
            <Button type="button" onClick={setAmazonButton}>
              Insert Button
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={errorAlert.open}
        onOpenChange={(open) => setErrorAlert({ ...errorAlert, open })}
        title="Error"
        description={errorAlert.message}
        type="error"
      />
    </div>
  );
}
