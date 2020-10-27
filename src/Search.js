import React from "react";
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
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
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

const useStyles = makeStyles((theme) => ({
  rootmedia: {
    maxWidth: 400,
    marginBottom: 20,
    marginRight: "auto",
    marginLeft: "auto",
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

export default function Search() {
  const classes = useStyles();
  const [spacing, setSpacing] = React.useState(2);
  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched, results, searchTerm }) => ({
          wasSearched,
          results,
          searchTerm,
        })}
      >
        {({ wasSearched, results, searchTerm }) => {
          const objArray = [];
          results.forEach((row) => {
            if (!row.ean) {
              if (row.gtin) {
                row.ean = row.gtin;
              }
              if (row.mpn) {
                row.ean = row.mpn;
              }
            }

            let productId = row.name.raw.match(/\d/g).join("");
            if (productId == "" || productId.length < 1) {
              productId = null;
            }

            if (!row.ean && !productId) {
              row.ean = row.id;
            }

            let groupByEan = null;
            let groupByProductId = null;

            if (productId !== null) {
              groupByProductId = objArray.find(
                (X) => X.productId === productId
              );
              if (groupByProductId) {
                groupByProductId.value.push(row);
                groupByProductId.productId = productId;
                groupByProductId.key = row.ean?.raw;
              } else {
                objArray.push({
                  key: row.ean?.raw,
                  value: [row],
                  productId: productId,
                });
              }
            }

            if (productId == 10920) {
              console.log(objArray);
            }
          });
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
                      <Grid item xs={12}>
                        <Paper className={classes.control}>
                          <Grid container>
                            {Object.keys(objArray).map(function (key) {
                              const productsInGroup = objArray[key];
                              let commaSeparatedDocumentIds = "";
                              const alreadyLoopedMerchants = [];

                              let productWithLowestPrice = null;
                              productsInGroup.value.forEach((product) => {
                                if (!productWithLowestPrice) {
                                  productWithLowestPrice = product;
                                }

                                if (
                                  productWithLowestPrice.price > product.price
                                ) {
                                  productWithLowestPrice = product;
                                }

                                commaSeparatedDocumentIds +=
                                  product.id.raw + ",";
                              });
                              const productWithDescription = productsInGroup.value.find(
                                (product) => product.description != null
                              );
                              const product = productsInGroup.value[0];
                              productsInGroup.query = searchTerm;
                              return (
                                <Card
                                  key={product.name.raw}
                                  className={classes.rootmedia}
                                >
                                  <CardActionArea>
                                    <CardMedia
                                      className={classes.media}
                                      image={product.image.raw}
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
                                        {productWithDescription
                                          ? productWithDescription.description?.raw.substring(
                                              0,
                                              200
                                            ) + "..."
                                          : ""}
                                      </Typography>
                                    </CardContent>
                                  </CardActionArea>
                                  <CardActions>
                                    <Button
                                      size="small"
                                      color="primary"
                                      className={classes.buttonbottom}
                                      href={productWithLowestPrice.url.raw}
                                    >
                                      Ta mig till bästa priset!
                                    </Button>
                                    <Button
                                      size="small"
                                      color="primary"
                                      className={classes.buttonbottom}
                                      href={
                                        "/productdetail?documentIds=" +
                                        commaSeparatedDocumentIds
                                      }
                                    >
                                      Läs mer
                                    </Button>
                                  </CardActions>
                                </Card>
                              );
                            })}
                          </Grid>
                        </Paper>
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
