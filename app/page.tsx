"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"
import { useState, useRef, ChangeEvent } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState<string>(""); // State for input text
  const [response, setResponse] = useState<string>(""); // State for generated response
  const [wordCount, setWordCount] = useState<number>(0); // State for word count
  const controllerRef = useRef<AbortController | null>(null); // Reference to AbortController

  // Function to handle text input changes
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    setPrompt(inputText);

    // Calculate word count
    const words = inputText.trim().split(/\s+/);
    const currentWordCount = words.length;
    setWordCount(currentWordCount);

    // Trigger API call if word count increased by 4
    if (currentWordCount % 4 === 0) {
      fetchCompletion(inputText); // Call the API with the current prompt
    }
  };

  // Fetch completion logic
  const fetchCompletion = async (currentPrompt: string) => {
    if (controllerRef.current) {
      controllerRef.current.abort(); // Abort the previous API call if still in progress
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch("http://127.0.0.1:5000/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
        signal: controller.signal, // Attach the abort signal
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.completion || "No response received.");
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Previous request aborted.");
      } else {
        console.error("Error fetching completion:", error);
        setResponse("An error occurred while fetching the completion.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <Label htmlFor="message-2">História Médica</Label>
      <Textarea
        placeholder="Comece a escrever aqui, a LLM completará o texto abaixo..."
        value={prompt}
        onChange={handleInputChange}
        className="w-2/3 h-32 p-4 border rounded-md"
      />
      

      {/* Response Textarea */}
      <Textarea
        placeholder="Texto Gerado aparecerá aqui"
        value={response}
        readOnly
        className="w-2/3 h-32 p-4 border rounded-md bg-gray-100"
      />
    </div>
  );
}
