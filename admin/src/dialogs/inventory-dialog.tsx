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
import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction } from "react";

type FormState = {
  title: string;
  category: string;
  quantity: string; // Or number, depending on your earlier decision
  costPrice: string;
  rate: string;
  image: string;
  description: string;
  errors: {
    title: string;
    category: string;
    quantity: string;
    costPrice: string;
    rate: string;
    description: string;
  };
};

type InventoryDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  formState: FormState;
  handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  handleImageUpload: React.ChangeEventHandler<HTMLInputElement>;
  handleSave: () => void;
  imagePreview: string | null;
  products: Product[];
  setFormState: Dispatch<SetStateAction<FormState>>;
};

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

const InventoryDialog: React.FC<InventoryDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  formState,
  handleInputChange,
  handleImageUpload,
  handleSave,
  imagePreview,
  products,
  setFormState,
}) => {
  return (
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
                    className={`absolute leading-10 transition transform left-4 top-4 ${
                      formState.description
                        ? "-translate-y-4 text-gray-500"
                        : ""
                    } group-focus-within:-translate-y-14 group-focus-within:text-gray-500`}
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
                        formState.quantity ? "-translate-y-8 text-gray-500" : ""
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
                    .filter((category) => category && category.trim() !== "")
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
  );
};

export default InventoryDialog;
