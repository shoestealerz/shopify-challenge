import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";
import { useAuth0 } from "../auth/react-auth0-wrapper";
import { Navbar } from "react-bootstrap";
import { Button} from "react-bootstrap";
import Upload from "./Upload";

function Header() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <Navbar className="Nav">
        <Link to="/">
          Photo repository
        </Link>

          <div className="whitespace"> </div>
          <div className="whitespace"> </div>
          <div className="whitespace"> </div>

        {!isAuthenticated && (
          <>
            <Button onClick={() => loginWithRedirect({})}>
              Login
            </Button>
          </>
        )}

        <div className="whitespace"> </div>
        <div className="whitespace"> </div>
        <div className="whitespace"> </div>

        {isAuthenticated && (
          <>
            <Link to={"/user/" + user.sub}>
              Profile
            </Link>
          </>
        )}
        
        <div className="whitespace"> </div>
        <div className="whitespace"> </div>
        <div className="whitespace"> </div>

        {isAuthenticated && (
          <Upload/>
        )}
    </Navbar>
  );
}

export default Header;
