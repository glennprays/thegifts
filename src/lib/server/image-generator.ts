import satori from 'satori';
import sharp from 'sharp';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Cache fonts at module level
let cachedFonts: Record<string, Buffer> | null = null;

async function loadFonts(): Promise<Record<string, Buffer>> {
  if (cachedFonts) return cachedFonts;

  cachedFonts = {
    regular: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/GraphikCompact-Regular-Trial.otf')
    ),
    bold: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/GraphikCompact-Bold-Trial.otf')
    ),
    semibold: fs.readFileSync(
      path.join(process.cwd(), 'static/fonts/GraphikCompact-Semibold-Trial.otf')
    )
  };
  return cachedFonts;
}

interface TopGift {
  name: string;
  score: number;
}

interface GenerateStoriesImageOptions {
  name: string;
  topGifts: TopGift[];
  topGiftPracticals: string[];
  locale: 'en' | 'id';
}

export async function generateStoriesImage(
  options: GenerateStoriesImageOptions
): Promise<Buffer> {
  const fonts = await loadFonts();
  const { name, topGifts, topGiftPracticals, locale } = options;

  // Generate QR code as base64
  const qrDataUrl = await QRCode.toDataURL('https://thegifts.site', {
    width: 150,
    margin: 1,
    color: { dark: '#1B1B1B', light: '#FFFFFF' }
  });

  // Extract base64 data from data URL
  const qrBase64 = qrDataUrl.split(',')[1];

  // Translations
  const titleText = locale === 'en' ? "Spiritual Gifts Assessment" : "Tes Karunia Rohani";
  const yourGiftsText = locale === 'en' ? "Your Top Gifts" : "Karunia Teratas Anda";
  const practicalText = locale === 'en' ? "Practical Applications" : "Penerapan Praktis";
  const scanText = locale === 'en' ? "Scan to discover yours" : "Pindai untuk menemukan milikmu";

  // Generate colors for progress bars (HSL gradient)
  function getBarColor(index: number): string {
    const hue = 220 - index * 15;
    return `hsl(${hue}, 70%, 50%)`;
  }

  // Build gift items JSX
  const giftItems = topGifts.slice(0, 3).map((gift, i) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
        padding: i === 0 ? '20px' : '12px 16px',
        backgroundColor: i === 0 ? '#f0fdf4' : '#ffffff',
        borderRadius: i === 0 ? '20px' : '12px',
        border: i === 0 ? '3px solid #7c9a2f' : '1px solid #e5e7eb'
      },
      children: [
        // Rank badge
        {
          type: 'div',
          props: {
            style: {
              width: i === 0 ? '48px' : '36px',
              height: i === 0 ? '48px' : '36px',
              borderRadius: '50%',
              background: i === 0
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                : `linear-gradient(135deg, ${getBarColor(i)}, ${getBarColor(i)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              flexShrink: 0
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    color: 'white',
                    fontWeight: 700,
                    fontSize: i === 0 ? '24px' : '18px'
                  },
                  children: String(i + 1)
                }
              }
            ]
          }
        },
        // Gift name and score
        {
          type: 'div',
          props: {
            style: {
              flex: 1
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: i === 0 ? '28px' : '20px',
                          fontWeight: i === 0 ? 700 : 600,
                          color: '#1B1B1B'
                        },
                        children: gift.name
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: i === 0 ? '24px' : '18px',
                          fontWeight: 700,
                          color: '#1B1B1B'
                        },
                        children: `${gift.score}/25`
                      }
                    }
                  ]
                }
              },
              // Progress bar
              {
                type: 'div',
                props: {
                  style: {
                    width: '100%',
                    height: i === 0 ? '12px' : '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: `${(gift.score / 25) * 100}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${getBarColor(i)}, ${getBarColor(i)})`,
                          borderRadius: '9999px'
                        },
                        children: []
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
  }));

  // Build practical applications items
  const practicalItems = topGiftPracticals.slice(0, 3).map((app) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '10px'
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#7c9a2f',
              marginTop: '8px',
              marginRight: '12px',
              flexShrink: 0
            },
            children: []
          }
        },
        {
          type: 'span',
          props: {
            style: {
              fontSize: '18px',
              color: '#374151',
              lineHeight: 1.5
            },
            children: app
          }
        }
      ]
    }
  }));

  // Main JSX structure for the image
  const jsx = {
    type: 'div',
    props: {
      style: {
        width: '1080px',
        height: '1920px',
        backgroundColor: '#ffffff',
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Graphik, sans-serif'
      },
      children: [
        // Header with branding
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              marginBottom: '40px'
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#7c9a2f',
                    letterSpacing: '2px'
                  },
                  children: 'thegifts.site'
                }
              }
            ]
          }
        },
        // User name section
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              marginBottom: '20px'
            },
            children: [
              {
                type: 'h1',
                props: {
                  style: {
                    fontSize: '48px',
                    fontWeight: 700,
                    color: '#1B1B1B',
                    marginBottom: '8px'
                  },
                  children: name
                }
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '28px',
                    color: '#6b7280'
                  },
                  children: titleText
                }
              }
            ]
          }
        },
        // Top gifts section
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              marginTop: '30px',
              marginBottom: '16px'
            },
            children: [
              {
                type: 'h2',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '20px'
                  },
                  children: yourGiftsText
                }
              },
              ...giftItems
            ]
          }
        },
        // Practical applications section
        ...(topGiftPracticals.length > 0
          ? [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '30px',
                    flex: 1
                  },
                  children: [
                    {
                      type: 'h2',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '16px'
                        },
                        children: practicalText
                      }
                    },
                    ...practicalItems
                  ]
                }
              }
            ]
          : []),
        // QR code section at bottom
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 'auto',
              paddingTop: '40px',
              borderTop: '2px solid #e5e7eb'
            },
            children: [
              {
                type: 'img',
                props: {
                  src: `data:image/png;base64,${qrBase64}`,
                  width: 150,
                  height: 150,
                  style: {
                    marginRight: '24px'
                  }
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column'
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          color: '#6b7280',
                          marginBottom: '4px'
                        },
                        children: scanText
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '32px',
                          fontWeight: 700,
                          color: '#7c9a2f',
                          letterSpacing: '2px'
                        },
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

  const svg = await satori(jsx, {
    width: 1080,
    height: 1920,
    fonts: [
      { name: 'Graphik', data: fonts.regular, weight: 400 },
      { name: 'Graphik', data: fonts.semibold, weight: 600 },
      { name: 'Graphik', data: fonts.bold, weight: 700 }
    ]
  });

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
