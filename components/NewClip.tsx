import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Image, Link2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { clipSchema } from "@/lib/utils";

type ClipFormValues = z.infer<typeof clipSchema>;

interface NewClipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClipFormValues) => void;
}

const items = [
  {
    label: "Text",
    value: "text",
    icon: FileText,
  },
//   {
//     label: "Image",
//     value: "image",
//     icon: Image,
//   },
  {
    label: "Link",
    value: "link",
    icon: Link2,
  },
];

export const NewClipDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: NewClipDialogProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const form = useForm<ClipFormValues>({
    resolver: zodResolver(clipSchema) as Resolver<ClipFormValues>,
    defaultValues: {
      content: "",
      type: "text",
      isFavorite: false,
    },
  });

  const handleSubmit = (data: ClipFormValues) => {
    const sanitizedData = {
      ...data,
      content: data.content.trim(),
      isFavorite,
    };
    onSubmit(sanitizedData);
    form.reset();
    setIsFavorite(false);
    onOpenChange(false);
  };

  const selectedType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[500px]  backdrop-blur-md border"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold ">
            Create New Clip
          </DialogTitle>
          <DialogDescription>
            Add a new item to your clipboard history
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Type Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold">
                    Clip Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      {items.map((item) => (
                        <div key={item.value}>
                          <RadioGroupItem
                            value={item.value}
                            id={item.value}
                            className="peer sr-only"
                          />
                          <label
                            htmlFor={item.value}
                            className="flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-sm border-2 border-border rounded-xl cursor-pointer transition-all duration-200 hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <item.icon className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Input */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    {selectedType === "text" && "Text Content"}
                    {selectedType === "image" && "Image URL or Name"}
                    {selectedType === "link" && "URL"}
                  </FormLabel>
                  <FormControl>
                    {selectedType === "text" ? (
                      <Textarea
                        placeholder="Enter your text content..."
                        className="min-h-[120px] border resize-none"
                        {...field}
                      />
                    ) : (
                      <Input
                    
                        placeholder={
                          selectedType === "image"
                            ? "Enter image URL or file name..."
                            : "Enter URL..."
                        }
                        className="bg-white/70 backdrop-blur-sm border-white/30"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value.length} / 5000 characters
                  </p>
                </FormItem>
              )}
            />

            {/* Favorite Toggle */}
            <div className="flex items-center justify-between p-4 bg-primary/5 backdrop-blur-sm rounded-md border border-border">
              <div className="flex items-center gap-2">
                <Star
                  className={`w-5 h-5 transition-colors ${
                    isFavorite
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="text-sm font-medium">Add to Favorites</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isFavorite ? "bg-primary" : "border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isFavorite ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Clip
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
