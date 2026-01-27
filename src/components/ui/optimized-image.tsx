import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  /** Placeholder blur color or image */
  placeholderColor?: string;
  /** Enable fade-in animation on load */
  fadeIn?: boolean;
  /** Priority loading - skip lazy loading */
  priority?: boolean;
  /** Aspect ratio for placeholder (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
}

/**
 * OptimizedImage - 優化的圖片組件
 * 
 * Features:
 * - 懶載入 (Intersection Observer)
 * - 淡入動畫
 * - 佔位符顏色
 * - 錯誤處理
 * - 響應式支援
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  placeholderColor = "bg-white/5",
  fadeIn = true,
  priority = false,
  aspectRatio,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Aspect ratio style
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : undefined;

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden",
        !isLoaded && placeholderColor,
        className
      )}
      style={aspectRatioStyle}
    >
      {/* Placeholder shimmer effect */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-white/30">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            fadeIn && !isLoaded && "opacity-0",
            fadeIn && isLoaded && "opacity-100",
            !fadeIn && "opacity-100"
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};

/**
 * ResponsiveImage - 響應式圖片組件
 * 
 * 支援多尺寸圖片來源，根據螢幕大小載入適當尺寸
 */
interface ResponsiveImageProps extends OptimizedImageProps {
  /** Mobile image source (optional, will use src if not provided) */
  mobileSrc?: string;
  /** Tablet image source (optional) */
  tabletSrc?: string;
  /** Breakpoints for responsive loading */
  breakpoints?: {
    mobile?: number;
    tablet?: number;
  };
}

export const ResponsiveImage = ({
  src,
  mobileSrc,
  tabletSrc,
  breakpoints = { mobile: 640, tablet: 1024 },
  ...props
}: ResponsiveImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    const updateSrc = () => {
      const width = window.innerWidth;
      if (mobileSrc && width < (breakpoints.mobile || 640)) {
        setCurrentSrc(mobileSrc);
      } else if (tabletSrc && width < (breakpoints.tablet || 1024)) {
        setCurrentSrc(tabletSrc);
      } else {
        setCurrentSrc(src);
      }
    };

    updateSrc();
    window.addEventListener("resize", updateSrc);
    return () => window.removeEventListener("resize", updateSrc);
  }, [src, mobileSrc, tabletSrc, breakpoints]);

  return <OptimizedImage src={currentSrc} {...props} />;
};

export default OptimizedImage;
