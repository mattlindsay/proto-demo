# Fulfilment Method Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Collection / Delivery tabs in the cart's "Select a time" panel work, with liquid tab motion, fading content, a Reserve button that appears only when a slot is selected, and a cart row that reflects the reserved method.

**Architecture:** Everything lives in `index.html` (HTML, CSS in the drawer `<style>` block, JS in the final IIFE). Both content sets are in the DOM; one is visible at a time. A single `state` object `{method, reserved}` drives the panel and the cart row. Animation uses CSS transitions plus the Web Animations API for the pill and content.

**Tech Stack:** Plain HTML/CSS/JS, no build step, no dependencies.

**Spec:** `docs/superpowers/specs/2026-11-18-fulfilment-tabs-design.md`

## Global Constraints

- Australian English in copy and comments; prices in AUD as `$5`; no personal information in sample data (store name is "Balgowlah (Manly Vale)", delivery address is the existing sample).
- Header stays "Select a time" on both tabs.
- Cart starting state unchanged: "Delivery • Today 9am – 2pm", 9am – 2pm slot selected. `?notime` starts empty.
- Switching tabs resets: no slot, day "Today", chip "Morning", Reserve button hidden.
- Reserve label: `Reserve <time>`, e.g. "Reserve 9am – 2pm". For the "Now" slots: "Reserve Delivery Now" / "Reserve Direct to boot Now".
- Motion: pill ~380ms with 2–3px overshoot; old content out ~150ms; new content in ~200ms with ~8px upward slide and a small stagger; address area ~200ms cross-fade; `prefers-reduced-motion` gives a ~120ms fade only.
- Reuse existing assets: `assets/fms_iconDtbIsolated.png`, `assets/fms_deliveryRoadBase.png`, `assets/fms_image25.png`, `assets/cart_imgDeliveryRoadBase.png`, `assets/cart_imgIcon.svg`. No new image assets unless Figma needs one.
- Do not commit or push without the user's say-so.

## Review Focus

- Tapping the tabs rapidly mid-animation: must end on the last tab tapped, with no stuck half-faded content or pill in between tabs.
- Closing or going back while a tab animation is running: next open must show a clean, correct state.
- Panel is `visibility:hidden` when closed, so any measuring in JS returns 0: the pill must be positioned with percentages or transforms, not measured widths.
- Reopening after reserving a Collection slot: opens on Collection with that slot selected and Reserve showing; switching away and back clears it.
- `?notime`: panel opens with nothing selected and no Reserve button on both tabs; cart row shows the no-time design for the active method.
- Reserve on a "Now" slot: row title and button label use the slot's name, not a time range.

---

### Task 1: Cart row states

**Files:**
- Modify: `index.html` (the `#fmsBtn` markup near line 901; the `.fms` row CSS in the drawer style block; JS near `fmsTitle`, line ~1603)

**Interfaces:**
- Produces: `setFmsRow(method: 'delivery'|'collection', label: string|null): void` in the drawer IIFE. `label` is the slot label (e.g. "Today 9am – 2pm"); `null` means no time selected. Updates icon, title (`#fmsTitle`), subtitle and CTA.
- Produces: constant `STORE = 'Balgowlah (Manly Vale)'` and `ADDRESS = '46 Smith St, Surry Hills, NSW, 2010'`.

- [ ] **Step 1: Locate the row's CSS** (`grep -n "fms" index.html` inside the drawer style block, `.dc-top`) and note the existing `.tr`, `.tx`, `.chev` rules.
- [ ] **Step 2: Add markup** to `#fmsBtn`: both icons (delivery truck, Direct to boot car using the Figma crop: image 112.54% × 109.09%, left -6.27%, top -5.68% inside a 45.7 × 32.2px box) with only one shown; subtitle gets id `fmsSub`; add a `.cta` span, "Select a time" in `#008446`, 16px / 24px, weight 500, shown beside the chevron only in the no-time state (`#fmsBtn[data-empty]`); the chevron stays in both states.
- [ ] **Step 3: Implement `setFmsRow`** per the spec's content table: time selected → "Delivery • <label>" + address, or "Direct to boot • <label>" + store; no time → "Delivery" + address, or "Collection" + store, with `data-empty` set. Use a fast cross-fade of the text (≈150ms) when it changes.
- [ ] **Step 4: Read `?notime`** at load: `setFmsRow('delivery', null)` if present, otherwise leave the existing markup as the default.
- [ ] **Step 5: Verify** in the browser: default page shows "Delivery • Today 9am – 2pm". `?notime` shows "Delivery / address / Select a time ›" matching Figma 5332:121457. In the console `setFmsRow('collection', null)` and `setFmsRow('collection','Today 9am – 10am')` show the car rows matching 5332:121427 (title "Direct to boot • Today 9am – 10am", subtitle the store).

### Task 2: Collection content and method switching (no motion yet)

**Files:**
- Modify: `index.html` (`#timePanel` markup lines ~1018–1059; panel CSS ~528–582; panel JS ~1600–1634)

**Interfaces:**
- Consumes: `setFmsRow` from Task 1.
- Produces: `state = { method: 'delivery'|'collection', reserved: {method, label}|null }`.
- Produces: `setMethod(method, opts?: {instant?: boolean}): void` (switches visible content, resets selection, updates tab `.on`/`aria-selected`), `updateReserve(): void` (shows/hides `#reserveBtn`'s footer and sets its label from the selected `.slot`'s `data-label`).
- Produces: panel markup contract: `#fmsDelivery` and `#fmsCollection` content wrappers (each holding that method's `.sugg`/`.days`/`.tod` as relevant), and `#locDelivery` / `#locCollection` address rows.

- [ ] **Step 1: Restructure markup.** Give the tab buttons `role="tab"`, `data-method`, and wrap them in `role="tablist"`. Move the existing Delivery `.sugg`, `.days`, `.tod` into `#fmsDelivery`; add `#fmsCollection` with: 7 `.days` circles (same days as Delivery, all "From $5", no yellow tag), the three chips (Morning on), and `.slots` containing "Direct to boot Now" (green `.dn` badge reading "Direct to boot Now", title "Ready within 30 mins", meta "60 item limit", price $5, `data-label="Direct to boot Now"`), then 9am – 10am, 10am – 11am, 11am – 12pm at $0 with `data-label="Today 9am – 10am"` etc. Collection slots have no `.si` thumbnail. Add `#locCollection` ("Direct to boot from" / "Balgowlah (Manly Vale)" / Edit) beside `#locDelivery` (the existing `.loc`).
- [ ] **Step 2: Wire `setMethod`.** Clicking a tab calls it; ignore a click on the already-active tab. Reset `.slot.sel`, `.day.on` (first day), `.chips2 button.on` (Morning) in the incoming block, then `updateReserve()`.
- [ ] **Step 3: Selection and Reserve.** Slot clicks keep the existing handler, then call `updateReserve()`. Footer `.pf` is hidden (translated down, `inert`) when no `.slot.sel` in the visible block. Label: `Reserve <t>` where `<t>` is the slot's time text, or the slot name for "Now" slots (see Global Constraints). Reserve click: `state.reserved = {method, label}`, `setFmsRow(method, label)`, `closePanel()`.
- [ ] **Step 4: Open/close logic.** `openPanel` restores state: if `state.reserved`, `setMethod(reserved.method, {instant:true})` and re-select the slot whose `data-label` matches; otherwise show `state.method` with nothing selected. The default (no `?notime`) initialises `state.reserved = {method:'delivery', label:'Today 9am – 2pm'}` so the starting state is unchanged.
- [ ] **Step 5: Verify** in the browser: default open shows Delivery with 9am – 2pm selected and "Reserve 9am – 2pm". Click Collection: content and address swap, nothing selected, Reserve hidden. Pick "Today 9am – 10am": Reserve reads "Reserve 9am – 10am"; Reserve updates the cart row to the car row and closes. Reopen: Collection with that slot selected. `?notime`: nothing selected on either tab, no Reserve. "Direct to boot Now" gives "Reserve Direct to boot Now", and the cart row title for Now slots reads "Direct to boot • Now" / "Delivery • Now".

### Task 3: Motion

**Files:**
- Modify: `index.html` (panel CSS; the `setMethod` and `updateReserve` functions from Task 2)

**Interfaces:**
- Consumes: `setMethod` and `updateReserve` from Task 2 (add the animated path; `{instant:true}` skips all animation).
- Produces: `.method .pill` element, `animateSwitch(from, to): void`.

- [ ] **Step 1: Pill.** Add `<span class="pill" aria-hidden="true"></span>` as the first child of `.method`; style it as `position:absolute; top:4px; bottom:4px; left:4px; width:calc(50% - 4px)` with the green fill and the existing drop-shadow, behind the buttons; move the green fill off `button.on` (keep text colour white and weight 500 on `.on`, with a ~200ms colour transition). Position it with `transform: translateX(0 | 100%)`, never measured widths (the panel is hidden when closed). Instant when `{instant:true}` or when the panel is closed.
- [ ] **Step 2: Pill animation.** Use `pill.animate()` for ~380ms with a spring-style easing (a CSS `linear()` curve) that overshoots by about 2–3px and settles, ending at the target transform. Cancel any running animation first and start from the current computed transform so rapid taps never jump.
- [ ] **Step 3: Content.** In `animateSwitch`, fade the outgoing block (`#fmsDelivery`/`#fmsCollection`) to opacity 0 over ~150ms, then swap `hidden`, then animate incoming children (`.sugg`, `.days`, chips, each `.slot`) from opacity 0 / translateY(8px) to 1 / 0 over ~200ms with ≈25ms stagger (cap the stagger at the first 6 items). The address rows cross-fade over ~200ms in a stacked grid cell. Track a token so a newer switch cancels an older one; always finish on the latest tab.
- [ ] **Step 4: Reserve button.** Slide `.pf` with `transform: translateY(100%)` ↔ `none` using the drawer's existing easing (≈.34s), and keep `.pc`'s bottom padding so slots aren't hidden behind it when it shows.
- [ ] **Step 5: Reduced motion.** Under `prefers-reduced-motion: reduce`, skip the pill slide and stagger; use a ~120ms fade for content and the Reserve button.
- [ ] **Step 6: Verify** in the browser: tab switch looks liquid with a soft settle; double-tap and triple-tap fast, then confirm exactly one tab is active, the pill is on it, and no content is at partial opacity (check `getComputedStyle` opacity of both blocks). Close the panel mid-animation and reopen: clean state. Resize the window and reopen: the pill is still aligned. Toggle reduced motion in DevTools and confirm only fades.

### Task 4: Final check and handover

**Files:**
- Modify: none expected (fixes only)

- [ ] **Step 1: Walk the whole flow** against the Figma frames (5327:120647, 5332:121427, 5332:121457): default, `?notime`, both tabs, reserve each method, reopen, back/close without reserving, Escape key (already closes the panel).
- [ ] **Step 2: Check every Review Focus line above** and report any that fail; fix them.
- [ ] **Step 3: Report to the user** what was verified and what wasn't (for example, motion feel needs their eyes), and ask whether to commit and push. Do not commit before they say so.
