import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PlaceOrder = () => {
  const { cartItems, shippingAddress, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod: "PayPal",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Order failed",
        description: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-heading text-3xl font-semibold mb-8">Review Order</h1>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-heading text-lg font-medium mb-2">Shipping</h2>
          <p className="text-sm text-muted-foreground">
            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-heading text-lg font-medium mb-4">Items</h2>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                  <span>{item.name}</span>
                </div>
                <span>{item.qty} × ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-2 text-sm">
          <h2 className="font-heading text-lg font-medium mb-2">Price Summary</h2>
          <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax (15%)</span><span>${taxPrice.toFixed(2)}</span></div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
        </div>

        <Button onClick={handlePlaceOrder} className="w-full" size="lg" disabled={loading || cartItems.length === 0}>
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default PlaceOrder;
