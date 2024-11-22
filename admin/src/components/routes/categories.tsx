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
import { Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { apiService } from "@/service/api-service";
import SearchTable from "../Search";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css";

type SingleCategory = {
  id: number; // Adding ID for unique identification
  category: string;
};

// Define a category array type
type Category = SingleCategory[];

const Category = () => {
  const [category, setCategory] = useState<SingleCategory[]>([]); // Initialize as SingleCategory[]
  const [formState, setFormState] = useState({
    category: "",
    errors: {
      category: "",
    },
  });
  const [currentCategory, setCurrentCategory] = useState<SingleCategory | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, ,] = useState(10);
  const [filteredCategories, setFilteredCategories] = useState<
    SingleCategory[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(category.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    try {
      const res = await apiService.getCategories();
      const formattedCategories: SingleCategory[] = res.map(
        (item: string, index: number) => ({
          id: index + 1,
          category: item as
            | "electronics"
            | "jewelery"
            | "men's clothing"
            | "women's clothing", // Ensuring category is of correct type
        })
      );
      setCategory(formattedCategories);
      setFilteredCategories(formattedCategories);
      localStorage.setItem("category", JSON.stringify(formattedCategories)); // Save to local storage
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedCategory: Category = JSON.parse(
      localStorage.getItem("category") || "[]"
    );
    if (storedCategory.length > 0) {
      setCategory(storedCategory);
      setFilteredCategories(storedCategory);
    } else {
      fetchData();
    }
  }, []);

  // useEffect(() => {
  //   const storedCategory: Category = JSON.parse(
  //     localStorage.getItem("category") || "[]"
  //   );
  //   fetchData();
  //   setCategory(storedCategory);
  //   setFilteredCategories(storedCategory);
  // }, []);

  const validateForm = () => {
    const errors = {
      category: formState.category ? "" : "Category is required.",
    };

    setFormState((prev) => ({ ...prev, errors }));

    return !Object.values(errors).some((error) => error);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const updatedCategory = currentCategory
      ? category.map((p) =>
          p.id === currentCategory.id
            ? { ...p, category: formState.category } // Update existing category
            : p
        )
      : [
          ...category,
          {
            id: category.length + 1,
            category: formState.category, // Add new category
          },
        ];

    setCategory(updatedCategory);
    setFilteredCategories(updatedCategory); // Update filtered categories
    localStorage.setItem("category", JSON.stringify(updatedCategory));

    // Reset form and state
    setDialogOpen(false);
    setFormState({ category: "", errors: { category: "" } });
    setCurrentCategory(null);
  };

  const handleEditSave = () => {
    if (!currentCategory) return;

    const updatedCategory = category.map((p) =>
      p.id === currentCategory.id
        ? { ...p, category: currentCategory.category }
        : p
    );

    setCategory(updatedCategory);
    setFilteredCategories(updatedCategory); // Sync filtered categories
    localStorage.setItem("category", JSON.stringify(updatedCategory));
    setIsOpen(false);
    setCurrentCategory(null);

    toast.success("Category updated successfully.");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
      handleEditSave();
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    }
  };

  const handleCancel = () => {
    setCurrentCategory(null);
    closeDialog();
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleEdit = (category: SingleCategory) => {
    setCurrentCategory(category);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedCategory = category.filter((cat) => cat.id !== id);
      setCategory(updatedCategory);
      setFilteredCategories(updatedCategory); // Sync filtered categories
      localStorage.setItem("category", JSON.stringify(updatedCategory));
      toast.success("Category deleted.");
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term) {
      const lowercasedTerm = term.toLowerCase();
      setFilteredCategories(
        category.filter((cat) =>
          cat.category.toLowerCase().includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredCategories(category);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    handleSearch(searchTerm); // Trigger search on submit
  };

  return (
    <>
      <div className="flex justify-between w-full gap-6 pt-20 md:gap-0">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex w-full gap-2 md:gap-20">
            <SearchTable onSearch={handleSearch} />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground md:hidden" />
            <Button variant="outline" className="hidden md:flex">
              Search
            </Button>
          </div>
        </form>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="dark:text-[#F4F6FF]">
                New Inventory Stock Entry
              </DialogTitle>
              <DialogDescription>
                <div className="space-y-10 overflow-x-auto">
                  <div className="space-y-2">
                    <label className="relative flex flex-col-reverse group">
                      <input
                        type="text"
                        name="category"
                        value={formState.category}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        required
                        className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                      />
                      <span
                        className={`absolute leading-10 transition transform left-4 ${
                          formState.category
                            ? "-translate-y-8 text-gray-500"
                            : ""
                        } group-focus-within:-translate-y-8 group-focus-within:text-gray-500`}
                      >
                        Category Name
                      </span>
                    </label>
                    {formState.errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 flex justify-end px-8 py-8">
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
        <Table className="">
          <TableCaption>A list of your recent category.</TableCaption>
          <TableHeader>
            <TableRow className="text-[#121F3E] dark:text-[#F4F6FF]">
              <TableHead className="w-[100px]">S/N</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCategories.map((categoryItem) => (
              <TableRow
                key={categoryItem.id}
                className="text-[#576378] dark:text-[#F4F6FF]"
              >
                <TableCell>INV00{categoryItem.id}</TableCell>
                <TableCell className="font-medium">
                  {categoryItem.category}
                </TableCell>

                {/* Actions */}
                <TableCell className="flex items-center justify-center gap-4">
                  {/* Edit Button */}
                  <Dialog
                    open={isOpen}
                    onOpenChange={(open) => setIsOpen(open)}
                  >
                    <DialogTrigger>
                      <Icon
                        icon="mage:edit-pen"
                        className="w-5 h-5 font-bold text-[#121F3E] dark:text-[#F4F6FF]"
                        onClick={() =>
                          handleEdit(categoryItem as SingleCategory)
                        }
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="dark:text-[#F4F6FF]">
                          Edit Category
                        </DialogTitle>
                        <DialogDescription>
                          {/* Add your form or input for editing */}
                          <div className="space-y-10 overflow-x-auto">
                            <div className="space-y-2">
                              <span className="dark:text-[#F4F6FF] flex items-start">
                                Category Name:
                              </span>
                              <label className="relative flex flex-col-reverse group">
                                <input
                                  type="text"
                                  name="title"
                                  value={currentCategory?.category || ""}
                                  onKeyDown={handleEnterPress}
                                  onChange={(e) =>
                                    setCurrentCategory((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            category: e.target.value as
                                              | "electronics"
                                              | "jewelery"
                                              | "men's clothing"
                                              | "women's clothing",
                                          }
                                        : null
                                    )
                                  }
                                  required
                                  className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="absolute bottom-0 right-0 flex justify-end px-8 py-8">
                            <Button variant="ghost" onClick={handleCancel}>
                              Cancel
                            </Button>
                            <Button
                              variant="secondary"
                              className="bg-[#213899] text-white hover:text-[#2E2F30]"
                              onClick={handleEditSave}
                            >
                              Save
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(categoryItem.id)}
                  >
                    <Icon
                      icon="mage:trash-3"
                      className="w-5 h-5 font-bold text-[#121F3E] cursor-pointer dark:text-[#bbb2b2]"
                    />
                  </Button>
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
      </div>

      <ToastContainer />
    </>
  );
};

export default Category;
