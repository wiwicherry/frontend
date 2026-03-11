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
import { Trash2, CheckCircle, Upload, Loader2, Pencil } from "lucide-react"; // NEW: Added Pencil icon

const AdminDashboard = () => {
  const { toast } = useToast();

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [form, setForm] = useState({ name: "", price: "", category: "Arm Cuffs", description: "", countInStock: "" });
  
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false); // Renamed from 'creating' since it handles both now
  
  // NEW: State to track if we are editing an existing product
  const [editingId, setEditingId] = useState<string | null>(null);

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
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    
    setUploading(true);
    try {
      const { data } = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      // If editing, append new images to existing ones. If creating, just set them.
      setImageUrls((prev) => [...prev, ...data.images]); 
      toast({ title: "Images uploaded!" });
    } catch {
      toast({ variant: "destructive", title: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  // NEW: Helper to reset the form
  const resetForm = () => {
    setForm({ name: "", price: "", category: "Arm Cuffs", description: "", countInStock: "" });
    setImageUrls([]);
    setEditingId(null);
  };

  // NEW: Populate form when Edit is clicked
  const handleEditClick = (product: any) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category || "Arm Cuffs",
      description: product.description,
      countInStock: product.countInStock.toString(),
    });
    setImageUrls(product.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top so admin sees the form!
  };

  // NEW: Remove a specific image from the preview array
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls(imageUrls.filter((_, index) => index !== indexToRemove));
  };

  // UPDATED: Handles BOTH Create and Update
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) { toast({ variant: "destructive", title: "Please upload at least one image" }); return; }
    
    setSaving(true);
    
    const payload = {
      name: form.name,
      price: Number(form.price),
      images: imageUrls,
      category: form.category,
      description: form.description,
      countInStock: Number(form.countInStock),
    };

    try {
      if (editingId) {
        // UPDATE EXISTING
        await api.put(`/products/${editingId}`, payload);
        toast({ title: "Product updated successfully!" });
      } else {
        // CREATE NEW
        await api.post("/products", payload);
        toast({ title: "Product created!" });
      }
      resetForm();
      fetchProducts();
    } catch {
      toast({ variant: "destructive", title: editingId ? "Failed to update product" : "Failed to create product" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return; // Added safety confirmation
    try {
      await api.delete(`/products/${id}`);
      toast({ title: "Product deleted" });
      if (editingId === id) resetForm(); // Clear form if they deleted the product they were currently editing
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

        <TabsContent value="products">
          <div className="grid lg:grid-cols-2 gap-10">
            
            {/* Form Section */}
            <div className="rounded-lg border bg-card p-6 h-fit sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading text-xl font-medium">
                  {editingId ? "Edit Product" : "Create Product"}
                </h2>
                {editingId && (
                  <Button variant="ghost" size="sm" onClick={resetForm} className="text-muted-foreground">
                    Cancel Edit
                  </Button>
                )}
              </div>
              
              <form onSubmit={handleSubmitProduct} className="space-y-3">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Price (₹)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Arm Cuffs", "Necklaces", "Bracelets", "Charms", "Rings", "Earrings"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                <div><Label>Stock</Label><Input type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} required /></div>
                
                {/* Image Upload Section */}
                <div>
                  <Label>Images</Label>
                  <div className="flex flex-col gap-3 mt-1">
                    <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload More Images"}
                      <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                    
                    {imageUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img src={url} alt={`Preview ${index}`} className="h-16 w-16 rounded object-cover border" />
                            {/* NEW: Allow removing specific images */}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#E5989B] hover:bg-[#D49A89] text-white" disabled={saving}>
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{editingId ? "Updating..." : "Creating..."}</>
                  ) : (
                    editingId ? "Update Product" : "Create Product"
                  )}
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p._id} className={editingId === p._id ? "bg-muted/50" : ""}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>₹{p.price?.toFixed(2)}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell className="text-right">
                          {/* NEW: Edit Button */}
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(p)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 mr-1">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p._id)} className="text-destructive hover:bg-destructive/10">
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

        {/* Orders Tab (Unchanged) */}
        <TabsContent value="orders">
          {loadingOrders ? <Loader /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Shipping Address</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell className="font-mono text-xs">{o._id?.substring(18, 24)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{o.user?.name || "N/A"}</span>
                        <span className="text-xs text-muted-foreground">{o.user?.email || "No Email"}</span>
                        <span className="text-xs text-muted-foreground">{o.user?.mobile || "No Mobile"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {o.shippingAddress ? (
                        <div className="text-sm truncate" title={`${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.postalCode}`}>
                          {o.shippingAddress.address}, {o.shippingAddress.city}, {o.shippingAddress.postalCode}, {o.shippingAddress.country}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No Address</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">₹{o.totalPrice?.toFixed(2)}</TableCell>
                    <TableCell>{o.isPaid ? <span className="text-green-600 font-medium">Yes</span> : "No"}</TableCell>
                    <TableCell>{o.isDelivered ? <span className="text-green-600 font-medium">Delivered</span> : "Processing"}</TableCell>
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