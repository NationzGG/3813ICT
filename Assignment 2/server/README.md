# 3813ICT Assignment 2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

# Table of Content
* [Dependencies requirement](#dependencies-requirement)
* [Development server](#development-server)
* [Nodemon](#nodemon)
* [Back-end server](#back-end-server)
* [Code scaffolding](#code-scaffolding)
* [Build](#build)
* [Running unit tests](#running-unit-tests)
* [Running end-to-end tests](#running-end-to-end-tests)
* [Further help](#further-help)
* [Documentation](#documentation)
  * [Git](#git)
  * [Data Structures](#data-structures)
  * [REST API](#rest-api)
  * [Angular Architectire](#angular-architectire)
    * [Component and Routes](#component-and-routes)
    * [Services](#services)
  * [State change](#state-change)
    * [Data binding](#data-binding)
    * [Structural directives](#structural-directives)


## Dependencies requirement
Following dependencies must be installed for project to run as intended:

CSS and Javascript Styling
- bootstrap
- jquery
- popper.js
- @types/jquery

Backend server side
- socket.io-client
- socket.io
- @types/socket.io-client
- express
- cors
- body-parser


Installation: 
npm installl bootstrap jquery popper.js @types/jquery socket.io-client socket.io @types/socket.io-client express cors body-parser --save


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Nodemon

Nodemon is required for this project to run the server and monitor the file changes at backend. For more information visit [Nodemon homepage](https://nodemon.io).
To install
`npm install -g nodemon`

## Back-end server

Run `nodemon server/servser.js` from the project root directory. The back-end server starts at `http://localhost:3000/`. 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Documentation
Following are the documentations for the assignment

## Git

Github is a web-based hosting service that can perform version control use git, and it is used for this project to store the project file.

One Branch was created for this project. 

### Master
Master is the default branch containing the projects files.

## Data Structures
Three classes are used for user, group and channel.

class User {
    constructor(userName: string, userEmail: string, valid: boolean, superAdmin: boolean, groupAdmin: boolean, groupList: string[], adminGroupList: string[]){
        this.userName = userName;
        this.userEmail = userEmail;
        this.valid = valid;
        this.superAdmin = superAdmin;
        this.groupAdmin = groupAdmin;
        this.groupList = groupList;
        this.adminGroupList = adminGroupList;
    }
}

* `userName` - the name of the user.
* `userEmail` - the user email.
* `valid` - list of channels that the group has.
* `superAdmin` - a bool value to determine if the user has superAdmin permissions
* `groupAdmin` - a bool value to determine if the user has groupAdmin permissions
* `groupList` - list of groups specific to user.
* `adminGroupList` - all groups.

class Group {
    constructor(groupName: string, groupUsers: string[], groupChannel: string[], groupAssist: string[]){
        this.groupName = groupName;
        this.groupUsers = groupUsers;
        this.groupChannel = groupChannel;
        this.groupAssist = groupAssist;
    }
}

* `groupName` - the name of the group that is a string.
* `groupUsers` - list of users that are in the group.
* `groupChannel` - list of channels that the group has.
* `groupAssist` - a list of users who have the group assist role.

class Channel {
    constructor(channelName: string, channelUser: string[], groupBelong: string){
        this.channelName = channelName;
        this.channelUser = channelUser;
        this.groupBelong = groupBelong;
    }
}

* `channelName` - the name of the channel that is a string.
* `channelUser` - list of users that are in the channel.
* `groupBelong` - name of the group this channel belongs.

## REST API
Following is a graph represents how angular front-end communicate with Node.js server for this project.

![Alt RESTAPI](/doc-img/RESTAPI.png?raw=true)

The back-end server uses express to post or get the data from mongodb. It will initiate the request either use post or get method when the user request data via httpClicent from front-end.
* Get method is used for to retrieve full data. Only used in get group list and get user list.
* Post method is used when modify data is needed such as write, delete. It is also used for to retrieve specific piece of information from the data file.

#### Server side routes
There are several routes located in the routes file within the server. 

#### Main

server.js
main file that requires all the module, initiate server connection, require all the routes and pass varibales to the routes parameters.
Variable to pass to the routes
* app - express module
* fs - file system module
* path for the json data file
  * USER_DATA_FILE
  * GROUP_DATA_FILE
  * CHANNEL_DATA_FILE

#### User

Login - login.js
Check if the user name is in the data file
* Parameters
  * USER_DATA_FILE
  * path - `'/login'` - get data from `localhost:3000/login`
  * req.body - req.body object must contains following key to work with the request data:
    * userName: string
* returen value - send response
  * user in the data file - sned the user detail
  * user not in the data file - send object where state the user does not exist

Add User - addUser.js
Add new user to the data file.
* Parameters
  * USER_DATA_FILE
  * path - `'/addUser'` - get data from `localhost:3000/addUser`
  * req.body - req.body object must contains following key to work with the request data:
    * userName: string
    * userEmail: string
    * superAdmin: boolean
    * groupAdmin: boolean
* returen value - send response
  * user in the data file - send object where state the user already exist
  * user not in the data file - sned the full new list from user data file

Remove User - removeUser.js
Remove the user from user data file, remove the user name in the group data file and remove user name in channel data file.
* Parameters
  * GROUP_DATA_FILE
  * USER_DATA_FILE
  * CHANNEL_DATA_FILE
  * path - `'/removeUser'` - get data from `localhost:3000/removeUser`
  * req.body - req.body object must contains following key to work with the request data:
    * dataList: string[] - list of users need to be removed
* returen value - New user list

Edit User Role - editRole.js
Edit user role. Assign new role to the user.
* Parameters
  * USER_DATA_FILE
  * path - `'/editRole'` - get data from `localhost:3000/editRole`
  * req.body - req.body object must contains following key to work with the request data:
    * users: string[] - work with multiple user at once, therefore use list
    * newRole: string - name of the new role
* returen value - send response
  * user in the data file - send the full new list from user data file
  * user not in the data file - send object where state the user already exist
    
Get full user data list - getUserList.js
Retrieve full list from user data file
* Parameters
  * USER_DATA_FILE
  * path - `'/users'` - get data from `localhost:3000/users`
* returen value - send the full list from user data file

#### Group
Add Group - addGroup.js
Add new group to the data file. Add and remove users to the group.
* Parameters
  * GROUP_DATA_FILE
  * USER_DATA_FILE
  * path - `'/addGroup'` - get data from `localhost:3000/addChannel`
  * req.body - req.body object must contains following key to work with the request data:
    * groupName: string
    * groupUser: string[] - default empty when add group, otherwiise user name list that need to be added to or remove from the group.
    * groupChannel: string[] - defualt empty when add group, otherwise current channels in the group
    * groupAssist: string[] - default empty when add groups, otherwise current assist users in the group
    * mode: string - determain which mode, add new group `newGroup` or add `addUser` or remove `removeUser` users
* returen value - send new group data

Remove Group - removeGroup.js
Remove the group from group data file, remove the group name in the user data file and remove all the channels that belongs to the removed group.
* Parameters
  * GROUP_DATA_FILE
  * USER_DATA_FILE
  * CHANNEL_DATA_FILE
  * path - `'/removeGroup'` - get data from `localhost:3000/removeGroup`
  * req.body - req.body object must contains following key to work with the request data:
    * groupName: string
* returen value - None

Edit grout user Role - editGroupUserRole.js
Assign user group assist role, add new group assist list to the data file
* Parameters
  * GROUP_DATA_FILE
  * path - `'/editGroupUserRole'` - get data from `localhost:3000/editGroupUserRole`
  * req.body - req.body object must contains following key to work with the request data:
    * groupName: string 
    * users: string[] - list of new group assist
* returen value - send group detail with new group assist updated

Get specified group detail - getGroupDetail.js
Get detail data for the specifide group
* Parameters
  * GROUP_DATA_FILE
  * path - `'/getGroupDetail'` - get data from `localhost:3000/getGroupDetail`
  * req.body - req.body object must contains following key to work with the request data:
    * groupName: string
* returen value - send group detail
    
Get full group data list - getGroupList.js
Retrieve full list from group data file
* Parameters
  * GROUP_DATA_FILE
  * path - `'/getGroupList'` - get data from `localhost:3000/getGroupList`
* returen value - send send the full list from group data file

#### Channel
Add Channel - addChannel.js
Add new channel to the data file. Add and remove users to the channel.
* Parameters
  * CHANNEL_DATA_FILE
  * GROUP_DATA_FILE
  * path - `'/addChannel'` - get data from `localhost:3000/addChannel`
  * req.body - req.body object must contains following key to work with the request data:
    * channelName: string
    * channelUser: string[] - default empty when add channel, otherwiise user name list that need to be added to or remove from the group.
    * groupName: string,
    * groupChannelList: string[] - list of channels group have, used for check if channel already exist
    * mode: string - determain which mode, add new group `newChannel` or add `addUser` or remove `removeUser` users
* returen value - send new channel data

Remove Group - removeChannel.js
Remove the channel from channel data file, remove the channel name in the group data file.
* Parameters
  * GROUP_DATA_FILE
  * CHANNEL_DATA_FILE
  * path - `'/removeChannel'` - get data from `localhost:3000/removeChannel`
  * req.body - req.body object must contains following key to work with the request data:
    * groupName: string
    * channelName: string
* returen value - None

Get specified group detail - getChannelDetail.js
Get detail data for the specifide group
* Parameters
  * CHANNEL_DATA_FILE
  * path - `'/getChannelDetail'` - get data from `localhost:3000/getChannelDetail`
  * req.body - req.body object must contains following key to work with the request data:
    * groupName: string
    * channelName: string
* returen value - send group detail

## Angular Architectire

Following is a graph briefly illustrate the angular architectire for this project.

![Alt AngularArchitecture](/doc-img/AngularArchitecture.png?raw=true)

### Component and Routes
The component defines and controls the view. There are total eight components in this project currently. app component is the root compponent. Angular routes navigate relavent component view to be displaied in `router-outlet` under the app component. Following image illustrates each component and routes draftly.
![Alt ComponentRoutes](/doc-img/ComponentRoutes.png?raw=true)

### Services
The services mainly in charge of send httpClient request. It controls the communication between front-end and back-end server. The component calls the method from the service, service send request to the back-end `localhost:3000`, then return the request result as observable for the component to subscribe. The service also provide method for the component to pass the data, the service takes that data and make the data as observable data, which allows other component to subscribe the data.

There are two services in this project.
* UserAutenticationService
⋅⋅The user authentication service send request to server to retrieve the user detail. it is used for login user.
* UserInteractionService
..This service is used to send request to 
  * get user list, group list data
  * add user, group, channel
  * remove user, group, channel
  * modify user role

## State change
### Data binding
Template binding is used for display data.
#### One way biding
 Global varibles in the component.ts are declared on tope of the class above the constructor, and they are declared without let, var or const keyword. Double curly braces `{{}}`is used in the HTML template to display the global varible. it is bind together so whenever the global varible changes, the view will display the updated varible automatically.

#### Two way biding
Differ from one way biding, which only the view recevie the data from the control. Two way biding allows the control also recieves the data. It is mostly used in forms to retrieve user input. 
On the component.html 
add `[(target)]="expression"` to the hteml element, for example:
`<input [(ngModel)]="user">`
Then in the component.ts
Declear global variable with empty value, then retrieve the value use this keyword in the method. for example:
```typescript
user = ''; // initialise global variable with empty value
this.user // retrieve user input value
```

#### Event biding
`(click)` is used for event biding, and normally is in the button element like `<button (click)="method()"></button>`. Whenever the user click the button, it triggers the method indicated in the element to perform certain action.

#### Attributes biding
Attributes biding are also used in this project, and is mostly used for display a list of data that must have different attributes, so that relavent bootstrap element can work. It uses `attr.attrName`, and the HTML element will look like `<div [attr.data-target]="actionName"></div>`

### Structural directives
Structural directives are used for construct the HTML layout. ngIf, ngIfElse and ngFor are used in this project. 
**ngIf** - it add or remove the hTML element depends on the condition provide by the control. If the condition is true, then element will be added, otherwise the element will be removed from the view.
Example: `<div *ngIf="isActive"></div>`
**ngIfElse** - Similar to ngIf, the difference is instead of remove the element when condition is false, it add different element for display.
Example: if expression true, display element in ng-container, else display element in elseTemplate
```
<ng-container *ngIf="expression; else elseTemplate">
</ng-container>
<ng-template #elseTemplate>
</ng-template>
```
**ngFor** - This is used to display list/array data, it will add element for each item in the list.
Example: 
at component.ts
`items = [1, 2, 3]`
at component.html
`<div *ngFor="let item of items" class="pl-1">{{item}}</div>`
result
```
<div class="pl-1">1</div>
<div class="pl-1">2</div>
<div class="pl-1">3</div>
```

