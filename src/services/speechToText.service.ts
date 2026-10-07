import { pipeline } from '@huggingface/transformers';

let transcriber: any = null;

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!transcriber) {
    transcriber = await pipeline(
      'automatic-speech-recognition',
      'onnx-community/whisper-base',
    );
  }

  const audioUrl = URL.createObjectURL(audioBlob);

  try {
    const result = await transcriber(audioUrl, {
      language: 'spanish',
      task: 'transcribe',
    });

    return result.text;
  } finally {
    URL.revokeObjectURL(audioUrl);
  }
}