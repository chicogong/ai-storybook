// Helper to decode base64 string to byte array
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM/WAV data into an AudioBuffer
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext
): Promise<AudioBuffer> {
  // The Google TTS endpoint returns raw audio bytes (often PCM or WAV wrapped).
  // Web Audio API's decodeAudioData can generally handle standard formats.
  // If it's raw PCM without headers, we might need manual formatting, 
  // but gemini-2.5-flash-preview-tts usually works with standard decodeAudioData 
  // if the response is configured correctly (e.g. we get a wav/mp3 container or raw).
  // However, the specific example in docs implies manual PCM decoding might be needed 
  // if we strip headers or use specific live stream formats. 
  // For the generateContent endpoint, it returns a format decodeAudioData can usually sniff,
  // or we treat it as raw PCM if we know the sample rate.
  
  // Try standard decoding first (supports WAV, MP3, etc)
  try {
    return await ctx.decodeAudioData(data.buffer.slice(0)); // slice to copy buffer
  } catch (e) {
    // Fallback for raw PCM if standard decode fails (assuming 24kHz mono based on typical output)
    console.warn("Standard decode failed, attempting raw PCM decode", e);
    const sampleRate = 24000; 
    const numChannels = 1;
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        // Convert Int16 to Float32 (-1.0 to 1.0)
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}