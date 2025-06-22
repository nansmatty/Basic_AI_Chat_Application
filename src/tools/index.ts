// When we write tools for openAI there are four steps need to follow
// 1. Configure chat tools (first openAI call)
// 2. Decide if tool call required
// 3. Invoke the tool
// 4. Make a second OpenAI call with the tool results.

import { OpenAI } from 'openai';

const openai = new OpenAI();

async function callOpenAiWithTools() {
	const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content: 'You are a helpful assistant that gives information about the time of day.',
		},
		{
			role: 'user',
			content: 'What time of day is it?',
		},
	];

	const response = await openai.chat.completions.create({
		model: 'gpt-4o-2024-11-20',
		messages: context,
	});

	console.log({ response: response.choices[0].message.content });
}

callOpenAiWithTools();
