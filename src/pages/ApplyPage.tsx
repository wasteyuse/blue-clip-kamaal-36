
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  socialMediaLinks: z.string().min(1, {
    message: "Please provide at least one social media link.",
  }),
  experience: z.string().min(10, {
    message: "Please tell us about your content creation experience.",
  }),
  interests: z.string().min(10, {
    message: "Please tell us about your content interests.",
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      socialMediaLinks: "",
      experience: "",
      interests: "",
      termsAccepted: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Mock submission - would connect to Supabase in production
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for applying to join BlueHustle. We'll review your application and get back to you soon.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Apply to Join BlueHustle</h1>
          <p className="text-gray-600">
            Fill out the form below to apply as a creator. We'll review your application and get back to you within 48 hours.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="socialMediaLinks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Media Links</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Instagram: https://instagram.com/yourusername&#10;YouTube: https://youtube.com/yourusername" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide links to your social media profiles (one per line).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Creation Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your content creation experience..." 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Interests</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What kind of content are you interested in creating?" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions
                      </FormLabel>
                      <FormDescription>
                        By submitting this application, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
