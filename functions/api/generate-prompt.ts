// Cloudflare Function for Claude API prompt generation
// @ts-ignore
export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const CLAUDE_API_KEY = env.CLAUDE_API_KEY;
    if (!CLAUDE_API_KEY) {
      console.error('Claude API key not configured');
      return new Response(JSON.stringify({ error: 'Claude API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { productName, productVision, targetAudience, problemStatement, additionalRequirements } = requestBody;

    const systemPrompt = `You are an expert at writing clear, comprehensive prompts for developers to use with Replit to build modern web applications. You excel at taking product requirements and turning them into detailed, actionable prompts that result in high-quality applications.

Your task is to take the user's product requirements and create a comprehensive prompt that includes:
1. The provided base template structure
2. Intelligent expansion of their requirements
3. Specific technical recommendations based on their use case
4. Clear implementation guidance

Always maintain the exact structure and format of the base template, but intelligently fill in and expand the sections based on the user's input.`;

    const baseTemplate = `You're building a sleek, modern web application using **React**, **Tailwind CSS**, **shadcn/ui**, and optional **tweakcn** themes. Follow these rules carefully:

---

## 🧠 Product Overview

**Goal:** Build a web application that helps [PRODUCT_PURPOSE]

**Why it matters:** This app is meant to [PROBLEM_SOLUTION]

**Audience:** Designed for [TARGET_AUDIENCE]

---

## 🎨 Design Style

Use the following to make the app look modern and clean:

- **shadcn/ui** components for layout and structure (e.g. \`Card\`, \`Button\`, \`Input\`, \`Tabs\`, \`Dialog\`)
- **Tailwind CSS** for layout and spacing (stick to 8px rhythm)
- Optional: **tweakcn** theme (e.g., \`amberMinimal\`, \`metroPop\`, or \`earthTones\`) to apply a cool color palette and typography
- Responsive and accessible by default
- Avoid custom CSS unless absolutely necessary

---

## 📱 UX Expectations

- Mobile-friendly, easy to navigate
- Use real or placeholder data
- Include **loading**, **empty**, and **error** states
- Clear headings, labels, and CTA buttons
- Focus on **clarity and simplicity**
- Feel like a real product demo or MVP

---

## 🚀 Install Guide (Optional for devs)

\`\`\`bash
# Init shadcn/ui with MCP
npx shadcn@latest init

# Add common components
npx shadcn@latest add button card dialog input form tabs

# Optional: Add tweakcn and theme config
npm install tweakcn
\`\`\`

---

## 🔧 Specific Requirements

[ADDITIONAL_REQUIREMENTS]

---

Please build this application with the specifications above. Make sure it's fully functional and includes all the necessary components for a complete user experience.`;

    const userPrompt = `Please create a comprehensive Replit prompt using this base template and the following user requirements:

**Product Name:** ${productName || 'Not provided'}
**Product Vision:** ${productVision || 'Not provided'}
**Target Audience:** ${targetAudience || 'Not provided'}
**Problem Statement:** ${problemStatement || 'Not provided'}
**Additional Requirements:** ${additionalRequirements || 'None specified'}

BASE TEMPLATE TO USE:
${baseTemplate}

Instructions:
1. Keep the exact structure and formatting of the base template
2. Replace [PRODUCT_PURPOSE] with an intelligent interpretation of the product vision
3. Replace [PROBLEM_SOLUTION] with a clear statement based on the problem statement
4. Replace [TARGET_AUDIENCE] with the specified audience
5. Replace [ADDITIONAL_REQUIREMENTS] with the additional requirements, or suggest relevant requirements if none provided
6. Make the prompt comprehensive and actionable for a developer using Replit
7. Ensure all technical specifications remain intact`;

    console.log('Making request to Claude API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = errorData.error?.message || errorData.message || response.statusText;
        console.error('Claude API error details:', errorData);
      } catch {
        errorText = response.statusText;
      }
      throw new Error(`Claude API error: ${errorText}`);
    }

    let data;
    try {
      data = await response.json();
      console.log('Claude API response received successfully');
    } catch (error) {
      console.error('Failed to parse Claude API response:', error);
      throw new Error('Invalid response from Claude API');
    }

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected Claude API response structure:', data);
      throw new Error('Invalid response structure from Claude API');
    }

    const generatedPrompt = data.content[0].text;
    return new Response(JSON.stringify({ prompt: generatedPrompt }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating prompt:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate prompt',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}