"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Link2,
  Image as ImageIcon,
  Search,
  Loader2,
} from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
}: ImageUploaderProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
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
      onChange(data.url);
      setOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setOpen(false);
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
    onChange(imageUrl);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload..."
          className="flex-1"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              <ImageIcon className="h-4 w-4 mr-2" />
              Choose
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose Image</DialogTitle>
              <DialogDescription>
                Upload from your computer, paste a URL, or search free images
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Link2 className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="unsplash">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        PNG, JPG, GIF or WebP (max 5MB)
                      </p>
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
                <Button type="button" onClick={handleUrlSubmit}>
                  Use This URL
                </Button>
              </TabsContent>

              <TabsContent value="unsplash" className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search free images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchUnsplash()}
                  />
                  <Button
                    type="button"
                    onClick={searchUnsplash}
                    disabled={searching}
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {unsplashImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-video cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors"
                      onClick={() => selectUnsplashImage(img.url)}
                    >
                      <Image
                        src={img.thumb}
                        alt={img.description || "Unsplash image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {unsplashImages.length === 0 && !searching && (
                  <p className="text-center text-muted-foreground py-8">
                    Search for free high-quality images
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {value && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
