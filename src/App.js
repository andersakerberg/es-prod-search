import React from "react";

import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { Button } from "@material-ui/core";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from "./config/config-helper";

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched, results }) => ({
          wasSearched,
          results,
        })}
      >
        {({ wasSearched, results }) => {
          const objArray = [];
          results.forEach((row) => {
            if (objArray[row.productidentifier.raw]) {
              objArray[row.productidentifier.raw].value.push(row);
            } else {
              objArray[row.productidentifier.raw] = {
                key: row.productidentifier.raw,
                value: [row],
              };
            }
          });
          console.log(objArray);
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={<SearchBox autocompleteSuggestions={true} />}
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={"Sort by"}
                          sortOptions={buildSortOptionsFromConfig()}
                        />
                      )}
                      {getFacetFields().map((field) => {
                        console.log(field);
                        return (
                          <Facet
                            key={field}
                            field={field}
                            label={field.substring(0, field.ength - 2)}
                          />
                        );
                      })}
                    </div>
                  }
                  bodyContent={
                    <div>
                      {Object.keys(objArray).map(function (key) {
                        const productsInGroup = objArray[key];
                        const alreadyLoopedMerchants = [];
                        const product = productsInGroup.value[0];
                        return (
                          <div>
                            <div>{decodeURIComponent(product.name.raw)}</div>
                            <div>
                              <img
                                src={decodeURIComponent(product.image.raw)}
                                alt={decodeURIComponent(product.name.raw)}
                                width="200px"
                                height="200px"
                              />
                            </div>
                            <div>
                              {productsInGroup.value.map(function (product) {
                                if (
                                  !alreadyLoopedMerchants.includes(
                                    product.merchant.raw
                                  )
                                ) {
                                  alreadyLoopedMerchants.push(
                                    product.merchant.raw
                                  );
                                  return (
                                    <Button
                                      key={product.merchant.raw}
                                      href={decodeURIComponent(product.url.raw)}
                                      variant="outlined"
                                      color="primary"
                                    >
                                      {product.merchant.raw + " "}
                                      {product.price.raw.substring(
                                        0,
                                        product.price.raw.length - 2
                                      ) + "SEK"}
                                    </Button>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
