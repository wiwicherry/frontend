import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
}

const ProductCard = ({ product }: { product: Product }) => (
  <Link to={`/product/${product._id}`}>
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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

export default ProductCard;
