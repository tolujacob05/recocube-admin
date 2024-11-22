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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { apiService } from "@/service/api-service";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css";

export type Product = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  rating: {
    count: number;
    rate: number;
  };
};

const Inventory = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(
    JSON.parse(localStorage.getItem("products") || "[]")
  );
  const [formState, setFormState] = useState({
    title: "",
    category: "",
    quantity: "",
    costPrice: "",
    rate: "",
    image: "",
    description: "",
    errors: {
      title: "",
      category: "",
      quantity: "",
      costPrice: "",
      rate: "",
      description: "",
    },
  });
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, ,] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setFormState({ ...formState, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchData = async () => {
    try {
      const res = await apiService.getAllProducts();
      console.log(res);
      setProducts(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    fetchData();
    setProducts(storedProducts);
  }, []);

  const validateForm = () => {
    const errors = {
      title: formState.title ? "" : "Product/Service Name is required.",
      category: formState.category ? "" : "Category is required.",
      quantity: formState.quantity ? "" : "Quantity is required.",
      costPrice: formState.costPrice ? "" : "Cost Price is required.",
      rate: formState.rate ? "" : "Rate is required.",
      description: formState.description ? "" : "Description is required.",
    };

    setFormState((prev) => ({ ...prev, errors }));

    return !Object.values(errors).some((error) => error); // Return true if no errors
  };

  const handleSave = () => {
    if (!validateForm()) {
      return; // Do not proceed if there are validation errors
    }

    const newProduct: Product = {
      id: products.length + 1,
      title: formState.title,
      category: formState.category,
      description: formState.description,
      image: formState.image,
      price: parseFloat(formState.costPrice),
      rating: {
        count: parseInt(formState.quantity, 10),
        rate: parseFloat(formState.rate),
      },
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setDialogOpen(false); // Close dialog
    setFormState({
      title: "",
      category: "",
      quantity: "",
      costPrice: "",
      rate: "",
      image: "",
      description: "",
      errors: {
        title: "",
        category: "",
        quantity: "",
        costPrice: "",
        rate: "",
        description: "",
      },
    });
    setImagePreview(null);
    toast.success("Item successfully added. Please check inventory lists.");
  };

  const handleEditSave = () => {
    if (!currentProduct) return;

    const updatedProducts = currentProduct.id
      ? products.map((p) => (p.id === currentProduct.id ? currentProduct : p)) // Edit existing product
      : [...products, { ...currentProduct, id: Date.now() }]; // Add new product

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts)); // Save to local storage
    setIsOpen(false); // Close dialog
    setCurrentProduct(null); // Reset form
    setImagePreview(null); // Clear image preview
    toast.success("Edit saved! Check product.");
  };

  const handleCancel = () => {
    console.log("handleCancel called");
    setCurrentProduct(null);
    closeDialog();
  };

  const closeDialog = () => {
    console.log("closeDialog called");
    setIsOpen(false); // Close the dialog when cancel is clicked
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setImagePreview(product.image); // Set image preview for the dialog
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filteredProducts.length === 0) {
      toast.error("No products found!");
    }
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Match title
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) || // Match category
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) // Match description
  );

  // Calculate total pages based on filtered products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get the current page's products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex justify-between w-full pt-20">
        <form>
          <div className="relative flex w-full gap-2 md:gap-20">
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm} // Bind the search term
              onChange={handleSearchChange} // Update the search term
              className="relative pl-3 shadow-none appearance-none w-96 bg-background dark:text-[#F4F6FF]"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground md:hidden" />
            <Button variant="outline" className="hidden md:flex">
              Search
            </Button>
          </div>
        </form>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="dark:text-[#F4F6FF]">
                New Inventory Stock Entry
              </DialogTitle>
              <DialogDescription>
                <div className="space-y-10 overflow-x-auto">
                  <div>
                    <label className="relative flex flex-col-reverse group">
                      <input
                        type="text"
                        name="title"
                        value={formState.title}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                      />
                      <span
                        className={`absolute leading-10 transition transform left-4 ${
                          formState.title ? "-translate-y-8 text-gray-500" : ""
                        } group-focus-within:-translate-y-8 group-focus-within:text-gray-500`}
                      >
                        Product/Service Name
                      </span>
                    </label>
                    {formState.errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="relative flex flex-col-reverse group">
                      <Textarea
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md w-full h-20"
                      />
                      <span
                        className={`absolute leading-10 transition transform left-4 ${
                          formState.description
                            ? "-translate-y-4 text-gray-500"
                            : ""
                        } group-focus-within:-translate-y-20 group-focus-within:text-gray-500`}
                      >
                        Description
                      </span>
                    </label>

                    {formState.errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="relative flex flex-col-reverse group">
                        <input
                          type="number"
                          name="quantity"
                          value={formState.quantity}
                          onChange={handleInputChange}
                          required
                          className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                        />
                        <span
                          className={`absolute leading-10 transition transform left-4 ${
                            formState.quantity
                              ? "-translate-y-8 text-gray-500"
                              : ""
                          } group-focus-within:-translate-y-8 group-focus-within:text-gray-500`}
                        >
                          Quantity
                        </span>
                      </label>
                      {formState.errors.quantity && (
                        <p className="mt-1 text-sm text-red-500">
                          {formState.errors.quantity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="relative flex flex-col-reverse group">
                        <input
                          type="number"
                          name="costPrice"
                          value={formState.costPrice}
                          onChange={handleInputChange}
                          required
                          className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                        />
                        <span
                          className={`absolute leading-10 transition transform left-4 ${
                            formState.costPrice
                              ? "-translate-y-8 text-gray-500"
                              : ""
                          } group-focus-within:-translate-y-8 group-focus-within:text-gray-500`}
                        >
                          Cost Price
                        </span>
                      </label>
                      {formState.errors.costPrice && (
                        <p className="mt-1 text-sm text-red-500">
                          {formState.errors.costPrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="relative flex flex-col-reverse group">
                        <input
                          type="number"
                          name="rate"
                          value={formState.rate}
                          onChange={handleInputChange}
                          required
                          className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                        />

                        <span
                          className={`absolute leading-10 transition transform left-4  ${
                            formState.rate ? "-translate-y-8 text-gray-500" : ""
                          } group-focus-within:-translate-y-8 group-focus-within:text-gray-500`}
                        >
                          Rate Price
                        </span>
                      </label>
                      {formState.errors.rate && (
                        <p className="mt-1 text-sm text-red-500">
                          {formState.errors.rate}
                        </p>
                      )}
                    </div>
                  </div>

                  <Select
                    value={formState.category}
                    onValueChange={(category) =>
                      setFormState({ ...formState, category })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select a category"
                        className="dark:text-[#F4F6FF]"
                      />
                    </SelectTrigger>
                    <SelectContent className="dark:text-[#F4F6FF]">
                      {[...new Set(products.map((item) => item.category))]
                        .filter(
                          (category) => category && category.trim() !== ""
                        )
                        .map((category, index) => (
                          <SelectItem
                            value={category}
                            key={index}
                            className="dark:text-[#F4F6FF]"
                          >
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
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
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Image Preview:
                      </h3>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-56 max-w-full mt-2 border rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 py-8">
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleSave}
                    className="bg-[#213899] text-white hover:text-[#47505B]"
                  >
                    Save
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full mt-4 overflow-x-auto md:overflow-x-visible">
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
                className="text-[#576378] dark:text-[#F4F6FF]"
              >
                <TableCell className="font-medium">INV00{product.id}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell className="text-center">
                  {product.category}
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.rating.count}</TableCell>
                <TableCell>{product.rating.rate}</TableCell>
                <TableCell>
                  <img
                    alt={product.title}
                    src={product.image}
                    className="w-full h-auto transition shadow-xl lg:h-20 object-fit rounded-xl"
                  />
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

        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Showing {itemsPerPage} entries per page
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white"
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)} // Set the clicked page as current
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Inventory;
