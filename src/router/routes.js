import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import EditDog from "../components/EditDog.vue";
import CreateDog from "../components/CreateDog.vue";

const routes = [
    {
        path: "/",
        component: Dashboard,
        props: true
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/breed/:breedId",
        name: "EditDog",
        component: EditDog,
        props: true
    },
    {
        path: "/breed/create",
        name: "CreateDog",
        component: CreateDog,
        props: true
    }
];

export default routes;