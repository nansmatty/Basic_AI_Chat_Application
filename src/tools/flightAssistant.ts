import { OpenAI } from 'openai';

const openai = new OpenAI();

function getAvailableFlights(departure: string, destination: string): string[] {
	console.log('Getting available flights.');

	if (departure === 'BOM' && destination === 'DEL') {
		return ['AI 123', 'AI 456'];
	}

	if (departure === 'CCU' && destination === 'BOM') {
		return ['AI 789', 'AI 101'];
	}

	if (departure === 'BOM' && destination === 'BLR') {
		return ['AI 202', 'AI 303'];
	}

	if (departure === 'BLR' && destination === 'CCU') {
		return ['AI 404', 'AI 505'];
	}

	return ['AI 404', 'AI 505'];
}

function reserveFlight(flightNumber: string): string {
	if (flightNumber.length == 6) {
		console.log(`Reserving the flight ${flightNumber}`);
		return '3645934968';
	}
	return 'FLIGHT_BOOKED';
}

const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
	{
		role: 'system',
		content: 'You are a helpful assistant that helps users book flights and reservations.',
	},
	// {
	// 	role: 'user',
	// 	content: 'I want to book a flight from BOM to DEL',
	// },
];

async function callOpenAiWithTools() {
	const response = await openai.chat.completions.create({
		model: 'gpt-4o-2024-11-20',
		messages: context,
		tools: [
			{
				type: 'function',
				function: {
					name: 'getAvailableFlights', // Needs to match the exact function or tool name
					description: 'Returns the available flights from the given departure and destination',
					parameters: {
						type: 'object',
						properties: {
							departure: {
								type: 'string',
								description: 'The departure airport code',
							},
							destination: {
								type: 'string',
								description: 'The destination airport code',
							},
						},
						required: ['departure', 'destination'],
					},
				},
			},
			{
				type: 'function',
				function: {
					name: 'reserveFlight', // Needs to match the exact function or tool name
					description: 'Reserves a flight for the given flight number',
					parameters: {
						type: 'object',
						properties: {
							flightNumber: {
								type: 'string',
								description: 'The flight number to reserve',
							},
						},
						required: ['flightNumber'],
					},
				},
			},
		],

		tool_choice: 'auto',
	});

	const willInvokeFunction = response.choices[0].finish_reason === 'tool_calls';

	if (willInvokeFunction) {
		const toolCall = response.choices[0].message.tool_calls![0];

		if (toolCall.function.name == 'getAvailableFlights') {
			// In this two part we are actually extracting the user role context what user asked to do.
			const rawArgs = toolCall.function.arguments;
			const parseArguments = JSON.parse(rawArgs);

			// function calling
			const toolResult = getAvailableFlights(parseArguments.departure, parseArguments.destination);
			context.push(response.choices[0].message);
			context.push({
				role: 'tool',
				content: toolResult.toString(),
				tool_call_id: toolCall.id,
			});
		}

		if (toolCall.function.name == 'reserveFlight') {
			// In this two part we are actually extracting the user role context what user asked to do.
			const rawArgs = toolCall.function.arguments;
			const parseArguments = JSON.parse(rawArgs);

			// function calling
			const toolResult = reserveFlight(parseArguments.flightNumber);
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
}

console.log('Hello from flight assistant chatbot! How may I help you?');
process.stdin.addListener('data', async function (input) {
	let userInput = input.toString().trim();

	context.push({
		role: 'user',
		content: userInput,
	});

	await callOpenAiWithTools();
});
