import { useState } from 'react';
import { ProductImage } from '../../types';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  const fallbackImage: ProductImage = { id: '1', url: 'https://via.placeholder.com/600x600/FFF8F0/00b4d8?text=Product', alt: productName, sortOrder: 0 };
  const allImages = (images && images.length > 0) ? images : [fallbackImage];
  const currentImage = allImages[Math.min(selected, allImages.length - 1)] || fallbackImage;

  return (
    <div>
      <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-cream-300/50 shadow-card">
        <img
          src={currentImage.url}
          alt={currentImage.alt || productName}
          className="w-full h-full object-cover"
        />
      </div>
      {allImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelected(index)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                selected === index
                  ? 'border-neon-cyan shadow-neon-cyan'
                  : 'border-cream-300/50 hover:border-cream-400'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
