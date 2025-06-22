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

function getOrderStatus(orderId: string) {
	console.log(`Getting the status of order ${orderId}`);
	const orderAsNumber = parseInt(orderId);
	if (orderAsNumber % 2 == 0) {
		return 'IN_PROGRESS';
	}
	return 'COMPLETED';
}

async function callOpenAiWithTools() {
	const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content: 'You are a helpful assistant that gives information about the time of day and order status.',
		},
		{
			role: 'user',
			content: 'What is the order status of order 1235?',
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
			{
				type: 'function',
				function: {
					name: 'getOrderStatus',
					description: 'Returns the status of an order',
					parameters: {
						type: 'object',
						properties: {
							orderId: {
								type: 'string',
								description: 'The ID of the order to get the status of',
							},
						},
						required: ['orderId'],
					},
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

		if (toolName == 'getOrderStatus') {
			const rawArgs = toolCall.function.arguments;

			console.log({ rawArgs });

			const parseArguments = JSON.parse(rawArgs);

			console.log({ parseArguments });

			const toolResult = getOrderStatus(parseArguments.orderId);
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
