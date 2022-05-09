import Vue from "vue";
import App from "./App.vue";

// Font Awesome
import "@fortawesome/fontawesome-free/js/all";

// Bootstrap
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Axios
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

// Axios progress bar
import "axios-progress-bar/dist/nprogress.css";
import { loadProgressBar } from "axios-progress-bar";
loadProgressBar();

// Normalize
import "normalize.css";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount("#app");
