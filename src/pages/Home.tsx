import { Container } from "@material-ui/core";
import React from "react";
import { FeaturedBoards } from "../components/FeaturedBoards";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { SortType } from "../common/sortingStates";
import { setSortBoards } from "../redux/reducers/filtersSlice";
import { RootState } from "../redux/store";

export const Home: React.FC = () => {
  const filters = useSelector((state: RootState) => state.filters.value);
  const dispatch = useDispatch();

  const handleChange = (e: SelectChangeEvent<SortType>) => {
    dispatch(setSortBoards(e.target.value as SortType));
  };

  // TO-DO: create a seperate styles.ts file for this component
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
              <MenuItem value={SortType.BEST}>best</MenuItem>
              <MenuItem value={SortType.NEW}>new</MenuItem>
              <MenuItem value={SortType.OLD}>old</MenuItem>
              <MenuItem value={SortType.COMMENTS_COUNT}>
                comments count
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <FeaturedBoards sort={filters.sortBoards} />
      </Container>
    </div>
  );
};
