import React from 'react';
import { render} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReviewTable from './ReviewTable';

describe('ReviewTable component', () => {
    test('renders without crashing', () => {
        render(
          <Router> {/* Wrap your component with Router */}
            <ReviewTable />
          </Router>
        );
      });

});