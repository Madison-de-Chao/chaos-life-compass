import { useEffect } from "react";

export interface OGImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string; // e.g. "image/jpeg"
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  /** Single image shortcut (kept for backward compatibility) */
  ogImage?: string;
  ogImageAlt?: string;
  /** Multiple images for richer previews across platforms / device sizes */
  ogImages?: OGImage[];
  canonical?: string;
}

export function useSEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogImage,
  ogImageAlt,
  ogImages,
  canonical,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    // Track tags we create so we can clean up on unmount
    const createdTags: Element[] = [];

    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const appendMetaTag = (property: string, content: string) => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", property);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
      createdTags.push(tag);
    };

    // Description / keywords
    setMetaTag("description", description);
    if (keywords) setMetaTag("keywords", keywords);

    // Core OG
    setMetaTag("og:title", ogTitle || title, true);
    setMetaTag("og:description", ogDescription || description, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:site_name", "虹靈御所 × 超烜創意", true);

    // Build the final image list: prefer ogImages array, fall back to single ogImage
    const images: OGImage[] =
      ogImages && ogImages.length > 0
        ? ogImages
        : ogImage
        ? [{ url: ogImage, alt: ogImageAlt }]
        : [];

    // Remove any prior OG image tags so multiple images render cleanly
    document
      .querySelectorAll(
        'meta[property="og:image"], meta[property="og:image:url"], meta[property="og:image:secure_url"], meta[property="og:image:alt"], meta[property="og:image:width"], meta[property="og:image:height"], meta[property="og:image:type"]'
      )
      .forEach((el) => el.remove());

    images.forEach((img) => {
      appendMetaTag("og:image", img.url);
      if (img.url.startsWith("https://")) appendMetaTag("og:image:secure_url", img.url);
      if (img.type) appendMetaTag("og:image:type", img.type);
      if (img.width) appendMetaTag("og:image:width", String(img.width));
      if (img.height) appendMetaTag("og:image:height", String(img.height));
      if (img.alt) appendMetaTag("og:image:alt", img.alt);
    });

    // Twitter Card — Twitter only honors one image; use the first
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", ogTitle || title);
    setMetaTag("twitter:description", ogDescription || description);
    if (images[0]) {
      setMetaTag("twitter:image", images[0].url);
      if (images[0].alt) setMetaTag("twitter:image:alt", images[0].alt);
    }

    // Canonical
    let canonicalLink: HTMLLinkElement | null = null;
    if (canonical) {
      canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonical);
    }

    return () => {
      document.title = "默默超完整性哲學官方入口網站";
      createdTags.forEach((el) => el.remove());
      if (canonicalLink) canonicalLink.remove();
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogType, ogImage, ogImageAlt, ogImages, canonical]);
}
