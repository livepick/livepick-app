# Design System Strategy: The Neon Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Curator"**
This design system rejects the static, "boxed-in" nature of traditional event platforms. It is built to feel like a high-end digital magazine that has been injected with the energy of a midnight rave. By blending the precision of editorial Swiss typography with the rebellious vibrance of "Cyber-Glow," we create an experience that feels both premium and pulse-pounding.

We break the "template" look through **Intentional Asymmetry**. Elements are not always perfectly centered; they overlap, bleed off the edges of the screen, and use dramatic scale shifts to guide the eye. This system is designed for the thumb-scrolling generation that values "vibe" as much as utility.

---

## 2. Colors & Surface Logic
The palette is rooted in a deep, midnight void (`background: #060e20`), allowing our "Electric Trio" (Neon Purple, Lime Green, and Cyan) to vibrate against the dark canvas.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning content. To define boundaries, designers must use **Background Color Shifts**. For example, a featured event card should not have a stroke; it should sit as a `surface-container-high` element on a `surface` background. The change in tonal depth is the divider.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent materials.
- **Base Layer:** `surface` (#060e20).
- **Secondary Sections:** `surface-container-low` (#091328).
- **Interactive Cards:** `surface-container-high` (#141f38).
- **Floating Modals:** `surface-bright` (#1f2b49) with a 24px backdrop blur.

### The "Glass & Gradient" Rule
To achieve "The Kinetic Curator" look, use Glassmorphism for all primary navigation and floating action elements. Apply `surface_variant` at 60% opacity with a `blur(20px)` to allow the vibrant `primary` and `secondary` accents to bleed through the UI, creating a sense of environmental light.

---

## 3. Typography: The Editorial Punch
We use a high-contrast pairing of **Space Grotesk** for impact and **Manrope** for technical clarity.

*   **Space Grotesk (Display & Headlines):** This is our "voice." Use `display-lg` (3.5rem) for hero titles, often with negative letter-spacing (-2%) to create a tight, aggressive editorial feel.
*   **Manrope (Body & Titles):** This provides the "utility." It is clean and highly legible. Use `title-lg` for card headers and `body-md` for event descriptions to ensure the user can scan details quickly amidst the high-contrast visuals.

**Typographic Hierarchy as Brand:**
Large-scale typography is used as a graphic element. Don't be afraid to let a `display-sm` headline overlap a photo or a `secondary` colored background shape.

---

## 4. Elevation & Depth
Depth in this system is atmospheric, not structural.

*   **The Layering Principle:** Instead of shadows, use the "Step-Up" method. An inner element must always be one "tier" lighter than its parent (e.g., a `surface-container-highest` button inside a `surface-container-low` card).
*   **Ambient Glow (Shadows):** When elevation is required for floating elements, use a 32px blur shadow with 8% opacity. The shadow color should be tinted with `primary` (#f382ff) to mimic the glow of a neon sign against a dark wall.
*   **The "Ghost Border" Fallback:** If a layout requires a hard edge (e.g., an input field), use the `outline-variant` (#40485d) at **20% opacity**. Never use 100% opacity borders; they kill the "Neon Editorial" fluidity.

---

## 5. Components

### Buttons & CTAs
*   **Primary:** Solid `primary` (#f382ff) with `on_primary` text. Use `roundedness.full` for a "pill" shape that feels modern. Add a subtle linear gradient from `primary` to `primary_container` for a 3D glass effect.
*   **Secondary:** Outline style using the "Ghost Border" rule. Text should be `secondary` (#a2f31f).
*   **State:** On hover, primary buttons should "glow" by increasing the shadow spread of the `primary` tint.

### Energetic Cards
*   **Structure:** No borders. Use `surface-container-high`.
*   **Spacing:** Use `spacing.6` (2rem) for internal padding to give content room to breathe.
*   **The "Pop" Element:** Every card should feature a small "tag" or "chip" in `secondary` or `tertiary` to draw the eye to the most important metadata (e.g., "LIVE" or "SOLD OUT").

### Input Fields
*   **Style:** `surface-container-lowest` (#000000) background with a 1px "Ghost Border" at 10% opacity. 
*   **Focus State:** The border transitions to 100% opacity `tertiary` (#81ecff) with a soft outer glow.

### Signature Component: The "Vibe Slider"
A custom filter component for influencers to filter events by "vibe" (e.g., Chill, Wild, VIP). This uses a horizontal scroll of `secondary_container` chips that "light up" in `secondary` (#a2f31f) when selected.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. Place a large `display-md` headline on the left and a small `label-md` piece of metadata on the far right.
*   **Do** use vibrant gradients for image overlays. A 40% opacity gradient from `primary` to transparent over event photos creates brand cohesion.
*   **Do** embrace the `xl` (3rem) corner radius for large containers to soften the high-contrast "brutalist" typography.

### Don't:
*   **Don't** use pure white (#FFFFFF). Always use `on_background` (#dee5ff) for text to maintain the "Dark Mode" eye comfort.
*   **Don't** use divider lines between list items. Use `spacing.4` (1.4rem) of vertical white space instead.
*   **Don't** use standard "Drop Shadows." If it doesn't look like an ambient neon glow, it doesn't belong in this system.