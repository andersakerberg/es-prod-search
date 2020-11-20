declare module Search {
  interface MerchantData {
    name: string;
    id: number;
    url: string;
    price: string;
    merchantLogoUrl: string;
  }

  interface SearchData {
    key: number;
    name: string;
    image: string;
    product_ids: number[];
    brand: string;
    description: string;
    tag_01: string;
    tag_02: string;
    tag_03: string;
    tag_04: string;
    tag_05: string;
    price: string;
    url: string;
    id: number;
    merchantData: MerchantData[];
  }


  interface EsProperty {
     raw:any;
  }


  interface EsSearchData {
    key: EsProperty;
    name: EsProperty;
    image: EsProperty;
    product_ids: EsProperty;
    brand: EsProperty;
    description: EsProperty;
    tag_01: EsProperty;
    tag_02: EsProperty;
    tag_03: EsProperty;
    tag_04: EsProperty;
    tag_05: EsProperty;
    price: EsProperty;
    url: EsProperty;
    id: EsProperty;
    merchantdata: EsProperty;
    merchantlogourl: EsProperty;
  }
}
