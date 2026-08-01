/**
 * Client-seitige Wiedergabe für Cloud-TTS-Antworten.
 *
 * Lädt den HTTP-Stream vollständig, spielt dann als Blob ab.
 * Wartet auf canplay, damit der erste MP3-Frame dekodiert ist.
 */

export interface StreamAudioHandle {
  audio: HTMLAudioElement;
  objectUrl: string;
}

export async function playStreamingAudioResponse(
  response: Response,
  volume: number,
  onPlaying: () => void
): Promise<StreamAudioHandle> {
  if (!response.ok || !response.body) {
    throw new Error("Invalid TTS stream response");
  }

  const contentType = response.headers.get("Content-Type") ?? "audio/mpeg";
  return playWithStreamedBlob(response, volume, onPlaying, contentType);
}

function concatChunks(chunks: Uint8Array[], totalLength: number): Uint8Array {
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

async function readResponseBody(
  body: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value?.length) continue;
    chunks.push(value);
    totalLength += value.length;
  }

  return concatChunks(chunks, totalLength);
}

/**
 * Wartet bis genug Audio dekodiert ist (canplay), nicht nur Metadaten (loadeddata).
 * loadeddata allein reichte nicht – play() startete vor dem ersten hörbaren Frame.
 */
async function waitForPlaybackReady(audio: HTMLAudioElement): Promise<void> {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return;

  await new Promise<void>((resolve, reject) => {
    audio.addEventListener("canplay", () => resolve(), { once: true });
    audio.addEventListener(
      "error",
      () => reject(new Error("Audio decode error")),
      { once: true }
    );
  });
}

async function playWithStreamedBlob(
  response: Response,
  volume: number,
  onPlaying: () => void,
  contentType: string
): Promise<StreamAudioHandle> {
  const audioBytes = await readResponseBody(response.body!);
  if (audioBytes.length === 0) {
    throw new Error("Empty TTS audio stream");
  }

  const blob = new Blob([Uint8Array.from(audioBytes)], { type: contentType });
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio();
  audio.volume = volume;
  audio.preload = "auto";
  audio.src = objectUrl;

  audio.load();
  await waitForPlaybackReady(audio);
  audio.currentTime = 0;
  audio.onplay = onPlaying;
  await audio.play();

  return { audio, objectUrl };
}

export function cleanupStreamAudio(handle: StreamAudioHandle | null): void {
  if (!handle) return;
  handle.audio.pause();
  handle.audio.src = "";
  URL.revokeObjectURL(handle.objectUrl);
}
