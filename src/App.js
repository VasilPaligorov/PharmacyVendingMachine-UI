import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './elements/SharedElements/login/login';
import Register from './elements/SharedElements/register/register';
import ReportABug from './elements/SharedElements/reportABug/reportABug';
import ShowPrescriptions from './elements/SharedElements/prescriptions/showPrescriptions';
import ShowMedicines from './elements/Admin/medicines/showMedicines';
import CreatePrescription from './elements/SharedElements/prescriptions/createPrescription';
import ShowBugs from './elements/Admin/showBugs/showBugs';
import { Navigate } from 'react-router-dom';
import CreateMedicine from './elements/Admin/medicines/createMedicine';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {localStorage.getItem('email') ?
            <>
              <Route path='/showPrescriptions' element={<ShowPrescriptions />} />
              <Route path='/createPrescription' element={<CreatePrescription />} />
              <Route path='/createOrder' element={<CreatePrescription />} />
              <Route path='/showMedicines' element={<ShowMedicines />} />
              <Route path='/createMedicine' element={<CreateMedicine />} />
              <Route path='/reportABug' element={<ReportABug />} />
              <Route path='/showBugs' element={<ShowBugs />} />
              {sessionStorage.getItem('machineIP') && localStorage.getItem("email")==='admin@gmail.com'? 
                <>
                  <Route path='/showMachineMedicines' element={<ShowMedicines />} />
                  <Route path='/addMedicineToMachine' element={<CreateMedicine />} />
                </> :
                <></>
              }
            </>
            : <></>

          }

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
