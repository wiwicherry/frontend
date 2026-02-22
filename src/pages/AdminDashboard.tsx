import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import { Trash2, CheckCircle, Upload, Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [form, setForm] = useState({ name: "", price: "", category: "Arm Cuffs", description: "", countInStock: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchProducts = () => {
    setLoadingProducts(true);
    api.get("/products").then((res) => { setProducts(res.data); setLoadingProducts(false); }).catch(() => setLoadingProducts(false));
  };

  const fetchOrders = () => {
    setLoadingOrders(true);
    api.get("/orders").then((res) => { setOrders(res.data); setLoadingOrders(false); }).catch(() => setLoadingOrders(false));
  };

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setImageUrl(data.image);
      toast({ title: "Image uploaded!" });
    } catch {
      toast({ variant: "destructive", title: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) { toast({ variant: "destructive", title: "Please upload an image first" }); return; }
    setCreating(true);
    try {
      await api.post("/products", {
        name: form.name,
        price: Number(form.price),
        images: [imageUrl],
        category: form.category,
        description: form.description,
        countInStock: Number(form.countInStock),
      });
      toast({ title: "Product created!" });
      setForm({ name: "", price: "", category: "Arm Cuffs", description: "", countInStock: "" });
      setImageUrl("");
      fetchProducts();
    } catch {
      toast({ variant: "destructive", title: "Failed to create product" });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast({ title: "Product deleted" });
      fetchProducts();
    } catch {
      toast({ variant: "destructive", title: "Failed to delete" });
    }
  };

  const handleMarkDelivered = async (id: string) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      toast({ title: "Marked as delivered" });
      fetchOrders();
    } catch {
      toast({ variant: "destructive", title: "Failed to update" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-semibold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Create Form */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-heading text-xl font-medium mb-4">Create Product</h2>
              <form onSubmit={handleCreateProduct} className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Price ($)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Arm Cuffs", "Necklaces", "Bracelets", "Charms"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                <div><Label>Stock</Label><Input type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} required /></div>
                <div>
                  <Label>Image</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload Image"}
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                    {imageUrl && <img src={imageUrl} alt="Preview" className="h-12 w-12 rounded object-cover" />}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Product"}
                </Button>
              </form>
            </div>

            {/* Products Table */}
            <div>
              <h2 className="font-heading text-xl font-medium mb-4">All Products</h2>
              {loadingProducts ? <Loader /> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>${p.price?.toFixed(2)}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p._id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          {loadingOrders ? <Loader /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell className="font-mono text-xs">{o._id}</TableCell>
                    <TableCell>{o.user?.name || "N/A"}</TableCell>
                    <TableCell>${o.totalPrice?.toFixed(2)}</TableCell>
                    <TableCell>{o.isPaid ? <span className="text-primary">Yes</span> : "No"}</TableCell>
                    <TableCell>{o.isDelivered ? <span className="text-primary">Yes</span> : "No"}</TableCell>
                    <TableCell>
                      {!o.isDelivered && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkDelivered(o._id)} className="gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5" /> Deliver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
