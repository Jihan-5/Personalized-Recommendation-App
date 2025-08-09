import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { OpenAI } from "https://deno.land/x/openai/mod.ts";

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY')! });

serve(async (req) => {
  try {
    const { description } = await req.json();

    if (!description || description.trim().length < 20) {
      return new Response(JSON.stringify({ summary: description }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes product descriptions into a single, engaging sentence." },
        { role: "user", content: `Summarize this: "${description}"` },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 60,
    });

    const summary = chatCompletion.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});