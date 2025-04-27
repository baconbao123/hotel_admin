import axios from "axios"
//  @ts-ignore
import Cookies from "js-cookie"
const $axios = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BACK_END_LINK,
    headers: {
        Authorization: "Bearer "+ ( Cookies.get("token") ? Cookies.get("token") : ""),
    }
})
const authorization = (token: any) => {
    return {Authorization: "Bearer " + token}
}
export {
    authorization
}
$axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const errorStatus = [403,500, 400, 401, 404]
        if (error.response && error.response.status === 403) {
            location.href = '/403'
        }
        else if (error.response && error.response.status === 500) {
            location.href = '/500'
        }
        else if (error.response && error.response.status === 404 && window.location.pathname  !== '/404') {
            location.href = '/404'
        }
        else if (error.response && error.response.status === 400) {
            // location.href = '/400'
        }
        if (error.response && error.response.status === 401 && window.location.pathname  !== '/login' )
        {
            if (Cookies.get("refreshToken")) {
                $axios.post('/Auth/refreshToken', {
                    refreshToken: Cookies.get("refreshToken"),
                    publicKey: "mynameisnguyen"
                } )
                    .then((res) => {
                        Cookies.set("token", res.data.token, {expires: 0.1});
                        Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 });
                        window.location.reload();
                    })
                    .catch((err) => {
                        window.location.href = '/login'
                        console.log("Error ", err)
                    })
            }
            else {
                window.location.href = '/login'
            }
        }
        else if ( window.location.pathname  !== '/error' && !errorStatus.includes(error.response.status)) {
            // location.href = '/error'
        }
        return Promise.reject(error);
    }
);
export default $axios