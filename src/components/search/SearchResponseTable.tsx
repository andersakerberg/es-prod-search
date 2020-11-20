import React from "react";
import { TableContainer, Paper, Grid } from "@material-ui/core";
import shortid from "shortid";
import { convertFromEsSearchData } from "utils/EsSearch/converter";
import ProductTable from "./product/ProductTable";

export default function SearchResponseTable(props: {
  esSearchData: Search.EsSearchData[];
}) {
  const rows = convertFromEsSearchData(props.esSearchData);
  return (
    <Grid spacing={1} container key={`product-grid-${shortid}`}>
      <TableContainer component={Paper} key={`table-container-${shortid}`}>
        <ProductTable products={rows}></ProductTable>
      </TableContainer>
    </Grid>
  );
}
