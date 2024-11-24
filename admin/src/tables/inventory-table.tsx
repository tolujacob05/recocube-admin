import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "../components/routes/inventory";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Icon } from "@iconify/react";

interface ProductTableProps {
  currentProducts: Product[];
  currentProduct: Product | null; // Assuming currentProduct is a single Product or null when no product is selected
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product | null>>; // Correctly typed setter function
  handleEdit: (product: Product) => void;
  handleDelete: (id: number) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancel: () => void;
  handleEditSave: () => void;
  imagePreview: string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  currentProducts,
  currentProduct,
  setCurrentProduct,
  handleEdit,
  handleDelete,
  isOpen,
  setIsOpen,
  handleImageUpload,
  handleCancel,
  handleEditSave,
  imagePreview,
}) => {
  return (
    <>
      <Table>
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow className="text-[#121F3E] dark:text-[#F4F6FF]">
            <TableHead>S/N</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Cost Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Img</TableHead>
            <TableHead className="text-center">Manage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product) => (
            <TableRow
              key={product.id}
              className="text-[#576378] dark:text-[#F4F6FF] text-xl"
            >
              <TableCell className="font-medium">INV00{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell className="text-center">{product.category}</TableCell>
              {/* <TableCell className="truncate max-w-[150px] md:overflow-visible md:whitespace-normal">
                {product.description}
              </TableCell> */}
              <TableCell className="truncate max-w-[150px]">
                {product.description}
              </TableCell>
              <TableCell>{product.rating.count}</TableCell>
              <TableCell>{product.rating.rate}</TableCell>
              <TableCell>
                <div className="w-40">
                  <img
                    alt={product.title}
                    src={product.image}
                    className="w-full transition shadow-xl h-52 object-fit rounded-xl"
                  />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-4">
                  <Dialog
                    open={isOpen}
                    onOpenChange={(open) => setIsOpen(open)}
                  >
                    <DialogTrigger>
                      <Icon
                        icon="mage:edit-pen"
                        className="w-5 h-5 font-bold text-[#121F3E] cursor-pointer dark:text-[#F4F6FF]"
                        onClick={() => handleEdit(product)} // Open dialog with selected product
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="dark:text-[#F4F6FF]">
                          Edit Inventory Stock Entry
                        </DialogTitle>
                        <DialogDescription>
                          <div className="space-y-10 overflow-x-auto">
                            <div>
                              <span className="dark:text-[#F4F6FF] flex items-start">
                                Product Name:
                              </span>
                              <label className="relative flex flex-col-reverse group">
                                <input
                                  type="text"
                                  name="title"
                                  value={currentProduct?.title || ""}
                                  onChange={(e) =>
                                    setCurrentProduct((prev) =>
                                      prev
                                        ? { ...prev, title: e.target.value }
                                        : null
                                    )
                                  }
                                  required
                                  className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                                />
                              </label>
                            </div>

                            <div className="space-y-2">
                              <span className="dark:text-[#F4F6FF] flex items-start">
                                Description:
                              </span>
                              <label className="relative flex flex-col-reverse group">
                                <Textarea
                                  name="description"
                                  value={currentProduct?.description || ""}
                                  onChange={(e) => {
                                    setCurrentProduct((prev) => {
                                      if (!prev) return null; // If `prev` is null, don't update
                                      return {
                                        ...prev,
                                        description: e.target.value, // Correctly update the `description` field
                                      };
                                    });
                                  }}
                                  required
                                  className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10"
                                  placeholder="Type your message here."
                                />
                              </label>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                              <div className="space-y-2">
                                <span className="dark:text-[#F4F6FF]">
                                  Quantity:
                                </span>
                                <label className="relative flex flex-col-reverse group">
                                  <input
                                    type="number"
                                    name="quantity"
                                    value={currentProduct?.rating.count || ""}
                                    onChange={(e) =>
                                      setCurrentProduct((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              rating: {
                                                ...prev.rating,
                                                count: +e.target.value,
                                              },
                                            }
                                          : null
                                      )
                                    }
                                    required
                                    className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-[150px] sm:w-[200px] max-w-full"
                                  />
                                </label>
                              </div>

                              <div className="space-y-2">
                                <span className="dark:text-[#F4F6FF]">
                                  Price:
                                </span>
                                <label className="relative flex flex-col-reverse group">
                                  <input
                                    type="number"
                                    name="price"
                                    value={currentProduct?.price || ""}
                                    onChange={(e) =>
                                      setCurrentProduct((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              price: +e.target.value,
                                            }
                                          : null
                                      )
                                    }
                                    required
                                    className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-[150px] sm:w-[200px] max-w-full"
                                  />
                                </label>
                              </div>

                              <div className="space-y-2">
                                <span className="dark:text-[#F4F6FF]">
                                  Rate:
                                </span>
                                <label className="relative flex flex-col-reverse group">
                                  <input
                                    type="number"
                                    name="rating"
                                    value={currentProduct?.rating.rate || ""}
                                    onChange={(e) =>
                                      setCurrentProduct((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              rating: {
                                                ...prev.rating,
                                                rate: +e.target.value,
                                              },
                                            }
                                          : null
                                      )
                                    }
                                    required
                                    className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-[150px] sm:w-[200px] max-w-full"
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="flex items-start text-sm font-medium text-gray-700">
                                Upload Image
                              </label>
                              <div className="relative w-full">
                                <label
                                  htmlFor="file-upload"
                                  className="w-full flex flex-col items-center justify-center text-center text-sm text-gray-500 border rounded-lg cursor-pointer focus:outline-none border-dashed border-[#213899] h-[100px] bg-gray-50 hover:bg-gray-100"
                                >
                                  <div>
                                    <span className="font-medium text-blue-500 underline hover:text-blue-700">
                                      Click to upload
                                    </span>
                                    <span> or Drag & drop</span>
                                  </div>
                                  <span className="mt-1 text-xs text-gray-400">
                                    Max upload size: 15MB
                                  </span>
                                  <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              {imagePreview && (
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="h-56 mt-4 border rounded-lg"
                                />
                              )}
                            </div>

                            <div className="flex justify-end gap-4 py-8">
                              <Button variant="ghost" onClick={handleCancel}>
                                Cancel
                              </Button>
                              <Button
                                variant="secondary"
                                className="bg-[#213899] text-white hover:text-[#47505B]"
                                onClick={handleEditSave} // Save the changes
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Icon
                      icon="mage:trash-3"
                      className="w-5 h-5 font-bold text-[#121F3E] cursor-pointer dark:text-[#ee4242]"
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductTable;
