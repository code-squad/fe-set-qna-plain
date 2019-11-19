'use strict';

const REST = (() => {
    const TOKEN_NAME = 'token';

    const getToken = () => {
        const token = localStorage.getItem(TOKEN_NAME) || null;
        if (!token) {
            return null;
        }
        return `Bearer ${token}`;
    }

    const _fetch = (url, method, properties) => {
        const token = getToken();
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: (properties && JSON.stringify(properties)) || null,
        });
    }

    return {
        async post(url, properties) {
            const res = await _fetch(url, 'POST', properties);
            return res;
        },

        getToken() {
            return getToken();
        },

        setToken(token) {
            localStorage.setItem(TOKEN_NAME, token);
        }
    }
})();