import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import ScanSuccessfully from '../../src/components/scanSuccessfully/ScanSuccessfully';

describe('ScanSuccessfully', () => {

   // TEST 1
   it('renders successfully when triggered', async () => {
    render(
      <MemoryRouter>
        <ScanSuccessfully trigger={true} setTrigger={jest.fn()} />
      </MemoryRouter>
    );
  
    const timeout = 1000;
  
    await waitFor(
      () => {
        const scanSuccessfullyContent = screen.getByTestId('scan-successfully-content');
        expect(scanSuccessfullyContent).toBeInTheDocument();
      },
      {
        timeout,
      }
    );
  });

  // TEST 2
  it('closes the pop-up when clicked on the overlay', async () => {
    const setTriggerMock = jest.fn();
    render(
      <MemoryRouter>
        <ScanSuccessfully trigger={true} setTrigger={setTriggerMock} />
      </MemoryRouter>
    );

    const timeout = 2000;
  
    await waitFor(
      () => {
        const scanSuccessfullyOverlay = screen.getByTestId('scan-successfully-overlay');
        fireEvent.click(scanSuccessfullyOverlay);

        expect(setTriggerMock).toHaveBeenCalledWith(false);
    },
    {
      timeout,
    }
  );
});
});
