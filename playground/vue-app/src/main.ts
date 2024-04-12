import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// @ts-expect-error
console.log(__GIT_COMMIT_ID__, '__GIT_COMMIT_ID__')

createApp(App).mount('#app')
