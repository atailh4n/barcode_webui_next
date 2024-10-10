"use client";
import { useState } from "react";
import { Trash2, Barcode, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  name: string;
  barcode: string;
  price: number;
  quantity: number;
}

export default function BarcodeReader() {
  const [products, setProducts] = useState<Product[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [manualProduct, setManualProduct] = useState<Product>({
    name: "",
    barcode: "",
    price: 0,
    quantity: 1,
  });

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProductQuantity = (index: number, newQuantity: number) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockProduct: Product = {
      name: `Ürün ${barcodeInput}`,
      barcode: barcodeInput,
      price: Math.random() * 100,
      quantity: 1,
    };
    addProduct(mockProduct);
    setBarcodeInput("");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(manualProduct);
    setManualProduct({
      name: "",
      barcode: "",
      price: 0,
      quantity: 1,
    });
    setIsManualDialogOpen(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(",", "."); // Virgülü noktaya çevir
    setManualProduct({ ...manualProduct, quantity: parseFloat(value) });
  };

  const calculateTotals = () => {
    const subtotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const vat = subtotal * 0.2; // %20 KDV
    const total = subtotal + vat;
    return { subtotal, vat, total };
  };

  const { subtotal, vat, total } = calculateTotals();

  const handleCheckout = () => {
    alert("Checkout successful!");
    setProducts([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Barkod Tester</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form onSubmit={handleBarcodeSubmit} className="mb-4 flex gap-2">
            <Input
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Telefonunuzdan barkod okutun ya da manuel olarak girin."
              required
            />
            <Button type="submit">
              <Barcode className="mr-2 h-4 w-4"></Barcode> Ekle
            </Button>
          </form>
          <div className="space-y-2 mb-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm">Barkod: {product.barcode}</p>
                  <p className="text-sm">Fiyat: ₺{product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <Label>Miktar: </Label>
                    <Input
                      type="number"
                      step="0.001" // Ondalık miktarlara izin verir
                      value={product.quantity}
                      onChange={(e) =>
                        updateProductQuantity(index, parseFloat(e.target.value))
                      }
                      className="w-24"
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeProduct(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Dialog
            open={isManualDialogOpen}
            onOpenChange={setIsManualDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full py-8 text-lg">
                <Plus className="mr-2 h-6 w-6"></Plus> Manuel Olarak Ekleyin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manuel Ürün Ekleme</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ürün Adı</Label>
                  <Input
                    id="name"
                    value={manualProduct.name}
                    onChange={(e) =>
                      setManualProduct({
                        ...manualProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barkod</Label>
                  <Input
                    id="barcode"
                    value={manualProduct.barcode}
                    onChange={(e) =>
                      setManualProduct({
                        ...manualProduct,
                        barcode: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Fiyat</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={manualProduct.price}
                    onChange={(e) =>
                      setManualProduct({
                        ...manualProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Miktar</Label>
                  <Input
                    id="quantity"
                    type="text" // Değiştirildi
                    value={manualProduct.quantity.toString().replace(".", ",")} // Noktayı virgüle çevir
                    onChange={handleQuantityChange} // Güncellenen onChange fonksiyonu
                    required
                  />
                </div>
                <Button type="submit">Ürünü Ekle</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Alışveriş Özeti</h2>
          <div className="space-y-2">
            <p>Ara toplam: ₺{subtotal.toFixed(2)}</p>
            <p>KDV (20%): ₺{vat.toFixed(2)}</p>
            <p className="font-bold">Toplam: ₺{total.toFixed(2)}</p>
          </div>
          <Button className="mt-4 w-full" onClick={handleCheckout}>
            Hesabı Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}
