
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contentUrl: z.string().url("Must be a valid URL"),
  assetUsed: z.string().optional(),
});

export default function SubmitContentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      contentUrl: "",
      assetUsed: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please login to submit content",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('submissions')
        .insert([
          {
            user_id: user.id,
            content_url: values.contentUrl,
            asset_used: values.assetUsed || null,
            type: 'content', // default type
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Content submitted successfully",
        description: "Your content is now pending review",
      });
      
      navigate("/dashboard/content");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit content",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Submit New Content</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your content title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/your-content" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Used (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Asset ID or URL" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Content"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
