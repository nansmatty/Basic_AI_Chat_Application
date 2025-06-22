// When we write tools for openAI there are four steps need to follow
// 1. Configure chat tools (first openAI call)
// 2. Decide if tool call required
// 3. Invoke the tool
// 4. Make a second OpenAI call with the tool results.

import { OpenAI } from 'openai';

const openai = new OpenAI();

function getTimeOfDay() {
	return new Date().toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});
}

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
		tools: [
			{
				type: 'function',
				function: {
					name: 'getTimeOfDay',
					description: 'Get the time of day',
				},
			},
		],
		tool_choice: 'auto', // The engine will decide which tool to use
	});

	const willInvokeFunction = response.choices[0].finish_reason === 'tool_calls';
	const toolCall = response.choices[0].message.tool_calls![0];

	if (willInvokeFunction) {
		const toolName = toolCall.function.name;

		if (toolName == 'getTimeOfDay') {
			const toolResult = getTimeOfDay();
			context.push(response.choices[0].message);
			context.push({
				role: 'tool',
				content: toolResult,
				tool_call_id: toolCall.id,
			});
		}
	}

	const secondResponse = await openai.chat.completions.create({
		model: 'gpt-4o-2024-11-20',
		messages: context,
	});

	console.log({ secondResponse: secondResponse.choices[0].message.content });
	return;
}

callOpenAiWithTools();
