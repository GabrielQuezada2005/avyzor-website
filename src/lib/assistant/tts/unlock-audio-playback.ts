/**
 * Browser blockieren Cloud-TTS oft, wenn zwischen Klick und audio.play()
 * ein await (TTS-Fetch) liegt – User-Activation verfällt.
 * Ein kurzer synchroner Play-Aufruf im Klick-Handler hält die Freigabe.
 */

let playbackUnlocked = false;

const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

export function isAudioPlaybackUnlocked(): boolean {
  return playbackUnlocked;
}

/** Im synchronen User-Gesture-Handler aufrufen (vor await). */
export function ensureAudioPlaybackUnlocked(): void {
  if (playbackUnlocked || typeof window === "undefined") return;

  try {
    const audio = new Audio();
    audio.setAttribute("playsinline", "true");
    audio.src = SILENT_WAV;
    const playPromise = audio.play();
    if (playPromise) {
      void playPromise
        .then(() => {
          playbackUnlocked = true;
          audio.pause();
          audio.src = "";
        })
        .catch(() => {
          // Freigabe fehlgeschlagen – späterer Play-Versuch nutzt Retry
        });
    }
  } catch {
    // Ignorieren – Playback versucht es erneut
  }
}
