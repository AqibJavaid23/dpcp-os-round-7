# DPCP / HBS Brand Kit (for the DPCP OS prototype)

Source: Shama's internal logo folders in George's Google Drive (read-only copy, pulled Oct 3, 2026).
- Central "Logos folder" (Sep 16, 2026): Drive folder `1y1BQvuqSGyrJBQDgVX0NIAKFmWon6NBD`. It contains `copilot-all-logos` (the "Dental Copilot Logo Family" folder `17NF1zMZUezoLRFajL5zZ0zkbMe4-siX_`), `HBS Logo`, `HDG Logo` and `Havasu Dental Group Logo`. Both Slack links point at the same tree, so everything here comes from the central folder.
- Every original is a PNG except HBS, which has a vector SVG and a PDF. No SVG exists for DPCP or the copilot family. The PNGs are 1600x800 lockups and a 2000px mark, which is sharp enough for the web. Ask Shama for SVG/AI masters if you need true vectors.

## Colors

| Token | Hex | Where it comes from |
|---|---|---|
| `--dpcp-navy` | `#123B78` | Wordmark text and outer ring (exact pixel value, color logos) |
| `--dpcp-blue` | `#0081CE` | Airplane and inner ring (the 2000px mark is `#0080D0`, treat them as the same) |
| `--dpcp-navy-deep` | `#0B254B` | Official dark background (`*-on-navy`, square icon on navy) |
| `--dpcp-blue-tint` | `#BFD0E8` | Light ring on the reversed (dark-background) logo |
| `--dpcp-blue-wash` | `#BFDFF3` | Light accent in the square icon (minor) |
| white / black | `#FFFFFF` / `#000000` | Mono versions |
| `--hbs-red` | `#B6101A` | HBS monogram (SVG fill; PNGs sample `#B5101A`) |
| `--hbs-charcoal` | `#1B1B21` | HBS "HARIRI BUSINESS SERVICES" text and divider |
| `--hbs-gray` | `#828285` | HBS gray mono version |
| (HDG) | `#B5101A` red, `#1B1B21` charcoal, `#828285` gray | Same palette as HBS, so HDG matches the parent |
| (Havasu Dental Group) | `#0B2545` navy, `#0978FF` accent | Practice brand only, don't use in DPCP OS chrome |

Suggested app palette: primary `#123B78`, accent/interactive `#0081CE`, dark surfaces and the sidebar `#0B254B`, light tint `#BFD0E8`.

## App rule (George, Oct 2026)

The product is **Dental Practice Copilot OS** (short form **DPCP OS**). The header lockup is the DPCP horizontal logo plus a Montserrat **OS** in DPCP blue (`#0081CE`) on light, white on navy. The footer reads **Powered by Dental Practice Copilot OS** in DPCP navy, with the copilot mark. Do not use HBS red in the app.

Do not mention Hariri Business Services or HBS anywhere in the app UI, copy, fake data, page titles, manifest, or icons. HBS is a private holding company. The logo files stay in this kit for the record, and they are not shown in the product. The only exception is the system owner email `george@hariribusinessservices.com`, and only on the Manage access screen.

Department items (team cards, tasks, review, communication, company, admin) use that department's copilot logo. **Coaching** has no separate lockup in the kit, so it uses the DPCP copilot mark. **Operations** has no logo in the kit, so the app uses a navy placeholder badge that says the department name. Missing from the kit: an Operations copilot logo.

Typeface (from the images, not verified): the V1 wordmarks look like **Montserrat** (Regular for "Dental Practice", Bold for "Copilot"). The V2 "endorsed" lockups use a different geometric sans. The HBS logo uses a high-contrast serif. Confirm with Shama before you lock fonts.

## Which logo to use

| Use | File |
|---|---|
| App header, light background | `logos/dpcp_horizontal_color_cropped.png` (transparent padding trimmed, 1301x279) |
| App header or sidebar, dark/navy background | `logos/dpcp_horizontal_color-reversed_cropped.png` (blue plane, light rings, white text) or `logos/dpcp_horizontal_white_cropped.png` (all white) |
| Compact header / collapsed sidebar / avatar | `logos/copilot-mark_icon_color.png` (light background) / `logos/copilot-mark_icon_white.png` (dark background) |
| Favicon | `logos/app-icons/favicon.ico` (16/32/48), `favicon-32.png`, `favicon-16.png` (color mark on transparent) |
| PWA manifest icons | `logos/app-icons/pwa-icon-192.png`, `pwa-icon-512.png` (white mark on `#0B254B`); `pwa-maskable-512.png` (`"purpose": "maskable"`, 20% safe padding) |
| iOS home screen | `logos/app-icons/apple-touch-icon-180.png` |
| PWA `theme_color` / `background_color` | `#0B254B` / `#FFFFFF` |
| Login / splash | `logos/copilot-mark_square_color-on-navy.png` or the full DPCP lockup |
| Department/module badges | the matching `dental-<dept>-copilot_horizontal_*` file (the `-endorsed` version adds "BY DENTAL PRACTICE CO-PILOT") |
| App footer | Copilot mark plus the words "Powered by Dental Practice Copilot OS". Do not use the HBS lockup in the app. |

Light vs dark rule: on white or light gray, use `_color`. On `#0B254B` navy or other dark backgrounds, use `_color-reversed` or `_white`. Use `_black` only for print/mono.

Files under `logos/app-icons/` and `*_cropped.png` are **derived by me** (cropped, resized, placed on navy) from Shama's originals. Everything else is an untouched original, renamed.

## File list

Naming: `brand_variant_color[-on-background].ext`. No `-on-...` suffix means a transparent background.
- Colors: `color` = full-color for light backgrounds; `color-reversed` = full-color for dark backgrounds (Drive's name: "navy"); `white` / `black` = mono.
- Variants: `horizontal` = Variation 1 (mark plus 2-line wordmark); `horizontal-endorsed` = Variation 2 ("Variation 2"/"V2" Drive folders), the same with a "BY DENTAL PRACTICE CO-PILOT" line underneath.

### Shared copilot mark (airplane in rings, used by every copilot brand)
- `copilot-mark_icon_color.png`, `_black.png`, `_white.png`: 2000x1708 transparent mark.
- `copilot-mark_square_color-on-navy.png`, `_color-on-white.png`, `_white-on-black.png`, `_black-on-white.png`: 1500x1500 square tiles (Drive: "blue bg", "White bg", "black bg", "black icon").

### Dental Practice Copilot (DPCP), the main brand
- `dpcp_horizontal_{color,color-reversed,white,black}.png`: 1600x800 transparent.
- `dpcp_horizontal_{color,black}-on-white.png`, `dpcp_horizontal_{white,color-reversed}-on-navy.png`, `dpcp_horizontal_{white,color-reversed}-on-black.png`: same lockup on a solid background.
- `dpcp_horizontal_{color,color-reversed,white,black}_cropped.png`: derived, padding trimmed for headers.
- There is no Variation 2 ("endorsed") for DPCP itself, since DPCP is the endorser.

### Copilot family (1600x800 transparent, each in V1 `horizontal` and V2 `horizontal-endorsed`, in color / color-reversed / white / black)
- `dental-insurance-copilot_*` (DICP; Drive folder "insurance")
- `dental-marketing-copilot_*` (DMCP; "marketing")
- `dental-finance-copilot_*` ("finance")
- `dental-staffing-copilot_*` (DSCP; "Staffing")
- `dental-equipment-copilot_*` ("Dental Equipment")
- `dental-supplies-copilot_*` ("Dental Supplies")
- The Drive folders also hold on-white/on-navy/on-black background versions of each. I left those out because the transparent files cover them. They're in Drive if needed.

### HBS (Hariri Business Services), parent company
- `hbs_lockup-horizontal_color.svg`: **vector** master (Illustrator export, 1500x800 viewBox; red monogram, charcoal text).
- `hbs_lockup-horizontal_color.pdf`: print master.
- `hbs_lockup_{color,gray,white}.png`: about 1500x1500 transparent, monogram plus "HARIRI BUSINESS SERVICES".
- `hbs_monogram_{red,gray,white}.png`: about 1500x800 transparent "HBS" monogram only.
- (The HBS JPG versions on white were skipped because the transparent PNGs replace them.)

### `logos/hdg-practices/`: practice brands, NOT for the DPCP OS app chrome
- `hdg_logo_{red,charcoal,white}.png`: Havasu Dental Group parent (HDG) mark, transparent.
- `havasu-dental-group_logo_on-light.png`, `_on-dark.png`: the Havasu Dental Group lockup (downscaled from 2332px to 2000px wide).
- `havasu-dental-group_logo_on-white-small.png`: 581x152.
- Use these only where the app displays a client/practice (for example, a practice switcher).

### `logos/app-icons/` (derived)
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon-180.png`, `pwa-icon-192.png`, `pwa-icon-512.png`, `pwa-maskable-512.png`.
