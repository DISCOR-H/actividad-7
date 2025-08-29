import { Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './components/Register';
import RegisterUserForm from './components/register/registroUser/registroUser';
import RegistroTiendaForm from './components/register/registroTienda/registroTienda';
import UsuarioView from './components/vistas/vistaUsuario/usuarioView';
import LocalBarberia from './components/LocalesTienda/LocalBarberia/LocalBarberia';
import LocalTatto from './components/LocalesTienda/LocalTatto/LocalTatto';
import LocalManicure from './components/LocalesTienda/LocalManicure/LocalManicure';
import MenuBMT from './components/HomeBMT/homeBMT';


// Importamos las nuevas vistas para la opción B de tatto
import TattoView from './components/vistas/vistaTatto/tattoView';
import TattoDetail from './components/vistas/vistaTatuador/TattoDetail';

// Importamos las nuevas vistas para la opción C de tatto
// Corregir importaciones de Manicure
import ManicureView from "./components/vistas/vistaManicure/ManicureView";
import ManicureDetail from './components/vistas/vistaDetailManicure/ManicureDetail';


// Importamos las nuevas vistas para la opción A de Barberias
import BarberiaView from "./components/vistas/vistaBarberia/barberiaView";
import BarberiaDetail from "./components/vistas/vistaDetailBarbero/baberoDetailView";


import MisCitasView from './components/Citas/verCitasUsuario/verCitasUsuario';
import WelcomePage from './pages/Index';

const AppRoutes = () => {
  return (
    <>
      <Route  path="/usuarioView">
        <UsuarioView />
      </Route>
      <Route exact path="/LocalManicurista">
        <LocalManicure />
      </Route>
      <Route exact path="/LocalTatuador">
        <LocalTatto />
      </Route>
      <Route exact path="/Localbarberia">
        <LocalBarberia />
      </Route>
      <Route exact path="/registroLocal">
        <RegistroTiendaForm />
      </Route>
      <Route exact path="/registroUser">
        <RegisterUserForm />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/index">
        <WelcomePage />
      </Route>

      <Route exact path="/Login">
        <Login />
      </Route>
      <Route exact path="/Register">
        <Register />
      </Route>
      <Route exact path="/menuBmt">
        < MenuBMT/>
      </Route>

      <Route exact path="/mis-citas">
        < MisCitasView/>
      </Route>

      
      {/* Rutas nuevas para Tatto */}
      <Route exact path="/tatto" component={TattoView} />
      <Route exact path="/tatto/:id" component={TattoDetail} />


      {/* Rutas corregidas para Manicures */}
      <Route exact path="/manicure" component={ManicureView} />
      <Route exact path="/manicure/:id" component={ManicureDetail} />


      {/* Rutas corregidas para barberias */}
      <Route exact path="/barberias" component={BarberiaView} />
      <Route exact path="/barberias/:id" component={BarberiaDetail} />
      
      {/* Rutas para operarios */}

      <Route exact path="/">
        <Redirect to="/Login" />
      </Route>
    </>
  );
};

export default AppRoutes;
