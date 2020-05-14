import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebRegistrationService {

  constructor() { }

  public register(username: string, password: string) : Promise<Response> {
    return fetch(`http://localhost:8080/server/users`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      mode: "cors",
      credentials: "include",
      // format the data
      body: JSON.stringify({
        name: username,
        password: password
      })
    }).then();
  }

  public delete(username: string) : Promise<Response> {
    return fetch(`http://localhost:8080/server/users`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      mode: "cors",
      credentials: "include",
      // format the data
      body: JSON.stringify({
        name: username,
        password: ""
      })
    }).then();
  }
}
