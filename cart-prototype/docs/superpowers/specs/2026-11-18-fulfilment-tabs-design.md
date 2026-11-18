# Fulfilment method tabs (Collection / Delivery) – design

Status: awaiting approval. Not yet committed.

## Intent
In the cart prototype's "Select a time" panel, make the Collection and Delivery tabs work, matching the Figma frames (FMS – In Cart, 5327:120647; in-cart rows 5332:121427 and 5332:121457). Purpose: a convincing prototype of the fulfilment flow, with motion that feels liquid and considered.

## Goals
- Tabs switch the panel between Delivery (existing content) and Collection (new content from Figma).
- Header reads "Select a time" on both tabs.
- Green tab background slides to the other tab: fast, ease out, settles softly with a slight overshoot ("liquid" ripple at the end).
- Time content fades out then the new content fades in with a slight upward slide (similar total time to the pill). Address/store area simply cross-fades.
- Reserve button appears (slides up) only when a slot is selected, and slides away when none is. Label includes the time, e.g. "Reserve 9am – 2pm".
- Switching tabs resets selection (no slot, default day and chip).
- Cart row reflects the reserved method and time.

## Non-goals / anti-goals
- No real availability, pricing or store logic; content is static sample data.
- No change to the cart starting state (see below) unless `?notime` is used.
- Must not look or feel janky at reduced-motion settings: fall back to a short fade.

## Behaviour
- **Starting state (unchanged):** cart row "Delivery • Today 9am – 2pm", panel opens on Delivery with the 9am – 2pm slot selected and the Reserve button showing.
- **`?notime` flag (my call):** starts with no reservation. Cart row shows the no-time design; the panel opens with nothing selected and no Reserve button. For reviewing the empty rows.
- **Reopening after a reservation:** panel opens on the reserved method with that slot selected.
- **Closing or going back without reserving:** the cart row is unchanged.
- **Reserve:** updates the cart row and closes the panel.
- **Switching tabs:** clears the selection; the Reserve button slides away. Switching back to the reserved tab also starts clear.

## Content
- **Delivery:** as today (suggested block, 7 days with "From" prices, chips, delivery slots).
- **Collection:** no "Suggested for you"; address area reads "Direct to boot from / Balgowlah (Manly Vale)" with Edit; day circles all "From $5"; slots "Direct to boot Now – Ready within 30 mins – 60 item limit – $5" (green badge), 9am – 10am $0, 10am – 11am $0, 11am – 12pm $0; no slot thumbnails.
- **Cart row, time selected:** Delivery → truck icon, "Delivery • <time>", address. Collection → Direct to boot car icon, "Direct to boot • <time>", "Balgowlah (Manly Vale)" (replaces the "Store Name" placeholder).
- **Cart row, no time:** Delivery → truck, "Delivery", address, green "Select a time ›". Collection → car icon, "Collection", store, green "Select a time ›" (mirrored from Delivery, my call).

## Approaches considered
1. **Both content sets in the page, one visible at a time (chosen).** Pill is one extra element animated with the Web Animations API; content blocks cross-faded. Small, fits the prototype's style, easy to tune.
2. One content block rebuilt from JavaScript data: less markup, but the fade/swap sequencing is hand-rolled and it's harder to match Figma in the HTML.
3. Pure CSS radio-button tabs: pill slides well but the overshoot, stagger and reset behaviour are awkward. Rejected.

## Motion (my calls, to tune on review)
- Pill: ~380ms, fast-out/ease-out curve with a 2–3px overshoot and settle.
- Content: old fades out ~150ms; new fades in ~200ms and rises ~8px, with a small stagger down the list.
- Address area: ~200ms cross-fade.
- Reserve button: slides up/down on the drawer's existing easing.
- `prefers-reduced-motion`: ~120ms fade only.

## Left to the builder
Exact easing values, stagger timing, ids and class names, and how the Reserve label handles the "Now" slots (default: "Reserve Delivery Now" / "Reserve Direct to boot Now").
