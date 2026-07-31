/**
 * Client-seitige Streaming-Wiedergabe für Cloud-TTS-Antworten.
 *
 * Nutzt MediaSource (niedrige Latenz) mit Blob-Fallback.
 */

export interface StreamAudioHandle {
  audio: HTMLAudioElement;
  objectUrl: string;
}

/** Mindestpuffer vor Start – verhindert Underruns, kein Chunk-zu-Chunk-Delay. */
const PREBUFFER_BYTES = 6_144;

export async function playStreamingAudioResponse(
  response: Response,
  volume: number,
  onPlaying: () => void
): Promise<StreamAudioHandle> {
  if (!response.ok || !response.body) {
    throw new Error("Invalid TTS stream response");
  }

  const contentType = response.headers.get("Content-Type") ?? "audio/mpeg";

  if (
    typeof MediaSource !== "undefined" &&
    MediaSource.isTypeSupported(contentType)
  ) {
    try {
      return await playWithMediaSource(response, volume, onPlaying, contentType);
    } catch {
      // Fallback bei MSE-Fehlern
    }
  }

  return playWithBlob(response, volume, onPlaying);
}

async function playWithBlob(
  response: Response,
  volume: number,
  onPlaying: () => void
): Promise<StreamAudioHandle> {
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);
  audio.volume = volume;
  audio.onplay = onPlaying;
  await audio.play();
  return { audio, objectUrl };
}

async function playWithMediaSource(
  response: Response,
  volume: number,
  onPlaying: () => void,
  contentType: string
): Promise<StreamAudioHandle> {
  const mediaSource = new MediaSource();
  const objectUrl = URL.createObjectURL(mediaSource);
  const audio = new Audio(objectUrl);
  audio.volume = volume;
  audio.preload = "auto";

  const sourceOpen = new Promise<void>((resolve, reject) => {
    mediaSource.addEventListener(
      "sourceopen",
      () => {
        void appendStreamToMediaSource(
          mediaSource,
          response.body!,
          audio,
          onPlaying
        )
          .then(resolve)
          .catch(reject);
      },
      { once: true }
    );
    mediaSource.addEventListener("error", () => reject(new Error("MediaSource error")), {
      once: true,
    });
  });

  await sourceOpen;
  return { audio, objectUrl };
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

async function appendStreamToMediaSource(
  mediaSource: MediaSource,
  body: ReadableStream<Uint8Array>,
  audio: HTMLAudioElement,
  onPlaying: () => void
): Promise<void> {
  const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
  if (sourceBuffer.mode !== "sequence") {
    sourceBuffer.mode = "sequence";
  }

  const reader = body.getReader();
  let started = false;
  let pendingChunks: Uint8Array[] = [];
  let pendingBytes = 0;

  const waitForUpdate = (): Promise<void> =>
    sourceBuffer.updating
      ? new Promise((resolve) =>
          sourceBuffer.addEventListener("updateend", () => resolve(), {
            once: true,
          })
        )
      : Promise.resolve();

  const flushPending = async (): Promise<void> => {
    if (pendingBytes === 0) return;

    const merged = concatChunks(pendingChunks, pendingBytes);
    pendingChunks = [];
    pendingBytes = 0;

    await waitForUpdate();
    sourceBuffer.appendBuffer(new Uint8Array(merged));

    if (!started) {
      started = true;
      audio.onplay = onPlaying;
      await audio.play();
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      await flushPending();
      break;
    }
    if (!value?.length) continue;

    pendingChunks.push(value);
    pendingBytes += value.length;

    if (started || pendingBytes >= PREBUFFER_BYTES) {
      await flushPending();
    }
  }

  await waitForUpdate();
  if (mediaSource.readyState === "open") {
    mediaSource.endOfStream();
  }
}

export function cleanupStreamAudio(handle: StreamAudioHandle | null): void {
  if (!handle) return;
  handle.audio.pause();
  handle.audio.src = "";
  URL.revokeObjectURL(handle.objectUrl);
}
