import React from "react";
import Helmet from "react-helmet";
export const structuredDataSingle = (props: {
  prod: Search.SearchData;
  merchant: Search.MerchantData;
}) => {
  const product = props.prod;
  const merchant = props.merchant;

  const data = {
    "@context": "http://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    url: merchant.url,
    brand: {
      "@type": "Brand",
      name: product.brand,
      logo: product.image,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: `${"SEK"}`,
      price: merchant.price.toString(),
      url: merchant.url,
      seller: {
        "@type": "Organization",
        name: merchant.name,
      },
    },
  };

  return JSON.stringify(data);
};

export const StructuredData = (props: {
  prod: Search.SearchData;
  merchant: Search.MerchantData;
}) => {
  return (
    <Helmet>
      <script className="structured-data-list" type="application/ld+json">
        {structuredDataSingle(props)}
      </script>
    </Helmet>
  );
};
