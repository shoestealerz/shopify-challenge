import React from "react";
import "../styles/App.css";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Container } from "react-bootstrap";

// apollographql query
export const POST_INFO = gql`
  query($id: Int!) {
    Post(where: { id: { _eq: $id } }) {
      id
      url
      User {
        id
        name
      }
    }
  }
`;

function Post(props) {
  let postId = props.id ? props.id : props.match.params.id;

  // getting values from query
  const { loading, error, data } = useQuery(POST_INFO, {
    variables: { id: postId }
  });

  if (loading) return "";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Container>
        {data.Post.map((post, index) => (
          <article key={index}>
            <header>
              <div>
                <div>
                  <Link to={"/user/" + post.User.id}>
                    <strong>{post.User.name}</strong>
                  </Link>
                </div>
              </div>
            </header>
            <div className="Post-image">
              <div className="Post-image-bg">
                <img alt={post.caption} src={post.url} />
              </div>
            </div>
          </article>
        ))}
      </Container>
    </>
  );
}

export default Post;
