"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useRef, ChangeEvent } from "react";

export default function MedicalDocumentPage() {
  const [medicalHistory, setMedicalHistory] = useState<string>(""); // State for medical history input
  const [completion, setCompletion] = useState<string>(""); // State for LLM completion
  const [referral, setReferral] = useState<string>(""); // State for referral generation
  const controllerRef = useRef<AbortController | null>(null); // Reference to AbortController

  // Function to handle input changes in the Medical History
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    setMedicalHistory(inputText);

    // Calculate word count and trigger completion every 4 words
    const words = inputText.trim().split(/\s+/);
    if (words.length % 4 === 0) {
      fetchCompletion(inputText);
    }
  };

  // Fetch completion from the LLM
  const fetchCompletion = async (currentInput: string) => {
    if (controllerRef.current) {
      controllerRef.current.abort(); // Abort previous API call
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch("http://127.0.0.1:5000/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setCompletion(data.completion || "No response received.");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching completion:", error);
        setCompletion("An error occurred while fetching the completion.");
      }
    }
  };

  // Generate a referral
  const handleGenerateReferral = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: medicalHistory }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setReferral(data.result || "No referral generated.");
    } catch (error) {
      console.error("Error generating referral:", error);
      setReferral("An error occurred while generating the referral.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      {/* Medical History Section */}
      <div className="w-2/3">
        <Label htmlFor="medical-history">História Médica</Label>
        <Textarea
          id="medical-history"
          placeholder="Comece a escrever aqui. O LLM completará conforme necessário..."
          value={medicalHistory}
          onChange={handleInputChange}
          className="w-full h-40 p-4 border rounded-md"
        />
        <Textarea
          placeholder="Texto Gerado pelo LLM aparecerá aqui"
          value={completion}
          readOnly
          className="w-full h-20 p-4 mt-4 border rounded-md bg-gray-100"
        />
      </div>

      {/* Medical Referral Section */}
      <div className="w-2/3">
        <Label htmlFor="referral">Encaminhamento Médico</Label>
        <Textarea
          id="referral"
          placeholder="Texto do Encaminhamento aparecerá aqui..."
          value={JSON.stringify(referral)}
          readOnly
          className="w-full h-40 p-4 border rounded-md bg-gray-100"
        />
        <button
          onClick={handleGenerateReferral}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Gerar Encaminhamento
        </button>
      </div>
    </div>
  );
}
