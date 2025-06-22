import { createReadStream } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI();

// DOCS : https://platform.openai.com/docs/api-reference/audio/createTranslation

async function translate() {
	const response = await openai.audio.translations.create({
		file: createReadStream('bonjour.mp3'),
		model: 'whisper-1',
	});

	console.log(response.text);
}

translate();
