//import external files
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, InputLabel, MenuItem, FormControl, Select, Stack, Button } from  '@mui/material';
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import { setCountItems } from '../../Store/countSlice';
import { setCategoryItems } from '../../Store/categorySlice';
import { setSelectedCategory } from '../../Store/selectedCategorySlice';
import { setSelectedProduct } from '../../Store/selectedProductSlice';
import { setShoppingCartItems } from '../../Store/shoppingCartItemsSlice';

//import internal files
import "../../style/main/addProducts.scss";
import TableComponent from "../innerComponents/TableComponent"

const AddProducts = () => {
    
    const baseUrl = "https://localhost:5001/category";
    const productUrl = "https://localhost:5001/shoppingcart";
    const customerID = 1;

    const dispatch = useDispatch();
    const countItems = useSelector((state) => state.count.countItems);
    const categoryItems = useSelector(state => state.category.categoryItems);
    const selectedCategory = useSelector(state => state.selectedCategory.selectedCategory);
    const selectedProduct = useSelector(state => state.selectedProduct.selectedProduct);
    const shoppingCartItems = useSelector(state => state.shoppingCartItems.shoppingCartItems);
    const [requiredError, setRequiredError] = useState("");

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
            dispatch(setCategoryItems(data)); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        dispatch(setSelectedCategory(value));
    };

    const handleProductChange = ({ target: { value } }) => {
        dispatch(setSelectedProduct(value));
    };

    const handleAddItems = async (e) => {
        e.preventDefault();
        setTimeout(async () => {
            try {
                if(!selectedProduct || !selectedProduct)
                    setRequiredError("יש להוסיף מוצר וקטגוריה");

                let customerProduct = {
                    productName: selectedProduct,
                    categoryID: selectedCategory,
                    customerID: customerID
                }

                let response = await AddItemsToShoppingCart(JSON.stringify(customerProduct));
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                } else {
                    const customerProducts = await response.json();
                    dispatch(setShoppingCartItems(customerProducts));
                    const totalCountCategory = customerProducts.reduce((sum, product) => {
                        const getCount = product.innerCustomerItems.reduce((innerSum, element) => {
                            return innerSum + element.quantity;
                        }, 0);
                        return sum + getCount;
                    }, 0);
                    
                    dispatch(setCountItems(totalCountCategory));
                    dispatch(setSelectedCategory(""));
                    dispatch(setSelectedProduct(""));
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
            throw error; 
        }
    };

    const Wrapper = styled(Box)(({ theme }) => ({
       
        [theme.breakpoints.down("md")]: {
         
        },
        [theme.breakpoints.down("sm")]: {
         
        },
        [theme.breakpoints.up("lg")]: {
          
        },
      }));
    
      const Heading = styled(Typography)(({ theme }) => ({
        [theme.breakpoints.down("md")]: {
          fontSize: "1.5rem",
          color: "#10abd9",
        },
      }));

    return(
       <Box className="add-product-page">
            <Box className="title-div">
                <h1>רשימת קניות</h1>
            </Box>
            <Box className="count-items">
                <label className="lbl-counter">סה"כ</label>
                <span className="spn-counter">{`${countItems} מוצרים`}</span>
            </Box>
            <Box className="main-items">
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <TextField id="outlined-basic" label="מוצר" variant="outlined" onChange={handleProductChange} value={selectedProduct} defaultValue={selectedProduct}/>
                </Box>
                <Box sx={{ minWidth: 216 }} className="categories">
                <FormControl sx={{ m: 1, minWidth: 216 }}>
                    <InputLabel id="select-lbl">קטגוריה</InputLabel>
                    <Select
                    labelId="select-lbl"
                    id="select-category"
                    value={selectedCategory}
                    label="קטגוריה"
                    required
                    onChange={handleCategoryChange}
                    className="select-category-type choose-item">
                                {categoryItems.map(item => (
                                    <MenuItem key={item.categoryID} value={item.categoryID}>{item.categoryName}</MenuItem>
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
                    requiredError &&
                    <Wrapper>
                        <Heading variant="h1">{requiredError}</Heading>
                    </Wrapper>
                }
            {
            (shoppingCartItems && shoppingCartItems.length > 0) ?
            <Box>
                 <Wrapper>
                    <Heading className="lbl-information has-results" variant="h1">יש לאסוף מוצרים אלו במחלקות המתאימות</Heading>
                </Wrapper>
                    <Box className="shoppingCart-table">
                        <TableComponent items={shoppingCartItems}/>
                    </Box>
            </Box> :
            <Box>
                 <Wrapper>
                    <Heading variant="h1" className="lbl-information">עדיין אין לך מוצרים לשליחה</Heading>
                </Wrapper>
            </Box>
        }
           
       </Box>
    )
}

export default AddProducts;