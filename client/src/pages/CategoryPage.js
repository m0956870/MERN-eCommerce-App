import React, { useState, useEffect, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
} from "@material-ui/core";

import axios from "axios";
import styled from "styled-components";

import Product from "../components/Product";

import { UserContext } from "../App";

const CategoryPage = () => {
  const { category } = useParams();
  // console.log(category);

  const { state } = useContext(UserContext);
  // console.log(state);

  const [allProducts, setAllProducts] = useState(null);

  // FILTERS
  const [usedFilter, setUsedFilter] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  let subCategoryList = [];

  const [sortByValue, setSortByValue] = useState("");
  const [dualRangeValue, setDualRangeValue] = React.useState([10, 50]);

  const fetchAllProducts = async () => {
    try {
      let { data } = await axios.get(`/product/category/${category}`);
      // console.log(data.response)
      if (data.status) {
        setAllProducts(data.response);
        setFilteredProducts(data.response);

        data.response.map((item) => {
          if (!subCategoryList.includes(item.subCategory)) {
            subCategoryList.push(item.subCategory);
          }
          // console.log(subCategoryList);
        });
      }
      setSubCategory(subCategoryList);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // console.log(allProducts);
  // console.log(subCategory);

  // console.log(filteredProducts);
  // console.log(usedFilter);

  const checkboxAllFunc = () => {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false));
    // setSubCategory([]) // second option but rerender subCategory

    fetchAllProducts();
    setUsedFilter(false);
  };

  const checkboxFunc = (e) => {
    // console.log(e.target.value);
    // console.log(e.target.checked);

    if (!usedFilter) {
      setFilteredProducts([]);
    }

    setUsedFilter(true);

    if (e.target.checked) {
      let newList = allProducts.map((item) => {
        if (item.subCategory === e.target.value) {
          // console.log(item)
          setFilteredProducts((filteredProducts) => [
            ...filteredProducts,
            item,
          ]);
        }
      });
      // console.log(newList);
    } else {
      let newList = filteredProducts.filter(
        (item) => item.subCategory !== e.target.value
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  const sortByHandleInput = async (e) => {
    // console.log(e.target.value);
    setSortByValue(e.target.value);

    if (e.target.value === 10) {
      // console.log("ten");

      try {
        let { data } = await axios.get(`/product/category/${category}`);
        // console.log(data.response)
        if (data.status) {
          setAllProducts(data.response);
          setFilteredProducts(data.response);
        }
      } catch (error) {
        // console.log(error);
      }
    } else if (e.target.value === 20) {
      // console.log("twenty");

      try {
        let { data } = await axios.get(`/product/category/newest/${category}`);
        // console.log(data.response)
        if (data.status) {
          setAllProducts(data.response);
          setFilteredProducts(data.response);
        }
      } catch (error) {
        // console.log(error);
      }
    } else if (e.target.value === 50) {
      // console.log("fifty");

      let lowToHigh = allProducts.sort((a, b) => a.price - b.price);
      // console.log(lowToHigh)

      setAllProducts(lowToHigh);
      setFilteredProducts(lowToHigh);
    } else if (e.target.value === 60) {
      // console.log("sixty");

      let highToLow = allProducts.sort((a, b) => b.price - a.price);
      // console.log(highToLow)

      setAllProducts(highToLow);
      setFilteredProducts(highToLow);
    } else {
      console.log(e.target.value);
    }
  };

  const handleChangeDual = (event, newValue) => {
    setDualRangeValue(newValue);
    // console.log(newValue);
    // console.log(newValue[0])
    // console.log(newValue[1])

    if (allProducts) {
      let newList = allProducts.filter(
        (item) => item.price > newValue[0] && item.price < newValue[1]
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  const dualHandle0 = (e) => {
    // console.log(e.target.value);
    setDualRangeValue([e.target.value, dualRangeValue[1]]);

    if (allProducts) {
      let newList = allProducts.filter(
        (item) => item.price > e.target.value && item.price < dualRangeValue[1]
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  const dualHandle1 = (e) => {
    // console.log(e.target.value);
    setDualRangeValue([dualRangeValue[0], e.target.value]);

    if (allProducts) {
      let newList = allProducts.filter(
        (item) => item.price > dualRangeValue[0] && item.price < e.target.value
      );
      // console.log(newList);
      setFilteredProducts(newList);
    }
  };

  return (
    <>
      <Container>
        <nav>
          <SubCategory>
            <div className="all" onClick={() => checkboxAllFunc()}>
              All Products
            </div>

            {subCategory &&
              subCategory.map((item) => (
                <div className="checkbox">
                  <input
                    type="checkbox"
                    name="catgory"
                    value={item}
                    onClick={(e) => checkboxFunc(e)}
                    // checked={checked}
                  />
                  <span className="sub-category"> {item}</span>
                </div>
              ))}
          </SubCategory>

          <SortBy>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort By:</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortByValue}
                label="Age"
                onChange={sortByHandleInput}
              >
                <MenuItem value={10}>Oldest Arrivals</MenuItem>
                <MenuItem value={20}>Newest Arrivals</MenuItem>
                <MenuItem value={50}>Price: Low to High</MenuItem>
                <MenuItem value={60}>Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </SortBy>

          <DualRange>
            <h3>Price</h3>
            <Slider
              getAriaLabel={() => "Price range"}
              value={dualRangeValue}
              onChange={handleChangeDual}
              valueLabelDisplay="auto"
              // getAriaValueText={valuetext}
              style={{ color: "#000" }}
            />
            <div className="input">
              <input
                className="number-input"
                type="number"
                min="0"
                max="100"
                value={dualRangeValue[0]}
                onChange={dualHandle0}
              />
              <div style={{ color: "lightgrey" }}> - </div>
              <input
                className="number-input"
                type="number"
                min="0"
                max="100"
                value={dualRangeValue[1]}
                onChange={dualHandle1}
              />
            </div>
          </DualRange>
        </nav>

        <main>
          <h2>{category}</h2>
          <AllProducts>
            {filteredProducts &&
              filteredProducts.map((product) => <Product product={product} />)}
          </AllProducts>
        </main>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 90vh;
  width: 100vw;
  display: flex;
  justify-content: start;
  align-items: start;

  nav {
    height: 90vh;
    width: 19%;
    border-right: 1px solid lightgrey;
    padding: 0.8rem;
  }
  main {
    height: 90vh;
    width: 81%;
    padding: 0 2rem;
    overflow: scroll;
    h2 {
      margin: 1rem 0;
    }
  }
`;

const SubCategory = styled.div`
  width: 100%;
  height: auto;
  ${"" /* border: 1px solid grey; */}

  .all {
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0 0 0.2rem 0;
    background: #000;
    color: #fff;
    padding: 0.2rem 0.3rem;
    cursor: pointer;
  }
  .checkbox .sub-category {
    font-size: 1rem;
    color: grey;
  }
`;

const SortBy = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  .select {
    width: 100%;
  }
`;

const DualRange = styled.div`
  width: 100%;
  margin: 1rem 0;
  ${"" /* border: 1px solid red; */}
  .input {
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .number-input {
      height: 2rem;
      padding: 0 0.5rem;
      background: #f1f1f1;
      border: none;
    }
  }
`;

const AllProducts = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export default CategoryPage;
