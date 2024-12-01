"use client";
import { MoonLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div style={styles.container}>
      <MoonLoader color="#000" size={50} />
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    backgroundColor: '#fff',
  },
};

export default Loading;
