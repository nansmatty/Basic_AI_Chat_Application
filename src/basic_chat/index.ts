import { OpenAI } from 'openai';

const openai = new OpenAI();

process.stdin.addListener('data', async (input) => {
	const userInput = input.toString().trim();

	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content: 'You are a helpful assistant.',
			},
			{
				role: 'user',
				content: userInput,
			},
		],
	});

	console.log(response.choices[0].message.content);
});
