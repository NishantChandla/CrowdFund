import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';

import { TezosToolkit } from '@taquito/taquito';
// import Campaign from '../../ethereum/campaign';
// import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    console.log(props.query.name);
    let requestCount =0;
    let campaigns=[];
    const Tezos = new TezosToolkit("https://edonet.smartpy.io/");
     const contract =  await Tezos.contract.at('KT1WMwPDPDys4qRcZbiXBLinr9XeZip3NAZV');
    
      const storage = await contract.storage();
      // console.log(storage.valueMap);
      let campaign;
      storage.valueMap.forEach((key,value)=>{
        if(value.substring(1,value.length-1) == props.query.address){
          campaign = {name:key.name,description:key.description,id:value.substring(1,value.length-1),balance:key.balance.c[0],requestsCount:0,approversCount:key.approverCount.c[0],manager:key.address,minimumContribution:key.minimumAmount.c[0]};
          console.log(key.approverCount);
          key.requests.forEach((one)=>{
            requestCount+=1;
          })
        }
      });
      
    console.log(campaign);
    // const campaign = Campaign(props.query.address);
    // const summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address,
      minimumContribution: campaign.minimumContribution / 1000000,
      balance: campaign.balance / 1000000 ,
      requestsCount: requestCount,
      approversCount: campaign.approversCount,
      manager: campaign.manager
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution  + ' ꜩ',
        meta: 'Minimum Contribution',
        description:
          'You must contribute at least this much mutez to become an approver'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description:
          'Number of people who have already donated to this campaign'
      },
      {
        header: balance + ' ꜩ',
        meta: 'Campaign Balance',
        description:
          'The balance is how much money this campaign has left to spend.'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
