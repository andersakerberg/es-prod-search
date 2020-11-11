import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { v4 } from "uuid";
import { Button } from "@material-ui/core";
import "react-perfect-scrollbar/dist/css/styles.css";

import {
  ErrorBoundary,
  SearchProvider,
  SearchBox,
  PagingInfo,
  ResultsPerPage,
  Paging,
  WithSearch,
  Facet,
} from "@elastic/react-search-ui";
import { SingleLinksFacet } from "@elastic/react-search-ui-views";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "./styles.css";
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  getConfig,
} from "./config/config-helper";
import { RibbonContainer, RightCornerLargeRibbon } from "react-ribbons";

function ClearFilters({ filters, clearFilters, className }) {
  if (filters.length > 0) {
    return (
      <div key={className}>
        <button className={className} onClick={() => clearFilters()}>
          Rensa {filters.length} filter..
        </button>
      </div>
    );
  }
  return null;
}
const useStyles = makeStyles((theme) => ({
  rootmedia: {
    width: "auto",
    padding: 20,
    marginRight: "auto",
    marginLeft: "auto",
    height: 450,
    position: "relative",
    margin: 10,
  },
  media: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    height: 200,
  },

  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  readMoreButton: { backgroundColor: "#4bbcd3", color: "white" },
  toStoreButton: { backgroundColor: "#F3A4AF", color: "white" },
  /*#example2 {
  background: url(mountain.jpg),
  background-repeat: no-repeat;
  background-size: 300px 100px;
}*/
}));
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

// One item component
// selected prop will be passed
const MenuItem = ({ text, selected }) => {
  return <div className={`menu-item ${selected ? "active" : ""}`}>{text}</div>;
};

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
  list.map((el) => {
    const { name } = el;

    return <MenuItem text={name} key={name} selected={selected} />;
  });

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const structuredDataSingle = (prod, deeplink) => {
  let data = {
    "@context": "http://schema.org/",
    "@type": "Product",
    name: `${prod.name.raw}`,
    image: prod.image.raw,
    description:
      prod.description && prod.description.raw
        ? prod.description.raw
        : prod.name.raw,
    url: deeplink,
    offers: {
      "@type": "Offer",
      priceCurrency: `${"SEK"}`,
      price: prod["price"] ? `${parseFloat(prod.price.raw)}` : 0,
      availability: `${getRandomInt(20)}`,
      seller: {
        "@type": "Organization",
        name: prod.brand && prod.brand.raw ? prod.brand.raw : "Leksakstips.se",
      },
    },
  };

  // brand
  if (prod.ean && prod.ean.raw) {
    // @ts-ignore
    data.mpn = prod.ean.raw;
    // @ts-ignore
    data.brand = {
      "@type": "Thing",
      name: prod.brand && prod.brand.raw ? prod.brand.raw : "Leksakstips.se",
    };
  }

  // logo
  if (prod["image"]) {
    data["image"] = prod["logo"];
  }

  return JSON.stringify(data);
};

let selected = "tag_01";
const facetsToShow = 6;

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
      <Facet show={facetsToShow} field="tag_01" label="tag_01" view={SingleLinksFacet} />
    );
  }

  return (
    <Facet show={facetsToShow} field="tag_01" label="tag_01" view={SingleLinksFacet} />
  );
};

export default function Search() {
  const classes = useStyles();

  return (
    <SearchProvider className="search-affe-box" key={v4()} config={config}>
      <WithSearch
        key={v4()}
        mapContextToProps={({
          wasSearched,
          results,
          searchTerm,
          filters,
          clearFilters,
        }) => ({
          wasSearched,
          results,
          searchTerm,
          filters,
          clearFilters,
        })}
      >
        {({ wasSearched, results, searchTerm, filters, clearFilters }) => {
          return (
            <div className="App">
              <ErrorBoundary key={v4()}>
                <Layout
                  header={
                    <div>
                      <SearchBox
                        autocompleteSuggestions={true}
                        searchAsYouType={true}
                        inputProps={{
                          placeholder:
                            "Sök leksak eller kategori och jämför pris",
                        }}
                      />
                      <ClearFilters
                        className="clearfilters-btn"
                        filters={filters}
                        clearFilters={clearFilters}
                      />

                      {getFacetLinks(filters)}
                    </div>
                  }
                  bodyContent={
                    <div>
                      <Grid spacing={1} container>
                        {results.map(function (product, index) {
                          let commaSeparatedDocumentIds = "";
                          if (product.product_ids) {
                            commaSeparatedDocumentIds = product.product_ids.raw.join(
                              ","
                            );
                          } else {
                          }

                          product.query = searchTerm;
                          const href = window.location.href.split("?")[0];
                          let detailLink = "";
                          if (href.includes("localhost")) {
                            detailLink =
                              "http://localhost:3001/productdetail?documentIds=" +
                              commaSeparatedDocumentIds +
                              "&query=" +
                              searchTerm +
                              "&domain=" +
                              "http://localhost:3001";
                          } else {
                            detailLink =
                              "/productpage?documentIds=" +
                              commaSeparatedDocumentIds +
                              "&query=" +
                              searchTerm +
                              "&domain=" +
                              href;
                          }

                          return (
                            <Grid
                              key={"main-grid" + product.id.raw}
                              item
                              lg={4}
                              xs={12}
                            >
                              <div style={{ display: "none" }}>
                                {structuredDataSingle(product, detailLink)}
                              </div>
                              <Card
                                key={product.name.raw + index}
                                className={classes.rootmedia}
                              >
                                <RibbonContainer className="custom-class">
                                  <CardActionArea>
                                    <a
                                      href={detailLink}
                                      key={product.id.raw + "link"}
                                    >
                                      <CardMedia
                                        className={classes.media}
                                        image={
                                          product.image
                                            ? product.image.raw
                                            : "https://via.placeholder.com/150"
                                        }
                                        title={product.name.raw}
                                      />
                                    </a>
                                    <CardContent>
                                      <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                      >
                                        {product.name.raw}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                      >
                                        {product
                                          ? product.description?.raw.substring(
                                              0,
                                              99
                                            ) + "..."
                                          : ""}
                                      </Typography>
                                    </CardContent>
                                  </CardActionArea>
                                  <CardActions>
                                    <div className="buttonsBottom">
                                      <Button
                                        size="small"
                                        color="primary"
                                        className={classes.toStoreButton}
                                        href={product.url.raw}
                                        target="blank"
                                      >
                                        Till butik
                                      </Button>
                                      <Button
                                        size="small"
                                        color="primary"
                                        className={classes.readMoreButton}
                                        href={detailLink}
                                      >
                                        Läs mer
                                      </Button>
                                    </div>
                                  </CardActions>
                                  <RightCornerLargeRibbon
                                    backgroundColor="#cc0000"
                                    color="#f0f0f0"
                                    fontFamily="Arial"
                                  >
                                    {product.price.raw + " SEK"}
                                  </RightCornerLargeRibbon>
                                </RibbonContainer>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
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
