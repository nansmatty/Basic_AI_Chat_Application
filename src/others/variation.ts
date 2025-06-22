import { createReadStream, writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI();

// DALL-E-3 doesn't support image variation yet or maybe not even in future so use DALL-E-2

async function generateImageVariation() {
	const response = await openai.images.createVariation({
		image: createReadStream('dinasour.png'),
		model: 'dall-e-2', // If we dont pass still we wont get any error because currently only DALL-E-2 is only support model for image variation
		size: '1024x1024',
		response_format: 'b64_json',
		n: 1,
	});

	const rawImage = response.data && response.data[0]?.b64_json;

	if (rawImage) {
		writeFileSync('dinasour_variation.png', Buffer.from(rawImage, 'base64'));
	}
}

generateImageVariation();
