/** Honeypot field – hidden from users, catches bots. Must remain empty. */
export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
    >
      <label htmlFor="website">Website</label>
      <input
        type="text"
        id="website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
