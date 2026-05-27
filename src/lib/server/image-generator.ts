import satori from 'satori';
import sharp from 'sharp';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { BASE_URL } from '$lib/constants/constants';

let cachedFonts: Record<string, Buffer> | null = null;
let cachedQrBase64: string | null = null;

async function getQrBase64(): Promise<string> {
  if (cachedQrBase64) return cachedQrBase64;
  const qrDataUrl = await QRCode.toDataURL(BASE_URL, {
    width: 140,
    margin: 1,
    color: { dark: '#1a2e05', light: '#FFFFFF' }
  });
  cachedQrBase64 = qrDataUrl.split(',')[1];
  return cachedQrBase64;
}

async function loadFonts(): Promise<Record<string, Buffer>> {
  if (cachedFonts) return cachedFonts;
  cachedFonts = {
    // DM Sans for body text
    light: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/DMSans-Light.ttf')
    ),
    regular: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/DMSans-Regular.ttf')
    ),
    medium: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/DMSans-Medium.ttf')
    ),
    semibold: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/DMSans-SemiBold.ttf')
    ),
    // DM Serif Display for headings
    serif: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/DMSerifDisplay-Regular.ttf')
    ),
    serifItalic: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/DMSerifDisplay-Italic.ttf')
    )
  };
  return cachedFonts;
}

interface TopGift {
  name: string;
  score: number;
  description?: string;
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
//
// Dynamic height strategy:
// - Estimate content height based on what's present (description, practicals count)
// - Render satori at that height (no overflow, no cropping)
// - Use sharp to composite onto a 1080×1920 canvas (centered vertically)
//   so the output is always a valid Instagram Stories size

const W = 1080;
const H = 1920;
const PAD_X = 64;
const PAD_Y = 72;

// Font size scale — all in px, sized for 1080-wide canvas
const F = {
  brandName: 48,
  brandSub: 22,
  userName: 80,
  userSubtitle: 26,
  sectionLabel: 28,
  heroPill: 24,
  heroName: 72,
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

export async function generateStoriesImage(
  options: GenerateStoriesImageOptions
): Promise<Buffer> {
  const fonts = await loadFonts();
  const { name, topGifts, topGiftPracticals } = options;

  const qrBase64 = await getQrBase64();

  const titleText = 'Spiritual Gifts Assessment';
  const yourGiftsText = 'YOUR TOP GIFTS';
  const practicalText = 'PRACTICAL APPLICATIONS';
  const scanText = 'Discover your gifts at';

  function scoreText(score: number, max = 25) {
    return `${score} of ${max}`;
  }

  const PRIMARY = '#6b8f27';
  const PRIMARY_DARK = '#4a6518';
  const PRIMARY_LIGHT = '#8fb840';
  const PRIMARY_PALE = '#f2f8e8';
  const TEXT_DARK = '#1a2e05';
  const TEXT_MED = '#4a5e2a';
  const TEXT_MUTED = '#8aab52';

  // ── Helpers ──────────────────────────────────────────────────────────

  function blob(top?: string, right?: string, bottom?: string, left?: string, size = '400px', opacity = '0.12') {
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex', position: 'absolute',
          ...(top !== undefined && { top }),
          ...(right !== undefined && { right }),
          ...(bottom !== undefined && { bottom }),
          ...(left !== undefined && { left }),
          width: size, height: size, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(107,143,39,${opacity}) 0%, transparent 70%)`
        }
      }
    };
  }

  function sectionHeader(label: string) {
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex', flexDirection: 'row' as const,
          alignItems: 'center', marginBottom: '24px'
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex', width: '7px', height: '34px',
                backgroundColor: PRIMARY, borderRadius: '4px',
                marginRight: '16px', flexShrink: 0
              }
            }
          },
          {
            type: 'span',
            props: {
              style: { fontSize: `${F.sectionLabel}px`, fontWeight: 600, color: TEXT_DARK, letterSpacing: '1px' },
              children: label
            }
          }
        ]
      }
    };
  }

  // ── Hero card ────────────────────────────────────────────────────────
  const topGift = topGifts[0];

  const heroCard = {
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'column' as const,
        background: `linear-gradient(145deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 55%, ${PRIMARY_LIGHT} 100%)`,
        borderRadius: '32px',
        paddingTop: '44px', paddingBottom: '36px',
        paddingLeft: '44px', paddingRight: '44px',
        marginBottom: '18px',
        position: 'relative', overflow: 'hidden'
      },
      children: [
        // Deco circles
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', position: 'absolute',
              top: '-50px', right: '-50px',
              width: '220px', height: '220px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.08)'
            }
          }
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', position: 'absolute',
              bottom: '-60px', left: '-30px',
              width: '180px', height: '180px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
            }
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
              backgroundColor: 'rgba(255,255,255,0.20)',
              borderRadius: '999px',
              paddingTop: '6px', paddingBottom: '6px',
              paddingLeft: '22px', paddingRight: '22px',
              marginBottom: '18px'
            },
            children: [{
              type: 'span',
              props: {
                style: {
                  fontSize: `${F.heroPill}px`, fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)', letterSpacing: '3px'
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
              fontSize: `${F.heroName}px`, fontWeight: 400,
              fontFamily: '"DM Serif Display", serif',
              color: '#ffffff', marginBottom: '14px', lineHeight: 1.05
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
              color: 'rgba(255,255,255,0.88)', marginBottom: '28px'
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
                    display: 'flex', flex: 1, height: '12px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '999px', overflow: 'hidden'
                  },
                  children: [{
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        width: `${(topGift.score / 25) * 100}%`,
                        height: '100%',
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '999px'
                      }
                    }
                  }]
                }
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: `${F.heroScore}px`, fontWeight: 600, color: '#ffffff' },
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
  const secondaryCards = topGifts.slice(1, 3).map((gift, i) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
        marginBottom: '16px',
        paddingTop: '24px', paddingBottom: '24px',
        paddingLeft: '28px', paddingRight: '28px',
        backgroundColor: '#ffffff', borderRadius: '24px',
        border: '2px solid #dceab0'
      },
      children: [
        // Rank badge
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '54px', height: '54px', borderRadius: '50%',
              backgroundColor: PRIMARY_PALE,
              border: `2px solid ${PRIMARY}`,
              marginRight: '20px', flexShrink: 0
            },
            children: [{
              type: 'span',
              props: {
                style: { fontSize: `${F.cardRank}px`, fontWeight: 400, fontStyle: 'italic', fontFamily: '"DM Serif Display", serif', color: PRIMARY_DARK },
                children: i === 0 ? '2nd' : '3rd'
              }
            }]
          }
        },
        // Name + bar
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' as const, flex: 1 },
            children: [
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
                        style: { fontSize: `${F.cardName}px`, fontWeight: 600, color: TEXT_DARK },
                        children: gift.name
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: `${F.cardScore}px`, fontWeight: 600, color: TEXT_MED },
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
                    display: 'flex', width: '100%', height: '9px',
                    backgroundColor: '#e8f3d0', borderRadius: '999px', overflow: 'hidden'
                  },
                  children: [{
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        width: `${(gift.score / 25) * 100}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
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
        backgroundColor: '#ffffff', borderRadius: '20px',
        border: '2px solid #dceab0'
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: PRIMARY, marginRight: '20px', flexShrink: 0
            },
            children: [{
              type: 'span',
              props: {
                style: { fontSize: `${F.practicalNum}px`, fontWeight: 600, color: '#ffffff' },
                children: String(i + 1)
              }
            }]
          }
        },
        {
          type: 'span',
          props: {
            style: { fontSize: `${F.practicalTxt}px`, fontWeight: 500, color: TEXT_DARK, lineHeight: 1.4 },
            children: app
          }
        }
      ]
    }
  }));

  // ── Estimate content height ──────────────────────────────────────────
  // This lets us render satori at the EXACT needed height — no overflow, no cropping.
  // Each section's height is estimated conservatively (rounds up).
  const EST_LINE = (fontSize: number, lineHeight = 1.3) => fontSize * lineHeight;
  const VPAD = PAD_Y * 2;

  let contentH = VPAD;

  // Header block
  contentH += EST_LINE(F.brandName) + 6 + EST_LINE(F.brandSub) + 48;

  // Name block
  contentH += EST_LINE(F.userName) + 8 + EST_LINE(F.userSubtitle) + 36;

  // "Your Top Gifts" section header
  contentH += 34 + 24; // bar height + margin

  // Hero card: pill + name + optional description + score row + card padding
  const descLineCount = topGift.description
    ? Math.ceil((topGift.description.length * F.heroDesc * 0.55) / (W - PAD_X * 2 - 88))
    : 0;
  contentH += 44 + 36  // top+bottom padding
    + EST_LINE(F.heroPill) + 18         // pill
    + EST_LINE(F.heroName) + 14         // name
    + (descLineCount > 0 ? descLineCount * EST_LINE(F.heroDesc, 1.55) + 28 : 0) // desc
    + 12 + 18                           // bar + score row
    + 18;                               // marginBottom

  // Secondary cards (2)
  const secondaryCount = Math.min(topGifts.length - 1, 2);
  contentH += secondaryCount * (24 + 24 + EST_LINE(F.cardName) + 12 + 9 + 16);

  // Practical section
  if (topGiftPracticals.length > 0) {
    contentH += 16; // spacer
    contentH += 34 + 24; // section header
    const practCount = Math.min(topGiftPracticals.length, 4);
    contentH += practCount * (20 + 20 + EST_LINE(F.practicalTxt) + 14);
  }

  // Footer card
  contentH += 40 + 40 + 140 + 14; // pad top/bottom + QR + margin

  // Always render at least 1920px; never less (short content = centered in canvas)
  const renderH = Math.max(contentH, H);

  // ── Build JSX ───────────────────────────────────────────────────────
  const jsx = {
    type: 'div',
    props: {
      style: {
        display: 'flex', flexDirection: 'column' as const,
        width: `${W}px`, height: `${renderH}px`,
        background: 'linear-gradient(170deg, #f7fbee 0%, #eef7d8 35%, #fafdf4 65%, #f0f8e4 100%)',
        paddingTop: `${PAD_Y}px`, paddingBottom: `${PAD_Y}px`,
        paddingLeft: `${PAD_X}px`, paddingRight: `${PAD_X}px`,
        fontFamily: '"DM Sans", sans-serif',
        position: 'relative', overflow: 'hidden'
      },
      children: [
        // Background blobs
        blob('-120px', '-100px', undefined, undefined, '480px', '0.12'),
        blob(undefined, undefined, '200px', '-120px', '360px', '0.10'),
        blob('700px', '-80px', undefined, undefined, '280px', '0.08'),

        // ── Header ──────────────────────────────────────────────────
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column' as const,
              marginBottom: '48px'
            },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: `${F.brandName}px`, fontWeight: 400, fontFamily: '"DM Serif Display", serif', color: PRIMARY, letterSpacing: '1px' },
                  children: 'TheGifts'
                }
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: `${F.brandSub}px`, fontWeight: 400, color: TEXT_MUTED, marginTop: '5px' },
                  children: 'Understand the Purpose God Planted in You.'
                }
              }
            ]
          }
        },

        // ── Name + subtitle ──────────────────────────────────────────
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column' as const,
              marginBottom: '36px'
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: `${F.userName}px`, fontWeight: 400,
                    fontFamily: '"DM Serif Display", serif',
                    color: TEXT_DARK, marginBottom: '8px', lineHeight: 1.0
                  },
                  children: name
                }
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: `${F.userSubtitle}px`, fontWeight: 400, color: TEXT_MED },
                  children: titleText
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

        // ── Flex spacer (pushes footer to bottom when content is short) ─
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
              borderRadius: '32px', border: '2px solid #dceab0'
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
                        style: { fontSize: `${F.footerScan}px`, fontWeight: 400, color: TEXT_MUTED, marginBottom: '6px' },
                        children: scanText
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: `${F.footerSite}px`, fontWeight: 600, color: PRIMARY, letterSpacing: '1px' },
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
      // DM Sans
      { name: 'DM Sans', data: fonts.light, weight: 300 },
      { name: 'DM Sans', data: fonts.regular, weight: 400 },
      { name: 'DM Sans', data: fonts.medium, weight: 500 },
      { name: 'DM Sans', data: fonts.semibold, weight: 600 },
      // DM Serif Display
      { name: 'DM Serif Display', data: fonts.serif, weight: 400, style: 'normal' },
      { name: 'DM Serif Display', data: fonts.serifItalic, weight: 400, style: 'italic' }
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
        background: { r: 247, g: 251, b: 238, alpha: 1 }
      }
    })
      .composite([{ input: svgBuffer, top: topOffset, left: 0 }])
      .png({ compressionLevel: 6 })
      .toBuffer();
  }

  return sharp(svgBuffer).png({ compressionLevel: 6 }).toBuffer();
}
