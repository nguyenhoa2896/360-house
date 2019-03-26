import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

import {withFirebase} from "../../server/Firebase/index";
import {withAuthentication} from "../../server/Session/index";

import * as SCHEMA from "../../constants/schema";
import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
	error: null,
	isLoading: false
};

class AddInfoFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			authUser: {
				...SCHEMA.user
			},
			...INITIAL_STATE
		};
	}

	onSubmit = event => {
		this.props.firebase
			.doUpdateProfile({
				...this.state.authUser
			})
			.then(() => {
				alert("Update Success");
			})
			.catch(error => {
				alert(error);
			});
		event.preventDefault();
	};

	componentWillMount() {
		this.setState({
			authUser: {
				displayName: {value: this.props.authUser.displayName},
				email: {value: this.props.authUser.email},
				phoneNumber: {value: this.props.authUser.phoneNumber},
				gender: {value: this.props.authUser.gender},
				photoURL: {value: this.props.authUser.photoURL}
			}
		});
	}
	onChange = propertyName => event => {
		const {authUser} = this.state;
		const newAuthUser = {
			...authUser,
			[propertyName]: event.target.value
		};
		this.setState({authUser: newAuthUser});
	};
	/**
	 * check if the Schema Input is inValid
	 * @param  {}  object [this.state.?checkObject?]
	 * @return {Boolean}        [return if one is not satisfied]
	 */
	isInvalid = object =>
		object.some(f => {
			if (typeof f[1].value == "undefined")
				throw new Error(`Schema ${f[0]} do not have value`);
			else if (f[1].type === "text") {
				console.log(f[1].type, f[0]);
				return f[1].value === "";
			} else {
				throw new Error(`Did not match all type`);
			}
		});

	render() {
		const {error} = this.state;

		const isInvalid = this.isInvalid(Object.entries(this.state.authUser));

		return (
			<form onSubmit={this.onSubmit}>
				<input
					value={this.state.authUser.displayName}
					onChange={this.onChange("displayName")}
					type="text"
					placeholder="Full Name"
				/>
				<input
					onChange={this.onChange("email")}
					value={this.state.authUser.email}
					type="text"
					placeholder="email"
				/>
				<input
					onChange={this.onChange("gender")}
					type="text"
					value={this.state.authUser.gender}
					placeholder="gender"
				/>
				<input
					onChange={this.onChange("phoneNumber")}
					value={this.state.authUser.phoneNumber}
					type="text"
					placeholder="phoneNumber"
				/>
				{
					//TODO: Add component to choose Agent or Client
				}
				{
					//TODO: Add Real Avatar input
				}
				<input
					onChange={this.onChange("photoURL")}
					value={this.state.authUser.photoURL}
					type="text"
					placeholder="photoURL"
				/>

				<button disabled={isInvalid} type="submit">
					Add new Information
				</button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

const AddInfoForm = compose(
	withAuthentication,
	withFirebase
)(AddInfoFormBase);

export default AddInfoForm;
