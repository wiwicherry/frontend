import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety fallback for products with no images
  const images = product.images?.length > 0 ? product.images : ["/placeholder.svg"];

  // Navigation handlers (stopPropagation prevents the Link from clicking!)
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Link to={`/product/${product._id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
        
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={images[currentIndex]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {images.length > 1 && (
            <>
              {/* Left Arrow - Now visible on mobile, fades on desktop */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Right Arrow - Now visible on mobile, fades on desktop */}
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-3 bg-accent" : "w-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <CardContent className="p-4 text-center">
          {product.category && (
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {product.category}
            </p>
          )}
          <h3 className="font-heading text-base font-medium text-foreground">{product.name}</h3>
          <p className="mt-1 text-sm text-accent font-semibold">₹{product.price?.toFixed(2)}</p>
        </CardContent>
        
      </Card>
    </Link>
  );
};

export default ProductCard;