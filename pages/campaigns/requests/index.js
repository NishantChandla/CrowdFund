import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import { TezosToolkit } from '@taquito/taquito';
// import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    let approversCount;
    let requestCount;
    let requests=[];
    let campaigns=[];
    const Tezos = new TezosToolkit("https://edonet.smartpy.io/");
     const contract =  await Tezos.contract.at('KT1WMwPDPDys4qRcZbiXBLinr9XeZip3NAZV');
      const storage = await contract.storage();
      // console.log(storage.valueMap);
      let campaign;
      storage.valueMap.forEach((key,value)=>{
        if(value.substring(1,value.length-1) == address){
          requestCount = 0;
          approversCount =key.approverCount.c[0];
          // console.log(key.requests);
          key.requests.forEach((one)=>{
            requests.push({complete:one.complete,description:one.description,recipient:one.recipent,value:one.value.c[0]/1000000,approvalCount: one.approvecount.c[0]});
            requestCount+=1;
          })
          // campaign = {name:key.name,description:key.description,id:value,balance:0,requestsCount:0,approversCount:key.approverCount,manager:'tz1',minimumContribution:key.minimumAmount};
        }
      });
      // console.log(requests);
    // const campaign = Campaign(address);
    // const requestCount = await campaign.methods.getRequestsCount().call();
    // const approversCount = await campaign.methods.approversCount().call();

    // const requests = await Promise.all(
    //   Array(parseInt(requestCount))
    //     .fill()
    //     .map((element, index) => {
    //       return campaign.methods.requests(index).call();
    //     })
    // );

    return { address, requests, requestCount, approversCount };
  }

  renderRows() {
    // console.log(this.props.requests);
    let items =[];
    for(let i in this.props.requests){
      let request = this.props.requests[i];
      items.push((<RequestRow
        key={i}
        id={i}
        request={request}
        address={this.props.address}
        approversCount={this.props.approversCount}
      />));
    }
    // this.props.requests
    // const items =  this.props.requests.map((request, index) => {
    //   // console.log(request);
    //   // console.log(index);
    //   return (
    //     <RequestRow
    //       key={index}
    //       id={index}
    //       request={request}
    //       address={this.props.address}
    //       approversCount={this.props.approversCount}
    //     />
    //   );
    // });
    return items;
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
