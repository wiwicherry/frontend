import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loader from "@/components/Loader";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-20 text-muted-foreground">Product not found.</p>;

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      image: product.images?.[0] || "/placeholder.svg",
      price: product.price,
      countInStock: product.countInStock,
      qty,
    });
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2 text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{product.category}</p>
          )}
          <h1 className="font-heading text-3xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-accent">${product.price?.toFixed(2)}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6">
            {product.countInStock > 0 ? (
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-sm text-destructive font-medium">Out of Stock</span>
            )}
          </div>

          {product.countInStock > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <Select value={String(qty)} onValueChange={(v) => setQty(Number(v))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: product.countInStock }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAddToCart} className="gap-2" size="lg">
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
