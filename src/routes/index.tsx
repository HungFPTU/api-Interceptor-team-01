import Home from "../pages/Home";
import Login from "../pages/Login";
import {DefaultLayout} from '../layout'
import { RoleEnum, RouteConfig } from "../model/RouteConfig";
import UpdateUser from "../pages/UpdateUser";
import Register from "../pages/Register";

const publicRoute : RouteConfig[] = [
    { path: '/', component: Home, layout: DefaultLayout, role : RoleEnum.Guest },
    { path: '/login', component: Login, layout : null, role : RoleEnum.Guest },
    { path: '/updateuser', component: UpdateUser, layout : null, role : RoleEnum.User },
    { path: "register", component: Register, layout: null, role: RoleEnum.Guest },
    
];

const privateRoute :  RouteConfig[] = [
];

export { publicRoute, privateRoute };