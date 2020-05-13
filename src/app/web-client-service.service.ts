import {Injectable} from '@angular/core';
import {Task} from "./task";
import {IEdge} from "yfiles";

const TASKS_HTML_ADDRESS = `http://localhost:8080/server/tasks`;
const TASKS_RELATIONS_HTML_ADDRESS = `http://localhost:8080/server/tasks/changeRelation`;

@Injectable({
  providedIn: 'root'
})
export class WebClientServiceService {

  constructor() {}

  //add reject on fetch after response
  addTask(tag: Task) : Promise<Response> {
    return fetch(TASKS_HTML_ADDRESS, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      mode: "cors",
      credentials: "include",
      // format the data
      body: JSON.stringify({
        id: "0",
        name: tag.name,
        description: tag.description,
        notificationDate: tag.notificationDate,
        importance: tag.importance,
        style: tag.style
      })
    });
  }

  editTask(
      nodeInfo: HTMLElement, name: HTMLInputElement, description: HTMLInputElement, date: HTMLInputElement, importance: HTMLInputElement
  ) : Promise<Response> | null {
    if (name != null && description != null && date != null && importance != null) {
      return fetch(TASKS_HTML_ADDRESS, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        mode: "cors",
        credentials: "include",
        // format the data
        body: JSON.stringify({
          id: nodeInfo.id,
          name: name.value,
          description: description.value,
          notificationDate: date.value,
          importance: importance.value,
          style: nodeInfo.style
        })
      });
    }
    else return null;
  }

  deleteTask(item: Task) : Promise<Response> | null {
    if (item != null) {
      return fetch(TASKS_HTML_ADDRESS, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          id: item.id,
          name: item.name,
          description: item.description,
          notificationDate: item.notificationDate,
          importance: item.importance,
          style: item.style
        })
      });
    }
    else return null;
  }

  addEdge(source: Task, target: Task) : Promise<Response> {
    return fetch(TASKS_RELATIONS_HTML_ADDRESS, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        id: source.id,
        anotherId: target.id
      })
    });
  }

  deleteEdge(edge: IEdge) : Promise<Response> | null {
    if (edge.sourceNode != null && edge.targetNode != null) {
      return fetch(TASKS_RELATIONS_HTML_ADDRESS, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        mode: "cors",
        credentials: "include",
        // format the data
        body: JSON.stringify({
          id: edge.sourceNode.tag["id"],
          anotherId: edge.targetNode.tag["id"]
        })
      });
    }
    else return null;
  }

  getDataJson() : Promise<Response> {
    return fetch(TASKS_HTML_ADDRESS, {mode: "cors", credentials: "include"});
  }
}
