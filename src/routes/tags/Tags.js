import React from 'react';
import { connect } from 'dva';
import styles from './Tags.css';

function Tags() {
  return (
    <div className={styles.normal}>
      Route Component: Groups
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Tags);
