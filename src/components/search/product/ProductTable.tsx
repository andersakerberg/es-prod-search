import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  Typography,
  Button,
  TableRow,
  Divider,
} from "@material-ui/core";
import shortid from "shortid";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { RibbonContainer, RightCornerLargeRibbon } from "react-ribbons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { StructuredData } from "components/seo/StructuredData";
import classes from "*.module.css";

const useRowStyles = makeStyles({
  root: {
    borderBottom: "1px black",
  },
  rootmedia: {
    width: "auto",
    padding: 20,
    marginRight: "auto",
    marginLeft: "auto",
    height: 300,
    position: "relative",
    margin: 10,
  },
  media: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },

  paper: {
    height: 140,
    width: 100,
  },

  readMoreButton: { backgroundColor: "#4bbcd3", color: "white" },
  toStoreButton: { backgroundColor: "#F3A4AF", color: "white" },
});

function sortMerchants(
  merchantDataA: Search.MerchantData,
  merchantDataB: Search.MerchantData
) {
  const merchantAPrice = merchantDataA.price;
  const merchantBPrice = merchantDataB.price;
  if (merchantAPrice < merchantBPrice) {
    return -1;
  }
  if (merchantAPrice > merchantBPrice) {
    return 1;
  }

  // names must be equal
  return 0;
}

function Row(props: { row: Search.SearchData }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment key={`react-row-fragment-${shortid}`}>
      <TableRow onClick={() => setOpen(!open)} key={`table-row-${shortid}`}>
        <TableCell align="left">
          <Typography> {row.name}</Typography>
          <LazyLoadImage
            alt={row.name}
            className={classes.media}
            src={row.image ? row.image : "https://via.placeholder.com/150"}
          />
        </TableCell>

        <TableCell align="right">
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow onClick={() => setOpen(!open)}>
        <TableCell align="left">
          <Typography>{row.price + " SEK"}</Typography>
        </TableCell>
        <TableCell align="right">
          <Button
            size="small"
            color="primary"
            href={row.url}
            target="blank"
            className="toStoreButton"
          >
            <Typography>Till butik</Typography>
          </Button>
        </TableCell>
      </TableRow>
      <TableRow onClick={() => setOpen(!open)}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  <TableRow onClick={() => setOpen(!open)}>
                    <TableCell align="center">
                      <RibbonContainer>
                        <LazyLoadImage
                          alt={row.name}
                          className={"detailImage"}
                          src={
                            row.image
                              ? row.image
                              : "https://via.placeholder.com/150"
                          }
                        />
                        <RightCornerLargeRibbon
                          backgroundColor="#cc0000"
                          color="#f0f0f0"
                          fontFamily="Arial"
                        >
                          {row.price + " SEK"}
                        </RightCornerLargeRibbon>
                      </RibbonContainer>
                    </TableCell>
                  </TableRow>
                  <TableRow onClick={() => setOpen(!open)}>
                    <TableCell align="left">
                      <Typography>{row.description}</Typography>
                    </TableCell>
                  </TableRow>

                  {row.merchantData
                    .sort(sortMerchants)
                    .map((merchant: Search.MerchantData) => (
                      <TableRow
                        key={"details" + merchant.id}
                        className="merchant-data"
                      >
                        <TableCell align="left">
                          <StructuredData
                            merchant={merchant}
                            prod={row}
                          ></StructuredData>

                          <img
                            key={"merchant-image" + merchant.id + row.id}
                            className={"merchant-logo"}
                            alt={`Merchant ${merchant.name} with id ${merchant.id} on product ${row.name}`}
                            src={`https://leksakstips.se/images/${merchant.id}.png`}
                          ></img>
                        </TableCell>
                        <TableCell align="left">
                          <Typography className="typo-price-merchant">
                            {" "}
                            {merchant.price + " SEK"}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            size="small"
                            color="primary"
                            href={row.url}
                            target="blank"
                            className="toStoreButton"
                          >
                            <Typography>Till butik</Typography>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
          <Divider></Divider>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ProductTable(props: { products: Search.SearchData[] }) {
  const classes = useRowStyles();
  return (
    <Table aria-label="collapsible table" key={`table-${shortid}`}>
      <TableBody key={`table-body-${shortid}`}>
        {props.products.map((row) => (
          <Row key={`row-${shortid}-${row.id}`} row={row} />
        ))}
      </TableBody>
    </Table>
  );
}
