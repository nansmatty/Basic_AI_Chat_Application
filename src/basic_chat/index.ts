import { OpenAI } from 'openai';

const openai = new OpenAI();

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
	{
		role: 'system',
		content: 'You are a helpful assistant.',
	},
];

// when gpt responses it role is assistant and when i put some data then my role is user and for initial setup we need to set role system and the content.
// The content helps or how the way gpt will act if you say humor or funny it response will like that to.

async function createChatCompletion() {
	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: context,
	});
	const responseMessage = response.choices[0].message;
	context.push(responseMessage);

	console.log(`${response.choices[0].message.role}: ${response.choices[0].message.content}`);
}

process.stdin.addListener('data', async (input) => {
	const userInput = input.toString().trim();

	context.push({
		role: 'user',
		content: userInput,
	});

	await createChatCompletion();
});
