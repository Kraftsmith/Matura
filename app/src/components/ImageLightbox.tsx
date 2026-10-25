import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../useSettings';

interface ImageLightboxProps {
  isOpen: boolean;
  src: string;
  alt: string;
  caption?: React.ReactNode;
  onClose: () => void;
}

/** Full-screen preview of a picture: click outside, the close button or Escape to return. */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({ isOpen, src, alt, caption, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const { t } = useSettings();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Scale the picture up to the viewport while keeping its aspect ratio: the width is the smaller of
  // "fills the width" and "fills the height", and the height follows automatically.
  const sizing: React.CSSProperties = ratio
    ? { width: `min(100%, calc((100vh - 7rem) * ${ratio}))`, height: 'auto' }
    : { maxWidth: '100%', maxHeight: 'calc(100vh - 7rem)', width: 'auto', height: 'auto' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/90 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t('misc.closePreview')}
        title={`${t('misc.closePreview')} (Esc)`}
        className="absolute top-4 right-4 grid h-11 w-11 cursor-pointer place-items-center rounded-lg bg-surface/10 text-white hover:bg-surface/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X className="h-6 w-6" />
      </button>

      <img
        src={src}
        alt={alt}
        style={sizing}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight);
        }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg"
      />
      {caption && (
        <p onClick={(e) => e.stopPropagation()} className="mt-4 max-w-[72ch] text-center text-sm leading-5 text-line">
          {caption}
        </p>
      )}
    </div>
  );
};
