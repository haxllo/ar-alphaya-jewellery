'use client';

import { useEffect, useRef } from 'react';

interface ShopifyBuyButtonProps {
  productId: string; // Shopify product ID (e.g., '8234567890123')
  storefrontAccessToken: string;
  domain: string; // Your Shopify store domain (e.g., 'your-store.myshopify.com')
  buttonText?: string;
  buttonStyles?: {
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    borderRadius?: string;
  };
  showImage?: boolean;
  showPrice?: boolean;
  showTitle?: boolean;
}

declare global {
  interface Window {
    ShopifyBuy?: any;
  }
}

export default function ShopifyBuyButton({
  productId,
  storefrontAccessToken,
  domain,
  buttonText = 'Buy Now',
  buttonStyles = {},
  showImage = true,
  showPrice = true,
  showTitle = true,
}: ShopifyBuyButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Shopify Buy Button SDK
    const script = document.createElement('script');
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.async = true;

    script.onload = () => {
      if (window.ShopifyBuy && buttonRef.current) {
        const client = window.ShopifyBuy.buildClient({
          domain: domain,
          storefrontAccessToken: storefrontAccessToken,
        });

        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          ui.createComponent('product', {
            id: productId,
            node: buttonRef.current,
            moneyFormat: 'Rs.%20%7B%7Bamount%7D%7D', // Rs. {amount}
            options: {
              product: {
                styles: {
                  product: {
                    '@media (min-width: 601px)': {
                      'max-width': '100%',
                      'margin-left': '0',
                      'margin-bottom': '50px',
                    },
                  },
                  title: {
                    'font-family': 'inherit',
                    'font-size': '24px',
                    'font-weight': '600',
                    'color': '#1f2937',
                  },
                  button: {
                    'font-family': 'inherit',
                    'font-size': '16px',
                    'padding-top': '16px',
                    'padding-bottom': '16px',
                    'background-color': buttonStyles.backgroundColor || '#2563eb',
                    'color': buttonStyles.color || '#ffffff',
                    'border-radius': buttonStyles.borderRadius || '8px',
                    ':hover': {
                      'background-color': buttonStyles.backgroundColor 
                        ? `${buttonStyles.backgroundColor}dd` 
                        : '#1d4ed8',
                    },
                    ':focus': {
                      'background-color': buttonStyles.backgroundColor 
                        ? `${buttonStyles.backgroundColor}dd` 
                        : '#1d4ed8',
                    },
                  },
                  price: {
                    'font-family': 'inherit',
                    'font-size': '20px',
                    'font-weight': '600',
                    'color': '#059669',
                  },
                  compareAt: {
                    'font-family': 'inherit',
                    'font-size': '16px',
                    'color': '#6b7280',
                  },
                },
                buttonDestination: 'checkout',
                contents: {
                  img: showImage,
                  title: showTitle,
                  price: showPrice,
                  button: true,
                },
                text: {
                  button: buttonText,
                },
              },
              cart: {
                styles: {
                  button: {
                    'font-family': 'inherit',
                    'background-color': '#2563eb',
                    ':hover': {
                      'background-color': '#1d4ed8',
                    },
                    'border-radius': '8px',
                  },
                },
                text: {
                  total: 'Subtotal',
                  button: 'Checkout',
                },
              },
              toggle: {
                styles: {
                  toggle: {
                    'font-family': 'inherit',
                    'background-color': '#2563eb',
                    ':hover': {
                      'background-color': '#1d4ed8',
                    },
                  },
                  count: {
                    'font-size': '16px',
                  },
                },
              },
              modalProduct: {
                contents: {
                  img: true,
                  imgWithCarousel: true,
                  button: true,
                  buttonWithQuantity: true,
                },
                styles: {
                  product: {
                    '@media (min-width: 601px)': {
                      'max-width': '100%',
                      'margin-left': '0px',
                      'margin-bottom': '0px',
                    },
                  },
                  button: {
                    'font-family': 'inherit',
                    'background-color': '#2563eb',
                    ':hover': {
                      'background-color': '#1d4ed8',
                    },
                    'border-radius': '8px',
                  },
                },
              },
              option: {
                styles: {
                  label: {
                    'font-family': 'inherit',
                    'font-weight': '600',
                  },
                  select: {
                    'font-family': 'inherit',
                  },
                },
              },
            },
          });
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [productId, storefrontAccessToken, domain, buttonText, buttonStyles, showImage, showPrice, showTitle]);

  return <div ref={buttonRef} className="shopify-buy-button" />;
}
