import React from "react";
import { Typography } from "@material-ui/core";
import { SearchBox, Facet } from "@elastic/react-search-ui";
import { SingleLinksFacet } from "@elastic/react-search-ui-views";

const facetsToShow = 13;

const ClearFilters = ({ filters, clearFilters, className }) => {
  if (filters.length > 0) {
    return (
      <div key={className}>
        <button className={className} onClick={() => clearFilters()}>
          <Typography> Rensa {filters.length} filter.. </Typography>
        </button>
      </div>
    );
  }
  return null;
};

const getFacetLinks = (filters) => {
  const facets = [];
  for (let index = 0; index <= filters.length; index++) {
    facets.push(index);
  }

  console.log(facets);
  return (
    <div>
      {facets.map((item, index) => (
        <Facet
          key={"facet-" + item}
          show={facetsToShow}
          field={"tag_0" + (item + 1).toString()}
          label={"tag_0" + (item + 1).toString()}
          view={SingleLinksFacet}
        />
      ))}
    </div>
  );
};

export default function SearchHeader(props: { filters; clearFilters }) {
  return (
    <div>
      <SearchBox
        autocompleteSuggestions={true}
        searchAsYouType={true}
        inputProps={{
          placeholder: "Sök leksak eller kategori och jämför pris",
        }}
      />
      <ClearFilters
        className="clearfilters-btn"
        filters={props.filters}
        clearFilters={props.clearFilters}
      />

      {getFacetLinks(props.filters)}
    </div>
  );
}
