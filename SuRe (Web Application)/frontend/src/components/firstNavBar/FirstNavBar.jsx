import React from 'react';

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  signin_register_navbar,
  linkstyles,

} from './FirstNavBarStyle'

export const FirstNavBar = () => {

  const location = useLocation();

  const [linkState, setLinkState] = useState([
    { label: 'Sign In', active: false, hovered: false, route: "signinpage"},
    { label: 'Register', active: false, hovered: false, route: "registerpage" },
  ]);

  // Function to handle onMouseOver
  function handleMouseOver(index) {
    setLinkState((prevLinkState) =>
      prevLinkState.map((link, i) =>
        i === index ? { ...link, hovered: true } : { ...link, hovered: false }
      )
    );
  }

  // Function to handle onMouseLeave
  function handleMouseLeave(index) {
    setLinkState((prevLinkState) =>
      prevLinkState.map((link, i) =>
        i === index ? { ...link, hovered: false } : link
      )
    );
  }

  return (
    <div>
        <div style={signin_register_navbar}>
        {linkState.map((link, index) => (
          <p key={index}>
            <Link to={`/${link.route.toLowerCase()}`}
              onMouseOver={() => handleMouseOver(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{
                ...linkstyles,
                
                backgroundColor: location.pathname.includes(link.route.toLowerCase())
                  ? 'rgba(255, 255, 255, 0.50)' // Background color when on the page
                  : link.hovered
                  ? 'rgba(255, 255, 255, 0.50)' // Background color on hover
                  : 'transparent', // Default background color
              }}
            >
              {link.label}
            </Link>
          </p>
        ))}
        </div>
    </div>
  )
}
