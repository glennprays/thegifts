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
  description?: string;
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
  const giftItems = topGifts.slice(0, 3).map((gift, i) => {
    if (i === 0) {
      // Hero card for top gift
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #7c9a2f 0%, #5a7a1f 100%)',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '24px',
            boxShadow: '0 20px 40px rgba(124, 154, 47, 0.3)'
          },
          children: [
            // Header with badge and label
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                },
                children: [
                  // Gold badge
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '16px'
                      },
                      children: [
                        {
                          type: 'span',
                          props: {
                            style: {
                              color: '#1B1B1B',
                              fontWeight: 700,
                              fontSize: '28px'
                            },
                            children: '1'
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '20px',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9)'
                      },
                      children: yourGiftsText.split(' ')[0] + ' #' + (i + 1)
                    }
                  }
                ]
              }
            },
            // Gift name
            {
              type: 'h2',
              props: {
                style: {
                  fontSize: '40px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '16px'
                },
                children: gift.name
              }
            },
            // Description (if available)
            ...(gift.description ? [
              {
                type: 'p',
                props: {
                  style: {
                    fontSize: '20px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '20px'
                  },
                  children: gift.description
                }
              }
            ] : []),
            // Score with progress bar
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flex: 1,
                        height: '14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
                              background: 'white',
                              borderRadius: '9999px'
                            }
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '24px',
                        fontWeight: 700,
                        color: 'white'
                      },
                      children: `${gift.score}/25`
                    }
                  }
                ]
              }
            }
          ]
        }
      };
    } else {
      // Smaller cards for #2 and #3
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '16px 20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '2px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          },
          children: [
            // Rank badge
            {
              type: 'div',
              props: {
                style: {
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${getBarColor(i)}, ${getBarColor(i)})`,
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
                        fontSize: '20px'
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
                  display: 'flex',
                  flexDirection: 'column',
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
                              fontSize: '22px',
                              fontWeight: 600,
                              color: '#1B1B1B'
                            },
                            children: gift.name
                          }
                        },
                        {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '18px',
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
                        display: 'flex',
                        width: '100%',
                        height: '8px',
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
                            }
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
    }
  });

  // Build practical applications items (now showing 4)
  const practicalItems = topGiftPracticals.slice(0, 4).map((app, i) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#f0fdf4',
        borderRadius: '12px',
        borderLeft: '4px solid #7c9a2f'
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#7c9a2f',
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
                    fontSize: '16px'
                  },
                  children: String(i + 1)
                }
              }
            ]
          }
        },
        {
          type: 'span',
          props: {
            style: {
              fontSize: '20px',
              fontWeight: 500,
              color: '#1B1B1B',
              lineHeight: 1.4
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
        background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
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
              marginBottom: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(124, 154, 47, 0.1) 0%, rgba(124, 154, 47, 0.05) 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(124, 154, 47, 0.2)'
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '36px',
                    fontWeight: 700,
                    color: '#7c9a2f',
                    letterSpacing: '3px'
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
              marginBottom: '30px'
            },
            children: [
              {
                type: 'h1',
                props: {
                  style: {
                    fontSize: '52px',
                    fontWeight: 700,
                    color: '#1B1B1B',
                    marginBottom: '12px'
                  },
                  children: name
                }
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 500,
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
              marginBottom: '30px'
            },
            children: [
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
                    marginTop: '10px',
                    flex: 1
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '20px'
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: '6px',
                                height: '32px',
                                backgroundColor: '#7c9a2f',
                                borderRadius: '3px',
                                marginRight: '12px'
                              }
                            }
                          },
                          {
                            type: 'h2',
                            props: {
                              style: {
                                display: 'block',
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#1B1B1B'
                              },
                              children: practicalText
                            }
                          }
                        ]
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
              background: 'linear-gradient(to top, rgba(124, 154, 47, 0.05) 0%, transparent 100%)',
              borderRadius: '20px'
            },
            children: [
              {
                type: 'img',
                props: {
                  src: `data:image/png;base64,${qrBase64}`,
                  width: 140,
                  height: 140,
                  style: {
                    marginRight: '28px'
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
                          fontSize: '22px',
                          fontWeight: 500,
                          color: '#6b7280',
                          marginBottom: '6px'
                        },
                        children: scanText
                      }
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '36px',
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
