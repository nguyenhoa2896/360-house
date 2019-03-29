import app from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";
import Config from "./config.js";

const config = Config;

class Firebase {
	constructor() {
		app.initializeApp(config);
		//Get the Provider of user email (Google, Facebook, ...)
		this.emailAuthProvider = app.auth.EmailAuthProvider;
		//Initialize firebase authentication
		this.auth = app.auth();
		//Initialize firebase database
		this.database = app.database();
		//Initialize firebase provider
		this.googleProvider = new app.auth.GoogleAuthProvider();
		//Initialize firebase storage
		this.storage = app.storage();
	}

	// Auth API

	//Sign Up with Email
	doCreateUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);
	//Sign In with Email
	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	//Sign In with Google Account
	//Note that if use another social logins, they must be join together
	//so the account do not conflict
	doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

	//Sign Out
	doSignOut = () => this.auth.signOut();
	//Password Forgot
	doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
	//Password Update
	doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

	//User's profile updateProfile
	doUpdateProfile = data => this.user(this.auth.currentUser.uid).set(data);

	// User API
	user = uid => this.database.ref(`users/${uid}`);

	users = () => this.database.ref("users");

	//House API

	house = uid => this.database.ref(`houses/${uid}`);

	houses = () => this.database.ref("houses");

	// Sign Up Email Verification

	doSendEmailVerification = () =>
		this.auth.currentUser.sendEmailVerification({url: config.url});

	/*
  Athorization and Authentication join method
  Merge AUth and DB User API
  */
	onAuthUserListener = (next, fallback) =>
		this.auth.onAuthStateChanged(authUser => {
			if (authUser) {
				this.user(authUser.uid)
					.once("value")
					.then(snapshot => {
						const dbUser = snapshot.val();

						//default empty roles
						if (!dbUser.roles) {
							dbUser.roles = [];
						}

						//merge auth and db user
						authUser = {
							uid: authUser.uid,
							email: authUser.email,
							//Check if the user has a verified email
							emailVerified: authUser.emailVerified,
							providerData: authUser.providerData,
							...dbUser
						};
						next(authUser);
					});
			} else {
				fallback();
			}
		});
	/**
	 * Upload Image to firebase
	 * @param  {JS object}   data  {Object{metadata: filemetadata, data: filedata, hotelID: hotelID}}
	 * @param 	{String} 	data {hotelID}
	 * @param  {Function} next  {Function(processed)}
	 * @param  {[type]}   error {Error{name: errorName, message: errorMessage}}
	 * @param  {Function} done  {Function(imageURL)}
	 */
	uploadImage = (data, hotelID, next, error, done) => {
		let imagePath = `images/house/${data.hotelID}/${Date().now}`;
		const uploadTask = this.storage.ref(imagePath).put(data);
		uploadTask.on(
			"stage_change",
			//next
			//return completed percent
			snapshot => {
				var process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				next(process);
			},
			//error
			//return error
			error => {
				switch (error.code) {
					//Add More Case of error(https://firebase.google.com/docs/storage/web/handle-errors)
					case "storage/unauthorized": {
						error(
							Error({
								name: "unauthorized",
								message: "Unauthorized User"
							})
						);
						break;
					}
					default: {
						error(
							new Error({
								name: "unspecificError",
								message: error
							})
						);
						break;
					}
				}
			},
			//complete
			() =>
				uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
					done(downloadURL);
				})
		);
	};
}

export default Firebase;
