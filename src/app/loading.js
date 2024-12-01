'use client'; 

import { Spinner } from '@nextui-org/spinner';

const Loading = () => {
  return (
    <div style={styles.container}>
      <Spinner color="primary" size="lg" />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
};

export default Loading;
