import { React, useContext } from "react";
import { Container } from "@material-ui/core";
import FeaturedBoards from "../components/FeaturedBoards";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import { FilterContexts } from "../contexts/FilterContexts";

const Home = (props) => {
  const { filters, setFilters } = useContext(FilterContexts);

  const handleChange = (e) => {
    setFilters({ ...filters, sortBoards: e.target.value });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1",
        padding: "2rem",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ minWidth: 50, paddingBottom: "1rem" }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filters.sortBoards}
              label="Sort By"
              onChange={handleChange}
            >
              <MenuItem value={"best"}>best</MenuItem>
              <MenuItem value={"new"}>new</MenuItem>
              <MenuItem value={"old"}>old</MenuItem>
              <MenuItem value={"comments count"}>comments count</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <FeaturedBoards sort={filters.sortBoards} />
      </Container>
    </div>
  );
};

export default Home;
