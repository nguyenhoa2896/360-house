const user = {
	displayName: {
		loopable: true,
		type: "text",
		placeHolder: "User Name",
		value: ""
	},
	email: {
		loopable: true,
		type: "text",
		placeHolder: "Email",
		value: ""
	},
	gender: {
		loopable: true,
		type: "text",
		placeHolder: "Gender",
		value: ""
	},
	phoneNumber: {
		loopable: true,
		type: "text",
		placeHolder: "Phone Number",
		value: ""
	},
	roles: {
		loopable: false,
		value: []
	},
	photoURL: {
		loopable: false,
		type: "img",
		placeHolder: "Photo Avatar",
		value: ""
	}
};

const house = {
	address: {
		street: {
			loopable: true,
			type: "text",
			placeHolder: "House Address and Street Name",
			value: ""
		},
		city: {
			loopable: true,
			type: "text",
			placeHolder: "City",
			value: ""
		},
		state: {
			loopable: true,
			type: "text",
			placeHolder: "State",
			value: ""
		},
		country: {
			loopable: true,
			type: "text",
			placeHolder: "Country",
			value: ""
		},
		location: {
			loopable: false,
			value: {
				lat: 0.0,
				long: 0.0
			}
		}
	},
	price: {
		loopable: true,
		type: "text",
		placeHolder: "Price",
		value: ""
	},
	description: {
		loopable: true,
		type: "text",
		placeHolder: "Description",
		value: ""
	},
	data: {
		loopable: false,
		value: ""
	},
	features: {
		loopable: false,
		value: {
			type: "",
			yearBuild: "",
			heating: "",
			cooling: "",
			parking: "",
			lot: ""
		}
	},
	agentId: {
		loopable: false,
		value: []
	},
	userID: {
		loopable: false,
		value: []
	}
};

export {user, house};
