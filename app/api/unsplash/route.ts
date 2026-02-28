import { NextRequest, NextResponse } from "next/server";

interface UnsplashPhoto {
  id: string;
  urls: { regular: string; thumb: string };
  description: string | null;
  alt_description: string | null;
  user: { name: string; links: { html: string } };
  links: { download_location: string };
}

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "demo-key";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "nature";
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "12";

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`,
      {
        headers: {
          "Accept-Version": "v1",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Unsplash");
    }

    const data = await response.json();

    // Format response
    const images = data.results.map((photo: UnsplashPhoto) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadUrl: photo.links.download_location,
    }));

    return NextResponse.json({
      images,
      total: data.total,
      totalPages: data.total_pages,
    });
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images from Unsplash" },
      { status: 500 },
    );
  }
}
