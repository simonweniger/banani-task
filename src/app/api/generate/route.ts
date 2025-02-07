import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { MessageContentSchema, type Message } from '@/types/messages';

interface GenerateRequest {
  messages: Message[];
}

export async function POST(request: Request) {
  const body: GenerateRequest = await request.json();
  const newMessages = body.messages;

  if (!newMessages) {
    return NextResponse.json({ error: "Messages is required" }, { status: 400 });
  }

  // const Step = z.object({
  //   explanation: z.string(),
  //   output: z.string(),
  // });

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: "You are a experienced senior designer. It's your job to generate new ui components" },
        ...newMessages.map(msg => ({
          role: msg.role,
          content: JSON.stringify(msg.content)
        }))
      ],
      response_format: zodResponseFormat(MessageContentSchema, "final_component"),
    });

    const completionContent = completion.choices[0].message.parsed;
    const result = {role:"assistant", content:completionContent};

    console.log("Result", result);
    return NextResponse.json({ result })  // NextResponse.json({ result: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}