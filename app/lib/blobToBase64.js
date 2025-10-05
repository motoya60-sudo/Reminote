import { Buffer } from 'buffer';

async function blobToBase64(blob) {
	const arrayBuffer = await blob.arrayBuffer();
	const base64 = Buffer.from(arrayBuffer).toString('base64');
	return base64
}