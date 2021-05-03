import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }} >
      <a className="item">CrowdFund</a>

      <Link route="/">
        <a className="item">Campaigns</a>
      </Link>

      <Menu.Menu position="right">


        <Link route="/campaigns/new">
          <a className="item">Create Campaign</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
