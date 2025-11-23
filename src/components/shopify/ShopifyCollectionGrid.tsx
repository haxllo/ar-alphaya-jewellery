'use client';

import { useEffect, useRef } from 'react';

interface ShopifyCollectionGridProps {
  collectionId: string; // Shopify collection ID
  storefrontAccessToken: string;
  domain: string; // Your Shopify store domain
  productsPerRow?: number;
  buttonText?: string;
  showPagination?: boolean;
}

declare global {
  interface Window {
    ShopifyBuy?: any;
  }
}

export default function ShopifyCollectionGrid({
  collectionId,
  storefrontAccessToken,
  domain,
  productsPerRow = 3,
  buttonText = 'Buy Now',
  showPagination = true,
}: ShopifyCollectionGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Shopify Buy Button SDK
    const script = document.createElement('script');
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.async = true;

    script.onload = () => {
      if (window.ShopifyBuy && gridRef.current) {
        const client = window.ShopifyBuy.buildClient({
          domain: domain,
          storefrontAccessToken: storefrontAccessToken,
        });

        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          ui.createComponent('collection', {
            id: collectionId,
            node: gridRef.current,
            moneyFormat: 'Rs.%20%7B%7Bamount%7D%7D',
            options: {
              product: {
                styles: {
                  product: {
                    '@media (min-width: 601px)': {
                      'max-width': `calc(${100 / productsPerRow}% - 20px)`,
                      'margin-left': '10px',
                      'margin-right': '10px',
                      'margin-bottom': '50px',
                    },
                  },
                  title: {
                    'font-family': 'inherit',
                    'font-size': '18px',
                    'font-weight': '600',
                  },
                  button: {
                    'font-family': 'inherit',
                    'background-color': '#2563eb',
                    ':hover': {
                      'background-color': '#1d4ed8',
                    },
                    'border-radius': '8px',
                  },
                  price: {
                    'font-family': 'inherit',
                    'font-size': '16px',
                    'font-weight': '600',
                    'color': '#059669',
                  },
                },
                text: {
                  button: buttonText,
                },
              },
              productSet: {
                styles: {
                  products: {
                    '@media (min-width: 601px)': {
                      'margin-left': '-10px',
                      'margin-right': '-10px',
                    },
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
  }, [collectionId, storefrontAccessToken, domain, productsPerRow, buttonText, showPagination]);

  return <div ref={gridRef} className="shopify-collection-grid" />;
}
