import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { createMessageContentSchema, type Message } from '@/types/messages';
import { iconNames, TableStyleSchema } from '@/types/table';
import { zodToJsonSchema } from 'zod-to-json-schema';

interface GenerateRequest {
  messages: Message[];
}

export async function POST(request: Request) {
  const body: GenerateRequest = await request.json();
  const newMessages = body.messages;

  if (!newMessages) {
    return NextResponse.json({ error: "Messages is required" }, { status: 400 });
  }

  // here we create the schema for the table design in theory we could have first a model that generates the design strucutre (what components to use)
  // then get the schemas for each component and let different models design the components
  // since we just wanna create a table in this exercise we hard code the TableDesignSchema as a response format
  const MessageContentSchema = createMessageContentSchema(TableStyleSchema);
  const jsonSchema = zodToJsonSchema(MessageContentSchema, 'messageContent');
  const systemMessage = `You are an experienced senior designer. Create a table based on the users request. Stricktly follow their requirements.
            Available icons: ${iconNames.join(', ')}.

            STRICT REQUIREMENTS:
            1. ONLY use icon names from the list above. Any other icon names will cause an error.
            2. Double-check that each icon name matches EXACTLY with one from the list.
            3. Do not attempt to use similar or alternative icon names.

            Icons can be placed before or after text in cells.
            You can style icons with additional classes for color and size.

            Style the table based on the request from the user. Remember that you can make it bordered and change the border radius.
            
            IMPORTANT: FOLLOW THE USER INSTRUCTIONS AND USE THE REQUESTED AMOUNT OF ROWS AND COLUMNS!
            Only use icon names from the provided list above. Do not use any other icon names.
            
            Here is a example Json response:
            ---
            {
              title: "Employee Directory",
              bordered: true,
              borderRadius: "lg",
              header: {
                className: "bg-gray-100",
                cells: [
                  {
                    className: "font-bold",
                    content: {
                      text: "Employee",
                      icon: {
                        name: "person",
                        position: "before",
                        className: "text-blue-500"
                      }
                    }
                  },
                  {
                    className: "font-bold",
                    content: {
                      text: "Department",
                      icon: {
                        name: "business",
                        position: "before",
                        className: "text-gray-600"
                      }
                    }
                  },
                  {
                    className: "font-bold",
                    content: {
                      text: "Status",
                      icon: {
                        name: "info",
                        position: "before",
                        className: "text-gray-600"
                      }
                    }
                  }
                ]
              },
              rows: [
                {
                  className: "hover:bg-gray-50",
                  cells: [
                    {
                      className: "font-medium",
                      content: {
                        text: "John Doe",
                        icon: {
                          name: "account_circle",
                          position: "before",
                          className: "text-blue-400"
                        }
                      }
                    },
                    {
                      className: "",
                      content: {
                        text: "Engineering"
                      }
                    },
                    {
                      className: "text-green-600",
                      content: {
                        text: "Active",
                        icon: {
                          name: "check_circle",
                          position: "after",
                          className: "text-green-600"
                        }
                      }
                    }
                  ]
                },
                {
                  className: "hover:bg-gray-50",
                  cells: [
                    {
                      className: "font-medium",
                      content: {
                        text: "Jane Smith",
                        icon: {
                          name: "account_circle",
                          position: "before",
                          className: "text-blue-400"
                        }
                      }
                    },
                    {
                      className: "",
                      content: {
                        text: "Design"
                      }
                    },
                    {
                      className: "text-yellow-600",
                      content: {
                        text: "On Leave",
                        icon: {
                          name: "schedule",
                          position: "after",
                          className: "text-yellow-600"
                        }
                      }
                    }
                  ]
                }
              ]
            };

            ---

            Your Response must follow this JSON schema:
            ${JSON.stringify(jsonSchema, null, 2)}
            
            `;

  console.log("system Message", systemMessage)

  try {
    const maxRetries = 3;
    let attempt = 0;
    let validResponse = false;
    let result;

    while (!validResponse && attempt < maxRetries) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemMessage + (attempt > 0 ? "\n\nPrevious attempt failed validation. Please ensure the response strictly follows the schema and the user request!" : "")
            },
            ...newMessages.map(msg => ({
              role: msg.role,
              content: JSON.stringify(msg.content)
            }))
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        });

        const responseContent = completion.choices[0].message.content;
        const parsedContent = JSON.parse(responseContent || "{}");

        const validatedDesign = TableStyleSchema.parse(parsedContent.design);

        result = {
          role: "assistant",
          content: {
            message: parsedContent.message || "Here's your table design",
            design: validatedDesign
          }
        };
        validResponse = true;
      } catch (validationError) {
        attempt++;
        console.error(`Attempt ${attempt} failed:`, validationError);
        if (attempt >= maxRetries) {
          throw new Error("Failed to generate valid response after multiple attempts");
        }
      }
    }

    console.log("Result", result);
    return NextResponse.json({ result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Failed to generate valid response",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}