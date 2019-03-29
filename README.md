# Test Park App

This is an app which manages basic functionalities of a car parking app. With it the user can basically "Check in" and "Check out" from a parking lot. It also calculates the total prize of the visit by multiplying the time of the visit with the prize per hour.

## How to Run
* First install dependencies:

Run:
```
npm install
```
```
cd server && npm install
```
```
cd client && npm install
```
* Then start the app, like so:
```
npm start
```

### Prize Calculation
When the user checks in, the app documents the time of arrival. In the same way, when the user checks out, the time of that moment is used to calculate the total time of the visit. As the check out is initialized, the app uses the time of the checkout and checkin to calculate the total time of the stay.

### This app uses javascript technologies such as:
- React
- Express
- FS
- API

