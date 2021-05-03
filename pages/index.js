import React, { Component, useState } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { TezosToolkit } from '@taquito/taquito';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
   static async getInitialProps() {
       console.log("ye1s");
        let campaigns=[];
      const Tezos = new TezosToolkit("https://edonet.smartpy.io/");
       const contract =  await Tezos.contract.at('KT1WMwPDPDys4qRcZbiXBLinr9XeZip3NAZV');
        const storage = await contract.storage();
        // console.log(storage.valueMap);
        storage.valueMap.forEach((key,value)=>{
            campaigns.push({name:key.name,description:key.description,id:value.substring(1,value.length-1)});
        });
        // const campaigns = storage.valueMap;
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(val => {
      return {
        header: val.name,
        meta:val.description,
        description: (
          <Link route={`/campaigns/${val.id}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
