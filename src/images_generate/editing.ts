import { createReadStream, writeFileSync } from 'fs';
import OpenAI, { toFile } from 'openai';

const openai = new OpenAI();

// Failed to generate image edit getting error some kind application/octet-stream it is not detection the image as png rather it is different

async function generateImageEdit() {
	try {
		// Although it generate an edit image need to check and pass the same image as mask and variation and mask one needs to be edited a specific part but it will cost us so try with caution

		const image = await toFile(createReadStream('dinasourVariation.png'), 'dinasourVariation.png', {
			type: 'image/png',
		});
		const mask = await toFile(createReadStream('dinasour_mask.png'), 'dinasour_mask.png', {
			type: 'image/png',
		});

		const response = await openai.images.edit({
			image,
			mask,
			prompt: 'Add the night sky with bright stars on same image.',
			model: 'dall-e-2',
			response_format: 'b64_json',
		});

		const rawImage = response.data?.[0]?.b64_json;
		if (rawImage) {
			writeFileSync('dinasour_edit.png', Buffer.from(rawImage, 'base64'));
			console.log('✅ Image edit complete.');
		}
	} catch (error) {
		console.error('❌ Failed to generate image edit:', error);
	}
}

generateImageEdit();
