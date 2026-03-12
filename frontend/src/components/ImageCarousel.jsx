import { useMemo, useState } from 'react';

function ImageCarousel({ images }) {
  const safeImages = useMemo(() => (images?.length ? images : ['https://via.placeholder.com/800x400?text=No+Image']), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="carousel">
      <div className="carousel-main">
        <img src={safeImages[activeIndex]} alt="Product" />
      </div>
      <div className="carousel-thumbs">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
          >
            <img src={image} alt={`thumb-${index}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
