import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Clock, CheckCircle, AlertCircle, Loader2, Search } from "lucide-react";

const allCountries = [
  { iso2: "AF", name: "Afghanistan", dialCode: "+93", flag: "🇦🇫" },
  { iso2: "AL", name: "Albania", dialCode: "+355", flag: "🇦🇱" },
  { iso2: "DZ", name: "Algeria", dialCode: "+213", flag: "🇩🇿" },
  { iso2: "AD", name: "Andorra", dialCode: "+376", flag: "🇦🇩" },
  { iso2: "AO", name: "Angola", dialCode: "+244", flag: "🇦🇴" },
  { iso2: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { iso2: "AM", name: "Armenia", dialCode: "+374", flag: "🇦🇲" },
  { iso2: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { iso2: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { iso2: "AZ", name: "Azerbaijan", dialCode: "+994", flag: "🇦🇿" },
  { iso2: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
  { iso2: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
  { iso2: "BY", name: "Belarus", dialCode: "+375", flag: "🇧🇾" },
  { iso2: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { iso2: "BZ", name: "Belize", dialCode: "+501", flag: "🇧🇿" },
  { iso2: "BJ", name: "Benin", dialCode: "+229", flag: "🇧🇯" },
  { iso2: "BT", name: "Bhutan", dialCode: "+975", flag: "🇧🇹" },
  { iso2: "BO", name: "Bolivia", dialCode: "+591", flag: "🇧🇴" },
  { iso2: "BA", name: "Bosnia and Herzegovina", dialCode: "+387", flag: "🇧🇦" },
  { iso2: "BW", name: "Botswana", dialCode: "+267", flag: "🇧🇼" },
  { iso2: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { iso2: "BN", name: "Brunei", dialCode: "+673", flag: "🇧🇳" },
  { iso2: "BG", name: "Bulgaria", dialCode: "+359", flag: "🇧🇬" },
  { iso2: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
  { iso2: "BI", name: "Burundi", dialCode: "+257", flag: "🇧🇮" },
  { iso2: "KH", name: "Cambodia", dialCode: "+855", flag: "🇰🇭" },
  { iso2: "CM", name: "Cameroon", dialCode: "+237", flag: "🇨🇲" },
  { iso2: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { iso2: "CV", name: "Cape Verde", dialCode: "+238", flag: "🇨🇻" },
  { iso2: "CF", name: "Central African Republic", dialCode: "+236", flag: "🇨🇫" },
  { iso2: "TD", name: "Chad", dialCode: "+235", flag: "🇹🇩" },
  { iso2: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { iso2: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { iso2: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { iso2: "KM", name: "Comoros", dialCode: "+269", flag: "🇰🇲" },
  { iso2: "CG", name: "Congo", dialCode: "+242", flag: "🇨🇬" },
  { iso2: "CD", name: "Congo (Democratic Republic)", dialCode: "+243", flag: "🇨🇩" },
  { iso2: "CR", name: "Costa Rica", dialCode: "+506", flag: "🇨🇷" },
  { iso2: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { iso2: "HR", name: "Croatia", dialCode: "+385", flag: "🇭🇷" },
  { iso2: "CU", name: "Cuba", dialCode: "+53", flag: "🇨🇺" },
  { iso2: "CY", name: "Cyprus", dialCode: "+357", flag: "🇨🇾" },
  { iso2: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿" },
  { iso2: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { iso2: "DJ", name: "Djibouti", dialCode: "+253", flag: "🇩🇯" },
  { iso2: "DM", name: "Dominica", dialCode: "+1767", flag: "🇩🇲" },
  { iso2: "DO", name: "Dominican Republic", dialCode: "+1", flag: "🇩🇴" },
  { iso2: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨" },
  { iso2: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { iso2: "SV", name: "El Salvador", dialCode: "+503", flag: "🇸🇻" },
  { iso2: "GQ", name: "Equatorial Guinea", dialCode: "+240", flag: "🇬🇶" },
  { iso2: "ER", name: "Eritrea", dialCode: "+291", flag: "🇪🇷" },
  { iso2: "EE", name: "Estonia", dialCode: "+372", flag: "🇪🇪" },
  { iso2: "SZ", name: "Eswatini", dialCode: "+268", flag: "🇸🇿" },
  { iso2: "ET", name: "Ethiopia", dialCode: "+251", flag: "🇪🇹" },
  { iso2: "FJ", name: "Fiji", dialCode: "+679", flag: "🇫🇯" },
  { iso2: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
  { iso2: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { iso2: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦" },
  { iso2: "GM", name: "Gambia", dialCode: "+220", flag: "🇬🇲" },
  { iso2: "GE", name: "Georgia", dialCode: "+995", flag: "🇬🇪" },
  { iso2: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { iso2: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  { iso2: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
  { iso2: "GD", name: "Grenada", dialCode: "+1473", flag: "🇬🇩" },
  { iso2: "GT", name: "Guatemala", dialCode: "+502", flag: "🇬🇹" },
  { iso2: "GN", name: "Guinea", dialCode: "+224", flag: "🇬🇳" },
  { iso2: "GW", name: "Guinea-Bissau", dialCode: "+245", flag: "🇬🇼" },
  { iso2: "GY", name: "Guyana", dialCode: "+592", flag: "🇬🇾" },
  { iso2: "HT", name: "Haiti", dialCode: "+509", flag: "🇭🇹" },
  { iso2: "HN", name: "Honduras", dialCode: "+504", flag: "🇭🇳" },
  { iso2: "HU", name: "Hungary", dialCode: "+36", flag: "🇭🇺" },
  { iso2: "IS", name: "Iceland", dialCode: "+354", flag: "🇮🇸" },
  { iso2: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { iso2: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { iso2: "IR", name: "Iran", dialCode: "+98", flag: "🇮🇷" },
  { iso2: "IQ", name: "Iraq", dialCode: "+964", flag: "🇮🇶" },
  { iso2: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
  { iso2: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱" },
  { iso2: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { iso2: "JM", name: "Jamaica", dialCode: "+1876", flag: "🇯🇲" },
  { iso2: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { iso2: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
  { iso2: "KZ", name: "Kazakhstan", dialCode: "+7", flag: "🇰🇿" },
  { iso2: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { iso2: "KI", name: "Kiribati", dialCode: "+686", flag: "🇰🇮" },
  { iso2: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { iso2: "KG", name: "Kyrgyzstan", dialCode: "+996", flag: "🇰🇬" },
  { iso2: "LA", name: "Laos", dialCode: "+856", flag: "🇱🇦" },
  { iso2: "LV", name: "Latvia", dialCode: "+371", flag: "🇱🇻" },
  { iso2: "LB", name: "Lebanon", dialCode: "+961", flag: "🇱🇧" },
  { iso2: "LS", name: "Lesotho", dialCode: "+266", flag: "🇱🇸" },
  { iso2: "LR", name: "Liberia", dialCode: "+231", flag: "🇱🇷" },
  { iso2: "LY", name: "Libya", dialCode: "+218", flag: "🇱🇾" },
  { iso2: "LI", name: "Liechtenstein", dialCode: "+423", flag: "🇱🇮" },
  { iso2: "LT", name: "Lithuania", dialCode: "+370", flag: "🇱🇹" },
  { iso2: "LU", name: "Luxembourg", dialCode: "+352", flag: "🇱🇺" },
  { iso2: "MG", name: "Madagascar", dialCode: "+261", flag: "🇲🇬" },
  { iso2: "MW", name: "Malawi", dialCode: "+265", flag: "🇲🇼" },
  { iso2: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
  { iso2: "MV", name: "Maldives", dialCode: "+960", flag: "🇲🇻" },
  { iso2: "ML", name: "Mali", dialCode: "+223", flag: "🇲🇱" },
  { iso2: "MT", name: "Malta", dialCode: "+356", flag: "🇲🇹" },
  { iso2: "MH", name: "Marshall Islands", dialCode: "+692", flag: "🇲🇭" },
  { iso2: "MR", name: "Mauritania", dialCode: "+222", flag: "🇲🇷" },
  { iso2: "MU", name: "Mauritius", dialCode: "+230", flag: "🇲🇺" },
  { iso2: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { iso2: "FM", name: "Micronesia", dialCode: "+691", flag: "🇫🇲" },
  { iso2: "MD", name: "Moldova", dialCode: "+373", flag: "🇲🇩" },
  { iso2: "MC", name: "Monaco", dialCode: "+377", flag: "🇲🇨" },
  { iso2: "MN", name: "Mongolia", dialCode: "+976", flag: "🇲🇳" },
  { iso2: "ME", name: "Montenegro", dialCode: "+382", flag: "🇲🇪" },
  { iso2: "MA", name: "Morocco", dialCode: "+212", flag: "🇲🇦" },
  { iso2: "MZ", name: "Mozambique", dialCode: "+258", flag: "🇲🇿" },
  { iso2: "MM", name: "Myanmar", dialCode: "+95", flag: "🇲🇲" },
  { iso2: "NA", name: "Namibia", dialCode: "+264", flag: "🇳🇦" },
  { iso2: "NR", name: "Nauru", dialCode: "+674", flag: "🇳🇷" },
  { iso2: "NP", name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
  { iso2: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { iso2: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { iso2: "NI", name: "Nicaragua", dialCode: "+505", flag: "🇳🇮" },
  { iso2: "NE", name: "Niger", dialCode: "+227", flag: "🇳🇪" },
  { iso2: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { iso2: "KP", name: "North Korea", dialCode: "+850", flag: "🇰🇵" },
  { iso2: "MK", name: "North Macedonia", dialCode: "+389", flag: "🇲🇰" },
  { iso2: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { iso2: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
  { iso2: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
  { iso2: "PW", name: "Palau", dialCode: "+680", flag: "🇵🇼" },
  { iso2: "PS", name: "Palestine", dialCode: "+970", flag: "🇵🇸" },
  { iso2: "PA", name: "Panama", dialCode: "+507", flag: "🇵🇦" },
  { iso2: "PG", name: "Papua New Guinea", dialCode: "+675", flag: "🇵🇬" },
  { iso2: "PY", name: "Paraguay", dialCode: "+595", flag: "🇵🇾" },
  { iso2: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
  { iso2: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { iso2: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
  { iso2: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { iso2: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { iso2: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴" },
  { iso2: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
  { iso2: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼" },
  { iso2: "WS", name: "Samoa", dialCode: "+685", flag: "🇼🇸" },
  { iso2: "SM", name: "San Marino", dialCode: "+378", flag: "🇸🇲" },
  { iso2: "ST", name: "Sao Tome and Principe", dialCode: "+239", flag: "🇸🇹" },
  { iso2: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { iso2: "SN", name: "Senegal", dialCode: "+221", flag: "🇸🇳" },
  { iso2: "RS", name: "Serbia", dialCode: "+381", flag: "🇷🇸" },
  { iso2: "SC", name: "Seychelles", dialCode: "+248", flag: "🇸🇨" },
  { iso2: "SL", name: "Sierra Leone", dialCode: "+232", flag: "🇸🇱" },
  { iso2: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { iso2: "SK", name: "Slovakia", dialCode: "+421", flag: "🇸🇰" },
  { iso2: "SI", name: "Slovenia", dialCode: "+386", flag: "🇸🇮" },
  { iso2: "SB", name: "Solomon Islands", dialCode: "+677", flag: "🇸🇧" },
  { iso2: "SO", name: "Somalia", dialCode: "+252", flag: "🇸🇴" },
  { iso2: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { iso2: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { iso2: "SS", name: "South Sudan", dialCode: "+211", flag: "🇸🇸" },
  { iso2: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { iso2: "LK", name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
  { iso2: "SD", name: "Sudan", dialCode: "+249", flag: "🇸🇩" },
  { iso2: "SR", name: "Suriname", dialCode: "+597", flag: "🇸🇷" },
  { iso2: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { iso2: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { iso2: "SY", name: "Syria", dialCode: "+963", flag: "🇸🇾" },
  { iso2: "TJ", name: "Tajikistan", dialCode: "+992", flag: "🇹🇯" },
  { iso2: "TZ", name: "Tanzania", dialCode: "+255", flag: "🇹🇿" },
  { iso2: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { iso2: "TL", name: "Timor-Leste", dialCode: "+670", flag: "🇹🇱" },
  { iso2: "TG", name: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { iso2: "TO", name: "Tonga", dialCode: "+676", flag: "🇹🇴" },
  { iso2: "TT", name: "Trinidad and Tobago", dialCode: "+1868", flag: "🇹🇹" },
  { iso2: "TN", name: "Tunisia", dialCode: "+216", flag: "🇹🇳" },
  { iso2: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
  { iso2: "TM", name: "Turkmenistan", dialCode: "+993", flag: "🇹🇲" },
  { iso2: "TV", name: "Tuvalu", dialCode: "+688", flag: "🇹🇻" },
  { iso2: "UG", name: "Uganda", dialCode: "+256", flag: "🇺🇬" },
  { iso2: "UA", name: "Ukraine", dialCode: "+380", flag: "🇺🇦" },
  { iso2: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { iso2: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { iso2: "UY", name: "Uruguay", dialCode: "+598", flag: "🇺🇾" },
  { iso2: "UZ", name: "Uzbekistan", dialCode: "+998", flag: "🇺🇿" },
  { iso2: "VU", name: "Vanuatu", dialCode: "+678", flag: "🇻🇺" },
  { iso2: "VA", name: "Vatican City", dialCode: "+39", flag: "🇻🇦" },
  { iso2: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },
  { iso2: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
  { iso2: "YE", name: "Yemen", dialCode: "+967", flag: "🇾🇪" },
  { iso2: "ZM", name: "Zambia", dialCode: "+260", flag: "🇿🇲" },
  { iso2: "ZW", name: "Zimbabwe", dialCode: "+263", flag: "🇿🇼" },
].sort((a, b) => a.name.localeCompare(b.name));

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
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Debounced search to improve performance (only for filtering, not input value)
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(countrySearch);
    }, 150);

    return () => clearTimeout(timer);
  }, [countrySearch]);

  // Filter countries based on debounced search
  const filteredCountries = useMemo(() => {
    if (!debouncedSearch.trim()) return allCountries;
    const searchLower = debouncedSearch.toLowerCase();
    return allCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchLower) ||
        country.dialCode.includes(debouncedSearch) ||
        country.dialCode.replace('+', '').includes(debouncedSearch)
    );
  }, [debouncedSearch]);

  // Focus management - stable and persistent
  useEffect(() => {
    if (isCountryDropdownOpen && searchInputRef.current) {
      // Focus immediately when dropdown opens
      const timer = setTimeout(() => {
        if (searchInputRef.current && isCountryDropdownOpen) {
          searchInputRef.current.focus({ preventScroll: true });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isCountryDropdownOpen]);

  // Handle search input changes with IME support
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Always update the input value immediately for responsive UI
    const value = e.target.value;
    setCountrySearch(value);
    
    // Don't prevent updates during composition
    if (isComposing) return;
  }, [isComposing]);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    setCountrySearch(e.currentTarget.value);
  }, []);

  // Handle keyboard navigation in dropdown
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCountryDropdownOpen(false);
      setCountrySearch("");
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCountryDropdownOpen]);

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

  // Handle country selection
  const handleCountrySelect = useCallback((country: typeof allCountries[0]) => {
    form.setValue('countryCode', country.dialCode);
    form.setValue('countryIso2', country.iso2);
    setIsCountryDropdownOpen(false);
    setCountrySearch("");
  }, [form]);

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
                    render={({ field }) => {
                      const selectedCountry = allCountries.find(c => c.dialCode === field.value) || allCountries[0];
                      
                      return (
                        <FormItem className="w-48">
                          <div className="relative" ref={dropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCountryDropdownOpen(!isCountryDropdownOpen);
                                if (!isCountryDropdownOpen) {
                                  setCountrySearch("");
                                }
                              }}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-left bg-white flex items-center justify-between"
                              data-testid="select-country-code"
                              aria-expanded={isCountryDropdownOpen}
                              aria-haspopup="listbox"
                            >
                              <span className="flex items-center gap-2">
                                <span>{selectedCountry.flag}</span>
                                <span className="text-sm">{selectedCountry.dialCode}</span>
                              </span>
                              <svg
                                className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {isCountryDropdownOpen && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                                <div className="sticky top-0 bg-white p-2 border-b z-10">
                                  <div className="relative">
                                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                                    <Input
                                      ref={searchInputRef}
                                      placeholder="Search country or code..."
                                      value={countrySearch}
                                      onChange={handleSearchChange}
                                      onCompositionStart={handleCompositionStart}
                                      onCompositionEnd={handleCompositionEnd}
                                      onKeyDown={handleSearchKeyDown}
                                      className="pl-8 h-8 text-sm"
                                      data-testid="search-country"
                                      autoComplete="off"
                                      role="searchbox"
                                      aria-label="Search countries"
                                    />
                                  </div>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {filteredCountries.map((country) => (
                                    <button
                                      key={country.iso2}
                                      type="button"
                                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 flex items-center gap-2 text-sm"
                                      onClick={() => handleCountrySelect(country)}
                                      onMouseDown={(e) => e.preventDefault()}
                                      tabIndex={-1}
                                      role="option"
                                    >
                                      <span>{country.flag}</span>
                                      <span>{country.name}</span>
                                      <span className="text-gray-500 ml-auto">{country.dialCode}</span>
                                    </button>
                                  ))}
                                  {filteredCountries.length === 0 && (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                      No countries found
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
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
              
              {/* reCAPTCHA */}
              <div className="flex justify-center">
                {import.meta.env.VITE_CAPTCHA_SITE_KEY ? (
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token || "")}
                    onExpired={() => setRecaptchaToken("")}
                    onErrored={() => setRecaptchaToken("")}
                    data-testid="recaptcha"
                  />
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-700 font-medium">reCAPTCHA Configuration Needed</p>
                    <p className="text-sm text-yellow-600 mt-1">Please add your Google reCAPTCHA site key to enable verification</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3"
                      onClick={() => setRecaptchaToken("demo-token")}
                      data-testid="button-recaptcha-demo"
                    >
                      Use Demo Mode
                    </Button>
                  </div>
                )}
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
