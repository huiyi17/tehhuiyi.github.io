import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SubmitPopUp from '../../src/components/submitPopUp/SubmitPopUp';

describe('SubmitPopUp', () => {

  // TEST 1
  it('renders successfully when triggered', () => {
    render(
      <SubmitPopUp trigger={true} setTrigger={jest.fn()}>
        <p>Popup Content</p>
      </SubmitPopUp>
    );

    const popup = screen.getByText('Submit Successfully');
    const closeButton = screen.getByRole('button', { name: 'Close' });

    expect(popup).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  // TEST 2
  it('calls setTrigger when Close button is clicked', () => {
    const setTriggerMock = jest.fn();
    render(
      <SubmitPopUp trigger={true} setTrigger={setTriggerMock}>
        <p>Popup Content</p>
      </SubmitPopUp>
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(setTriggerMock).toHaveBeenCalledWith(false);
  });

    // TEST 3
  it('does not render when not triggered', () => {
    render(
      <SubmitPopUp trigger={false} setTrigger={jest.fn()}>
        <p>Popup Content</p>
      </SubmitPopUp>
    );

    const popup = screen.queryByText('Submit Successfully');
    const closeButton = screen.queryByRole('button', { name: 'Close' });

    expect(popup).not.toBeInTheDocument();
    expect(closeButton).not.toBeInTheDocument();
  });
});
