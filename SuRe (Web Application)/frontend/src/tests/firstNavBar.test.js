import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FirstNavBar } from '../../src/components/firstNavBar/FirstNavBar'; 

describe('FirstNavBar Component', () => {
  // TEST 1
  test('renders the navbar with correct links', () => {
    render(
      <MemoryRouter>
        <FirstNavBar />
      </MemoryRouter>
    );

    // Check if both "Sign In" and "Register" links are present
    const signInLink = screen.getByText(/Sign In/i);
    const registerLink = screen.getByText(/Register/i);
    expect(signInLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });

  // TEST 2
  test('applies background color on hover and when on the page', () => {
    render(
      <MemoryRouter initialEntries={['/signinpage']}>
        <FirstNavBar />
      </MemoryRouter>
    );

    // Check if background color changes on hover
    const signInLink = screen.getByText(/Sign In/i);
    fireEvent.mouseOver(signInLink);
    expect(signInLink).toHaveStyle('background-color: rgba(255, 255, 255, 0.50)');

    // Check if background color applies when on the page
    expect(signInLink).toHaveStyle('background-color: rgba(255, 255, 255, 0.50)');
  });

  // TEST 3
  test('applies background color when the link is active (current page)', () => {
    render(
      <MemoryRouter initialEntries={['/signinpage']}>
        <FirstNavBar />
      </MemoryRouter>
    );

    const signInLink = screen.getByText(/Sign In/i);

    expect(signInLink).toHaveStyle('background-color: rgba(255, 255, 255, 0.50)');
  });
});
