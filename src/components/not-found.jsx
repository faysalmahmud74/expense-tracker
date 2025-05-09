import React from 'react';
import Layout from './Layout';
import Loader from './loader';

const NotFound = () => {
    return (
        <Layout>
            <div className="flex justify-center bg-gray-100 mt-5">
                <img
                    src='/access_denied.png'
                    alt="access-denied"
                    className="w-full"
                    style={{
                        width: '100%',
                        height: 600,
                        objectFit: 'contain'
                    }}
                    loading={<Loader />}
                />
            </div>
            {/* <h1 className="text-2xl font-bold text-red-600 text-center mt-5">Access Denied</h1> */}
            <p className="text-sm lg:text-xl xl:text-xl 2xl:text-xl mt-1 text-center text-gray-600 font-semibold">The page you are looking for does not exist!</p>
        </Layout>
    );
};

export default NotFound;
