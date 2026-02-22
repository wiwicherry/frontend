import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, totalItems } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (!userInfo) {
      navigate("/login?redirect=shipping");
    } else {
      navigate("/shipping");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="font-heading text-2xl font-semibold mb-4">Your bag is empty</h1>
        <Link to="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-semibold mb-8">Shopping Bag</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex gap-4 rounded-lg border p-4 bg-card">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link to={`/product/${item._id}`} className="font-medium hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-sm text-accent font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={String(item.qty)} onValueChange={(v) => updateQty(item._id, Number(v))}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: item.countInStock }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item._id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-card p-6 h-fit">
          <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Items ({totalItems})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full mt-6">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
