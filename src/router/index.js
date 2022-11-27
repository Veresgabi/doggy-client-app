// import Vue from "vue";
import { createRouter, createWebHistory } from 'vue-router'
import routes from "./routes.js";

// Vue.use(router);

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;