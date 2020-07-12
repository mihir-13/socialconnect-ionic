import { NgModule } from '@angular/core';
import { PostsComponent } from './posts/posts';
import { UserFriendsComponent } from './user-friends/user-friends';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [PostsComponent,
    UserFriendsComponent],
	imports: [IonicModule],
	exports: [PostsComponent,
    UserFriendsComponent]
})
export class ComponentsModule {}
