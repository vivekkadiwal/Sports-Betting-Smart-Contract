import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './shell.css';
import Header from './components/Header';
import Footer from './components/Footer';

const Shell = (props) => {
    const { children } = props;

    return (
        <div className='shell'>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

Shell.propTypes = {
    children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => {
    return state;
};

export default connect(
    mapStateToProps,
)(Shell);