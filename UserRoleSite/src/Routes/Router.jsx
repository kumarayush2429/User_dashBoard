import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DefaultLayout from '../DefaultLayout/DefaultLayout'
import DashBoard from '../pages/Dashboard'
import DashBoardForm from '../pages/DashBoardForm'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'
import UserCreatedData from '../pages/UserCreatedData'
import { dashboard, form, register, userdata } from './Routes'




const route = createBrowserRouter([{
  path: "/",
  element: <DefaultLayout />,
  children: [
    {
      path: "/",
      element: <Login />
    },
    {
      path: dashboard,
      element: <DashBoard />
    }, {
      path: form,
      element: <DashBoardForm />
    }, {
      path: register,
      element: <Register />
    }, {
      path: userdata,
      element: <UserCreatedData />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]
}])

const Router = () => {
  return (
    <RouterProvider router={route} />
  )
}

export default Router
