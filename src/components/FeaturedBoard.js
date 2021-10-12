import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Link } from "react-router-dom";
import routes from "../constants/route.json";

const useStyles = makeStyles({
  card: {
    display: "flex",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
});

const FeaturedBoard = (props) => {
  const classes = useStyles();
  const { post } = props;

  return (
    <Grid item xs={12} md={6}>
      <Link
        to={`${routes.BOARD}/${post.board_id}`}
        style={{ textDecoration: "none" }}
      >
        <Card className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component="h2" variant="h5">
                {post.board_name}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {post.preview &&
                  post.preview.slice(0, 100) +
                    (post.preview.length > 100 ? `...` : "")}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Continue reading...
              </Typography>
            </CardContent>
          </div>
        </Card>
      </Link>
    </Grid>
  );
};

FeaturedBoard.propTypes = {
  post: PropTypes.object,
};

export default FeaturedBoard;
