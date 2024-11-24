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
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

type SingleCategory = {
  id: number;
  category: string; // Or the exact type used in the parent
};

interface CategoryTableProps {
  currentCategories: SingleCategory[];
  currentCategory: SingleCategory | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setCurrentCategory: React.Dispatch<
    React.SetStateAction<SingleCategory | null>
  >;
  handleEdit: (category: SingleCategory) => void;
  handleDelete: (id: number) => void;
  handleEditSave: () => void;
  handleCancel: () => void;
  handleEnterPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  currentCategories,
  currentCategory,
  isOpen,
  setIsOpen,
  setCurrentCategory,
  handleEdit,
  handleDelete,
  handleEditSave,
  handleCancel,
  handleEnterPress,
}) => {
  return (
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
            <TableCell className="flex items-center justify-center gap-4">
              <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <DialogTrigger>
                  <Icon
                    icon="mage:edit-pen"
                    className="w-5 h-5 font-bold text-[#121F3E] dark:text-[#F4F6FF]"
                    onClick={() => handleEdit(categoryItem)}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="dark:text-[#F4F6FF]">
                      Edit Category
                    </DialogTitle>
                    <DialogDescription>
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
  );
};

export default CategoryTable;
