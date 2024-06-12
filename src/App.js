import React from 'react'; // Import React here

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './Store/store';
import './index.css';
import reportWebVitals from './reportWebVitals';

import './App.css';
import ProductItems from "./views/shoppingItems/ProductItems";
import AddProducts from "./views/shoppingItems/AddProducts";

function App() {
  return (
    <div className="body-content">
      {/* <ProductItems /> */}
      <AddProducts />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
 document.getElementById('root')
);


// import './App.css';
// import ProductItems from "./views/shoppingItems/ProductItems";
// import AddProducts from "./views/shoppingItems/AddProducts";

// function App() {
//   return (
//     <div className="body-content">
//       {/* <ProductItems /> */}
//       <AddProducts />
//     </div>
// );
// }

export default App;
