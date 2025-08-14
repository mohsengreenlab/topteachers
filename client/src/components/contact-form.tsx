import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const countries = [
  { iso2: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { iso2: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { iso2: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { iso2: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { iso2: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { iso2: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { iso2: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { iso2: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { iso2: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { iso2: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { iso2: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { iso2: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { iso2: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { iso2: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { iso2: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
  { iso2: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { iso2: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
  { iso2: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
  { iso2: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿" },
  { iso2: "HU", name: "Hungary", dialCode: "+36", flag: "🇭🇺" },
  { iso2: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
  { iso2: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴" },
  { iso2: "BG", name: "Bulgaria", dialCode: "+359", flag: "🇧🇬" },
  { iso2: "HR", name: "Croatia", dialCode: "+385", flag: "🇭🇷" },
  { iso2: "SK", name: "Slovakia", dialCode: "+421", flag: "🇸🇰" },
  { iso2: "SI", name: "Slovenia", dialCode: "+386", flag: "🇸🇮" },
  { iso2: "EE", name: "Estonia", dialCode: "+372", flag: "🇪🇪" },
  { iso2: "LV", name: "Latvia", dialCode: "+371", flag: "🇱🇻" },
  { iso2: "LT", name: "Lithuania", dialCode: "+370", flag: "🇱🇹" },
  { iso2: "LU", name: "Luxembourg", dialCode: "+352", flag: "🇱🇺" },
  { iso2: "MT", name: "Malta", dialCode: "+356", flag: "🇲🇹" },
  { iso2: "CY", name: "Cyprus", dialCode: "+357", flag: "🇨🇾" },
  { iso2: "IS", name: "Iceland", dialCode: "+354", flag: "🇮🇸" },
  { iso2: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
  { iso2: "UA", name: "Ukraine", dialCode: "+380", flag: "🇺🇦" },
  { iso2: "BY", name: "Belarus", dialCode: "+375", flag: "🇧🇾" },
  { iso2: "MD", name: "Moldova", dialCode: "+373", flag: "🇲🇩" },
  { iso2: "RS", name: "Serbia", dialCode: "+381", flag: "🇷🇸" },
  { iso2: "ME", name: "Montenegro", dialCode: "+382", flag: "🇲🇪" },
  { iso2: "BA", name: "Bosnia and Herzegovina", dialCode: "+387", flag: "🇧🇦" },
  { iso2: "MK", name: "North Macedonia", dialCode: "+389", flag: "🇲🇰" },
  { iso2: "AL", name: "Albania", dialCode: "+355", flag: "🇦🇱" },
  { iso2: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { iso2: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { iso2: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { iso2: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { iso2: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { iso2: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { iso2: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
  { iso2: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { iso2: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
  { iso2: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { iso2: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
  { iso2: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
  { iso2: "LK", name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
  { iso2: "NP", name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
  { iso2: "MM", name: "Myanmar", dialCode: "+95", flag: "🇲🇲" },
  { iso2: "KH", name: "Cambodia", dialCode: "+855", flag: "🇰🇭" },
  { iso2: "LA", name: "Laos", dialCode: "+856", flag: "🇱🇦" },
  { iso2: "BN", name: "Brunei", dialCode: "+673", flag: "🇧🇳" },
  { iso2: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { iso2: "FJ", name: "Fiji", dialCode: "+679", flag: "🇫🇯" },
  { iso2: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { iso2: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { iso2: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { iso2: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { iso2: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { iso2: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
  { iso2: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },
  { iso2: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨" },
  { iso2: "UY", name: "Uruguay", dialCode: "+598", flag: "🇺🇾" },
  { iso2: "PY", name: "Paraguay", dialCode: "+595", flag: "🇵🇾" },
  { iso2: "BO", name: "Bolivia", dialCode: "+591", flag: "🇧🇴" },
  { iso2: "GY", name: "Guyana", dialCode: "+592", flag: "🇬🇾" },
  { iso2: "SR", name: "Suriname", dialCode: "+597", flag: "🇸🇷" },
  { iso2: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { iso2: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { iso2: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { iso2: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  { iso2: "TZ", name: "Tanzania", dialCode: "+255", flag: "🇹🇿" },
  { iso2: "UG", name: "Uganda", dialCode: "+256", flag: "🇺🇬" },
  { iso2: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼" },
  { iso2: "ET", name: "Ethiopia", dialCode: "+251", flag: "🇪🇹" },
  { iso2: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { iso2: "MA", name: "Morocco", dialCode: "+212", flag: "🇲🇦" },
  { iso2: "TN", name: "Tunisia", dialCode: "+216", flag: "🇹🇳" },
  { iso2: "DZ", name: "Algeria", dialCode: "+213", flag: "🇩🇿" },
  { iso2: "LY", name: "Libya", dialCode: "+218", flag: "🇱🇾" },
  { iso2: "SD", name: "Sudan", dialCode: "+249", flag: "🇸🇩" },
  { iso2: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { iso2: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { iso2: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { iso2: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { iso2: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
  { iso2: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
  { iso2: "YE", name: "Yemen", dialCode: "+967", flag: "🇾🇪" },
  { iso2: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
  { iso2: "LB", name: "Lebanon", dialCode: "+961", flag: "🇱🇧" },
  { iso2: "SY", name: "Syria", dialCode: "+963", flag: "🇸🇾" },
  { iso2: "IQ", name: "Iraq", dialCode: "+964", flag: "🇮🇶" },
  { iso2: "IR", name: "Iran", dialCode: "+98", flag: "🇮🇷" },
  { iso2: "AF", name: "Afghanistan", dialCode: "+93", flag: "🇦🇫" },
  { iso2: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
  { iso2: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱" },
  { iso2: "PS", name: "Palestine", dialCode: "+970", flag: "🇵🇸" },
];

const contactFormSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Please enter your message"),
  countryCode: z.string().optional(),
  phone: z.string().optional().refine((phone) => {
    if (!phone || phone.trim() === "") return true; // Optional field
    // Basic phone validation - allows digits, spaces, dashes, parentheses
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 7;
  }, "Please enter a valid phone number"),
  countryIso2: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      countryCode: "+1",
      phone: "",
      countryIso2: "US",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData & { recaptcha: string }) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message sent successfully!",
        description: data.message,
      });
      form.reset();
      // Reset reCAPTCHA if available
      if ((window as any).grecaptcha) {
        (window as any).grecaptcha.reset();
      }
      setRecaptchaToken("");
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    if (!recaptchaToken) {
      toast({
        title: "Verification required",
        description: "Please complete the reCAPTCHA verification",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate({
      ...data,
      recaptcha: recaptchaToken,
    });
  };

  // Handle reCAPTCHA callback
  const handleRecaptchaCallback = (token: string) => {
    setRecaptchaToken(token);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-600">
            Get in touch with us today and we'll help you find the perfect tutor for your learning goals.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          data-testid="input-name"
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                          data-testid="input-email"
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-subject" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all">
                          <SelectValue placeholder="Select a subject (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="find-tutor">I want to find a tutor</SelectItem>
                        <SelectItem value="become-tutor">I want to become a tutor</SelectItem>
                        <SelectItem value="general-inquiry">General inquiry</SelectItem>
                        <SelectItem value="technical-support">Technical support</SelectItem>
                        <SelectItem value="billing">Billing question</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem className="w-48">
                        <Select 
                          onValueChange={(value) => {
                            // Value format: "iso2:dialCode" (e.g., "US:+1")
                            const [iso2, dialCode] = value.split(':');
                            field.onChange(dialCode);
                            form.setValue('countryIso2', iso2);
                          }} 
                          defaultValue={`US:${field.value}`}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-country-code" className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {countries.map((country) => (
                              <SelectItem key={country.iso2} value={`${country.iso2}:${country.dialCode}`}>
                                {country.flag} {country.name} ({country.dialCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                            data-testid="input-phone"
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Message *</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Tell us about your learning goals, preferred subjects, or any questions you have..."
                        {...field}
                        data-testid="textarea-message"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-vertical"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* reCAPTCHA placeholder - would be implemented with react-google-recaptcha */}
              <div className="flex justify-center">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-600">reCAPTCHA verification would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Click here to simulate verification</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => setRecaptchaToken("demo-token")}
                    data-testid="button-recaptcha"
                  >
                    Verify (Demo)
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit"
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          
          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div data-testid="contact-info-email">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-white h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                <p className="text-gray-600">support@topteachers.online</p>
              </div>
              
              <div data-testid="contact-info-telegram">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="text-white h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.74 8.206c-.131.616-.475.765-.963.475L12 14.64l-1.85 1.78c-.205.205-.376.376-.771.376l.274-3.891 7.066-6.384c.308-.273-.067-.426-.478-.153L8.378 11.49l-2.82-.881c-.612-.192-.622-.612.128-.906L19.176 6.98c.51-.192.957.123.792.906z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Message Us</h4>
                <a 
                  href="https://t.me/topteachersonline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  @topteachersonline
                </a>
              </div>
              
              <div data-testid="contact-info-hours">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-white h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Support Hours</h4>
                <p className="text-gray-600">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
