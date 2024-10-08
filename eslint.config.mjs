import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

export default [
    {
        files: ['**/*.{js,mjs,cjs,vue}'],
        languageOptions: {
            globals: {
                ...globals.node, // Cung cấp các biến toàn cục cho môi trường Node.js
                ...globals.commonjs, // Cung cấp các biến toàn cục cho CommonJS
            },
        },
        plugins: {
            vue: pluginVue,
        },
        rules: {
            // Thêm hoặc điều chỉnh quy tắc ESLint của bạn ở đây
        },
    },
    pluginJs.configs.recommended, // Tích hợp cấu hình recommended của eslint-plugin-js
    ...pluginVue.configs['flat/essential'], // Tích hợp cấu hình essential của eslint-plugin-vue
];