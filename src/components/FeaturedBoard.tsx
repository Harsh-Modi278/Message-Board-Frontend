import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";
import routes from "../constants/route.json";
import { getTimeDiff } from "../utils/miscUtilities";

export interface Post {
  boardId: string;
  boardName: string;
  upvotes: number;
  commentsCount: number;
  timeCreated: string;
}
interface FeaturedBoardProps {
  post: Post;
}

// TO-DO: add separate styles.ts file for each component
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

export const FeaturedBoard: React.FC<FeaturedBoardProps> = ({ post }) => {
  const classes = useStyles();

  return (
    <Link
      to={`${routes.BOARD}/${post.boardId}`}
      style={{ textDecoration: "none" }}
    >
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent>
            <Typography component="div" variant="h4" color="primary">
              {post.boardName}
            </Typography>
            <Typography variant="body2" component="span" color="secondary">
              {`${post.upvotes} upvote${post.upvotes > 1 ? "s" : ""} | ${
                post.commentsCount
              } comment${
                post.commentsCount > 1 ? "s" : ""
              } | submitted ${getTimeDiff(post.timeCreated)}`}
            </Typography>
            <br />
            {/* Uncomment and modify the following lines as needed */}
            {/* <Typography variant="subtitle1" paragraph component="p">
              <ReactMarkdownWrapper body={post.preview} />
            </Typography>
            <Typography variant="subtitle1" color="primary" component="em">
              Continue reading...
            </Typography> */}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
