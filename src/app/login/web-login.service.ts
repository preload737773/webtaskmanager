import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class WebLoginService {
    constructor() {
    }

    public setLoginInformation() : void {
        document.getElementById("username")!.innerHTML = this.getCookie("username");
    }

    public checkLogin() : boolean {
        return this.getCookie("token") == "";
    }

    public deleteCookie() : void {
        this.setCookie("token", "", 0);
        this.setCookie("username", "", 0);
        document.getElementById("username")!.innerHTML = "Sign In";
    }

    public getCookie(cname: string) : string {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    public setCookie(cname: string, cvalue: string, exdays: number) : void {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    public login() {
        let name = document.getElementById("emailForm") as HTMLInputElement;
        let password = document.getElementById("passwordForm") as HTMLInputElement;
        fetch(`http://localhost:8080/server/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            mode: "cors",
            credentials: "include",
            // format the data
            body: JSON.stringify({
                name: name.value,
                password: password.value
            })
        }).then((response) => {
            response.text().then((text) => {
                if (!text.includes("Login error")) {
                    this.setCookie("token", text, 1);
                    let username = document.getElementById("username");
                    if (username) {
                        username.innerHTML = name.value;
                        this.setCookie("username", name.value, 1);
                    }
                }
                else {
                    this.deleteCookie();
                }
            });
        });
    }
}