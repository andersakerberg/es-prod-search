export const convertFromEsSearchData = (
  esSearchData: Search.EsSearchData[]
): Search.SearchData[] => {
  return esSearchData.map(
    (esSearchData: Search.EsSearchData): Search.SearchData => {
      return {
        price: esSearchData.price?.raw,
        brand: esSearchData.brand?.raw,
        description: esSearchData.brand?.raw,
        id: esSearchData.id.raw,
        image: esSearchData.image?.raw,
        key: esSearchData.key?.raw,
        merchantData: JSON.parse(esSearchData.merchantdata.raw),
        name: esSearchData.name?.raw,
        product_ids: esSearchData.product_ids?.raw,
        tag_01: esSearchData.tag_01?.raw,
        tag_02: esSearchData.tag_02?.raw,
        tag_03: esSearchData.tag_03?.raw,
        tag_04: esSearchData.tag_04?.raw,
        tag_05: esSearchData.tag_05?.raw,
        url: esSearchData.url?.raw,        
      } as Search.SearchData;
    }
  );
};
