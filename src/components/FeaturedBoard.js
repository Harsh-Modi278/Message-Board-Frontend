import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Link } from "react-router-dom";
import routes from "../constants/route.json";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";

import { getTimeDiff } from "../utils/functions";

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
    <Link
      to={`${routes.BOARD}/${post.board_id}`}
      style={{ textDecoration: "none" }}
    >
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent>
            <Typography component="div" variant="h4" color="primary">
              {post.board_name}
            </Typography>
            <Typography
              variant="bottom text"
              component="span"
              color="secondary"
            >
              {`${post.upvotes} upvote${post.upvotes > 1 ? "s" : ""} | ${
                post.comments_count
              } comment${
                post.comments_count > 1 ? "s" : ""
              } | submitted ${getTimeDiff(post.time_created)}`}
            </Typography>
            <br />
            <Typography variant="subtitle1" paragraph component="p">
              <ReactMarkdownWrapper
                body={
                  post.preview &&
                  post.preview.slice(0, 400) +
                    (post.preview.length > 400 ? `...` : "")
                }
              />
            </Typography>
            <Typography variant="subtitle1" color="primary" component="em">
              Continue reading...
            </Typography>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

FeaturedBoard.propTypes = {
  post: PropTypes.object,
};

export default FeaturedBoard;
