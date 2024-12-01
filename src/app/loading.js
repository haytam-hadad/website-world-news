"use client";
import { SyncLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div style={styles.container}>
      <SyncLoader color="#111" size={20} />
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    backgroundColor: '#fff',
  },
};

export default Loading;
