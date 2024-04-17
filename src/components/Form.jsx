"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "./ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const safety = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

const genAI = new GoogleGenerativeAI("AIzaSyAZ0RSEqQr-45A1OZ8j6aZg8sMCOHsTeoU");
const formSchema = z.object({
  description: z.string().min(30, "The description is too short."),
  length: z.number().min(100, "The length is too short."),
  portfolio: z.boolean(),
  tone: z.string().optional(),
});

export function ProfileForm({ setOpen, setResponse, setLoading }) {
  const [portfolio, setPortfolio] = useState("");

  const { toast } = useToast();
  // 2. Define a submit handler.
  async function onSubmit(values) {
    setLoading(true);
    setOpen(true);

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: safety,
    });
    const prompt = `
    Please write a proposal for this upwork job posting. The proposal must follow the instructions given below.

    >>>${values.description}<<<
    
    Instructions:
    >Word Count: Minimum ${values.length} words
    > ${values.tone ? `please use  ${values.tone} tone` : ""}
    > No title is required, Just directly write the proposal
     > Try to give a good starting impression by using a catchy lines like these.
    > The starting lines must be like this.
    1. "I am a professional Full-Stack dev with 7 years of experience in the field of programming."
    2. "I have worked on 100+ projects and have a 5-star rating on Upwork."
    4. "I am included in the top 3% of the freelancers (Top rated plus) on Upwork."

    > Also mention that I am available for meeting to discuss the project further, and meeting is always a good idea and of course it is not paid
  ${
    values.portfolio
      ? `> Also, include the portfolio in the proposal in a formatted manner and organized way, I just mentioned it roughly.
       > Also please fix the description in a lil bit more brief manner of the portfolio items, I just mentioned it roughly. Fix Grammar as well.
  https://design.inc/ (Paid Design Services Online) (Next, React , tailwind, node, mongo, amazons3 , stripe) (typescripte)
  https://blackalgo.com/  (Copy Trading Platform)   (Next, React , tailwind, node, mongo, amazons3 , stripe)
  https://www.nysun.com/ ( News Website) (Next, React , tailwind, node, mongo, amazons3 , stripe, Wordpress, Zavor)
  https://infohomes.com/ (property listing website with charts to show competion) (Next, tailwind, Chart.js, Supabase, aws cognito)
  https://business.verbyo.com/ (Marketing application to get leads for your business) (React , tailwind, node, MYSQL, amazons3 , stripe, MariaDb)
  https://tuk.dev/ (Based on tailwind components listing, free and paid) (Next, React , tailwind, node, mongo, amazons3 , stripe)
  https://www.getfigit.com/ (design componnets list for figma) (Next, React , tailwind)
  https://www.alphasquad.studio/  (Design and dev agency website) (Next, React , tailwind)
  https://qoves.com/ (Skin based AI solutions platform) (Next, React , tailwind)


  Mobile Apps:
  https://verbyo.com/ (App for the users marketing the business on social platforms) (React Native, tailwind, node, MYSQL, amazons3 , stripe, MariaDb)

  Vscode extensions:
  https://www.vsblox.com/ (Extension to simply copy paste pre made components directly in VS code) (Svelte, typescript, tailwind, node, mongo, amazons3 , stripe)
  https://marketplace.visualstudio.com/items?itemName=PythagoraTechnologies.gpt-pilot-vs-code (AI based coding assisatant directly in VS Code) (React, typescript, tailwind, node, mongo, amazons3 , stripe)
  
  `
      : ""
  }
    > Use one of these words for greeting in the start of the proposal.
    [Howdy!
        Hey there!
        Greetings!
        Salutations!
        Hiya!
        Good day!
        Aloha!
        Bonjour!
        Shalom!]
    `;

    const result = await model.generateContent(prompt);
    // safety settings

    const response = await result.response;
    const text = response.text();
    setResponse(text);
    setLoading(false);
    // copy to clipboard
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied ✅",
      description: "The response has been copied to your clipboard.",
    });
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      portfolio: true,
      length: 500,
      tone: "professional",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="length"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Response Length - {value}</FormLabel>
              <FormControl>
                <Slider
                  onValueChange={(vals) => {
                    onChange(vals[0]);
                  }}
                  defaultValue={[value]}
                  max={1200}
                  step={1}
                />
              </FormControl>
              <FormDescription>Select the length of response</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel htmlFor="portfolio">Include portfolio</FormLabel>
              <FormControl>
                <Checkbox
                  className="ml-2"
                  id="portfolio"
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
              <FormDescription>
                Do you want to include your portfolio in the response?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tone"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Select Tone</FormLabel>
              <FormControl>
                <Select
                  value={value}
                  onValueChange={onChange}
                  className="w-[240px]"
                >
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="collaborative">
                      Collaborative{" "}
                    </SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Select the tone of the response</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upwork Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste your Upwork job description."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please copy and paste the upwork job description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
