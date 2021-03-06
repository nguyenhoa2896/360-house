import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {Button,Container,Col, Form,FormGroup,Label,Input,} from 'reactstrap';
import GoogleButton from 'react-google-button'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
// import Toolbar from 'material-ui/core/Toolbar';
// import Typography from 'material-ui/core/Typography';
import PropTypes from 'prop-types';
// import { withStyles } from 'material-ui/core/styles';


const ERROR_CODE_ACCOUNT_EXISTS =
'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
An account with an E-Mail address to
this social account already exists. Try to login from
this account instead and associate your social accounts on
your personal account page.
`;

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};


/*
Sign In with Google base
TODO: Break down to many file
*/
class SignInGoogleFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {error : null};
  }

  onSubmit = event => {
    this.props.firebase
    .doSignInWithGoogle()
    .then(socialAuthUser => {
      /*
      Create a user in Firebase database
      Currently the user gets recreate everytime the user login
      We can use the condition socialAuthUser.additionalUserInfo.isNewUser for
      condition checking
      */

      return this.props.firebase
      .user(socialAuthUser.user.uid)
      .set({
        username: socialAuthUser.user.displayName,
        email: socialAuthUser.user.email,
        roles: [],
      });
    })
    .then(() => {
      this.setState({error: null});
      this.props.history.push(ROUTES.HOME);
    })
    .catch(error => {
      //Check if the new Google Account had been use for normal sign in
      if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }

      this.setState({error});
    });
    //prevent the page to reload after submit the page
    event.preventDefault();
  }
  render() {
    const {error} = this.state;

    return(
      <form onSubmit={this.onSubmit}>
      {/* <Button type="submit" variant="outline-*"></Button> */}
      <GoogleButton onClick={ this.onSubmit }/>
      {/*
        error checking
        */}
        {error && <p>{error.message}</p>}
        </form>
      );
    }
  }

  /*
  Sign In with Email form base
  TODO: Break in to many file and improve quality
  */
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
        <MuiThemeProvider>
         <AppBar position="static" color="default">
        {/* <Toolbar>
          <Typography variant="h6" color="inherit">
            Photos
          </Typography>
        </Toolbar> */}
      </AppBar>
        <form onSubmit={this.onSubmit}>
        <TextField
        name="email"
        value={email}
        onChange={this.onChange}
        type="text"
        placeholder="Email Address"
        />
        <TextField
        name="password"
        value={password}
        onChange={this.onChange}
        type="password"
        placeholder="Password"
        />
        <Button size="lg" variant="outline-*" disabled={isInvalid} type="submit">
        Sign In
        </Button>

        {error && <p>{error.message}</p>}
        </form>
        </MuiThemeProvider>
      );
    }
  }
  /*
  Sign in Higher-order component for SignInForm
  */
  const SignInForm = compose(
    withRouter,
    withFirebase,
  )(SignInFormBase);

  /*
  Sign in Higher-order component for SignInGoogle
  */
  const SignInGoogleForm = compose(
    withRouter,
    withFirebase,
  )(SignInGoogleFormBase)

  export { SignInForm, SignInGoogleForm };
