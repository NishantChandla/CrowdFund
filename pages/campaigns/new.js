import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";
// import ConnectButton from "../../components/Connect";
// import factory from '../../ethereum/factory';
// import web3 from '../../ethereum/web3';
import { TezosToolkit } from '@taquito/taquito';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false,
    name:'',
    description:'',
    isConnected: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });
//  try {
//       const op = await contract.methods.decrement(1).send();
//       await op.confirmation();
//       const newStorage: any = await contract.storage();
//       if (newStorage) setStorage(newStorage.toNumber());
//       setUserBalance(await Tezos.tz.getBalance(userAddress));
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoadingDecrement(false);
//     }
    try {
      const Tezos = new TezosToolkit("https://edonet.smartpy.io/");
      // await Tezos.setProvider({ signer: new TezTeigner() });
      
      const wallet = new BeaconWallet({
        name: "Taquito Boilerplate",
        preferredNetwork: NetworkType.EDONET,
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: data => setPublicToken(data.publicKey)
          }
        }
      });
      Tezos.setWalletProvider(wallet);
      await wallet.requestPermissions({
        network: {
          type: NetworkType.EDONET,
          rpcUrl: "https://edonet.smartpy.io/"
        }
      });
      // this.setState({isConnected:true});
    
      // gets user's address
      const contract =  await Tezos.wallet.at('KT1WMwPDPDys4qRcZbiXBLinr9XeZip3NAZV');
      const op = await contract.methods.createCampaign(this.state.description,this.state.minimumContribution,this.state.name).send();
      await op.confirmation();
      // const accounts = await web3.eth.getAccounts();
      // contract.methods.createCampaign
      // await factory.methods
      //   .createCampaign(this.state.minimumContribution)
      //   .send({
      //     from: accounts[0]
      //   });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name</label>
            <Input
              value={this.state.name}
              onChange={event =>
                this.setState({ name: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="mutez"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        
        </Form>
         {/* <Button primary onClick={this.connectBeacon()} >
          <span>
          <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
          </span>
          </Button> */}
      </Layout>
    );
  }
}

export default CampaignNew;
