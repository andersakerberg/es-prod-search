import React from "react";
import {
  ErrorBoundary,
  SearchProvider,
  PagingInfo,
  ResultsPerPage,
  Paging,
  WithSearch,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
} from "../../config/config-helper";
import SearchResponseTable from "./SearchResponseTable";
import SearchHeader from "./SearchHeader";

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
  initialState: {
    resultsPerPage: 8,
  },
};

export default function Search() {
  return (
    <SearchProvider className="search-affe-box" config={config}>
      <WithSearch
        mapContextToProps={({
          wasSearched,
          results,
          filters,
          clearFilters,
        }) => ({
          wasSearched,
          results,
          filters,
          clearFilters,
        })}
      >
        {({ wasSearched, results, filters, clearFilters }) => {
          const searchData = results as Search.EsSearchData[];
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                    <SearchHeader
                      filters={filters}
                      clearFilters={clearFilters}
                    ></SearchHeader>
                  }
                  bodyContent={
                    <SearchResponseTable
                      esSearchData={searchData}
                    ></SearchResponseTable>
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
