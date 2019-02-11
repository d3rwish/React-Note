import React from 'react';

import './Spinner.css';

const spinner = () => (
    <div className="spin-wrapper">
        <div className="spin-Loading">Loading Data...</div>
        <div className="spin-folding-cube">
            <div className="spin-cube1 spin-cube"></div>
            <div className="spin-cube2 spin-cube"></div>
            <div className="spin-cube4 spin-cube"></div>
            <div className="spin-cube3 spin-cube"></div>
        </div>
    </div>
);

export default spinner;