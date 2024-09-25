import Home from "../pages/Home";
import Login from "../pages/Login";
import {DefaultLayout} from '../layout'
import { RoleEnum, RouteConfig } from "../model/RouteConfig";

const publicRoute : RouteConfig[] = [
    { path: '/', component: Home, layout: DefaultLayout, role : RoleEnum.Guest },
    { path: '/login', component: Login, layout : null, role : RoleEnum.Guest },
    
];

const privateRoute :  RouteConfig[] = [
];

export { publicRoute, privateRoute };