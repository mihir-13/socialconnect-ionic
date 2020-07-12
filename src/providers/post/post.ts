import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const BASEURL = 'http://localhost:3000/api/socialconnect';

@Injectable()
export class PostProvider {

  constructor(public http: HttpClient) {}

  AddPost(body): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-post`, body);
  }

  GetAllPost(): Observable<any> {
    return this.http.get(`${BASEURL}/posts`);
  }

  AddLikePost(body): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-likepost`, body);
  }

  AddComment(postId, comment): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-comment`, {
      postId,
      comment
    });
  }

  GetPost(id): Observable<any> {
    return this.http.get(`${BASEURL}/post/${id}`);
  }

}
