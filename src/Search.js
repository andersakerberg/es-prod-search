import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
import Paper from "@material-ui/core/Paper";
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
import {
  SingleLinksFacet,
  SingleSelectFacet,
} from "@elastic/react-search-ui-views";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "./styles.css";
import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from "./config/config-helper";
import Loader from "./Loader";
import {
  RibbonContainer,
  RightCornerRibbon,
  RightCornerLargeRibbon,
} from "react-ribbons";

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

function getGroupedProducts(scrambled) {
  // scrambled.forEach((row) => {
  //   if (row.sku?.raw && !row.ean?.raw) {
  //     const muppjevel = scrambled.find(
  //       (X) => X.sku !== null && X.sku.raw === row.sku?.raw
  //     );
  //     if (muppjevel) {
  //       row.ean.raw = muppjevel.ean.raw;
  //     }
  //   }
  // });
  let objArray = [];
  scrambled.forEach((row) => {
    if (!row.ean?.raw) {
      if (row.gtin?.raw) {
        row.ean.raw = row.gtin?.raw;
      }
      if (!row.gtin?.raw) {
      }
    }
    let productId = null;
    if (row.name.raw !== null) {
      const match = row.name?.raw.match(/\d/g);
      if (match && match[0].length > 8) {
        productId = match[0];
      }
    }
    if (!productId) {
      productId = null;
    }

    if (productId != null && (productId == "" || productId.length < 1)) {
      productId = null;
    }
    let groupByProductId = null;

    groupByProductId = objArray
      .filter((X) => X.ean != null)
      .find((X) => X.ean.raw === row.ean?.raw);
    if (groupByProductId) {
      groupByProductId.id = v4();
      groupByProductId.value.push(row);
      groupByProductId.productId = productId;
      groupByProductId.key = row.ean?.raw;
      groupByProductId.sku = row.sku?.raw !== null ? row.sku?.raw : null;
      if (row.brand) {
        groupByProductId.brand = row.brand?.raw;
      }
    } else {
      objArray.push({
        key: row.ean?.raw,
        id: v4(),
        value: [row],
        productId: productId,
        brand: row.brand !== null ? row.brand?.raw : null,
        sku: row.sku?.raw !== null ? row.sku?.raw : null,
      });
    }
  });

  objArray.forEach((firstGrouping) => {
    const brand = firstGrouping.brand?.raw;
    const productId = firstGrouping.productId;
    const ean = firstGrouping.ean?.rwa;
    const productsGrouped = firstGrouping.value;
    const id = firstGrouping.id?.raw;
    const sku = firstGrouping.sku?.raw;
    let foundmatch = false;
    if (productId != null) {
      const foundMatchOnProductIdInOtherGroup = objArray.find(
        (X) =>
          X.productId != null &&
          X.brand != null &&
          X.brand.raw != null &&
          X.id.raw != null &&
          X.productId === firstGrouping.productId &&
          X.brand === firstGrouping.brand?.raw &&
          X.id !== firstGrouping.id?.raw
      );
      if (foundMatchOnProductIdInOtherGroup) {
        foundMatchOnProductIdInOtherGroup.value.push(productsGrouped);
        objArray = objArray.filter(function (item) {
          return item.id?.raw !== id;
        });
        foundmatch = true;
      }
    }

    if (sku != null && !foundmatch) {
      const foundMatchOnProductIdInOtherGroup = objArray.find(
        (X) =>
          X.sku != null &&
          X.id != null &&
          X.id.raw != null &&
          X.sku.raw != null &&
          X.sku.raw === firstGrouping.sku &&
          X.id.raw !== firstGrouping.id
      );
      if (foundMatchOnProductIdInOtherGroup) {
        foundMatchOnProductIdInOtherGroup.value.push(productsGrouped);
        objArray = objArray.filter(function (item) {
          return item.id.raw !== id;
        });
      }
    }
  });

  return objArray;
}

export default function Search() {
  const classes = useStyles();
  const [spacing, setSpacing] = React.useState(2);
  const [groupedProducts, setGroupedProducts] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };
  return (
    <SearchProvider config={config}>
      <WithSearch
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
              <ErrorBoundary>
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

                      {getFacetFields().map((field) => {
                        return (
                          <Facet
                            show={8}
                            key={"facet"}
                            field={field}
                            label={field.substring(0, field.length)}
                            view={SingleLinksFacet}
                          />
                        );
                      })}
                    </div>
                  }
                  bodyContent={
                    <div>
                      <Grid container>
                        {results.map(function (product, index) {
                          console.log(results);
                          let commaSeparatedDocumentIds = "";
                          if (product.product_ids) {
                            console.log(product);
                            commaSeparatedDocumentIds = product.product_ids.raw.join(
                              ","
                            );
                          } else {
                            console.log(
                              "NO PRODUCT ID ON PRODUCT WITH ID " + product.id
                            );
                          }
                          console.log(product.tag_04);

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
                              spacing={2}
                            >
                              <Card
                                key={product.name.raw + index}
                                className={classes.rootmedia}
                              >
                                <a href={detailLink}>
                                  <RibbonContainer className="custom-class">
                                    <CardActionArea>
                                      <CardMedia
                                        className={classes.media}
                                        image={
                                          product.image
                                            ? product.image.raw
                                            : "https://via.placeholder.com/150"
                                        }
                                        title={product.name.raw}
                                      />

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
                                </a>
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
