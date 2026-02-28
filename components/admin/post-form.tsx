"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichEditor } from "@/components/admin/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/constants";
import { createSlug } from "@/lib/text-utils";
import { PlusCircle, X } from "lucide-react";

export function PostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    featuredImage: "",
    content: "",
    category: "ROMANCE",
    published: false,
    tags: [] as string[],
    books: [] as Array<{
      title: string;
      author: string;
      image: string;
      amazonLink: string;
      summary: string;
      whoFor: string;
      emotionalPoints: string[];
    }>,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentBook, setCurrentBook] = useState({
    title: "",
    author: "",
    image: "",
    amazonLink: "",
    summary: "",
    whoFor: "",
    emotionalPoints: ["", "", ""],
  });

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: createSlug(title),
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const addBook = () => {
    if (currentBook.title && currentBook.author) {
      setFormData({
        ...formData,
        books: [...formData.books, currentBook],
      });
      setCurrentBook({
        title: "",
        author: "",
        image: "",
        amazonLink: "",
        summary: "",
        whoFor: "",
        emotionalPoints: ["", "", ""],
      });
    }
  };

  const removeBook = (index: number) => {
    setFormData({
      ...formData,
      books: formData.books.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published: publish,
        }),
      });

      if (response.ok) {
        const post = await response.json();
        router.push(`/admin/posts`);
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: createSlug(e.target.value) })
              }
              placeholder="auto-generated-slug"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Short description..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) =>
                setFormData({ ...formData, featuredImage: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-navy/10 dark:bg-cream/10 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Content *</CardTitle>
        </CardHeader>
        <CardContent>
          <RichEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </CardContent>
      </Card>

      {/* Books Section */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Books (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Books */}
          {formData.books.length > 0 && (
            <div className="space-y-4">
              {formData.books.map((book, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">
                        {book.title} by {book.author}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {book.summary}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeBook(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Book */}
          <div className="space-y-4 p-4 border-2 border-dashed rounded-lg">
            <h4 className="font-semibold">Add a Book</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Book Title *"
                value={currentBook.title}
                onChange={(e) =>
                  setCurrentBook({ ...currentBook, title: e.target.value })
                }
              />
              <Input
                placeholder="Author *"
                value={currentBook.author}
                onChange={(e) =>
                  setCurrentBook({ ...currentBook, author: e.target.value })
                }
              />
              <Input
                placeholder="Image URL"
                value={currentBook.image}
                onChange={(e) =>
                  setCurrentBook({ ...currentBook, image: e.target.value })
                }
              />
              <Input
                placeholder="Amazon Link *"
                value={currentBook.amazonLink}
                onChange={(e) =>
                  setCurrentBook({ ...currentBook, amazonLink: e.target.value })
                }
              />
            </div>
            <Textarea
              placeholder="Summary (3-4 sentences) *"
              value={currentBook.summary}
              onChange={(e) =>
                setCurrentBook({ ...currentBook, summary: e.target.value })
              }
              rows={3}
            />
            <Textarea
              placeholder="Who is it for?"
              value={currentBook.whoFor}
              onChange={(e) =>
                setCurrentBook({ ...currentBook, whoFor: e.target.value })
              }
              rows={2}
            />
            <div className="space-y-2">
              <Label>3 Emotional Points</Label>
              {[0, 1, 2].map((i) => (
                <Input
                  key={i}
                  placeholder={`Point ${i + 1}`}
                  value={currentBook.emotionalPoints[i]}
                  onChange={(e) => {
                    const points = [...currentBook.emotionalPoints];
                    points[i] = e.target.value;
                    setCurrentBook({ ...currentBook, emotionalPoints: points });
                  }}
                />
              ))}
            </div>
            <Button
              type="button"
              onClick={addBook}
              className="w-full"
              variant="outline"
            >
              <PlusCircle className="mr-2 w-4 h-4" />
              Add This Book
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}
