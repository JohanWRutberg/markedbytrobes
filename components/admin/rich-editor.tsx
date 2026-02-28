"use client";
import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Youtube from "@tiptap/extension-youtube";
import { AmazonButton } from "@/lib/tiptap-amazon-button";
import {
  Bold,
  Italic,
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
  const [linkText, setLinkText] = useState("");
  const [amazonUrl, setAmazonUrl] = useState("");
  const [amazonText, setAmazonText] = useState("Buy on Amazon");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
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
      StarterKit,
      Image,
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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none min-h-[400px] focus:outline-none p-4 border rounded-lg",
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
      editor.chain().focus().setImage({ src: data.url }).run();
      setImageDialogOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      editor.chain().focus().setImage({ src: urlInput.trim() }).run();
      setImageDialogOpen(false);
      setUrlInput("");
    }
  };
  const searchUnsplash = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(
        `/api/unsplash?q=${encodeURIComponent(searchQuery)}&per_page=12`,
      );
      if (!response.ok) {
        throw new Error("Failed to search images");
      }
      const data = await response.json();
      setUnsplashImages(data.images);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search images");
    } finally {
      setSearching(false);
    }
  };
  const selectUnsplashImage = (imageUrl: string) => {
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageDialogOpen(false);
    setSearchQuery("");
    setUnsplashImages([]);
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
      setLinkText("");
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
        >
          {" "}
          <Bold className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          {" "}
          <Italic className="w-4 h-4" />{" "}
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
        >
          {" "}
          <List className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          {" "}
          <ListOrdered className="w-4 h-4" />{" "}
        </Button>{" "}
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
        >
          {" "}
          <Link2 className="w-4 h-4" />{" "}
        </Button>{" "}
        <div className="w-px h-6 bg-border mx-1" />{" "}
        <Button type="button" variant="ghost" size="sm" onClick={addImage}>
          {" "}
          <ImageIcon className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button type="button" variant="ghost" size="sm" onClick={addYoutube}>
          {" "}
          <YoutubeIcon className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button type="button" variant="ghost" size="sm" onClick={addTable}>
          {" "}
          <TableIcon className="w-4 h-4" />{" "}
        </Button>{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setAmazonDialogOpen(true)}
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
        >
          {" "}
          <Redo className="w-4 h-4" />{" "}
        </Button>{" "}
      </div>{" "}
      {/* Editor */} <EditorContent editor={editor} />{" "}
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
              <div className="grid grid-cols-3 gap-4">
                {" "}
                {unsplashImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-video cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors"
                    onClick={() => selectUnsplashImage(img.url)}
                  >
                    {" "}
                    <img
                      src={img.thumb}
                      alt={img.description || "Unsplash image"}
                      className="w-full h-full object-cover"
                    />{" "}
                  </div>
                ))}
              </div>
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
    </div>
  );
}
