import React from 'react';

import '../utils/loading.css';

const Spinner = () => (
  <div>
    <div className="lds-ripple"><div></div><div></div></div>
  </div>
);

const Loading = () => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'center',
                height:'95vh',flexDirection:'column'}}>
    <Spinner />
    <div style={{fontSize:'30px',fontWeight:'800',marginTop:'200px'}}>
      Loading...
    </div>
  </div>
);

export default Loading;