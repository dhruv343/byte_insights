import React from 'react'
import {useLocation} from 'react-router-dom'
import { useState,useEffect } from 'react'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';
function Dashboard() {

  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(()=>{
  const UrlParams=new URLSearchParams(location.search)
  const tabUrl=UrlParams.get('tab');
  setTab(tabUrl);
  },[location.search])

  console.log(tab)
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div><DashSidebar/></div>

      {tab==="profile"?(<DashProfile/>):""
      }
      
      {
        tab==="posts"?(<DashPosts/>):""
      }
      
      {
        tab==="users"?<DashUsers/>:""
      }

      {tab === 'comments' && <DashComments />}
      {tab === 'dash' && <DashboardComp />}
      
    </div>
  )
}

export default Dashboard