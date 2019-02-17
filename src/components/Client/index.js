
import React, {Component} from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';

import * as ROLES from '../../constants/roles';
const ClientPage = () => (
  <div>
    <h1>Client Page</h1>
    <p> The Client Page is accessible by every client.</p>
  </div>
);
/*
condtion check for role
 */
const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.CLIENT);

export default compose(
  withAuthorization(condition),
  withEmailVerification,
  withFirebase,
)(ClientPage);
