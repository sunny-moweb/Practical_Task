import './App.css'
import Form from './components/Form'
import DisplayData from './components/DisplayData'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
// import EditData from './components/EditData'
// import CopyData from './components/CopyData'

function App() {

  return (
    <>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <DisplayData /> */}
          <Routes>
            <Route path='/' element={<DisplayData/>}></Route>
            <Route path='/add-parameter' element={<Form/>}></Route>
            <Route path='/edit-parameter' element={<Form/>}></Route>
            <Route path='/copy-parameter' element={<Form/>}></Route>
          </Routes>
          {/* <Form /> */}
        </PersistGate>
      </Provider>
      </BrowserRouter>
    </>
  )
}

export default App


//! 3:40 hold


// here above i have used routes for different pages but i face errors and added navigation to button in displaydata component
// like this-------------->
//   <PersistGate loading={null} persistor={persistor}>
//     <DisplayData />
//     <Routes>
//       <Route path='/add-parameter' element={<Form/>}></Route>
//     </Routes>
//   </PersistGate>