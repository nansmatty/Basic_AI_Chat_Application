import { writeFileSync, createReadStream } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI();

// DOCS : https://platform.openai.com/docs/api-reference/audio/createTranslation

async function createTranscription() {
	const response = await openai.audio.transcriptions.create({
		file: createReadStream('harvard.wav'),
		model: 'whisper-1',
		language: 'en',
	});

	console.log(response);
}

createTranscription();
