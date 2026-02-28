export const AFFILIATE_ID = process.env.AMAZON_AFFILIATE_ID || "";

export function createAmazonLink(productUrl: string): string {
  if (!AFFILIATE_ID) return productUrl;

  const url = new URL(productUrl);
  url.searchParams.set("tag", AFFILIATE_ID);
  return url.toString();
}

export const AFFILIATE_DISCLOSURE_SHORT =
  "As an Amazon Associate I earn from qualifying purchases.";

export const AFFILIATE_DISCLOSURE_FULL = `
This website contains affiliate links. If you click on an Amazon link and make a purchase, 
I may earn a small commission at no extra cost to you. This helps support the blog and allows 
me to continue creating content. I only recommend books and products I genuinely believe in.

Thank you for your support!
`;
