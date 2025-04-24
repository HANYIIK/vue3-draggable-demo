import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from './App.vue'
import { create, NTag, NCard } from "naive-ui";

const naive = create({
    components: [NTag, NCard],
});

const pinia = createPinia();
const app = createApp(App)
app.use(pinia)
app.use(naive);
app.use(ElementPlus);
app.mount('#app')
