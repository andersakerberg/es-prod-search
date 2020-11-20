import React from "react";
import { Typography } from "@material-ui/core";
import { SearchBox, Facet } from "@elastic/react-search-ui";
import { SingleLinksFacet } from "@elastic/react-search-ui-views";

const facetsToShow = 9;

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
  if (filters && filters.length > 0) {
    if (filters.length === 1) {
      return (
        <div>
          <Facet
            show={facetsToShow}
            field="tag_01"
            label="tag_01"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_02"
            label="tag_02"
            view={SingleLinksFacet}
          />
        </div>
      );
    }

    if (filters.length === 2) {
      return (
        <div>
          <Facet
            show={facetsToShow}
            field="tag_01"
            label="tag_01"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_02"
            label="tag_02"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_03"
            label="tag_03"
            view={SingleLinksFacet}
          />
        </div>
      );
    }

    if (filters.length === 3) {
      return (
        <div>
          <Facet
            show={facetsToShow}
            field="tag_01"
            label="tag_01"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_02"
            label="tag_02"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_03"
            label="tag_03"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_04"
            label="tag_04"
            view={SingleLinksFacet}
          />
        </div>
      );
    }

    if (filters.length === 4) {
      return (
        <div>
          <Facet
            show={facetsToShow}
            field="tag_01"
            label="tag_01"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_02"
            label="tag_02"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_03"
            label="tag_03"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_04"
            label="tag_04"
            view={SingleLinksFacet}
          />
          <Facet
            show={facetsToShow}
            field="tag_05"
            label="tag_05"
            view={SingleLinksFacet}
          />
        </div>
      );
    }
  } else {
    return (
      <Facet
        show={facetsToShow}
        field="tag_01"
        label="tag_01"
        view={SingleLinksFacet}
      />
    );
  }

  return (
    <Facet
      show={facetsToShow}
      field="tag_01"
      label="tag_01"
      view={SingleLinksFacet}
    />
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
