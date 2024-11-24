import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { apiService } from "@/service/api-service";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css";
import ProductTable from "../../tables/inventory-table";
import InventoryDialog from "@/dialogs/inventory-dialog";

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
    // Load products from local storage on initial load
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    if (storedProducts.length > 0) {
      setProducts(storedProducts);
    } else {
      // If no stored products, fetch from API
      fetchData();
    }
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

    toast.success("Product deleted.");
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

        <InventoryDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          formState={formState}
          handleInputChange={handleInputChange}
          handleImageUpload={handleImageUpload}
          handleSave={handleSave}
          imagePreview={imagePreview}
          products={products}
          setFormState={setFormState}
        />
      </div>

      <div className="container relative mx-auto mt-4 overflow-x-auto">
        <ProductTable
          currentProducts={currentProducts}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleEdit={handleEdit}
          currentProduct={currentProduct}
          setCurrentProduct={setCurrentProduct}
          handleImageUpload={handleImageUpload}
          imagePreview={imagePreview}
          handleCancel={handleCancel}
          handleEditSave={handleEditSave}
          handleDelete={handleDelete}
        />

        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Showing {currentProducts.length} of {filteredProducts.length}{" "}
            entries
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
      </div>

      <ToastContainer />
    </>
  );
};

export default Inventory;
