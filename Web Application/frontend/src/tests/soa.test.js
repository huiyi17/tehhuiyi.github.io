import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SoaPage from '../../src/pages/soaPage/SoaPage';

describe('Statement of Account Page', ()  => {

    // TEST1: render table
    test('renders table with correct rows and columns', async () => {
      render(
          <MemoryRouter>
            <SoaPage />
          </MemoryRouter>
      );

      const timeout = 5000;
    
      await waitFor(
          () => {
              const table = screen.getByRole('table');
              expect(table).toBeInTheDocument();
          },
          {
              timeout,
          }
      );

       // Check if the table headers are rendered
      const soaIdHeader = screen.getByText('SOA ID');
      const supplierHeader = screen.getByText('SUPPLIER');
      const dueDateHeader = screen.getByText('DUE DATE');
      const amountHeader = screen.getByText('AMOUNT');

      expect(soaIdHeader).toBeInTheDocument();
      expect(supplierHeader).toBeInTheDocument();
      expect(dueDateHeader).toBeInTheDocument();
      expect(amountHeader).toBeInTheDocument();
    });


    // TEST2: render search bar
    test('renders search bar', async () => {
      render(
          <MemoryRouter>
        <SoaPage />
          </MemoryRouter>
      );

      const timeout = 4000;
    
      await waitFor(
          () => {
              const globalFilter = screen.getByTestId('global-filter');
              expect(globalFilter).toBeInTheDocument();
          },
          {
              timeout,
          }
      );
    });

    // TEST3: filter button --> filter popup appear
    test('Filter query bar appear when filter button is clicked', async () => {
      render(
          <MemoryRouter>
              <SoaPage />
          </MemoryRouter>
      );

      const timeout = 2000;
    
      await waitFor(
          () => {
              const filterButton = screen.getByTestId('filter-button');
              expect(filterButton).toBeInTheDocument();
          },
          {
              timeout,
          }
      );
  
      // Click the filter button
      const filterButton = screen.getByTestId('filter-button');
      fireEvent.click(filterButton);
    
      // Now the popup should be visible
      await waitFor(
          () => {
            const soaQueryBarVisible = screen.getByTestId('soa-querybar');
            expect(soaQueryBarVisible).toBeInTheDocument();
          },
          {
            timeout,
          }
        );
    });

    // TEST4: table sorting
    test('sorting by clicking table header (invoice ID)', async () => {
      render(
          <MemoryRouter>
              <SoaPage />
          </MemoryRouter>
      );

      const timeout = 2000
    
      await waitFor(
          () => {
            // Get the table headers
            const headerCells = screen.getAllByRole('columnheader');
          },
          {
              timeout,
          }
      );
      // Get the table headers
      const headerCells = screen.getAllByRole('columnheader');
    
      // Click on the first header to sort by "INVOICE ID"
      fireEvent.click(headerCells[0]);
    
      // Verify that the table is sorted by "INVOICE ID" in ascending order
      const sortedInvoiceIds = screen.getAllByTestId('soa-id-link');
      expect(sortedInvoiceIds[0]).toHaveTextContent('0001');
    
      // Click on the first header again to sort in descending order
      fireEvent.click(headerCells[0]);
    
      // Verify that the table is sorted by "INVOICE ID" in descending order
      const sortedInvoiceIdsDescending = screen.getAllByTestId('soa-id-link');
      expect(sortedInvoiceIdsDescending[0]).toHaveTextContent('4125');
    });

    // TEST 5: export dropdown menu
    test('export dropdown menu is displayed when the export button is clicked', async () => {
      render(
        <MemoryRouter>
          <SoaPage />
        </MemoryRouter>
      );

      const timeout = 2000

      await waitFor(
          () => {
            const exportButton = screen.getByTestId('export-button');
            expect(exportButton).toBeInTheDocument();
          },
          {
              timeout,
          }
      );

      // Click the export button
      const exportButton = screen.getByTestId('export-button');
      fireEvent.click(exportButton);

      await waitFor(
        () => {
          // Check if the dropdown menu is displayed
          const exportExcelOption = screen.getByText('Export Excel');
          expect(exportExcelOption).toBeInTheDocument();
        },
        {
            timeout,
        }
    );

      const exportCSVOption = screen.getByText('Export CSV');
      const generateTaxReportOption = screen.getByText('Generate Tax Report');
    
      expect(exportCSVOption).toBeInTheDocument();
      expect(generateTaxReportOption).toBeInTheDocument();
    });

});