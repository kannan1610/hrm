import React, { useState } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateCompany from './Pages/company/CreateCompany';
import CreateBranch from './Pages/company/CreateBranch';
import UpdateCompany from './Pages/company/UpdateCompany';
import DemoCompany from './Pages/company/DemoCompany';
import CreateUser from './Pages/user/CreateUser';
import CreateCompliance from './Pages/compliance/CreateCompliance';
import CreateCategory from './Pages/category/CreateCategory';
import UpdateCategory from './Pages/category/UpdateCategory';
import CreateSubCategory from './Pages/subCategory/CreateSubCategory';
import Login from './login/Login';
import ProtectedRoute from './Components/ProtectedRoutes';
import ComplianceList from './Pages/compliance/ComplianceList';
import Outlets from './Navbar/Outlets';
import Index from './Pages/Dashboard/Admin';
import CompanywiseReport from './Pages/Reports/CompanyWiseReport';
import CategoryList from './Pages/category/CategoryList';
import NatureofCompliance from './Pages/category/CreateNatureOfCompliance';
import NatureComplianceList from './Pages/category/NatureComplianceList';
import CreatesubCatList from './Pages/subCategory/CreateSubCatList';
import SubCategoryList from './Pages/subCategory/SubCategoryList';
import Viewsub from './Pages/subCategory/ViewSubCategory';
import UserList from './Pages/user/UserList';
import Container from './Navbar/Container';
import ComplianceReport from './Pages/Reports/ComplianceReport';
import CalendarModule from './Pages/CompanyMaster/CalendarModule';
import Staff from './Pages/Dashboard/StaffDashBoard';
import ClientDash from './Pages/Dashboard/ClientDash';
import ClientManagement from './Pages/company/ClientManagement';
import ClientBranchManagement from './Pages/company/ClientBranchManagement';
import CalendarComponent from './Pages/CompanyMaster/CalendarModule';
import MyCalendar from './Pages/company/MyCalendar';
import CompanyComplianceList from './Pages/company/CompanyComplianceList';
import Consolidate from './Pages/compliancefilling/Consolidate';
import CompanyCompliance from './Pages/company/CompanyCompliance';
import Message from './Pages/notification/Message';
import UpdateNatureOfCompliance from './Pages/category/UpdateNatureofCompliance';
import UpdateBranch from './Pages/company/UpdateBranch';


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      {/* <div className="flex">
        <div
          className={`shadow-lg ${isSidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-0'}
           transition-transform-w duration-300 ease-in-out fixed lg:static`}
        >
          <SideNavbar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        </div>
        <div className="flex-1">
          <MainNavbar toggleSidebar={toggleSidebar} />
          <div className="p-4"> */}
            <Routes>
              <Route path="/" element={<Login/>} />
              <Route element={<Container />}>
                <Route path="/home" element={<Index/>}/>
                <Route path="/company" element={<CreateCompany />} />
                <Route path="/updatecompany/:id" element={<UpdateCompany />} />
                <Route path="/branch/:id" element={<CreateBranch />} />
                <Route path="/updatebranch/:id" element={<UpdateBranch />} />
                <Route path="/user" element={<CreateUser />} />
                <Route path="/userlist" element={<UserList/>} />
                <Route path="/compliance" element={<CreateCompliance />} />
                <Route path="/compliancelist" element={<ComplianceList/>}/>
                <Route path="/category" element={<CreateCategory />} />
                <Route path="/categorylist" element={<CategoryList/>} />
                <Route path='/updatecategory/:id' element={<UpdateCategory />} /> 
                <Route path="/createnaturecompliance" element={<NatureofCompliance/>} />
                <Route path="/updatenatureofcompliance/:id" element={<UpdateNatureOfCompliance/>} />
                <Route path="/naturecompliancelist" element={<NatureComplianceList/>} />
                <Route path="/createsubcategory" element={<CreateSubCategory />} />
                <Route path="/createsubcatlist" element={<CreatesubCatList />} />
                <Route path="/subcatlist" element={<SubCategoryList />} />
                <Route path="/viewsubcatlist/:id" element={<Viewsub />} />
                <Route path="/companyreport" element={<CompanywiseReport />} />
                <Route path="/compliancereport" element={<ComplianceReport />} />
                <Route path="/calendar" element={<MyCalendar/>} />
                <Route path="/dash" element={<Staff />} />
                <Route path="/admindash" element={<Index/>} />
                <Route path="/clientdash" element={<ClientDash/>} />
                <Route path="/clientmanagement" element={<ClientManagement/>} />
                <Route path="/clientbranchmanagement/:id" element={<ClientBranchManagement/>} />
                <Route path="/companycompliancelist" element={<CompanyComplianceList/>} />
                <Route path="/compliancefilling" element={<Consolidate/>} />
                <Route path="/companycompliance" element={<CompanyCompliance/>} />
                <Route path="/notification" element={<Message/>} />
                

                {/* <Route path="/reportCompany" element={<CompanywiseReport/>}/> */}
              </Route>
            </Routes>
          {/* </div>
        </div>
      </div> */}
    </BrowserRouter>
  );
};

export default App;
