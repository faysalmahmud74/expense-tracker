import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav aria-label="breadcrumb" className='text-gray-700 text-sm'>
            <ol style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
                <li>
                    <Link to="/dashboard">Home</Link>
                </li>
                {pathnames.map((value, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    return (
                        <React.Fragment key={index}>
                            <span style={{ margin: '0 8px' }}>{'>'}</span>
                            {isLast ? (
                                <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                            ) : (
                                <Link to={routeTo}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;