import { writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI();

async function generateFreeImage() {
	const response = await openai.images.generate({
		prompt: 'A photo of a cat on a mat.',
		model: 'dall-e-3',
		style: 'vivid', // This option is only available in DALL-E-3 Model
		quality: 'standard', // This options has also vary based on model choice
		size: '1792x1024', // This options has also vary based on model choice
		n: 1, // number of images to generate
	});

	console.log(response);
}

async function generateFreeLocalImage() {
	const response = await openai.images.generate({
		prompt: 'A dinasour eating grass.',
		model: 'dall-e-3',
		style: 'vivid', // This option is only available in DALL-E-3 Model
		quality: 'hd', // This options has also vary based on model choice
		size: '1792x1024', // This options has also vary based on model choice
		n: 1, // number of images to generate
		response_format: 'b64_json',
	});

	const rawImage = response.data && response.data[0]?.b64_json;

	if (rawImage) {
		writeFileSync('dinasour.jpeg', Buffer.from(rawImage, 'base64'));
	}
}

generateFreeLocalImage();

// Learn More about Image Model and there Options visit this site
// https://platform.openai.com/docs/api-reference/images/create

//Check the pricing model as well to get the idea of image generation cose as per model
//https://platform.openai.com/docs/pricing
