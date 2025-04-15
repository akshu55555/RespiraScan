export const askAI = async (question, reportText, final_result) => {
    try {
      const prompt = `[Act as a pulmonologist] Answer based on:
      Report: ${reportText.substring(0, 2000)}
      Diagnosis: ${final_result.label} (${(final_result.confidence * 100).toFixed(1)}% confidence)
      
      Question: ${question}
      
      Rules:
      - Be clinically precise
      - Cite relevant findings
      - If uncertain: "Consult your doctor about ${final_result.label}"`;
  
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.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}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7
            }
          })
        }
      );
  
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API error ${response.status}`);
      }
  
      const result = await response.json();
      return result[0]?.generated_text || "Please consult your physician for this matter.";
  
    } catch (error) {
      console.error("AI Service Error:", error);
      return "Our medical AI is currently unavailable. For urgent concerns, please contact your healthcare provider.";
    }
  };