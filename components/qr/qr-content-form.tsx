"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQRCodeStore } from "@/store/qr-store";
import {
  QRCodeType,
  WiFiConfig,
  VCardConfig,
  SMSConfig,
  EmailConfig,
  CalendarConfig,
} from "@/types/qr";

const wifiSchema = z.object({
  ssid: z.string().min(1, "SSID is required"),
  password: z.string().optional(),
  security: z.enum(["WPA", "WEP", "nopass"]),
  hidden: z.boolean().optional(),
});

const vcardSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  organization: z.string().optional(),
  title: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

const smsSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().optional(),
});

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  body: z.string().optional(),
});

const calendarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  allDay: z.boolean().optional(),
});

type WiFiFormData = z.infer<typeof wifiSchema>;
type VCardFormData = z.infer<typeof vcardSchema>;
type SMSFormData = z.infer<typeof smsSchema>;
type EmailFormData = z.infer<typeof emailSchema>;
type CalendarFormData = z.infer<typeof calendarSchema>;

export function QRContentForm() {
  const { config, updateConfig } = useQRCodeStore();
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // Initialize all form hooks at the top level
  const wifiForm = useForm<WiFiFormData>({
    resolver: zodResolver(wifiSchema),
    defaultValues: formData,
  });

  const vcardForm = useForm<VCardFormData>({
    resolver: zodResolver(vcardSchema),
    defaultValues: formData,
  });

  const smsForm = useForm<SMSFormData>({
    resolver: zodResolver(smsSchema),
    defaultValues: formData,
  });

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: formData,
  });

  const calendarForm = useForm<CalendarFormData>({
    resolver: zodResolver(calendarSchema),
    defaultValues: formData,
  });

  // Parse existing content when type changes
  useEffect(() => {
    try {
      if (["wifi", "vcard", "sms", "email", "calendar"].includes(config.type)) {
        const parsed = JSON.parse(config.content);
        setFormData(parsed);
      } else {
        setFormData({});
      }
    } catch {
      setFormData({});
    }
  }, [config.type]);

  // Update form default values when formData changes
  useEffect(() => {
    wifiForm.reset(formData);
    vcardForm.reset(formData);
    smsForm.reset(formData);
    emailForm.reset(formData);
    calendarForm.reset(formData);
  }, [formData, wifiForm, vcardForm, smsForm, emailForm, calendarForm]);

  const updateContent = (newData: Record<string, unknown> | string) => {
    if (["wifi", "vcard", "sms", "email", "calendar"].includes(config.type)) {
      updateConfig({ content: JSON.stringify(newData) });
    } else {
      updateConfig({ content: newData });
    }
  };

  const renderSimpleForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={config.content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Enter your content here..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );

  const renderWiFiForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
    } = wifiForm;

    const onSubmit = (data: WiFiFormData) => {
      updateContent(data);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="ssid">Network Name (SSID)</Label>
          <Input id="ssid" {...register("ssid")} placeholder="MyWiFi" />
          {errors.ssid && (
            <p className="text-sm text-red-500">{errors.ssid.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Enter WiFi password"
          />
        </div>

        <div>
          <Label htmlFor="security">Security Type</Label>
          <Select
            value={watch("security") || "WPA"}
            onValueChange={(value) =>
              setValue("security", value as "WPA" | "WEP" | "nopass")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">No Password</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hidden"
            checked={watch("hidden") || false}
            onCheckedChange={(checked) => setValue("hidden", checked)}
          />
          <Label htmlFor="hidden">Hidden Network</Label>
        </div>
      </form>
    );
  };

  const renderVCardForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = vcardForm;

    const onSubmit = (data: VCardFormData) => {
      updateContent(data);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...register("lastName")} placeholder="Doe" />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              {...register("organization")}
              placeholder="Company Inc."
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Software Developer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+1234567890"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            {...register("website")}
            placeholder="https://example.com"
          />
          {errors.website && (
            <p className="text-sm text-red-500">{errors.website.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="123 Main St"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} placeholder="New York" />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register("state")} placeholder="NY" />
          </div>
          <div>
            <Label htmlFor="zip">ZIP</Label>
            <Input id="zip" {...register("zip")} placeholder="10001" />
          </div>
        </div>
      </form>
    );
  };

  const renderSMSForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = smsForm;

    const onSubmit = (data: SMSFormData) => {
      updateContent(data);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register("phone")} placeholder="+1234567890" />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Hello, how are you?"
            className="min-h-[80px]"
          />
        </div>
      </form>
    );
  };

  const renderEmailForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = emailForm;

    const onSubmit = (data: EmailFormData) => {
      updateContent(data);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subject">Subject (Optional)</Label>
          <Input id="subject" {...register("subject")} placeholder="Hello" />
        </div>

        <div>
          <Label htmlFor="body">Message Body (Optional)</Label>
          <Textarea
            id="body"
            {...register("body")}
            placeholder="Hello, how are you?"
            className="min-h-[80px]"
          />
        </div>
      </form>
    );
  };

  const renderCalendarForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
    } = calendarForm;

    const onSubmit = (data: CalendarFormData) => {
      updateContent(data);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" {...register("title")} placeholder="Meeting" />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Team meeting"
            className="min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Conference Room"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date & Time</Label>
            <Input
              id="startDate"
              type="datetime-local"
              {...register("startDate")}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="endDate">End Date & Time</Label>
            <Input
              id="endDate"
              type="datetime-local"
              {...register("endDate")}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="allDay"
            checked={watch("allDay") || false}
            onCheckedChange={(checked) => setValue("allDay", checked)}
          />
          <Label htmlFor="allDay">All Day Event</Label>
        </div>
      </form>
    );
  };

  const renderForm = () => {
    switch (config.type) {
      case "url":
      case "text":
      case "phone":
        return renderSimpleForm();
      case "wifi":
        return renderWiFiForm();
      case "vcard":
        return renderVCardForm();
      case "sms":
        return renderSMSForm();
      case "email":
        return renderEmailForm();
      case "calendar":
        return renderCalendarForm();
      default:
        return renderSimpleForm();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Configuration</CardTitle>
      </CardHeader>
      <CardContent>{renderForm()}</CardContent>
    </Card>
  );
}
