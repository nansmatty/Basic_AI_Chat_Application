import { createReadStream, writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI();

// DOCS : https://platform.openai.com/docs/api-reference/audio/createTranslation

async function textToSpeech() {
	const sampletext =
		'Good morning, everyone. Today, let us embrace the power of unity and determination. Together, we can overcome challenges, inspire change, and create a brighter future. Remember, every small step contributes to a greater impact. Let’s move forward with hope, strength, and purpose. Thank you for being part of this journey.';

	const response = await openai.audio.speech.create({
		model: 'tts-1-hd',
		input: sampletext,
		voice: 'alloy',
		response_format: 'mp3',
	});

	const buffer = Buffer.from(await response.arrayBuffer());
	writeFileSync('speech.mp3', buffer);
}

textToSpeech();
