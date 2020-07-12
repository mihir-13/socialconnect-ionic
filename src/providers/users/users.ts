import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const BASEURL = 'http://localhost:3000/api/socialconnect';

@Injectable()
export class UsersProvider {

  constructor(public http: HttpClient) {}

  GetAllUser(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  }

  GetUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}`);
  }

  GetUserByUsername(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  FollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {
      userFollowed
    });
  }

  UnFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, {
      userFollowed
    });
  }

  MarkNotification(id, deleteValue?): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, {
      id,
      deleteValue
    });
  }

  MarkAllAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/mark-all`, {
      all: true
    });
  }

  AddImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      image
    });
  }

  SetDefaultImage(imageId, imageVersion): Observable<any> {
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVersion}`);
    // return this.http.get(`${BASEURL}/set-default-image?id=${imageId}?version=${imageVersion}`);
  }

  ProfileNotifications(id): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, {
      id
    });
  }

  ChangePAssword(body): Observable<any> {
    return this.http.post(`${BASEURL}/change-password`, body);
  }

}
