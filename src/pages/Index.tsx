import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-jewelry.jpg";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.slice(0, 4));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={heroImage} alt="Handcrafted jewelry collection" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="animate-fade-in max-w-xl px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Adorn Your Story
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 font-body">
              Handcrafted jewelry made with love, for moments that matter.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="lg" className="mt-8">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-center font-heading text-3xl font-semibold text-foreground mb-10">
          Latest Arrivals
        </h2>
        {loading ? (
          <Loader />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No products yet. Check back soon!</p>
        )}
        <div className="mt-10 text-center">
          <Link to="/shop">
            <Button variant="outline" size="lg">View All</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
