/**
 * Client-seitige Streaming-Wiedergabe für Cloud-TTS-Antworten.
 *
 * Nutzt MediaSource (niedrige Latenz) mit Blob-Fallback.
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

async function appendStreamToMediaSource(
  mediaSource: MediaSource,
  body: ReadableStream<Uint8Array>,
  audio: HTMLAudioElement,
  onPlaying: () => void
): Promise<void> {
  const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
  const reader = body.getReader();
  let started = false;

  const waitForUpdate = (): Promise<void> =>
    sourceBuffer.updating
      ? new Promise((resolve) =>
          sourceBuffer.addEventListener("updateend", () => resolve(), {
            once: true,
          })
        )
      : Promise.resolve();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value?.length) continue;

    await waitForUpdate();
    sourceBuffer.appendBuffer(new Uint8Array(value));

    if (!started) {
      started = true;
      audio.onplay = onPlaying;
      await audio.play();
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
