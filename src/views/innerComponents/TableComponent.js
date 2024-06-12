import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TableComponent = (props) => {
  const {items} = props;
  const categoryIDs = items.map(item => item.categoryID);

  // Generate headers
  const headers = items.map(item => (
    <TableCell className="td-items" key={item.categoryID} value={item.categoryID}>
      {item.categoryName} - {item.countCategory} מוצרים
    </TableCell>
  ));

  // Generate rows for the table body
  const rows = [];

  const maxProducts = Math.max(...items.map(item => item.innerCustomerItems.length));
  
  for (let rowIndex = 0; rowIndex < maxProducts; rowIndex++) {
    const cells = categoryIDs.map(categoryID => {
      const item = items.find(item => item.categoryID === categoryID);
      const product = item && item.innerCustomerItems[rowIndex];

      return (
        <TableCell className="sc-item vertical-td" key={`${categoryID}-${rowIndex}`} value={categoryID}  data-label={item?.categoryName}>
          {product ? `${product.productName} - ${product.quantity}` : ''}
        </TableCell>
      );
    });

    rows.push(
      <TableRow key={rowIndex} className="vertical-tr">
        {cells}
      </TableRow>
    );
  }

  return (
    
      <TableContainer component={Paper} className="table-container">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className="head-tbl">
          <TableRow>
            {headers}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </TableContainer>
   
  );
};

export default TableComponent;