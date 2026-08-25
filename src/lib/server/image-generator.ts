import satori from 'satori';
import sharp from 'sharp';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { BASE_URL } from '$lib/constants/constants';
import { giftColor } from '$lib/data/gift-colors';
import { giftMarkDataUri, sparkleDataUri } from './gift-mark-image';

let cachedFonts: Record<string, Buffer> | null = null;
let cachedQrBase64: string | null = null;

async function getQrBase64(): Promise<string> {
  if (cachedQrBase64) return cachedQrBase64;
  const qrDataUrl = await QRCode.toDataURL(BASE_URL, {
    width: 140,
    margin: 1,
    color: { dark: '#1b1b1b', light: '#FFFFFF' }
  });
  cachedQrBase64 = qrDataUrl.split(',')[1];
  return cachedQrBase64;
}

async function loadFonts(): Promise<Record<string, Buffer>> {
  if (cachedFonts) return cachedFonts;
  cachedFonts = {
    // Hanken Grotesk for body text
    medium: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/HankenGrotesk-Medium.ttf')
    ),
    bold: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/HankenGrotesk-Bold.ttf')
    ),
    // Bitter for headings
    serif: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/Bitter-Medium.ttf')
    ),
    serifBold: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/Bitter-Bold.ttf')
    ),
    serifItalic: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/Bitter-Medium-Italic.ttf')
    )
  };
  return cachedFonts;
}

interface TopGift {
  name: string;
  score: number;
  description?: string;
  category?: string;
}

interface GenerateStoriesImageOptions {
  name: string;
  topGifts: TopGift[];
  topGiftPracticals: string[];
}

// Satori constraints:
// 1. Every div with >1 child MUST have display: flex
// 2. Empty/single-child divs also need display: flex
// 3. No block-level tags (h1/h2/p) — use div or span only
// 4. '#' and '/' are silently dropped — use 'TOP GIFT', '2nd', '3rd', 'of' instead
// 5. Images must be PNG/JPEG data URIs (gift glyphs are rasterized via sharp)
//
// Dynamic height strategy:
// - Estimate content height based on what's present (description, practicals count)
// - Render satori at that height (no overflow, no cropping)
// - Use sharp to composite onto a 1080×1920 canvas (centered vertically)
//   so the output is always a valid Instagram Stories size

const W = 1080;
const H = 1920;
const PAD_X = 80;
const PAD_Y = 88;

// Font size scale — all in px, sized for 1080-wide canvas
const F = {
  brandName: 54,
  userName: 84,
  userSubtitle: 26,
  sectionLabel: 28,
  heroPill: 24,
  heroName: 76,
  heroDesc: 26,
  heroScore: 30,
  cardName: 30,
  cardRank: 22,
  cardScore: 24,
  practicalNum: 22,
  practicalTxt: 26,
  footerScan: 22,
  footerSite: 42,
};

// Illustration sizes
const MARK_HERO = 116; // glyph size inside the white tile
const MARK_TILE = 164; // white tile in hero card
const MARK_SECONDARY = 68;
const SPARKLE_LG = 76;
const SPARKLE_SM = 52;

export async function generateStoriesImage(
  options: GenerateStoriesImageOptions
): Promise<Buffer> {
  const fonts = await loadFonts();
  const { name, topGifts, topGiftPracticals } = options;

  const qrBase64 = await getQrBase64();

  const yourGiftsText = 'YOUR TOP GIFTS';
  const practicalText = 'PRACTICAL APPLICATIONS';
  const scanText = 'Discover your gifts at';

  function scoreText(score: number, max = 25) {
    return `${score} of ${max}`;
  }

  const PAPER = '#f6f5f4';
  const INK = '#1b1b1b';
  const INK_SOFT = '#424242';
  const INK_FAINT = '#767676';
  const LINE = '#e0dfdf';
  const AMBER = '#d97706';
  const AMBER_PALE = '#ffecc7';

  // Pre-rasterize all illustration assets
  const heroMark = await (async () => {
    const gc = giftColor(topGifts[0]?.category ?? '');
    return giftMarkDataUri(gc.glyph, gc.accent, MARK_HERO);
  })();

  const secondaryMarks = await Promise.all(
    topGifts.slice(1, 3).map((gift) => {
      const gc = giftColor(gift.category ?? '');
      return giftMarkDataUri(gc.glyph, gc.accent, MARK_SECONDARY);
    })
  );

  const sparkleAmber = await sparkleDataUri('#d97706', SPARKLE_LG);
  const sparkleGreen = await sparkleDataUri('#24843f', SPARKLE_SM);

  // ── Helpers ──────────────────────────────────────────────────────────

  function sectionHeader(label: string) {
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex', flexDirection: 'row' as const,
          alignItems: 'center', marginBottom: '26px'
        },
        children: [
          {
            type: 'img',
            props: {
              src: sparkleAmber,
              width: 34, height: 34,
              style: { marginRight: '16px' }
            }
          },
          {
            type: 'span',
            props: {
              style: { fontSize: `${F.sectionLabel}px`, fontWeight: 700, color: INK, letterSpacing: '2px' },
              children: label
            }
          }
        ]
      }
    };
  }

  // ── Hero card ────────────────────────────────────────────────────────
  const topGift = topGifts[0];
  const topAccent = giftColor(topGift.category ?? '').accent;

  const heroCard = {
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'column' as const,
        background: topAccent,
        borderRadius: '40px',
        paddingTop: '44px', paddingBottom: '44px',
        paddingLeft: '48px', paddingRight: '48px',
        marginBottom: '18px',
        position: 'relative', overflow: 'hidden'
      },
      children: [
        // Illustrated gift mark on a white tile
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: `${MARK_TILE}px`, height: `${MARK_TILE}px`,
              backgroundColor: '#ffffff',
              borderRadius: '40px',
              padding: '24px',
              marginBottom: '28px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            },
            children: [{
              type: 'img',
              props: { src: heroMark, width: MARK_HERO, height: MARK_HERO }
            }]
          }
        },
        // Rank pill
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'row' as const,
              alignItems: 'center', justifyContent: 'center',
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderRadius: '999px',
              paddingTop: '8px', paddingBottom: '8px',
              paddingLeft: '24px', paddingRight: '24px',
              marginBottom: '20px'
            },
            children: [{
              type: 'span',
              props: {
                style: {
                  fontSize: `${F.heroPill}px`, fontWeight: 700,
                  color: '#ffffff', letterSpacing: '3px'
                },
                children: 'TOP GIFT'
              }
            }]
          }
        },
        // Gift name
        {
          type: 'span',
          props: {
            style: {
              fontSize: `${F.heroName}px`, fontWeight: 700,
              fontFamily: '"Bitter", serif',
              color: '#ffffff', marginBottom: '16px', lineHeight: 1.05
            },
            children: topGift.name
          }
        },
        // Description (optional)
        ...(topGift.description ? [{
          type: 'span',
          props: {
            style: {
              fontSize: `${F.heroDesc}px`, lineHeight: 1.55,
              color: 'rgba(255,255,255,0.88)', marginBottom: '30px'
            },
            children: topGift.description
          }
        }] : []),
        // Score row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'row' as const,
              alignItems: 'center', gap: '16px'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex', flex: 1, height: '14px',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '999px', overflow: 'hidden'
                  },
                  children: [{
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        width: `${(topGift.score / 25) * 100}%`,
                        height: '100%',
                        background: '#ffffff',
                        borderRadius: '999px'
                      }
                    }
                  }]
                }
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: `${F.heroScore}px`, fontWeight: 700, color: '#ffffff' },
                  children: scoreText(topGift.score)
                }
              }
            ]
          }
        }
      ]
    }
  };

  // ── Secondary cards ──────────────────────────────────────────────────
  const secondaryCards = await Promise.all(topGifts.slice(1, 3).map(async (gift, i) => {
    const gc = giftColor(gift.category ?? '');
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
          marginBottom: '16px',
          paddingTop: '24px', paddingBottom: '24px',
          paddingLeft: '28px', paddingRight: '28px',
          backgroundColor: gc.pale,
          borderRadius: '32px'
        },
        children: [
          // Illustrated mark
          {
            type: 'div',
            props: {
              style: {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '104px', height: '104px',
                backgroundColor: '#ffffff',
                borderRadius: '26px',
                padding: '18px',
                marginRight: '22px', flexShrink: 0
              },
              children: [{
                type: 'img',
                props: { src: secondaryMarks[i], width: MARK_SECONDARY, height: MARK_SECONDARY }
              }]
            }
          },
          // Rank + name + bar
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' as const, flex: 1 },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: `${F.cardRank}px`, fontWeight: 500, fontStyle: 'italic',
                      fontFamily: '"Bitter", serif', color: INK_FAINT,
                      marginBottom: '4px'
                    },
                    children: i === 0 ? '2nd' : '3rd'
                  }
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex', flexDirection: 'row' as const,
                      justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: '12px'
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: `${F.cardName}px`, fontWeight: 700, color: INK },
                          children: gift.name
                        }
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: `${F.cardScore}px`, fontWeight: 500, color: INK_SOFT },
                          children: scoreText(gift.score)
                        }
                      }
                    ]
                  }
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex', width: '100%', height: '10px',
                      backgroundColor: '#ffffff', borderRadius: '999px', overflow: 'hidden'
                    },
                    children: [{
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          width: `${(gift.score / 25) * 100}%`,
                          height: '100%',
                          background: gc.accent,
                          borderRadius: '999px'
                        }
                      }
                    }]
                  }
                }
              ]
            }
          }
        ]
      }
    };
  }));

  // ── Practical items ──────────────────────────────────────────────────
  const practicalItems = topGiftPracticals.slice(0, 4).map((app, i) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
        marginBottom: '14px',
        paddingTop: '20px', paddingBottom: '20px',
        paddingLeft: '26px', paddingRight: '26px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: `2px solid ${LINE}`
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '46px', height: '46px', borderRadius: '999px',
              backgroundColor: AMBER_PALE, marginRight: '20px', flexShrink: 0
            },
            children: [{
              type: 'span',
              props: {
                style: { fontSize: `${F.practicalNum}px`, fontWeight: 700, color: INK },
                children: String(i + 1)
              }
            }]
          }
        },
        {
          type: 'span',
          props: {
            style: { fontSize: `${F.practicalTxt}px`, fontWeight: 500, color: INK, lineHeight: 1.4 },
            children: app
          }
        }
      ]
    }
  }));

  // ── Estimate content height ──────────────────────────────────────────
  const EST_LINE = (fontSize: number, lineHeight = 1.3) => fontSize * lineHeight;
  const VPAD = PAD_Y * 2;

  let contentH = VPAD;

  // Brand row
  contentH += 56 + 52;

  // Name block
  contentH += EST_LINE(F.userName) + 8 + EST_LINE(F.userSubtitle) + 40;

  // "Your Top Gifts" section header
  contentH += 34 + 26;

  // Hero card: mark tile + pill + name + optional description + score row
  const descLineCount = topGift.description
    ? Math.ceil((topGift.description.length * F.heroDesc * 0.55) / (W - PAD_X * 2 - 96))
    : 0;
  contentH += 44 + 44 // top+bottom padding
    + MARK_TILE + 28                    // mark tile
    + EST_LINE(F.heroPill) + 20         // pill
    + EST_LINE(F.heroName) + 16         // name
    + (descLineCount > 0 ? descLineCount * EST_LINE(F.heroDesc, 1.55) + 30 : 0) // desc
    + 14 + 18                           // score row
    + 18;                               // marginBottom

  // Secondary cards (2)
  const secondaryCount = Math.min(topGifts.length - 1, 2);
  contentH += secondaryCount * (24 + 24 + 104 + 16); // padding + mark height + margin

  // Practical section
  if (topGiftPracticals.length > 0) {
    contentH += 16;
    contentH += 34 + 26;
    const practCount = Math.min(topGiftPracticals.length, 4);
    contentH += practCount * (20 + 20 + EST_LINE(F.practicalTxt) + 14);
  }

  // Footer card
  contentH += 40 + 40 + 140 + 14;

  const renderH = Math.max(contentH, H);

  // ── Build JSX ───────────────────────────────────────────────────────
  const jsx = {
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'column' as const,
        width: `${W}px`, height: `${renderH}px`,
        background: PAPER,
        paddingTop: `${PAD_Y}px`, paddingBottom: `${PAD_Y}px`,
        paddingLeft: `${PAD_X}px`, paddingRight: `${PAD_X}px`,
        fontFamily: '"Hanken Grotesk", sans-serif',
        position: 'relative', overflow: 'hidden'
      },
      children: [
        // Decorative sparkles on the paper background (top zone stays clear of cards)
        {
          type: 'img',
          props: {
            src: sparkleAmber,
            width: SPARKLE_LG, height: SPARKLE_LG,
            style: { display: 'flex', position: 'absolute', top: '150px', right: '72px' }
          }
        },
        {
          type: 'img',
          props: {
            src: sparkleGreen,
            width: SPARKLE_SM, height: SPARKLE_SM,
            style: { display: 'flex', position: 'absolute', top: '330px', right: '110px' }
          }
        },

        // ── Brand row ───────────────────────────────────────────────
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'row' as const,
              alignItems: 'center', gap: '16px',
              marginBottom: '52px'
            },
            children: [
              {
                type: 'img',
                props: { src: sparkleAmber, width: 44, height: 44 }
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: `${F.brandName}px`, fontWeight: 700, fontFamily: '"Bitter", serif', color: INK, letterSpacing: '1px' },
                  children: 'The Gifts.'
                }
              }
            ]
          }
        },

        // ── Name + single label ─────────────────────────────────────
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column' as const,
              marginBottom: '40px'
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: `${F.userName}px`, fontWeight: 700,
                    fontFamily: '"Bitter", serif',
                    color: INK, marginBottom: '10px', lineHeight: 1.0
                  },
                  children: name
                }
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: `${F.userSubtitle}px`, fontWeight: 700, color: AMBER, letterSpacing: '3px' },
                  children: 'SPIRITUAL GIFTS RESULT'
                }
              }
            ]
          }
        },

        // ── Gifts section ────────────────────────────────────────────
        sectionHeader(yourGiftsText),
        heroCard,
        ...secondaryCards,

        // ── Practical section ────────────────────────────────────────
        ...(topGiftPracticals.length > 0 ? [
          { type: 'div', props: { style: { display: 'flex', height: '16px' } } },
          sectionHeader(practicalText),
          ...practicalItems
        ] : []),

        // ── Flex spacer ─────────────────────────────────────────────
        { type: 'div', props: { style: { display: 'flex', flex: 1 } } },

        // ── Footer ───────────────────────────────────────────────────
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'row' as const,
              alignItems: 'center', justifyContent: 'center',
              gap: '32px',
              paddingTop: '36px', paddingBottom: '36px',
              paddingLeft: '44px', paddingRight: '44px',
              backgroundColor: '#ffffff',
              borderRadius: '32px',
              border: `2px solid ${LINE}`
            },
            children: [
              {
                type: 'img',
                props: {
                  src: `data:image/png;base64,${qrBase64}`,
                  width: 130, height: 130
                }
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' as const },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: `${F.footerScan}px`, fontWeight: 500, color: INK_FAINT, marginBottom: '6px' },
                        children: scanText
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: `${F.footerSite}px`, fontWeight: 700, color: INK, letterSpacing: '1px' },
                        children: 'thegifts.site'
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(jsx as any, {
    width: W,
    height: renderH,
    fonts: [
      // Hanken Grotesk
      { name: 'Hanken Grotesk', data: fonts.medium, weight: 500 },
      { name: 'Hanken Grotesk', data: fonts.bold, weight: 700 },
      // Bitter
      { name: 'Bitter', data: fonts.serif, weight: 500, style: 'normal' },
      { name: 'Bitter', data: fonts.serifBold, weight: 700, style: 'normal' },
      { name: 'Bitter', data: fonts.serifItalic, weight: 500, style: 'italic' }
    ]
  });

  const svgBuffer = Buffer.from(svg);

  if (renderH <= H) {
    const topOffset = Math.floor((H - renderH) / 2);
    return sharp({
      create: {
        width: W,
        height: H,
        channels: 4,
        background: { r: 246, g: 245, b: 244, alpha: 1 }
      }
    })
      .composite([{ input: svgBuffer, top: topOffset, left: 0 }])
      .png({ compressionLevel: 6 })
      .toBuffer();
  }

  return sharp(svgBuffer).png({ compressionLevel: 6 }).toBuffer();
}
