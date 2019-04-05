import React, {Component} from "react";

class UploadImage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			images: [],
			imagesRender: [],
			imageURLs: [],
			hotelID: ""
		};
	}
	componentDidMount() {
		this.setState({
			hotelID: this.props.hotel.hotelID
		});
	}
	onChange = (event, position) => {
		let imagesRender = [...this.state.imagesRender];
		imagesRender[position] = event.target.file;

		if (imagesRender[position]) {
			const image = {
				data: {
					data: imagesRender[position],
					metadata: {}
				}
			};
			const images = this.state.images;
			images.push(image);
			this.setState(() => ({
				images: images
			}));
		}
	};
	onUpload = () => {
		const {images, hotelID, imageURLs} = this.state;
		Promise.all(
			images.map(image =>
				this.firebase.uploadImage(
					image,
					hotelID,
					process => {
						//During image processing
					},
					error => {
						//Return error
					},
					imageURL => {
						imageURLs.push(imageURL);
					}
				)
			)
		).then(() => {
			console.log(imageURLs);
		});
	};
	//Each click add more image Render to the component
	addImageRender = () => {
		this.setState(prevState => ({
			imagesRender: [...prevState.imagesRender, ""]
		}));
	};
	removeImageRender = position => {
		let imagesRender = [...this.state.imagesRender];
		imagesRender.splice(position, 1);
		this.setState({imagesRender});
	};
	createImageRender = () => {
		return this.state.imagesRender.map((image, position) => (
			<div key={position}>
				<input
					type="file"
					value={image || null}
					onChange={this.onChange(position)}
				/>
				<button onClick={this.RemoveClick(position)}>Remove</button>
			</div>
		));
	};
	render() {
		return (
			<form onSubmit={this.onUpload}>
				{this.createImageRender}
				<button onCLick={this.addImageRender} />
				<input type="submit" value="Submit" />
			</form>
		);
	}
}
export default UploadImage;
