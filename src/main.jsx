import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './routes/Login.jsx';
import Principal from './routes/Principal.jsx';
import Configurables from './routes/Configurables.jsx';
import Usuario from './routes/Usuario.jsx';
import AgregarTransporte from './routes/AgregarTransporte.jsx';
import ActualizarTransporte from './routes/ActualizarTransporte.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Layout from './layout.jsx';


import AgregarCooperativa from './routes/AgregarCooperativa.jsx';
import ActualizarCooperativa from './routes/ActualizarCooperativa.jsx';
import UnionCooperativa from './routes/UnionCooperativa.jsx';
import Reportes from './routes/Reportes.jsx';
import Gerente from './routes/Gerente.jsx';

import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout> <Principal /></Layout>,
    errorElement: <ErrorPage />,
  }, {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,

  }, {
    path: "/configurables",
    element: <Layout> <Configurables /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/usuario",
    element: <Layout> <Usuario /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/postTransporte",
    element: <Layout> <AgregarTransporte /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/putTransporte",
    element: <Layout> <ActualizarTransporte /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/postCooperativa",
    element: <Layout> <AgregarCooperativa /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/putCooperativa",
    element: <Layout> <ActualizarCooperativa /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/unioncooperativa",
    element: <Layout> <UnionCooperativa /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/reportes",
    element: <Layout> <Reportes /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/dashboard",
    element: <Layout> <Gerente /></Layout>,
    errorElement: <ErrorPage />,

  }
  //
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />

  </React.StrictMode>,
)
