import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { withRouter } from "react-router";
import { Container, Row, Col, Button } from "react-bootstrap";
import { gql } from "apollo-boost";
import { useAuth0 } from "../auth/react-auth0-wrapper";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

export const USER_INFO = gql`
  query($id: String!) {
    User(where: { id: { _eq: $id } }) {
      email
      last_seen
      name
      Posts_aggregate {
        aggregate {
          count
        }
      }
    }
    Post(where: { user_id: { _eq: $id } }) {
      url
      id
    }
  }
`;

const DELETE_POST = gql`
  mutation($id : Int!) {
    delete_Post(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

function Profile(props) {
  const { isAuthenticated, logout, user } = useAuth0();

  const isLoggedUser = () => {
    if (user.sub === props.match.params.id) {
      return true;
    } else {
      return false;
    }
  };

  const { loading, error, data } = useQuery(USER_INFO, {
    variables: { id: props.match.params.id }
  });
  const [deletePost] = useMutation(DELETE_POST);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Container className="container">
        <Container>
          {data.User.map((user, index) => (
            <Row key={index}>
              <Col>
                <Row>
                  <Col className="profile-username" >
                    {user.email}
                  </Col>

                  <Col className="profile-logout" >
                    {isAuthenticated && (
                      <>
                        {isLoggedUser() && (
                          <>
                            <Button onClick={() => logout()}>
                              Log Out
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col className="profile-stats" >
                    Number of photo submissions: 
                    <strong>{user.Posts_aggregate.aggregate.count}</strong>{" "}
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
        </Container>
        <hr />
        <Row>
          {data.Post.map((post, index) => (
            <div>
            <Link to={"/post/" + post.id} key={index}>
              <Col className="profile-grid">
                <div class="profile-post-image">
                  <img
                    className="profile-post-image"
                    src={post.url}
                  />
                </div>
              </Col>
            </Link>
            <Button onClick={() => {
              deletePost({
                variables: {id : post.id}
              });
            }}>
              delete
            </Button>
            </div>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default withRouter(Profile);
