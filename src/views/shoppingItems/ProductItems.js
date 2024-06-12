import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import "../../style/main/shopping.scss"

const ProductItems = () => {
    const [categoryItems, setCategoryItems] = useState([]);
    const [productItems, setProductItems] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState([]);

    const [countItems, setCountItems] = useState(0);
    const [isHasProduct, setIsHasProduct] = useState(true);
    const [addingItems, setAddingItems] = useState([]);

    const [shoppingCartItems, setShoppingCartItems] = useState([]);


    const baseUrl = "https://localhost:5001/category";
    const productUrl = "https://localhost:5001/product";
    const customerID = 1;

    //Get Categories on load
    useEffect(() => {
        fetchCategories(); 
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setCategoryItems(data); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

      //Get Products after choosing Category
      useEffect(() => {
              fetchProducts();  
            }, [selectedCategory]);

    const fetchProducts = async () => {
        try {
            if(selectedCategory != "")
                {
                    const response = await fetch(`${baseUrl}/GetProducts?categoryID=${selectedCategory}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    if(data.length > 0){
                        setProductItems(data); 
                        if(isHasProduct == false)
                            setIsHasProduct(true);
                    }
                    else{
                        setIsHasProduct(false);
                        setProductItems([]);
                    }
                }
         
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setSelectedCategory(value);
    };

    const handleProductChange = (event) => {
        const value = event.target.value;
        setSelectedProduct(value);
        value.forEach(val =>{
            const selectedItem = productItems.find(item => item.productID == val);
            const notExistsItems = selectedItem ? addingItems.filter(item => item.productID !== selectedItem.productID) : addingItems;
            if(addingItems.length == 0 || (notExistsItems != 0 && addingItems.length > 0)){
                setAddingItems([...notExistsItems, selectedItem]);
                setCountItems(value.length);
            }
        })
        
    };


    const handleAddItems = async (e) => {
        setTimeout(async () => {
            try {
                let ShoppingCartItemModel = JSON.stringify({
                    CustomerID: customerID,        
                    Products: addingItems,
                });
                let response = await AddItemsToShoppingCart(ShoppingCartItemModel);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                } else {
                    const data = await response.json();
                    setShoppingCartItems(data);
                    setCountItems(data.length);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }, 500);
    };

    const AddItemsToShoppingCart = async (ShoppingCartItemModel) => {
        try {
            const response = await fetch(`${productUrl}/AddItemsToShoppingCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: ShoppingCartItemModel
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error:', response.status, errorMessage);
                throw new Error(`Error ${response.status}: ${errorMessage}`);
            }
    
            return response;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    };

    const getProductNameById = (id) => {
        const product = productItems.find(item => item.productID === id);
        return product ? product.productName : '';
    };

  
    return(
        <Box className="shopping-page">
            <Box className="title-div">
                <h1>רשימת קניות</h1>
            </Box>
        <Box className="count-items">
            <label className="lbl-counter">כמות:</label>
            <span className="spn-counter">{countItems}</span>
        </Box>
        <Box className="main-items">
            <Box className="categories">
            <FormControl>
                    <InputLabel id="select-lbl">קטגוריה</InputLabel>
                    <Select
                        labelId="select-lbl"
                        id="select-category"
                        value={selectedCategory}
                        label="קטגוריה"
                        onChange={handleCategoryChange}
                        className="select-category-type choose-item">
                            {categoryItems.map(item => (
                                <MenuItem key={item.categoryID} value={item.categoryID}>{item.categoryName}</MenuItem>
                            ))}
                        </Select>
            </FormControl>
            </Box>
             
            <Box className="products">
                <FormControl>
                        <InputLabel id="select-lbl">מוצרים</InputLabel>
                        <Select
                            disabled= {selectedCategory == ""}
                            labelId="select-lbl"
                            id="select-product"
                            value={selectedProduct}
                            renderValue={(selected) => {
                                if (selected.length === 1) {
                                    return getProductNameById(selected[0]);
                                } else {
                                    return selected.map(id => getProductNameById(id)).join(", ");
                                }
                            }}
                            multiple
                            label="מוצרים"
                            onChange={handleProductChange}
                            className="select-product-type choose-item">
                                {productItems.map(item => (
                                    <MenuItem key={item.productID} value={item.productID}>{item.productName}</MenuItem>
                                ))}
                            </Select>
                </FormControl>
            </Box>
                        
            
            <Box className="add-item">
                <Stack spacing={2} direction="row">
                 <Button className="add-btn" variant="contained" onClick={handleAddItems}>הוסף</Button>
                </Stack>
            </Box>
        </Box>
        {
            isHasProduct == false &&
            <Box className="no-results">
                <span>אזלו המוצרים מקטגוריה זו. סליחה...</span>
            </Box>
        }
        {
            (shoppingCartItems && shoppingCartItems.length > 0) &&
            <Box className="shoppingCart-table">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                        {shoppingCartItems.map(item => (
                                <TableCell className="td-items" key={item.categoryID} value={item.categoryID}>{item.categoryName} - {item.countCategory} מוצרים</TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {shoppingCartItems.map(item => (
                        <TableRow key={item.categoryID}>
                            {item.innerItems.map(product => (
                                <TableCell className="sc-item" key={product.productID} value={product.productID}>{product.productName}</TableCell>
                            ))}
                        </TableRow>
            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        }
      
        </Box>
    )
}

export default ProductItems;