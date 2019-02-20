import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Footer from '../Footer';
import { SignUpLink } from '../SignUp';
import { PasswordForgotLink} from '../PasswordForget';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {Button,Container,Col, Form,FormGroup,Label,Input,} from 'reactstrap';

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div>
<Container className="SignIn">
        <h2>Sign In</h2>
        <Form className="form" onSubmit={this.onSubmit}>
          <Col>
            <FormGroup>
              <Label>Email</Label>
              <Input
                name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
              />
            </FormGroup>
          </Col>
          <Button variant="outline-primary" disabled={isInvalid} type="submit">
          Sign In
        </Button>
        </Form>
        <div>
        <SignUpLink />
      <PasswordForgotLink/>
        </div>
        {error && <p>{error.message}</p>}
      </Container>





      <div>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossOrigin="anonymous" />
        <link rel="stylesheet" href="style/footer.css" />
        <link rel="stylesheet" href="style/demo.css" />
        <link href="http://fonts.googleapis.com/css?family=Cookie" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossOrigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="style/homepage.css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossOrigin="anonymous" />
        <footer className="footer-distributed">
          <div className="footer-left">
            <h3>360Degree <span>House</span></h3>
            <p className="footer-links">
              <a href="#">Home</a> 
              <a href="#">Blog</a>  
              <a href="#">About</a>
              <a href="#">Faq</a>
              <a href="#">Contact</a>
            </p>
            <p className="footer-company-name">360DegreeHouse © 2018</p>
          </div>
          <div className="footer-center">
            <div>
              <i className="fa fa-map-marker" />
              <p><span>3637 Snell Avenue SPC364</span> San Jose, United States</p>
            </div>
            <div>
              <i className="fa fa-phone" />
              <p>+1 408 466 5588</p>
            </div>
            <div>
              <i className="fa fa-envelope" />
              <p><a href="mailto:support@company.com">support@360DegreeHouse.com</a></p>
            </div>
          </div>
          <div className="footer-right">
            <p className="footer-company-about">
              <span>About the company</span>
              We are an inspiring group of house dealers.
            </p>
            <div className="footer-icons">
              <a href="#"><i className="fab fa-facebook-square" /></a>
              <a href="#"><i className="fab fa-twitter-square" /></a>
              <a href="#"><i className="fab fa-linkedin" /></a>
            </div>
          </div>
        </footer>
      </div>
      </div>
    );
  } 

}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
