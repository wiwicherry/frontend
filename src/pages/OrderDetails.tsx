import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import Loader from "@/components/Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20 text-muted-foreground">Order not found.</p>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold mb-2">Order Confirmed</h1>
      <p className="text-sm text-muted-foreground mb-8">Order ID: {order._id}</p>

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-heading text-lg font-medium mb-2">Shipping</h2>
          <p className="text-sm text-muted-foreground">
            {order.user?.name} — {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
          </p>
          <p className="mt-2 text-sm">
            {order.isDelivered ? (
              <span className="text-primary">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
            ) : (
              <span className="text-accent font-medium">Not Delivered</span>
            )}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-heading text-lg font-medium mb-4">Items</h2>
          <div className="space-y-3">
            {order.orderItems?.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                  <span>{item.name}</span>
                </div>
                <span>{item.qty} × ${item.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${order.shippingPrice?.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${order.taxPrice?.toFixed(2)}</span></div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${order.totalPrice?.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
